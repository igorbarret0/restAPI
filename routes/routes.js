let express = require("express")
let app = express();
let router = express.Router();
let HomeController = require("../controllers/HomeController");
let UserController = require('../controllers/UserController')
let User = require('../models/User')
let AdminAuth = require('../middleware/AdminAuth.')


router.get('/', HomeController.index);
router.post('/user', UserController.create)
router.get('/user', AdminAuth, UserController.index)
router.get('/user/:id', UserController.findById)
router.put('/user', UserController.editUser)
router.delete('/user', UserController.deleteUser)
router.post('/recover', UserController.recoverPassword)
router.post('/changepassword', UserController.changePassword)
router.post('/login', UserController.login)

module.exports = router