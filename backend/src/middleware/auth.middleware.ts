import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtUserPayload {
  id: number;
  email: string;
  role: string;
}

export const authGuard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    req.user = {
      id: decoded.id ?? decoded.user_id,
      email: decoded.email,
      role: decoded.role,
    };


    next();
  } catch {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

/**
 * Optional auth - parses JWT if present but doesn't block.
 * Sets req.user if token is valid, otherwise continues without it.
 */
export const optionalAuthGuard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(); // No token, continue without user
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );
    req.user = {
      id: decoded.id ?? decoded.user_id,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    // Token invalid/expired, continue without user
  }
  next();
};

export const authorizeRole = (...allowedRoles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user || !allowedRoles.includes(req.user.role.toLowerCase())) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
