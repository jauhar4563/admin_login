const express = require('express')
const admin_route = express()
const config = require("../config/config");

const auth = require('../middlewares/adminAuth')

admin_route.set('view engine', 'ejs')
admin_route.set('views','./views/admin')

const multer = require('multer')
const path = require('path')

admin_route.use(express.static('public'))

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

const session = require('express-session');
admin_route.use(session({
    secret:config.sessionSecret,
    resave:false,
    saveUninitialized:true
}))

const bodyParser = require('body-parser')
admin_route.use(bodyParser.json())
admin_route.use(bodyParser.urlencoded({extended:true}))



const adminController = require('../controllers/adminController');

admin_route.get('/',auth.isLogout,adminController.loadLogin)

admin_route.post('/',adminController.verifyLogin);

admin_route.get('/home',auth.isLogin,adminController.loadDashboard);



admin_route.post('/logout',auth.isLogin,adminController.logout)
// admin_route.get('/logout',auth.isLogin)

admin_route.get('/dashboard',auth.isLogin,adminController.adminDashboard)

admin_route.get('/newUser',auth.isLogin,adminController.newUserLoad)

admin_route.post('/newUser',upload.single('image'),auth.isLogin,adminController.addUser)

admin_route.get('/editUser',auth.isLogin,adminController.editUserLoad)

admin_route.post('/editUser',upload.single('image'),auth.isLogin,adminController.updateUser);

admin_route.get('/deleteUser',adminController.deleteUser)

admin_route.get('*',(req,res)=>{
    res.redirect('/admin')       
})

module.exports = admin_route;

