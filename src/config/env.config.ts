import dotenv from "dotenv";

dotenv.config();

interface AppConfig {
  port: number;
  jwtSecret: string;
  tokenExpiration: string;
  mongoUrl: string;
}

const {
  PORT = "8080",
  JWT_SECRET,
  TOKEN_EXPIRATION,
  MONGO_URL,
} = process.env;

const config: AppConfig = {
  port: parseInt(PORT),
  jwtSecret: JWT_SECRET || "",
  tokenExpiration: TOKEN_EXPIRATION || "",
  mongoUrl: MONGO_URL || ""
};

export default config;