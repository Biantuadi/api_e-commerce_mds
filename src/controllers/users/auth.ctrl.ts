import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import config from "../../config/env.config";
import { User } from "../../entity/User";  // Import the User entity
import { getRepository } from "typeorm";  // Import TypeORM's repository system

const JWT_SECRET = config.jwtSecret as string;
const TOKEN_EXPIRATION = config.tokenExpiration as string;

export default class AuthController {
  private static readonly SALT_ROUNDS = 10;

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, password } = req.body;
      const transformedEmail = email.toLowerCase();

      const emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
      if (!emailRegex.test(transformedEmail)) {
        res.status(400).json({ message: "Invalid email" });
        return;
      }

      // Use TypeORM to find the user
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { email: transformedEmail } });

      if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
      }

      const token = jwt.sign({ userID: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: TOKEN_EXPIRATION,
      });

      // Send back the user info (excluding the password)
      const { password: _, ...userToSend } = user;  // Exclude password
      res.status(200).json({ user: userToSend, token });
    } catch (error: any) {
      console.error("An error occurred while processing the request:", error);
      res.status(500).json({ message: "An error occurred while processing the request" });
    }
  }

  public async signup(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
  
      const { firstname, lastname, email, password } = req.body;
      const transformedEmail = email.toLowerCase();
  
      const emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
      if (!emailRegex.test(transformedEmail)) {
        res.status(400).json({ message: "Invalid email" });
        return;
      }
  
      const userRepository = getRepository(User);
      const existingUser = await userRepository.findOne({ where: { email: transformedEmail } });
      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }
  
      const hashedPassword = await bcrypt.hash(password, AuthController.SALT_ROUNDS);
  
      // Create new user with default role 'buyer'
      const newUser = userRepository.create({
        firstname,
        lastname,
        email: transformedEmail,
        password: hashedPassword,
        role: "buyer",  // Default role is 'buyer'
        createdAt: new Date(),
      });
  
      const savedUser = await userRepository.save(newUser);
  
      const token = jwt.sign({ userID: savedUser.id, role: savedUser.role }, JWT_SECRET, {
        expiresIn: TOKEN_EXPIRATION,
      });
  
      const { password: _, ...userToSend } = savedUser;  // Exclude password
      res.status(200).json({ user: userToSend, token });
    } catch (error: any) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  

  public async updateUserPassword(req: Request, res: Response): Promise<void> {
    try {
      const userID = req.body.user.userID;  // Extract the userID from the token payload
      const { oldPassword, newPassword } = req.body;
  
      console.log('====================================');
      console.log('userID:', userID);
      console.log('====================================');
  
      const userRepository = getRepository(User);
  
      // Find the user by their ID
      const user = await userRepository.findOne({ where: { id: userID } });
  
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
  
      // Check if the old password matches the stored password
      const passwordMatch = await bcrypt.compare(oldPassword, user.password);
      if (!passwordMatch) {
        res.status(400).json({ message: "Invalid old password" });
        return;
      }
  
      // Hash the new password and update it
      const hashedNewPassword = await bcrypt.hash(newPassword, AuthController.SALT_ROUNDS);
      user.password = hashedNewPassword;
      await userRepository.save(user);
  
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error: any) {
      console.error("An error occurred while updating password:", error);
      res.status(500).json({ message: "An error occurred while updating password" });
    }
  }
  

  public async deleteAll(req: Request, res: Response): Promise<void> {
    try {
      const userRepository = getRepository(User);
      await userRepository.clear();  // Clear all users
      res.status(200).json({ message: "All users have been deleted" });
    } catch (error: any) {
      res.status(500).json(error);
    }
  }
}
