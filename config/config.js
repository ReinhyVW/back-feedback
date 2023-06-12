import dotenv from "dotenv";
dotenv.config();

export default {
    port: process.env.PORT || 3000,
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    server: process.env.DB_SERVER || "",
    database: process.env.DB_DATABASE || "",
}