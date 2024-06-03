import jwt from "jsonwebtoken";

const generateJwt = (id, email, role, extraId) => {
    return jwt.sign({ id, email, role, extraId }, process.env.SECRET_KEY, {
        expiresIn: "24h",
    });
};

export default generateJwt;
