const userService = require('../services/user.service');

exports.me = async (req, res) => {
  try {
    const user = await userService.getProfile(req.userId);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
