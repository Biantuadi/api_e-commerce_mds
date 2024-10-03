import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET as string;

export default class AuthMiddleware {
  public static async isTokenValid(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Extract the token from the Authorization header
      const token = req.headers.authorization?.split(" ")[1];  // Ensure token is in "Bearer <token>" format

      if (!token) {
        res.status(401).json({ message: "No token provided, authorization denied" });
        return;
      }

      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET) as { userID: string };

      req.body.user = decoded;
      next();
    } catch (error: any) {
      console.error("An error occurred while processing the request:", error);
      res.status(401).json({ message: "Token is not valid" });
    }
  }

  public static async isAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({ message: "No token provided, authorization denied" });
        return;
      }

      const decoded: any = jwt.verify(token, JWT_SECRET);
      if (decoded.role !== "admin") {
        res.status(403).json({ message: "Access denied, admin only" });
        return;
      }

      req.body.user = decoded;
      next();
    } catch (error: any) {
      console.error("An error occurred while processing the request:", error);
      res.status(500).json({ message: "An error occurred while processing the request" });
    }
  }

   // admin or user :
   public static async isAdminOrUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({ message: "No token, authorization denied" });
        return;
      }
      const decoded: any = jwt.verify(token, JWT_SECRET);
      if (decoded.role !== "admin" && decoded.role !== "user") {
        res.status(401).json({ message: "No token, authorization denied" });
        return;
      }
      req.body.user = decoded;
      next();
    } catch (error: any) {
      console.error("An error occurred while processing the request:", error);
      res
        .status(500)
        .json({ message: "An error occurred while processing the request" });
    }
  }

  public static async isSeller(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({ message: "No token, authorization denied" });
        return;
      }
  
      const decoded: any = jwt.verify(token, JWT_SECRET);
      if (decoded.role !== "seller") {
        res.status(403).json({ message: "You are not authorized to perform this action" });
        return;
      }
  
      req.body.user = decoded;
      next();
    } catch (error: any) {
      console.error("An error occurred while verifying seller status:", error);
      res.status(500).json({ message: "An error occurred while processing the request" });
    }
  }
}
