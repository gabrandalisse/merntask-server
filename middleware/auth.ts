import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
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
