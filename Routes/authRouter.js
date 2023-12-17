const express = require('express');
const authController = require('./../Controllers/authController')

const router = express.Router();

router.route('/signup').post(
    authController.signup, 
    authController.restrict('administrator, ticket agent,') 
    );
router.route('/login').post(authController.login);

router.route('/forgotPassword').post(authController.forgotPassword);

router.route('/resetPassword/:token').patch(authController.resetPassword);

router.route('/all').get(
    authController.protect,
    authController.restrict('administrator, ticket agent,'),  
    authController.getAllUsers
    );

router.route('/:userId')
.get(
    authController.protect, 
    authController.getUser
    )
.put(
    authController.protect, 
    authController.updateUser
    )

.delete(
    authController.protect, 
    authController.restrict('administrator, ticket agent,'), 
    authController.deleteUser
    )

module.exports = router;