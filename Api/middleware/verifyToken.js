import jwt from 'jsonwebtoken';
const JWT_SECRET_KEY = "GE3gZVA89uyTUdSxxPZPM9QBf7W1n3xKm4xmmqX04ME=";
const verifyToken=(req,res,next)=>{
    const token = req.cookies.token1;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
  
    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err)  return res.status(403).json({ message: "Token is not valid", error: err.message });
      req.userId = payload.userId;;
        next();
      
    });
}


export default verifyToken;