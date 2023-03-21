const { compareSync } = require('bcrypt')
let jwt = require('jsonwebtoken')
const secret = 'jnaidghasd456'

module.exports = function(req, res, next) {

    const authToken = req.headers['authorization']

    if (authToken != undefined) {

        const bearer = authToken.split(' ')
        let token = bearer[1]

        try {
            let decoded = jwt.verify(token, secret)

            if (decoded.role == 1) {
                next()
            } else {    
                res.status(403)
                res.send('Você não é um administrador')
                console.log(error)
            }
          
        } catch (error) {
            res.status(403)
            res.send('Você não está autenticado')
            console.log(error)
        }


    } else {
        res.status(403)
        res.send('Você não está autenticado')
    }
}