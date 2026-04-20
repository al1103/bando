const propertyService = require('../src/services/property.service');
const prisma = require('../src/config/prisma');

jest.mock('../src/config/prisma', () => ({
  property: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  $executeRaw: jest.fn(),
  $queryRaw: jest.fn()
}));

describe('Property Service', () => {
  describe('create', () => {
    it('should set status to PENDING for USER', async () => {
      prisma.property.create.mockResolvedValue({ id: 'prop-1' });
      
      await propertyService.create('user-1', 'USER', { title: 'Test' });

      expect(prisma.property.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ status: 'PENDING' })
      }));
    });

    it('should set status to APPROVED for ADMIN', async () => {
      prisma.property.create.mockResolvedValue({ id: 'prop-1' });
      
      await propertyService.create('admin-1', 'ADMIN', { title: 'Test' });

      expect(prisma.property.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ status: 'APPROVED' })
      }));
    });
  });

  describe('update', () => {
    it('should throw if user is not owner and not admin', async () => {
      prisma.property.findUnique.mockResolvedValue({ userId: 'other-user' });
      
      await expect(propertyService.update('prop-1', 'user-1', 'USER', {}))
        .rejects.toThrow('Unauthorized');
    });

    it('should allow if user is owner', async () => {
      prisma.property.findUnique.mockResolvedValue({ userId: 'user-1' });
      prisma.property.update.mockResolvedValue({});
      
      await propertyService.update('prop-1', 'user-1', 'USER', { title: 'New' });
      expect(prisma.property.update).toHaveBeenCalled();
    });

    it('should allow if user is admin', async () => {
      prisma.property.findUnique.mockResolvedValue({ userId: 'other-user' });
      prisma.property.update.mockResolvedValue({});
      
      await propertyService.update('prop-1', 'admin-1', 'ADMIN', { title: 'New' });
      expect(prisma.property.update).toHaveBeenCalled();
    });
  });
});
