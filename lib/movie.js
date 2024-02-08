const { z } = require('zod')

function validateCreateMoviePayload(payload) {
    const schema = z.object({
        title: z.string(),
        description: z.string(),
        language: z.string()
    })
    return schema.safeParse(payload)
}

module.exports = { validateCreateMoviePayload }