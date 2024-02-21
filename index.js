require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors')
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const { authenticationMiddleware } = require('./middlewares/authentication')
const Booking = require('./models/booking')

const authRouter = require('./routes/authentication')
const movieRouter = require('./routes/movie')
const theatreRouter = require('./routes/theatre')
const scheduleRouter = require('./routes/movieSchedule')

const app = express();
const PORT = process.env.PORT

if (!PORT) throw new Error('Missing PORT')

// Mongoose Connection
mongoose.connect(process.env.MONGODB_URI).then(() => console.log(`MongoDB Connected`))


app.post('/api/v1/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    console.log('Webhook came from Stripe');
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.body, sig, 'whsec_0bedf9029b46d05506b999ec6f6cb82d67dfa7000a5a0baf3c9498ea191b3123');


    switch (event.type) {
        case 'checkout.session.completed': {
            const txId = event.data.object.id
            const currency = event.data.object.currency
            const email = event.data.object.customer_email
            const metadata = event.data.object.metadata

            const { userId, scheduleId } = metadata

            await Booking.create({
                scheduleId: scheduleId,
                userId: userId,
                transcationId: txId
            })

        }
    }


    return res.json({ rec: true })

})

// Middlewares
app.use(express.json())
app.use(cors())
app.use(authenticationMiddleware())

app.get('/', (req, res) => res.json({ status: 'Success' }))

app.use(`/api/v1/auth`, authRouter)
app.use(`/api/v1/movies`, movieRouter)
app.use(`/api/v1/theatre`, theatreRouter)
app.use(`/api/v1/schedule`, scheduleRouter)




app.listen(PORT, () => console.log(`Server started on PORT:${PORT}`))