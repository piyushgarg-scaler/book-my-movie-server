const crypto = require('crypto')
const User = require('../models/user')
const lib = require('../lib/user')
const tokengen = require('../middlewares/tokengen')

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
        const token = tokengen.generateToken(password);

        return res.json({ status: 'success', data: { _id: createUserResult._id }, authtoken: token })

    } catch (err) {
        if (err.code === 11000)
            return res.status(400).json({ message: error.message })
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

const handleSignin = async (req, res) => {
    
    // console.log("Headers", req.headers)
    // const val = req.headers.Authorization || req.headers.authorization
    // const token = val.split('Bearer ')[1]
    if(!res)
    {
        return res.json({ message: 'User must be authenticated' })
    }
    const { email, password } = req.body
    const dbUser = await User.findOne({email})
    if(!dbUser)
    {
        return res.json( { error: 'Invalid Email or Password' })
    }
    const salt = dbUser.salt
    const dbUserPwd = dbUser.password

    const hashPwd = crypto.createHmac('sha256', salt).update(password).digest('hex');

    if(hashPwd !== dbUserPwd)
    {
        return res.json( { error: 'Invalid Email or Password' })
    }

    const token = tokengen.generateToken(password);
    return res.json({ status: 'logged in sucessfully', data: { _id: dbUser._id }, authtoken: token })
    // const token = token.validateToken()
}

module.exports = {
    handleSignup, handleSignin
}