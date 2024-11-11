import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user;
        next();
    })

}

export const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) return res.status(403).json({message:"Unauthorized"});
        next();
    }
}