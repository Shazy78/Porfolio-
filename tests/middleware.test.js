const { verifyToken } = require('../src/middleware/authMiddleware');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            header: jest.fn()
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 401 if no token is provided', () => {
        req.header.mockReturnValue(undefined);

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Access Denied. No token provided.' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if an invalid token is provided', () => {
        req.header.mockReturnValue('Bearer invalidtoken');
        jwt.verify.mockImplementation(() => { throw new Error('Invalid Token') });

        verifyToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Token' });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next() if a valid token is provided', () => {
        req.header.mockReturnValue('Bearer validtoken');
        const decodedUser = { id: 1, role: 'admin' };
        jwt.verify.mockReturnValue(decodedUser);

        verifyToken(req, res, next);

        expect(req.user).toEqual(decodedUser);
        expect(next).toHaveBeenCalled();
    });
});
