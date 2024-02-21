const MovieSchedule = require('../models/movieScheduleMapping');
const Booking = require('../models/booking')
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


const handleGetAllBookings = async (req, res) => {
    const allBookings = await Booking.aggregate([
        {
            '$lookup': {
                'from': 'users',
                'localField': 'userId',
                'foreignField': '_id',
                'as': 'user'
            }
        }, {
            '$unwind': {
                'path': '$user',
                'preserveNullAndEmptyArrays': false
            }
        }, {
            '$lookup': {
                'from': 'movieschedules',
                'localField': 'scheduleId',
                'foreignField': '_id',
                'as': 'schedule',
                'pipeline': [
                    {
                        '$lookup': {
                            'from': 'movies',
                            'localField': 'movieId',
                            'foreignField': '_id',
                            'as': 'movie'
                        }
                    }, {
                        '$lookup': {
                            'from': 'theatres',
                            'localField': 'theatreId',
                            'foreignField': '_id',
                            'as': 'theatre'
                        }
                    }, {
                        '$unwind': {
                            'path': '$movie'
                        }
                    }, {
                        '$unwind': {
                            'path': '$theatre'
                        }
                    }
                ]
            }
        }, {
            '$unwind': {
                'path': '$schedule'
            }
        }
    ])

    return res.json({ data: { bookings: allBookings } })
}

module.exports = { handleCreateMovieSchedule, handleGetAllMovieSchedules, handleGetAllBookings }