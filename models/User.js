let knex= require('../database/connection')
let bcrypt = require('bcrypt')
const PasswordToken = require('./PasswordToken')



class User {
    
    async create(email, password, name) {

        try {

            let hash = await bcrypt.hash(password, 10)
            await knex.insert({email: email, password: hash, name: name, role: 0}).table('users')

        } catch (error) {
            console.log(error)
        }
    }

    async findByEmail(email) {

        try {
            
            if (email != undefined) {
                let result = await knex.select("id", "name", "email", "password", "role").where({email: email}).table("users")

                if (result.length > 0) {
                    return result[0]
                } else {
                    return undefined
                }
            }

        } catch (error) {
            console.log(error)
            return undefined
        }
    }



    async findAll() {
        let users = await knex.select("id", "name", "email").from("users")

        try {
            return users
        } catch (error) {
            return undefined
        }
    }

    async findUserById(id) {

        try {
            
            if (id != undefined) {
                let result = await knex.select("id", "name", "email").where({id: id}).table("users")

                if (result.length > 0) {
                    return result[0]
                } else {
                    return undefined
                }
            }

        } catch (error) {
            console.log(error)
            return undefined
        }
    }

    async editUser(id, email, name) {

        let user = await this.findUserById(id)

        let editUser = {}

        if (email != undefined) {
            if (email != user.email) {
                let result = await this.findByEmail(email)
                if (!result) {
                    editUser.email = email
                }
            } else {
                return {status: false, err: 'O email já está cadastrado'}
            }
        }

        if (name != undefined) {
            if (name != user.name) {
                editUser.name = name
            }
        }

        try {
            
            await knex.select("name", "email").where({id: id}).update(editUser).table("users")
            return {status: true}

        } catch (error) {
            console.log(error)
        }
    }   

    async deleteUser(id) {

        if (id == undefined) {
            res.status(406)
            return
        }

        try {
            await knex.delete().where({id: id}).table("users")
            res.status(200)
            res.send('usuário deletado')
        } catch (error) {
            console.log(error)
        }
    }


    async changePassword(newPassword, id, token) {
        let hash = await bcrypt.hash(newPassword, 10)
        await knex.update({password: hash}).where({id: id}).table("users")

        await PasswordToken.setUsed(token)
    }



}


module.exports = new User()