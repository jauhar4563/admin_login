const express = require('express');
const session = require('express-session');

const user_route = express();

const config = require('../config/config')

user_route.use(session({
    secret:config.sessionSecret,
    resave:false,
    saveUninitialized:true
}))

const {isLogin,isLogout} = require('../middlewares/auth')

user_route.set('view engine','ejs');
user_route.set('views','./views/users')

const bodyParser = require('body-parser')
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}))

const multer = require('multer')
const path = require('path')

user_route.use(express.static('public'))

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'../public/userImages'));
    },
    filename:(req,file,cb)=>{
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    } 
})
const upload = multer({storage:storage})

const userController = require('../controllers/userController');

user_route.get('/register',isLogout,userController.loadRegister);

user_route.post('/register',upload.single('image'),userController.insertUser)

user_route.get('/verify',userController.verifyMail)

user_route.get('/',isLogout,userController.loginLoad);
user_route.get('/login',isLogout,userController.loginLoad);

user_route.post('/login',userController.verifyLogin);

user_route.get('/home',isLogin,userController.loadHome)

user_route.post('/logout',isLogin,userController.userLogout)

user_route.get('/edit',isLogin,userController.editLoad);

user_route.post('/edit',upload.single('image'),userController.updateProfile)

module.exports = user_route;