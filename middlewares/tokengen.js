const JWT = require('jsonwebtoken') 
const JWT_KEY = '@IronMan3000haterobbin'

exports.generateToken = (password) => {
    try{
        const token = JWT.sign(password, JWT_KEY)
        return token
    }
    catch(err){
        return err
    }
}

exports.validateToken = (token) => {
    try{
        const data = JWT.verify(token, JWT_KEY)
        return data
    }
    catch(err)
    {
        return err
    }
}