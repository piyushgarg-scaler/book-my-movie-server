const crpto = require('crypto')
const JWT = require('jsonwebtoken')
const { z } = require('zod')
const { v4: uuidv4 } = require('uuid')

const userTokenSchema = z.object({
    _id: z.string(),
    role: z.string()
})

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) throw new Error('JWT_SECRET is required!')

function validateUserSignup(data) {
    const schema = z.object({
        firstName: z.string(),
        lastName: z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3)
    })
    return schema.safeParse(data)
}

function validateUserSignin(data) {
    const schema = z.object({
        email: z.string().email(),
        password: z.string().min(3)
    })

    return schema.safeParse(data)
}

function generatehash(password, salt = uuidv4()) {
    const hash = crpto.createHmac('sha256', salt)
        .update(password)
        .digest('hex');
    return { salt, hash }

}

function generateUserToken(data) {
    const safeParseResult = userTokenSchema.safeParse(data);
    if (safeParseResult.error) throw new Error(safeParseResult.error)

    const token = JWT.sign(JSON.stringify(safeParseResult.data), JWT_SECRET)

    return token
}

function validateUserToken(token) {
    try {
        const payload = JWT.verify(token, JWT_SECRET);
        const safeParseResult = userTokenSchema.safeParse(JSON.parse(payload));

        if (safeParseResult.error) throw new Error(safeParseResult.error)

        return safeParseResult.data

    } catch (error) {
        return null
    }
}

module.exports = { validateUserSignup, generatehash, generateUserToken, validateUserToken, validateUserSignin }