const users = require('./../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const jwt = require('jsonwebtoken');

const signToken = id => {
    return jwt.sign({ id }, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES
       })
}

exports.signup = asyncErrorHandler(async (req, res, next) => {
   const token = signToken(newUser._id);

    const newUser = { id: users.length + 1, ...req.body };
    users.push(newUser);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = asyncErrorHandler(async(req, res, next) => {
    const { username, password } = req.body;
      const user = users.find((u) => u.username === username && u.password === password);
  
      if (user) {
        const token = signToken(user._id);
        res.json({ token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }

});


exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
    res.json(users);
  });


  exports.getUser = asyncErrorHandler(async (req, res, next) => {
    const userId = parseInt(req.params.id);
      const user = users.find((u) => u.id === userId);
  
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
  });

  
  exports.updateUser = asyncErrorHandler(async (req, res, next) => {
    const userId = parseInt(req.params.id);
    const index = users.findIndex((u) => u.id === userId);

    if (index !== -1) {
      users[index] = { ...users[index], ...req.body };
      res.json(users[index]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });

  
  exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
    const userId = parseInt(req.params.id);
    const index = users.findIndex((u) => u.id === userId);

    if (index !== -1) {
      const deletedUser = users.splice(index, 1);
      res.json({
        message: "User deleted Sucessfuly",
        //data: deletedUser[0] 
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
  
  exports.protect = asyncErrorHandler(async (req, res, next) => {
    //1. Read the token & check if it exist
    const testToken = req.headers.authorization;
    let token;
    if(testToken && testToken.startsWith('Bearer')){
         token = testToken.split(' ')[1];
    }
    if(!token){
        next(new CustomError('You are not loged in - unauthorized!', 401))
    }
    
    //2. Validate the token
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);

    //3. If the user exists
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
  //1. Get user based on posted email
  const user = await User.findOne({email: req.body.email});
  if(!user){
      const error = new CustomError('We could not find the user with given email', 404);
      next(error);
  }

  //2. Generate a random rest token
  const resetToken = user.createResetPasswordToken();

  await user.save({validateBeforeSave: false});

  //3. Send the token back to the user email
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


exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  //1. If the user exists with the given token & token has not expired
  const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({passwordResetToken: token, passwordResetTokenExpires: {$gt: Date.now()}});

  if(!user){
      const error = new CustomError('Token is ivalid or has expired!', 400);
      next(error);
  }

  //2. Resetting the user password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.passwordChangedAt = Date.now();

  if(req.body.password == req.body.confirmPassword){
      user.save();
  
  //3. Login the user
  const loginToken = signToken(user._id);

  res.status(200).json({
      status: 'success',
      token: loginToken
  })
  }else{
  
  const error = new CustomError('Password and confirmPassword deos not match!', 400);
      next(error);
  } 
});





