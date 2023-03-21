let User = require('../models/User')
let passwordToken = require('../models/PasswordToken')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const secret = 'jnaidghasd456'


class UserController {

    async create(req, res) {
        
        let {email, password, name} = req.body

        if (email == undefined || password == undefined && password.length < 8 || name == undefined) {
            res.status(406)
            res.json({err: 'Algum dado não foi informado. Tente Novamente'})
        }

        let emailExist = await User.findByEmail(email)

        if (emailExist) {
            res.status(406)
            res.json({err: 'O usuário já exise'})
        } else {
            res.status(200)
            await User.create(email, password, name)
            res.send('Usuário Criado')
        }
    }

    async index(req, res) {
        let users = await User.findAll()

        if (users != undefined) {
            res.status(200)
            res.json({allUsers: users})
        } else {
            res.status(406)
            res.send('Não foi possível listar os usuários')
        }
    }

    async findById(req, res) {

        let id = req.params.id

        if (id != undefined) {
            let result = await User.findUserById(id)
            if (result == undefined) {
                res.status(406)
                res.json({err: 'O usuário não pôde ser encontrado'})
            } else {
                res.status(200)
                res.json({result})
            }
        } else {
            res.status(406)
            res.json({err: 'Informe um ID válido'})
        }
    }


    async editUser(req, res) {
        let {id, email, name } = req.body

        if (id != undefined && email != undefined && name != undefined) {
            res.status(200)
            let result = await User.editUser(id, email, name)
            res.send(result)
        } else {
            res.status(406)
            res.json({err: 'Informe os dados corretamente'})
        }
    }

    async deleteUser(req, res) {
        
        let id = req.body.id

        if (id == undefined) {
            res.status(406)
            res.send('Passe um ID correto')
        }

        let result = await User.findUserById(id)

        if (result) {
            res.status(200)
            await User.deleteUser(id)
            res.send('Usuário deletado com sucesso')
        } else {
            res.status(406)
            res.json({err: 'O usuário não existe'})
        }
    }

    async recoverPassword(req, res) {
        let email = req.body.email

        let result = await passwordToken.validate(email)

        if (result.status) {
            res.status(200)
            res.json({result: result.status})
        } else {
            res.status(406)
            res.send(result.err)
        }
    } 
    
    
    async changePassword(req, res) {

        let token = req.body.token
        let password = req.body.password

        let result = await passwordToken.validateToken(token)

        if (result.status) {

            await User.changePassword(password, result.token.user_id, result.token.token)
            res.status(200)
            res.send('Senha alterada com sucesso')

        } else {
            res.status(406)
            res.send('Token inválido')
        }
    }


    async login(req, res) {
        let {email, password} = req.body

        let user = await User.findByEmail(email)

        if (user != undefined) {
            let result = await bcrypt.compare(password, user.password)
            if (result) {

                let token = jwt.sign({email: user.email, role: user.role}, secret)

                res.status(200)
                res.json({token: token})

            } else {
                res.status(406)
                res.send("Senha Incorreta")
            }
        } else {
            res.json({status: false})
        }
    }

}


module.exports = new UserController()