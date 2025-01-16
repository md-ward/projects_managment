import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Store secret key securely in .env

// Generate JWT Token
export const generateToken = (userId: number, email: string,): string => {
  return "Bearer "+ jwt.sign({ userId, email }, SECRET_KEY, { expiresIn: "30d" });
};

// Verify JWT Token
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (err) {
    return null;
  }
};
