const authMiddleware = require('../src/middleware/auth');
const roleMiddleware = require('../src/middleware/role');
const jwt = require('jsonwebtoken');
const { secret } = require('../src/config/jwt');

jest.mock('jsonwebtoken');

describe('Middleware', () => {
  describe('Auth Middleware', () => {
    let req, res, next;

    beforeEach(() => {
      req = { headers: {} };
      res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      next = jest.fn();
    });

    it('should return 401 if no token provided', () => {
      authMiddleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should call next if token is valid', () => {
      req.headers.authorization = 'Bearer valid-token';
      jwt.verify.mockReturnValue({ id: 'user-1', role: 'ADMIN' });
      
      authMiddleware(req, res, next);
      
      expect(req.userId).toBe('user-1');
      expect(req.userRole).toBe('ADMIN');
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Role Middleware', () => {
    let req, res, next;

    beforeEach(() => {
      req = { userRole: 'USER' };
      res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      next = jest.fn();
    });

    it('should return 403 if role not allowed', () => {
      const middleware = roleMiddleware(['ADMIN']);
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should call next if role is allowed', () => {
      req.userRole = 'ADMIN';
      const middleware = roleMiddleware(['ADMIN']);
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
