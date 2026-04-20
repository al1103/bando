const authService = require('../src/services/auth.service');
const prisma = require('../src/config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../src/config/prisma', () => ({
  user: {
    create: jest.fn(),
    findUnique: jest.fn()
  }
}));

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Service', () => {
  describe('register', () => {
    it('should hash password and create user', async () => {
      bcrypt.hash.mockResolvedValue('hashed_pw');
      prisma.user.create.mockResolvedValue({ id: '1', email: 'test@test.com' });

      const user = await authService.register('test@test.com', 'password');

      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { email: 'test@test.com', password: 'hashed_pw' }
      });
      expect(user).toEqual({ id: '1', email: 'test@test.com' });
    });
  });

  describe('login', () => {
    it('should throw error if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(authService.login('test@test.com', 'pw')).rejects.toThrow('Invalid credentials');
    });

    it('should return token if credentials are valid', async () => {
      const user = { id: '1', email: 'test@test.com', password: 'hashed_pw', role: 'USER' };
      prisma.user.findUnique.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token');

      const result = await authService.login('test@test.com', 'pw');

      expect(result.token).toBe('token');
      expect(result.user).toEqual(user);
    });
  });
});
