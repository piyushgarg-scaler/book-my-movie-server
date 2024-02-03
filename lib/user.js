const crpto = require('crypto')
const { z } = require('zod')
const { v4: uuidv4 } = require('uuid')

function validateUserSignup(data) {
    const schema = z.object({
        firstName: z.string(),
        lastName: z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3)
    })
    return schema.safeParse(data)
}

function generatehash(password) {
    const salt = uuidv4()
    const hash = crpto.createHmac('sha256', salt)
        .update(password)
        .digest('hex');
    return { salt, hash }

}

module.exports = { validateUserSignup, generatehash }