const prisma = require('../config/prisma');

exports.add = async (userId, propertyId) => {
  return await prisma.favorite.create({
    data: { userId, propertyId }
  });
};

exports.remove = async (userId, propertyId) => {
  return await prisma.favorite.delete({
    where: {
      userId_propertyId: { userId, propertyId }
    }
  });
};

exports.list = async (userId) => {
  return await prisma.favorite.findMany({
    where: { userId },
    include: { property: true }
  });
};
