let knex = require('../database/connection')
let User = require('./User')

class passwordToken{

    async validate(email) {

        let user = await User.findByEmail(email)

        if (user != undefined) {

            // if email exists the token can be generated
            try {


                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token: Date.now()
                }).table("passwordtokens")

                return ({status: true})

            } catch (error) {
                console.log(error)
                return ({status: false, err: error})
            }

        } else {
            return ({status: false, err: 'O usuário passado não existe'})
        }
    }

    async validateToken(token) {

        try {
            let result = await knex.select().where({token: token}).table("passwordtokens")

            if (result.length > 0) {
                let tk = result[0]

                if (tk.used) {
                    return ({status: false})
                } else {
                    return ({status: true, token: tk})
                }
            } else {
                return false
            }

        } catch (error) {
            console.log(error)
            return false
        }     
    }


    async setUsed(token) {
        await knex.update({used: 1}).where({token: token}).table("passwordtokens")
    }
    
}






module.exports = new passwordToken()