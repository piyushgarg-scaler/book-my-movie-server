const { z } = require('zod')

function validateCreateMovieSchedulePayload(payload) {
    const schema = z.object({
        movieId: z.string(),
        theatreId: z.string(),
        startTime: z.coerce.date(),
        price: z.string(),
    })
    return schema.safeParse(payload)
}

module.exports = { validateCreateMovieSchedulePayload }