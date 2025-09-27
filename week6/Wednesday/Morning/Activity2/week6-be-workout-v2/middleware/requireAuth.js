const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {
  // 健壮的secret获取机制
  let secret;
  try {
    // 尝试使用 node-config
    const config = require('config');
    secret = config.get('secret');
  } catch (error) {
    // 如果node-config失败，回退到环境变量或默认值
    secret = process.env.SECRET || '64bytesofrandomness';
    console.log('Using fallback secret due to config error:', error.message);
  }

  // verify user is authenticated
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' })
  }

  const token = authorization.split(' ')[1]

  try {
    const { _id } = jwt.verify(token, secret);

    req.user = await User.findOne({ _id }).select('_id')
    next()

  } catch (error) {
    console.log('JWT verification error:', error)
    res.status(401).json({ error: 'Request is not authorized' })
  }
}

module.exports = requireAuth