import express from "express";
import { loginUser, registerUser, resetPassword, deleteUser } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post("/login", loginUser);
authRouter.post("/register", registerUser);
authRouter.post("/reset-password", resetPassword);
authRouter.delete("/delete", deleteUser);

export default authRouter;
