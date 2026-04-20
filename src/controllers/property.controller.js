const propertyService = require('../services/property.service');

exports.create = async (req, res) => {
  try {
    const result = await propertyService.create(req.userId, req.userRole, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPublicList = async (req, res) => {
  try {
    const properties = await propertyService.getPublicList();
    res.json(properties);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMyProperties = async (req, res) => {
  try {
    const properties = await propertyService.getByUser(req.userId);
    res.json(properties);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAdminProperties = async (req, res) => {
  try {
    const properties = await propertyService.getAllAdmin();
    res.json(properties);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const property = await propertyService.getById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await propertyService.update(req.params.id, req.userId, req.userRole, req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await propertyService.delete(req.params.id, req.userId, req.userRole);
    res.json({ message: 'Property deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.approve = async (req, res) => {
  try {
    const result = await propertyService.approve(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.reject = async (req, res) => {
  try {
    const { rejectReason } = req.body;
    const result = await propertyService.reject(req.params.id, rejectReason);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.nearby = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;
    const properties = await propertyService.nearby(lat, lng, radius);
    res.json(properties);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
