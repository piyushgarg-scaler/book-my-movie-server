const Movie = require('../models/movie')
const MovieSchedule = require('../models/movieScheduleMapping')
const User = require('../models/user')
const { validateCreateMoviePayload } = require('../lib/movie');
const mongoose = require('mongoose');

const stripe = require('stripe')(process.env.STRIPE_SECRET)

const handleGetAllMovies = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const LIMIT = 5;

    const skip = (page - 1) * LIMIT
    const movies = await Movie.find({}).skip(skip).limit(LIMIT)

    return res.json({ status: 'success', data: { page, movies } })
}

const handleGetMovieById = async (req, res) => {
    const id = req.params.id
    const movie = await Movie.findById(id);

    if (!movie) return res.status(404).json({ status: 'success', data: null });

    return res.json({ status: 'success', data: { movie } })

}

const handleCreateMovie = async (req, res) => {
    const safeParseResult = validateCreateMoviePayload(req.body)

    if (safeParseResult.error) {
        return res.status(400).json({ status: 'error', error: safeParseResult.error })
    }

    const { title, description, language } = safeParseResult.data

    try {

        const movie = await Movie.create({ title, description, language })
        return res.json({ status: 'success', data: { id: movie._id } })

    } catch (error) {
        return res.status(500).json({ status: 'error', error: 'Internal Server Error' })
    }

}

const handleDeleteMovieById = async (req, res) => {
    const id = req.params.id;
    await Movie.findByIdAndDelete(id);
    return res.json({ status: 'success', data: { deleted: true } })
}


const handleGetMovieSchedule = async (req, res) => {
    const movieId = req.params.id;
    const result = await MovieSchedule.aggregate([
        {
            $match: {
                movieId: new mongoose.Types.ObjectId(movieId)

            }
        },
        {
            $lookup: {
                from: "theatres",
                localField: "theatreId",
                foreignField: "_id",
                as: "theatre"
            }
        },
        {
            $unwind: {
                path: "$theatre",
                preserveNullAndEmptyArrays: false
            }
        }
    ])

    return res.json({ status: 'success', data: { schedule: result } })
}


const handleCreateBookingOrder = async (req, res) => {
    const scheduleId = req.params.id


    const schedule = await MovieSchedule.findById(scheduleId)

    console.log(schedule)

    const user = await User.findById(req.user._id)

    const session = await stripe.checkout.sessions.create({
        success_url: 'http://localhost:5173/success',
        customer_email: user.email,
        line_items: [
            {
                adjustable_quantity: { enabled: true },
                price_data: {
                    unit_amount: parseInt(schedule.price) * 100,
                    currency: 'INR',
                    product_data: {
                        name: 'Test Booking'
                    }
                },
                quantity: 1
            }
        ],
        metadata: { userId: req.user._id, scheduleId: `${schedule._id}` },
        mode: 'payment'
    })

    return res.json({ status: 'success', data: session })
}

module.exports = { handleCreateMovie, handleGetAllMovies, handleDeleteMovieById, handleGetMovieById, handleGetMovieSchedule, handleCreateBookingOrder }