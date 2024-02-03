const crpto = require('crypto')
const { z } = require('zod')
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken');

function validateUserSignup(data) {
    const schema = z.object({
        firstName: z.string(),
        lastName: z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3)
    })
    return schema.safeParse(data)
}

function generatehash(password, userSalt=null) {
    let salt = uuidv4();
    if (userSalt) salt = userSalt;
    const hash = crpto.createHmac('sha256', salt)
        .update(password)
        .digest('hex');
    return { salt, hash }
}

function generateJwtToken(payload) {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {algorithm: 'HS256'});
    return token;
}

module.exports = { 
    validateUserSignup, 
    generatehash, 
    generateJwtToken,
}
