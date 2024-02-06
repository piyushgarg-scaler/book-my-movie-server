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

        const token = lib.generateUserToken({ _id: createUserResult._id.toString(), role: createUserResult.role })

        return res.json({ status: 'success', data: { _id: createUserResult._id, token: token } })

    } catch (err) {
        if (err.code === 11000)
            return res.status(400).json({ message: `user with email ${email} already exists!` })
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}


const handleSignin = async (req, res) => {
    const safeParseResult = lib.validateUserSignin(req.body);

    if (safeParseResult.error) {
        return res.status(400).json({ status: 'error', error: safeParseResult.error })
    }

    const { email, password } = safeParseResult.data

    const userInDb = await User.findOne({ email });

    if (!userInDb) return res.status(404).json({ error: `user with email ${email} does not exist!` })

    const salt = userInDb.salt;
    const hashedPasswordDb = userInDb.password;

    const { hash } = lib.generatehash(password, salt)

    if (hash !== hashedPasswordDb) return res.status(404).json({ error: `Incorrect password` })

    const token = lib.generateUserToken({ _id: userInDb._id.toString(), role: userInDb.role })

    return res.json({ status: 'success', data: { token: token } })
}


module.exports = {
    handleSignup,
    handleSignin,
}