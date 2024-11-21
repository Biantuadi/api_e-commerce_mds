import { getRepository } from "typeorm";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import { io } from "../app";
import userCache from "../cache/serCache";

export default class UserService {
  public static async findUserById(userId: string) {
    const userRepository = getRepository(User);
    return userRepository.findOne({ where: { id: userId } });
  }

  public static async findAllUsers(page: number, limit: number) {
    const userRepository = getRepository(User);
    const skip = (page - 1) * limit;
    return userRepository.findAndCount({
      skip,
      take: limit,
    });
  }

  public static async uploadAvatar(userId: string, avatar: string) {
    const userRepository = getRepository(User);
    await userRepository.update(userId, { avatar });
  }

  public static async updateUser(userId: string, userData: Partial<User>) {
    const userRepository = getRepository(User);
  
    // Récupérer l'utilisateur dans la base de données
    const findUser = await userRepository.findOne({ where: { id: userId } });
  
    if (!findUser) {
      throw new Error("User not found");
    }
  
    // Appliquer les nouvelles données à l'utilisateur
    Object.assign(findUser, userData);
  
    // Enregistrer l'utilisateur mis à jour dans la base de données
    await userRepository.save(findUser);
  
    // Supprimer l'utilisateur du cache pour forcer une actualisation
    userCache.set(userId, findUser);
  
    // Émettre l'événement de mise à jour via WebSocket
    io.emit("userUpdated", { userId });
  
    // Retourner l'utilisateur mis à jour après l'enregistrement
    return findUser;
  }
  

  public static async deleteUser(userId: string, password: string) {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid password");
    }

    await userRepository.remove(user);
  }

  public static async updateUserRole(userId: string, role: string) {
    const userRepository = getRepository(User);
    await userRepository.update(userId, { role });

    // Supprimer l'utilisateur du cache pour forcer une actualisation
    userCache.del("allUsers");

    // Émettre l'événement de mise à jour via WebSocket
    io.emit("userUpdated", { userId });

    return userRepository.findOne({ where: { id: userId } });
  }
}
