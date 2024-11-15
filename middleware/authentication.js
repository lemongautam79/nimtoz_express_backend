import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(400).json({ message: "Missing Access Token" });

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
        if (err) return res.status(401).json({ message: "Token Expired" })
        // if (err) return res.status(403).json({ message: "JWT Token sanga verify bhayena" })
        req.user = user;
        next();
    })

}

export const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) return res.status(401).json({ message: "Unauthorized" });
        next();
    }
}