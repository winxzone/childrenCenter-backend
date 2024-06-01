import sequelize from "../db.js";
import imageUpload from "../utils/imageUpload.js";
import ApiError from "../error/ApiError.js";

// Сделать img

class LessonController {
    async create(req, res, next) {
        const { name, age_category, number_of_lessons_per_week, duration, employee_id } =
            req.body;

        const { img } = req.files;

        const query = `
        INSERT INTO lesson (name, age_category, number_of_lessons_per_week, duration, employee_id, img)
        VALUES (:name, :age_category, :number_of_lessons_per_week, :duration, :employee_id, :fileName)
        RETURNING *;
        `;

        try {
            if (!req.files || !req.files.img) {
                return next(ApiError.badRequest("Обов'язкове зображення!"));
            }

            const fileName = await imageUpload(req, "img", "lesson", next);
            if (!fileName) {
                return next(ApiError.badRequest("Помилка при завантаженні зображення!"));
            }

            const [result] = await sequelize.query(query, {
                replacements: {
                    name,
                    age_category,
                    number_of_lessons_per_week,
                    duration,
                    employee_id,
                    fileName,
                },
                type: sequelize.QueryTypes.INSERT,
            });
            res.status(201).json(result[0]);
        } catch (e) {
            next(ApiError.badRequest(e));
        }
    }
    async getOne(req, res, next) {
        const { id } = req.params;
        const query = `SELECT * FROM lesson WHERE id = :id`;

        try {
            const [result] = await sequelize.query(query, {
                replacements: { id },
                type: sequelize.QueryTypes.SELECT,
            });

            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "Такого заняття не існує." });
            }
        } catch (e) {
            next(ApiError.badRequest(e));
        }
    }

    async getAll(req, res, next) {
        const query = `SELECT * FROM lesson`;

        try {
            const results = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
            });

            if (results.length > 0) {
                res.status(200).json(results);
            } else {
                res.status(404).json({ message: "Занять не знайдено." });
            }
        } catch (e) {
            next(ApiError.badRequest(e));
        }
    }

    async delete(req, res, next) {
        const { id } = req.params;
        const query = `DELETE FROM lesson WHERE id = :id RETURNING *`;

        try {
            const [result] = await sequelize.query(query, {
                replacements: { id },
                type: sequelize.QueryTypes.DELETE,
            });

            //
            if (result.length) {
                res.status(204).json();
            } else {
                res.status(404).json({ message: "Заняття було видалено або не існувало." });
            }
        } catch (e) {
            next(ApiError.badRequest(e));
        }
    }

    async update(req, res, next) {
        const { id } = req.params;
        const { name, age_category, number_of_lessons_per_week, duration, employee_id } =
            req.body;
        const query = `
            UPDATE lesson
            SET name = :name, 
                age_category = :age_category, 
                number_of_lessons_per_week = :number_of_lessons_per_week,
                duration = :duration, 
                employee_id = :employee_id,
                img = :fileName
            WHERE id = :id
            RETURNING *;
        `;

        try {
            if (!req.files || !req.files.img) {
                return next(ApiError.badRequest("Обов'язкове зображення!"));
            }

            const fileName = await imageUpload(req, "img", "lesson", next);
            if (!fileName) {
                return next(ApiError.badRequest("Помилка при завантаженні зображення!"));
            }
            const [result] = await sequelize.query(query, {
                replacements: {
                    id,
                    name,
                    age_category,
                    number_of_lessons_per_week,
                    duration,
                    employee_id,
                    fileName,
                },
                type: sequelize.QueryTypes.UPDATE,
            });

            if (result.length) {
                res.status(200).json(result[0]);
            } else {
                res.status(404).json({ message: "Заняття не знайдено." });
            }
        } catch (e) {
            next(ApiError.badRequest(e));
        }
    }
}

export const Controller = new LessonController();
