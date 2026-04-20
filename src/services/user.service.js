const prisma = require('../config/prisma');

exports.getProfile = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, role: true }
  });
};
