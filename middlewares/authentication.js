const userLib = require('../lib/user')

function authenticationMiddleware() {
    return function (req, res, next) {
        const authHeader = req.headers['Authorization'] ?? req.headers['authorization']

        if (authHeader) {
            const headerSplit = authHeader.split('Bearer ')
            if (headerSplit.length === 2) {
                const token = headerSplit[1]
                const validateTokenResult = userLib.validateUserToken(token)
                if (validateTokenResult) req.user = validateTokenResult
            }
        }

        next()

    }
}

module.exports = { authenticationMiddleware }