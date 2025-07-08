const requireAdmin = require('../middleware/authenticator');
const User = require('../MongooseSchema/UserSchema');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const superadmin = require('../middleware/superAuthenticator');
const {createUser, 
    signUser,makeAdmin, 
    deleteAdmin, getUsers, 
    forgotAndResetPassword, changePassword, 
    updateAfterResetPassword} = require('../controller/UserContoller')

//route to create user
router.post('/createuser',requireAdmin,createUser );

//route to sign in
router.post('/signuser',signUser );

//route to make admin only superadmin can make one admin
router.patch('/makeadmin',superadmin,makeAdmin )

//route to delete admin only supe allowed
router.delete('/deleteadmin',superadmin,deleteAdmin )

//route to get all users
router.get('/getusers',requireAdmin,getUsers )

//route to send reset for password
router.post('/forgot-password',forgotAndResetPassword );

//route tp update password when authenticated
router.post('/update-password',requireAdmin,changePassword);

//route to reset password after forgetting
router.post('/reset-password',updateAfterResetPassword );


module.exports = router;