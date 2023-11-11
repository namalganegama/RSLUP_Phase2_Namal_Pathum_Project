const CustomError = require('./../Utils/CustomError');
const User = require('./../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const util = require('util');
const sendEmail = require('./../Utils/email');
const crypto = require('crypto');


const signToken = id => {
    return jwt.sign({ id }, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES
       })
}

exports.signup = asyncErrorHandler(async (req, res, next) => {
   const newUser = await User.create(req.body);

   const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = asyncErrorHandler(async(req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password){
        const error = new CustomError('Please provide email ID & Password for login!', 400);
        return next(error);
    }
    
    const user = await User.findOne({ email }).select('+password');

    if(!user || !(await user.comparePasswordInDb(password, user.password))){
        const error = new CustomError('incorrect email or password!', 400);
        return next(error);
    }

    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    })

});


exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
    const users = await User.find();
  
    res.status(200).json({
      status: 'success',
      data: {
        users
      }
    });
  });


  exports.getUser = asyncErrorHandler(async (req, res, next) => {
    const userId = req.params.userId; 
    const user = await User.findById(userId);
  
    if (!user) {
      const error = new CustomError('User not found', 404);
      return next(error);
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  });

  
  exports.updateUser = asyncErrorHandler(async (req, res, next) => {
    const userId = req.params.userId; 
  
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true, 
      runValidators: true 
    });
  
    if (!updatedUser) {
      const error = new CustomError('User not found', 404);
      return next(error);
    }
  
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  });

  
  exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
    const userId = req.params.userId; 
  
    const deletedUser = await User.findByIdAndDelete(userId);
  
    if (!deletedUser) {
      const error = new CustomError('User not found', 404);
      return next(error);
    }
  
    res.status(204).json({
      status: 'success',
      data: null
    });
  });
  






exports.protect = asyncErrorHandler(async (req, res, next) => {
   
    const testToken = req.headers.authorization;
    let token;
    if(testToken && testToken.startsWith('Bearer')){
         token = testToken.split(' ')[1];
    }
    if(!token){
        next(new CustomError('You are not loged in - unauthorized!', 401))
    }
    
    
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);

    const user = await User.findById(decodedToken.id);

    if(!user){
        const error = new CustomError('The user with given token does not exist', 401);
        next(error);
    }
    req.user = user;
    next();
})


exports.restrict = (...role) => {
    return (req, res, next) => {
        if(!role.includes(req.user.role)){
            const error = new CustomError('You do not have permission to perform this action', 403);
            next(error);
        }
        next();
    }
}


exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  
  const user = await User.findOne({email: req.body.email});
  if(!user){
      const error = new CustomError('We could not find the user with given email', 404);
      next(error);
  }

 
  const resetToken = user.createResetPasswordToken();

  await user.save({validateBeforeSave: false});


  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `We have received a password reset request. Please use the below link to reset your password\n\n${resetUrl}\n\nThis reset password link will be valid only for 10 minutes.`

  try{
  await sendEmail({
      email: user.email,
      subject: 'Password change request received',
      message: message
      });

      res.status(200).json({
          status:'success',
          message: 'Password reset link send to the user email'
      });

  }catch(err){ 
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined
      user.save({validateBeforeSave: false});

      return next(new CustomError('There was an error sending password reset email. Please try again later', 500));
  }
});
