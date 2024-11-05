import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashPassword,
            }
        });

        console.log('User created:', newUser);
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to register" });
    }
};


const JWT_SECRET_KEY = "GE3gZVA89uyTUdSxxPZPM9QBf7W1n3xKm4xmmqX04ME=";
  console.log(JWT_SECRET_KEY);
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET_KEY,
      { expiresIn: '7d' }
    );

    const { password: _, ...userInfo } = user;

    res.cookie("token1", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: false,
      sameSite: "lax"
    });

    res.status(200).json({ userInfo, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login" });
  }
};

export const logout = (req, res) => {
    // Clear the "token1" cookie
    res.clearCookie('token1');
    res.status(200).json({ message: 'User logged out successfully' });
};
