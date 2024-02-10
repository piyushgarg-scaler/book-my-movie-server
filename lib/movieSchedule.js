const { z } = require('zod')

function validateCreateMovieSchedulePayload(payload) {
    const schema = z.object({
        movieId: z.string(),
        theatreId: z.string(),
        startTime: z.string(),
        price: z.string(),
    })
    return schema.safeParse(payload)
}

module.exports = { validateCreateMovieSchedulePayload }