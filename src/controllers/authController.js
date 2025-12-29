import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";

const register = async (req, res) => {
  const { email, name, password } = req.body;

  //   Check if user already exists
  const userExists = await prisma.user.findUnique({ where: { email } });

  if (userExists) {
    return res.status(400).json({
      error: "A user with this email already exist",
    });
  }

  //   Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hashSync(password, salt);

  //   Create User
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name,
        email,
      },
    },
  });
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  //   Check if user email exists in the table
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  //   Verify password
  let isPasswordValid = await bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  //   Generate JWT Token

  res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        email,
      },
    },
  });
};

export { register, login };
