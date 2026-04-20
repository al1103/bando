const favoriteService = require('../services/favorite.service');

exports.add = async (req, res) => {
  try {
    const favorite = await favoriteService.add(req.userId, req.params.propertyId);
    res.status(201).json(favorite);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await favoriteService.remove(req.userId, req.params.propertyId);
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.list = async (req, res) => {
  try {
    const favorites = await favoriteService.list(req.userId);
    res.json(favorites);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
