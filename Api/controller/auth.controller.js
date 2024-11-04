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

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

        // Generate a JWT token for the user
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            process.env.JWT_SECRET || 'defaultsecret', // Use a secure secret in production
            { expiresIn: '7d' }
        );

        // Remove password from user object before sending it in the response
        const { password: _, ...userInfo } = user;

        // Set the token as an HTTP-only cookie
        res.cookie("token1", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            secure: false, // Set to true in production
            sameSite: "lax" // Allows sending cookies on same-origin requests
        });
        

        // Send a JSON response after setting the cookie
        res.status(200).json({ userInfo, token });

    } catch (err) { 
        console.log(err);
        res.status(500).json({ message: "Failed to login" });
    }
};

export const logout = (req, res) => {
    // Clear the "token" cookie
    res.clearCookie('token');
    res.status(200).json({ message: 'User logged out successfully' });
};
