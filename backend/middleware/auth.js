const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Please log in to continue' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');// the -password is used so that the password is not returned to user

    if (!user) {
      return res.status(401).json({ message: 'Please log in to continue' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Please log in to continue' });
  }
};

module.exports = protect;