import JWT from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function authJWTVerification(req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization) {
        res.status(401).json({
            message: `Token tidak di temukan`
        });
        return;
    };

    const token = authorization.split(" ")[1];

    try {
        const verify = JWT.verify(token, process.env.JWT_SECRET);
        console.log(verify);
        next();
    } catch (err) {
        console.error(`Terjadi eror => ${err.message}`);
        res.json({
            message: `Token tidak valid`
        });
    };
}

export { authJWTVerification }