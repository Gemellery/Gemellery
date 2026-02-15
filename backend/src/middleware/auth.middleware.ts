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
    return res.sendStatus(401);
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
    return res.sendStatus(403);
  }
};

export const authorizeRole = (...allowedRoles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user || !allowedRoles.includes(req.user.role.toLowerCase())) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
