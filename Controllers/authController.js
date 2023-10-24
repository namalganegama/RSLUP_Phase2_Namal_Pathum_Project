const users = require('./../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
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
  




