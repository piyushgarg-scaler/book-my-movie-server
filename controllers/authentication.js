const User = require('../models/user')
const lib = require('../lib/user')

const handleSignup = async (req, res) => {
    const safeParseResult = lib.validateUserSignup(req.body);

    if (safeParseResult.error) {
        return res.status(400).json({ status: 'error', error: safeParseResult.error })
    }

    const { firstName, lastName, email, password } = safeParseResult.data

    try {
        const { hash: hashedPassword, salt } = lib.generatehash(password)

        const createUserResult = await User.create({ firstName, lastName, email, password: hashedPassword, salt })

        // TODO: Generate JWT Token and send that

        return res.json({ status: 'success', data: { _id: createUserResult._id } })

    } catch (err) {
        if (err.code === 11000)
            return res.status(400).json({ message: error.message })
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}


module.exports = {
    handleSignup
}