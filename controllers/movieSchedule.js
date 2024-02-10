const MovieSchedule = require('../models/movieScheduleMapping');
const { validateCreateMovieSchedulePayload } = require('../lib/movieSchedule');

const handleGetAllMovieSchedules = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const LIMIT = 5;

    const skip = (page - 1) * LIMIT;
    const movieSchedules = await MovieSchedule.find({}).skip(skip).limit(LIMIT);

    return res.json({ status: 'sucsess', data: { page, movieSchedules } });
};

const handleCreateMovieSchedule = async (req, res) => {

    const safeParseResult = validateCreateMovieSchedulePayload(req.body);

    if (safeParseResult.error) {
        return res.status(400).json({ status: 'error', error: safeParseResult.error });
    }

    const { movieId, theatreId, startTime, price } = safeParseResult.data;

    try {
        const movieSchedule = await MovieSchedule.create({ movieId, theatreId, startTime, price });

        return res.json({ status: 'success', data: { id: movieSchedule._id } });
    } catch (err) {
        if (err.code === 11000)
            return res.status(400).json({ message: `Schedule already exists!` })
        return res.status(500).json({ message: 'Internal Server Error' })
    }
};

module.exports = { handleCreateMovieSchedule, handleGetAllMovieSchedules }