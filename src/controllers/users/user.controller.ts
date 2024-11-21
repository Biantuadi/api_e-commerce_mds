import { Request, Response } from "express";
import UserService from "../../services/user.service"; // Importer le UserService
import { UploadedFile } from "express-fileupload";
import userCache from "../../cache/serCache";

export default class UserController {
  public async getMe(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.body.user as { userID: string }).userID;
      
      // Vérifie si l'utilisateur est dans le cache
      const cachedUser = userCache.get(userId);
      if (cachedUser) {
        console.log("User found in cache:", cachedUser);
         res.status(200).json(cachedUser); // Retourne l'utilisateur du cache
         return;
      }
  
      // Si l'utilisateur n'est pas en cache, on le récupère depuis la base de données
      const user = await UserService.findUserById(userId);
      if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
      }
  
      const { password, ...userWithoutPassword } = user;
  
      // Stocke l'utilisateur dans le cache pour la prochaine fois
      userCache.set(userId, userWithoutPassword);
      console.log("User added to cache:", userWithoutPassword);
  
      res.status(200).json(userWithoutPassword); // Retourne l'utilisateur
    } catch (error: any) {
      console.error("An error occurred while processing the request:", error);
      res.status(500).json({ message: "An error occurred while processing the request" });
    }
  }

  public async getById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;

      const user = await UserService.findUserById(userId);
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
      
      // Vérifie si les utilisateurs sont déjà en cache
      const cachedUsers = userCache.get("allUsers");
      if (cachedUsers) {
        res.status(200).json(cachedUsers);
      }
  
      const [users, totalCount] = await UserService.findAllUsers(page, limit);
      const totalPages = Math.ceil(totalCount / limit);
      const usersWithoutPasswords = users.map(({ password, ...rest }) => rest);
  
      const response = {
        users: usersWithoutPasswords,
        totalUsers: totalCount,
        currentPage: page,
        totalPages,
      };
  
      // Enregistre les utilisateurs dans le cache
      userCache.set("allUsers", response);
  
      res.status(200).json(response);
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

      await UserService.uploadAvatar(userId, base64Avatar);
      res.status(200).json({ message: "Avatar uploaded successfully", avatar: base64Avatar });
    } catch (error: any) {
      console.error("An error occurred while uploading the avatar:", error);
      res.status(500).json({ message: "An error occurred while processing the request" });
    }
  }

  public async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const { password, ...userData } = req.body;  // Ne jamais mettre à jour le mot de passe directement
  
      // Trouver l'utilisateur dans la base de données
      const user = await UserService.findUserById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
  
      // Appeler la méthode de mise à jour de l'utilisateur dans le service
      const updatedUser = await UserService.updateUser(userId, userData);
  
      // Masquer le mot de passe dans la réponse (si besoin)
      const { password: _, ...userWithoutPassword } = updatedUser;
  
      res.status(200).json({ message: "User updated successfully", user: userWithoutPassword });
    } catch (error: any) {
      console.error("An error occurred while updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  

  public async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId: any = req.params.id;
      const userPassword = req.body.password;

      if (!userId || !userPassword) {
        res.status(400).json({ message: "User ID and password are required" });
        return;
      }

      await UserService.deleteUser(userId, userPassword);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error: any) {
      console.error("An error occurred while deleting user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public async updateUserToSeller(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;  // Get userId from route params

      const user = await UserService.findUserById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Update the user's role to "seller"
      await UserService.updateUserRole(userId, "seller");

      res.status(200).json({ message: "User updated to seller successfully" });
    } catch (error: any) {
      console.error("Error updating user to seller:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
