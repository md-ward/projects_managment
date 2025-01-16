import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Define a custom interface to extend the Request object
interface AuthenticatedRequest extends Request {
    user?: string | JwtPayload; // Attach the decoded user information to the request
}

const checkAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    // Retrieve the token from the Authorization header
    const authHeader = req.headers.cookie?.split('=')[1] as string;
// console.log(authHeader);

    
    if (!authHeader) {
        res.status(401).json({ message: 'Authorization header is missing.' });
        return;
    }

    const token = authHeader.split(' ')[1]||authHeader.split('%20')[1]; // Assuming "Bearer <token>" format
    if (!token) {
        res.status(401).json({ message: 'Token is missing.' });
        return;
    }

    try {
        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decodedToken; // Attach user information to the request object
        // console.log(decodedToken);
        
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token.', error: (error as Error).message });
    }
};

export default checkAuth;
