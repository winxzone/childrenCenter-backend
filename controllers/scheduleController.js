import sequelize from "../db.js";

class ScheduleController {
    async create(req, res, next) {
        const { lessons_id, date, time, groups_id } = req.body;
        const query = `
            INSERT INTO schedule (lessons_id, date, time, groups_id)
            VALUES (:lessons_id, :date, :time, :groups_id)
            RETURNING *;
        `;

        try {
            const [result] = await sequelize.query(query, {
                replacements: {
                    lessons_id,
                    date,
                    time,
                    groups_id,
                },
                type: sequelize.QueryTypes.INSERT,
            });

            res.status(201).json(result[0]);
        } catch (err) {
            next(err);
        }
    }
    async getOne(req, res, next) {
        const { id } = req.params;

        const query = `SELECT * FROM schedule WHERE lessons_id = :id`;

        try {
            const [result] = await sequelize.query(query, {
                replacements: { id },
                type: sequelize.QueryTypes.SELECT,
            });

            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "Розклад не знайдено." });
            }
        } catch (err) {
            next(err);
        }
    }

    async getAll(req, res, next) {
        const query = `SELECT * FROM schedule`;

        try {
            const results = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
            });

            res.status(200).json(results);
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        const { id } = req.params;
        const query = `DELETE FROM schedule WHERE id = :id RETURNING *`;

        try {
            const [result] = await sequelize.query(query, {
                replacements: { id },
                type: sequelize.QueryTypes.DELETE,
            });

            //
            if (result.length) {
                res.status(204).json();
            } else {
                res.status(404).json({
                    message: "Розклад був видалено або ж зовсім не існував.",
                });
            }
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {}
}

export const Controller = new ScheduleController();
