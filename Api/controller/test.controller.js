import jwt from 'jsonwebtoken'

const JWT_SECRET_KEY = "GE3gZVA89uyTUdSxxPZPM9QBf7W1n3xKm4xmmqX04ME=";
console.log(JWT_SECRET_KEY)
export const shouldLogIn = async (req, res) => {
    const token = req.cookies.token1;
  
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
  
    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res.status(403).json({ message: "Token is not valid", error: err.message });
      }
  
      res.status(200).json({ message: "You are authenticated", payload });
    });
  };
  
// Placeholder function for admin login logic
export const shouldLogAdmin = async (req, res) => {
  // Admin login logic here
};
