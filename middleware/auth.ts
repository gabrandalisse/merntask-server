import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// TODO review any types
export default function (req: any, res: Response, next: NextFunction) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ msg: "the token is missing" });

  try {
    const encode: any = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = encode.user;

    next();
  } catch (error) {
    res.status(401).json({ msg: "invalid token" });
  }
}
