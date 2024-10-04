import bcrypt from 'bcrypt';
import config from '../config/env.config';
import { User } from '../entity/User';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';

const JWT_SECRET = config.jwtSecret as string;
const TOKEN_EXPIRATION = config.tokenExpiration as string;

export default class AuthService {
  private static readonly SALT_ROUNDS = 10;

  public static async findUserByEmail(email: string) {
    const userRepository = getRepository(User);
    return userRepository.findOne({ where: { email } });
  }

  // find user by id
  public static async findUserById(userId: string) {
    const userRepository = getRepository(User);
    return userRepository.findOne({ where: { id: userId } });
  }

  public static async validatePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }

  public static async hashPassword(password: string) {
    return bcrypt.hash(password, AuthService.SALT_ROUNDS);
  }

  public static generateToken(user: User) {
    return jwt.sign({ userID: user.id, role: user.role }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
  }

  public static async createUser(data: Partial<User>) {
    const userRepository = getRepository(User);
    const newUser = userRepository.create(data);
    return userRepository.save(newUser);
  }

  public static async clearUsers() {
    const userRepository = getRepository(User);
    await userRepository.clear();
  }
}
