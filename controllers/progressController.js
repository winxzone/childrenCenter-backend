import sequelize from "../db.js";
import ApiError from "../error/ApiError.js";

class ProgressController {
    async create(req, res, next) {
        const { schedule_id, children_id, rating } = req.body;

        const query = `INSERT INTO progress (schedule_id, children_id, rating) VALUES (:schedule_id, :children_id, :rating)`;

        try {
            const [result] = await sequelize.query(query, {
                replacements: {
                    schedule_id,
                    children_id,
                    rating,
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
        const query = `SELECT * FROM progress WHERE id = :id`;

        try {
            const [result] = await sequelize.query(query, {
                replacements: { id },
                type: sequelize.QueryTypes.SELECT,
            });

            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "Прогрес не існує." });
            }
        } catch (e) {
            next(ApiError.badRequest(e));
        }
    }

    async getAll(req, res, next) {
        const query = `SELECT * FROM progress`;

        try {
            const results = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
            });

            if (results.length > 0) {
                res.status(200).json(results);
            } else {
                res.status(404).json({ message: "Прогрес не знайдено." });
            }
        } catch (e) {
            next(ApiError.badRequest(e));
        }
    }

    async delete(req, res, next) {
        const { id } = req.params;
        const query = `DELETE FROM progress WHERE id = :id RETURNING *`;

        try {
            const [result] = await sequelize.query(query, {
                replacements: { id },
                type: sequelize.QueryTypes.DELETE,
            });

            //
            if (result.length) {
                res.status(204).json();
            } else {
                res.status(404).json({ message: "Прогрес було видалено або не існувало." });
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
            UPDATE progress
            SET schedule_id = :schedule_id, children_id = :children_id, rating = :rating
            WHERE id = :id
            RETURNING *;
        `;

        try {
            const [result] = await sequelize.query(query, {
                replacements: {
                    schedule_id,
                    children_id,
                    rating,
                },
                type: sequelize.QueryTypes.UPDATE,
            });

            if (result.length) {
                res.status(200).json(result[0]);
            } else {
                res.status(404).json({ message: "Прогрес не знайдено." });
            }
        } catch (e) {
            next(ApiError.badRequest(e));
        }
    }
}

export const Controller = new ProgressController();
