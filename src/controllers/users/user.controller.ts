import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../../entity/User";
import { UploadedFile } from "express-fileupload";
import bcrypt from "bcrypt";

export default class UserController {
  public async getMe(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.body.user as { userID: string }).userID;

      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { id: userId } });  
      if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
      }

      const { password, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error: any) {
      console.error("An error occurred while processing the request:", error);
      res.status(500).json({ message: "An error occurred while processing the request" });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;

      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { id: userId } });  
      if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
      }

      const { password, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error: any) {
      console.error("An error occurred while processing the request:", error);
      res.status(500).json({ message: "An error occurred while processing the request" });
    }
  }


  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;

      const userRepository = getRepository(User);
      const [users, totalCount] = await userRepository.findAndCount({
        skip,
        take: limit,
      });

      const totalPages = Math.ceil(totalCount / limit);
      const usersWithoutPasswords = users.map(({ password, ...rest }) => rest);

      res.status(200).json({
        users: usersWithoutPasswords,
        totalUsers: totalCount,
        currentPage: page,
        totalPages,
      });
    } catch (error: any) {
      res.status(500).json(error);
    }
  }

  public async uploadAvatar(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.body.user as { userID: string }).userID;

      if (!userId) {
        res.status(400).json({ message: "No user ID provided" });
        return;
      }

      if (!req.files || Object.keys(req.files).length === 0 || !req.files.avatar) {
        res.status(400).json({ message: "No avatar file uploaded" });
        return;
      }

      const avatarFile = req.files.avatar as UploadedFile;
      const base64Data = avatarFile.data.toString("base64");
      const base64Avatar = `data:${avatarFile.mimetype};base64,${base64Data}`;

      const userRepository = getRepository(User);
      await userRepository.update(
        { id: userId },
        { avatar: base64Avatar }
      );

      res.status(200).json({ message: "Avatar uploaded successfully", avatar: base64Avatar });
    } catch (error: any) {
      console.error("An error occurred while uploading the avatar:", error);
      res.status(500).json({ message: "An error occurred while processing the request" });
    }
  }

  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.body.user as { userID: string }).userID;
      const { password, ...userData } = req.body;  // Never update password directly

      const userRepository = getRepository(User);
      let user = await userRepository.findOne({ where: { id: userId } });  

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      await userRepository.update(userId, userData);
      user = await userRepository.findOne(
        { where: { id: userId } }
      );

      const { password: _, ...userWithoutPassword } = user!;
      res.status(200).json({ message: "User updated successfully", user: userWithoutPassword });
    } catch (error: any) {
      console.error("An error occurred while updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId:any = req.params.id;
      const userPassword = req.body.password;

      if (!userId || !userPassword) {
        res.status(400).json({ message: "User ID and password are required" });
        return;
      }

      const userRepository = getRepository(User);
      const user = await userRepository.findOne(userId);

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const passwordMatch = await bcrypt.compare(userPassword, user.password);
      if (!passwordMatch) {
        res.status(400).json({ message: "Invalid password" });
        return;
      }

      await userRepository.remove(user);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
      console.error("An error occurred while deleting user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public async updateUserToSeller(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;  // Get userId from route params
      const userRepository = getRepository(User);
  
      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
  
      // Update the user's role to "seller"
      await userRepository.update(userId, { role: "seller" });
  
      res.status(200).json({ message: "User updated to seller successfully", user });
    } catch (error: any) {
      console.error("Error updating user to seller:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  
}
