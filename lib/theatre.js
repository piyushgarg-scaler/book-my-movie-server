const { z } = require('zod')

function validateCreateTheatrePayload(payload) {
    const schema = z.object({
        name: z.string(),
        location: z.object({
            lat: z.string(),
            lon: z.string(),
            address: z.string(),
        })
    })
    return schema.safeParse(payload)
}

module.exports = { validateCreateTheatrePayload }