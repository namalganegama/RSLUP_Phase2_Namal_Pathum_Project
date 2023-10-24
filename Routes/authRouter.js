const express = require('express');
const authController = require('./../Controllers/authController')

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);


router.route('/all').get( authController.getAllUsers);

router.route('/:userId')
.get( authController.getUser)
.put( authController.updateUser)
.delete(authController.deleteUser)



module.exports = router;