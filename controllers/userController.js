import ApiError from "../error/ApiError.js";
import sequelize from "../db.js";

import bcrypt from "bcrypt";
import generateJwt from "../utils/generateJwt.js";

class UserController {
    async registration(req, res, next) {
        const {
            email,
            password,
            role,
            full_name,
            phone_number,
            address,
            date_of_birth,
            workplace,
        } = req.body;
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

            const userId = result[0].id;

            let extraId = null;

            if (userRole === "user") {
                const [clientResult] = await sequelize.query(
                    `INSERT INTO client (user_credential_id, full_name, phone_number, address, date_of_birth, workplace) 
                    VALUES (:user_credential_id, :full_name, :phone_number, :address, :date_of_birth, :workplace) RETURNING id`,
                    {
                        replacements: {
                            user_credential_id: userId,
                            full_name,
                            phone_number,
                            address,
                            date_of_birth,
                            workplace,
                        },
                        type: sequelize.QueryTypes.INSERT,
                    }
                );
                extraId = clientResult[0].id;
            }

            const token = generateJwt(userId, email, userRole, extraId);
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

            let extraId = null;

            const [clientResult] = await sequelize.query(
                `SELECT id FROM client WHERE user_credential_id = :user_credential_id`,
                {
                    replacements: { user_credential_id: existingUser.id },
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            console.log(clientResult);

            extraId = clientResult.id;
            console.log(extraId);

            const token = generateJwt(
                existingUser.id,
                existingUser.email,
                existingUser.role,
                extraId
            );

            res.status(200).json({ user: existingUser, token });
        } catch (error) {
            next(ApiError.internal(error.message));
        }
    }

    async check(req, res, next) {
        try {
            const { id, email, role, extraId } = req.user;
            return res.json({ user: { id, email, role, extraId } });
        } catch (error) {
            next(ApiError.unauthorized("Помилка перевірки користувача"));
        }
    }

    // - перепроверить все следущие методы
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

    async addChild(req, res, next) {
        const { full_name, date_of_birth, additional_information } = req.body;

        try {
            // Получаем user_id из токена
            const userId = req.user.id;

            // Ищем client_id с использованием user_id
            const [clientResult] = await sequelize.query(
                `SELECT id FROM client WHERE user_credential_id = :user_credential_id`,
                {
                    replacements: { user_credential_id: userId },
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            // Проверяем, был ли найден client
            if (!clientResult) {
                return next(ApiError.badRequest("Клієнт не знайдений."));
            }

            // Извлекаем client_id
            const clientId = clientResult.id;

            // Вставляем данные о ребенке в таблицу children с указанием client_id
            const [result] = await sequelize.query(
                `INSERT INTO children (full_name, date_of_birth, additional_information, client_id)
                 VALUES (:full_name, :date_of_birth, :additional_information, :client_id) RETURNING id`,
                {
                    replacements: {
                        full_name,
                        date_of_birth,
                        additional_information,
                        client_id: clientId,
                    },
                    type: sequelize.QueryTypes.INSERT,
                }
            );

            // Возвращаем успешный результат
            res.status(201).json({
                message: "Дані дитини успішно збережені.",
                child_id: result[0].id,
            });
        } catch (error) {
            // Обрабатываем ошибку
            next(ApiError.badRequest(error.message));
        }
    }

    async addEmployee(req, res, next) {
        const {
            email,
            password,
            full_name,
            phone_number,
            address,
            birth_date,
            position_id,
            role,
        } = req.body;

        // Проверяем, что роль соответствует ожидаемым значениям
        if (role !== "teacher" && role !== "admin") {
            return next(ApiError.badRequest("Роль должна быть 'teacher' или 'admin'."));
        }

        try {
            const hashPassword = await bcrypt.hash(password, 5);

            const [userResult] = await sequelize.query(
                `INSERT INTO user_credential (email, password, role) VALUES (:email, :password, :role) RETURNING id`,
                {
                    replacements: { email, password: hashPassword, role },
                    type: sequelize.QueryTypes.INSERT,
                }
            );

            const userCredentialId = userResult[0].id;

            const [employeeResult] = await sequelize.query(
                `INSERT INTO employee (full_name, phone_number, address, birth_date, employment_date, position_id, user_credential_id)
                 VALUES (:full_name, :phone_number, :address, :birth_date, NOW(), :position_id, :user_credential_id) RETURNING id`,
                {
                    replacements: {
                        full_name,
                        phone_number,
                        address,
                        birth_date,
                        position_id,
                        user_credential_id: userCredentialId,
                    },
                    type: sequelize.QueryTypes.INSERT,
                }
            );

            res.status(201).json({
                message: "Дані співробітника успішно збережені.",
                employee_id: employeeResult[0].id,
            });
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }
}

export const Controller = new UserController();
