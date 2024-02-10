const Theatre = require('../models/theatre')
const { validateCreateTheatrePayload } = require('../lib/theatre')

const handleGetAllTheaters = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const LIMIT = 5;

    const skip = (page - 1) * LIMIT
    const theatres = await Theatre.find({}).skip(skip).limit(LIMIT)

    return res.json({ status: 'success', data: { page, theatres } })
}

const handleGetTheatreById = async (req, res) => {
    const id = req.params.id;
    const theatre = await Theatre.findById(id);

    if (!theatre) return res.status(404).json({ error: `Theatre with id ${id} not found!` })

    return res.json({ status: 'success', data: { theatre } })

}


const handleCreateTheatre = async (req, res) => {
    const safeParseResult = validateCreateTheatrePayload(req.body)

    if (safeParseResult.error) {
        return res.status(400).json({ status: 'error', error: safeParseResult.error })
    }

    const { name, location: { lat, lon, address } } = safeParseResult.data

    const threatre = await Theatre.create({ name, location: { lat, lon, address } })

    return res.json({ status: 'success', data: { id: threatre._id } })

}

module.exports = { handleCreateTheatre, handleGetAllTheaters, handleGetTheatreById }