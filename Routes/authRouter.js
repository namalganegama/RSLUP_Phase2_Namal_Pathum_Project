const express = require('express');
const authController = require('./../Controllers/authController')

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);


router.route('/all').get(authController.protect, authController.getAllUsers);

router.route('/:userId')
.get(authController.protect, authController.getUser)
.put(authController.protect, authController.updateUser)

.delete(
    authController.protect, 
    authController.restrict('admin', 'developer'), 
    authController.deleteUser
    )

module.exports = router;