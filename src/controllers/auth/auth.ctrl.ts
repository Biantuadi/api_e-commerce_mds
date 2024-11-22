import { Request, Response } from "express";
import { validationResult } from "express-validator";
import AuthService from "../../services/auth.service"; // Import AuthService

export default class AuthController {
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

      // Utilise le service pour trouver l'utilisateur
      const user = await AuthService.findUserByEmail(transformedEmail);

      if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
      }

      const passwordMatch = await AuthService.validatePassword(
        password,
        user.password
      );
      if (!passwordMatch) {
        res.status(400).json({ message: "Invalid credentials" });
        return;
      }

      const token = AuthService.generateToken(user);

      // Exclure le mot de passe avant d'envoyer l'utilisateur

      const { password: _, ...userToSend } = user;
      res.status(200).json({ user: userToSend, token });
    } catch (error: any) {
      console.error("An error occurred while processing the request:", error);
      res
        .status(500)
        .json({ message: "An error occurred while processing the request" });
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

      const existingUser = await AuthService.findUserByEmail(transformedEmail);
      if (existingUser) {
        res.status(400).json({ message: "User already exists" });
        return;
      }

      const hashedPassword = await AuthService.hashPassword(password);

      const newUser = await AuthService.createUser({
        firstname,
        lastname,
        email: transformedEmail,
        password: hashedPassword,
        role: "buyer", // Default role
        createdAt: new Date(),
      });

      const token = AuthService.generateToken(newUser);

      const { password: _, ...userToSend } = newUser;
      res.status(200).json({ user: userToSend, token });
    } catch (error: any) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public async deleteAll(req: Request, res: Response): Promise<void> {
    try {
      await AuthService.clearUsers();
      res.status(200).json({ message: "All users have been deleted" });
    } catch (error: any) {
      res.status(500).json(error);
    }
  }
}
