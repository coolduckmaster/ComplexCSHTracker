//import vaildator from "validator";
//import bcrypt from "bcrypt";
//import jwt from "jsonwebtoken";

const loginUser = async (req, res) => {
    res.json({success: true, message: "Login successful"})
}

const registerUser = async (req, res) => {
}

export { loginUser, registerUser };