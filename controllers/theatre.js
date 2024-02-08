const Theatre = require('../models/theatre')
const { validateCreateTheatrePayload } = require('../lib/theatre')

const handleCreateTheatre = async (req, res) => {
    const safeParseResult = validateCreateTheatrePayload(req.body)

    if (safeParseResult.error) {
        return res.status(400).json({ status: 'error', error: safeParseResult.error })
    }

    const { name, location: { lat, lon, address } } = safeParseResult.data

    const threatre = await Theatre.create({ name, location: { lat, lon, address } })

    return res.json({ status: 'success', data: { id: threatre._id } })

}

module.exports = { handleCreateTheatre }