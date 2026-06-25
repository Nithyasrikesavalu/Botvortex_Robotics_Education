import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user info to request (id and role)
            req.user = decoded;

            return next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const isInstructor = (req, res, next) => {
    if (req.user && req.user.role && req.user.role.toLowerCase() === 'instructor') {
        next();
    } else {
        console.warn(`[Auth] Access denied for user ${req.user?.id} on path ${req.path}. Role: ${req.user?.role}`);
        res.status(403).json({ message: 'Not authorized as an instructor' });
    }
};
