import ApiError from "../error/ApiError.js";
import sequelize from "../db.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateJwt = ({ id, email, role }) => {
    console.log(jwt.sign({ id, email, role }, process.env.SECRET_KEY, { expiresIn: "24h" }));
    return jwt.sign({ id, email, role }, process.env.SECRET_KEY, { expiresIn: "24h" });
};

class UserController {
    async registration(req, res, next) {
        const { email, password, role } = req.body;
        const userRole = role || "user";

        if (!email || !password) {
            return next(ApiError.badRequest("Не задан email або пароль"));
        }

        try {
            const existingUser = await sequelize.query(
                `SELECT * FROM user_credential WHERE email = :email`,
                { replacements: { email }, type: sequelize.QueryTypes.SELECT }
            );

            if (existingUser.length) {
                return next(ApiError.badRequest("Користувач з таким email вже існує"));
            }

            const hashPassword = await bcrypt.hash(password, 5);

            const [result] = await sequelize.query(
                `INSERT INTO user_credential (email, password, role) VALUES (:email, :password, :role) RETURNING id`,
                {
                    replacements: { email, password: hashPassword, role: userRole },
                    type: sequelize.QueryTypes.INSERT,
                }
            );

            const userId = result[0] ? result[0].id : null;

            const token = generateJwt({ id: userId, email, role });
            res.status(201).json({ token, message: "Аккаунт успішно зареєстровано." });
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }

    async login(req, res, next) {
        const { email, password } = req.body;

        try {
            const [existingUser] = await sequelize.query(
                `SELECT * FROM user_credential WHERE email = :email`,
                { replacements: { email }, type: sequelize.QueryTypes.SELECT }
            );

            if (!existingUser) {
                return next(ApiError.unauthorized("Такого користувача не існує."));
            }

            const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
            if (!isPasswordMatch) {
                return next(ApiError.unauthorized("Не вірний пароль."));
            }

            const token = generateJwt(existingUser.id, existingUser.email, existingUser.role);

            res.status(200).json({ user: existingUser, token });
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }

    // check не работает исправить
    async check(req, res, next) {
        try {
            const { id, email, role } = req.user;
            console.log({
                user: { id, email, role },
                token: req.headers.authorization.split(" ")[1],
            });
            return res.json({ user: { id, email, role } });
        } catch (error) {
            next(ApiError.unauthorized("Помилка перевірки користувача"));
        }
    }

    async changeRole(req, res, next) {
        const { id, role } = req.body;

        if (!id || !role) {
            return next(ApiError.badRequest("Не задан id або роль"));
        }

        try {
            const [result] = await sequelize.query(
                `UPDATE user_credential SET role = :role WHERE id = :id RETURNING *`,
                {
                    replacements: { id, role },
                    type: sequelize.QueryTypes.UPDATE,
                }
            );

            const updatedUser = result[0];
            if (!updatedUser) {
                return next(ApiError.badRequest("Користувача не знайдено."));
            }

            res.json(updatedUser);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }
}

export const Controller = new UserController();
