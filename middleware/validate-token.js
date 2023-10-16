import jwt from 'jsonwebtoken';


export const verifyToken = (req, res, next) => {
    const token = req.header('auth-token');

    if (!token) {
        return res.status(401).json({
            acceso: "Acceso denegado"
        })
    }

    try {
        const verify = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verify
        next()
    } catch (error) {
        return res.status(400).json({
            acceso: "token no valido"
        })
    }


}   