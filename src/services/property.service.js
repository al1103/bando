const prisma = require('../config/prisma');

exports.create = async (userId, userRole, data) => {
  const { title, description, price, type, area, address, lat, lng, expiredAt } = data;
  const status = userRole === 'ADMIN' ? 'APPROVED' : 'PENDING';
  
  return await prisma.property.create({
    data: {
      title, description, price, type, area, address, status, userId,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      expiredAt: expiredAt ? new Date(expiredAt) : null
    }
  });
};

exports.getPublicList = async () => {
  const now = new Date();
  return await prisma.property.findMany({
    where: {
      status: 'APPROVED',
      OR: [
        { expiredAt: null },
        { expiredAt: { gt: now } }
      ]
    }
  });
};

exports.getByUser = async (userId) => {
  return await prisma.property.findMany({
    where: { userId }
  });
};

exports.getAllAdmin = async () => {
  return await prisma.property.findMany();
};

exports.getById = async (id) => {
  return await prisma.property.findUnique({
    where: { id }
  });
};

exports.update = async (id, userId, userRole, data) => {
  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) throw new Error('Not found');
  if (userRole !== 'ADMIN' && property.userId !== userId) throw new Error('Unauthorized');

  const { title, description, price, type, area, address, lat, lng, expiredAt } = data;
  
  return await prisma.property.update({
    where: { id },
    data: {
      title, description, price, type, area, address,
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
      expiredAt: expiredAt ? new Date(expiredAt) : null
    }
  });
};

exports.delete = async (id, userId, userRole) => {
  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) throw new Error('Not found');
  if (userRole !== 'ADMIN' && property.userId !== userId) throw new Error('Unauthorized');

  return await prisma.property.delete({ where: { id } });
};

exports.approve = async (id) => {
  return await prisma.property.update({
    where: { id },
    data: { status: 'APPROVED', rejectReason: null }
  });
};

exports.reject = async (id, rejectReason) => {
  return await prisma.property.update({
    where: { id },
    data: { status: 'REJECTED', rejectReason }
  });
};

exports.nearby = async (lat, lng, radius = 5000) => {
  // Simplified nearby search without PostGIS
  const now = new Date();
  const properties = await prisma.property.findMany({
    where: {
      status: 'APPROVED',
      OR: [
        { expiredAt: null },
        { expiredAt: { gt: now } }
      ]
    }
  });

  // Basic bounding box or simple filter can be added here if needed
  return properties;
};
