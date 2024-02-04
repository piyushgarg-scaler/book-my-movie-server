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

        const token = lib.generateJwtToken({
            userID: createUserResult._id,
            email: createUserResult.email
        });

        return res.json({ status: 'success', data: { _id: createUserResult._id, token: token } });

    } catch (err) {
        if (err.code === 11000)
            return res.status(400).json({ message: err.message })
        return res.status(500).json({ message: 'Internal Server Error' })
    }
}

const handleSignIn = async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ error: `User with email ${email} not found!` });
    }

    const { hash } = lib.generatehash(password, user.salt);
    if (hash !== user.password) {
        return res.json({ message: `Incorrect email or password!` });
    }

    const token = lib.generateJwtToken({
        userID: user._id,
        email: user.email
    });

    return res.json({ 
        status: 'success', 
        data: { token: token } 
    });
}

module.exports = {
    handleSignup,
    handleSignIn,
}
