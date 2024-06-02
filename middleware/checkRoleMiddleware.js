import ApiError from "../error/ApiError.js";
import jwt from "jsonwebtoken";

const checkRoleMiddleware = (requiredRoles) => {
    return (req, res, next) => {
        if (req.method === "OPTIONS") {
            next();
        }
        try {
            const token = req.headers.authorization.split(" ")[1];
            if (!token) {
                throw ApiError.unauthorized("Користувач не авторизований.");
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            if (!requiredRoles.includes(decoded.role)) {
                throw ApiError.forbidden("Користувач немає прав доступу.");
            }
            req.user = decoded;
            next();
        } catch (error) {
            next(error);
        }
    };
};

export default checkRoleMiddleware;
