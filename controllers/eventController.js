import sequelize from "../db.js";

class EventController {
    async create(req, res, next) {
        const { name, date, time } = req.body;
        const employee_id = req.user.id;

        const query = `
            INSERT INTO event (name, date, time, employee_id)
            VALUES (:name, :date, :time, :employee_id)
            RETURNING *;
        `;

        try {
            const [result] = await sequelize.query(query, {
                replacements: {
                    name,
                    date,
                    time,
                    employee_id,
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
        const query = `SELECT * FROM event WHERE id = :id`;

        try {
            const [results] = await sequelize.query(query, {
                replacements: { id },
                type: sequelize.QueryTypes.SELECT,
            });

            res.status(200).json(results);
        } catch (err) {
            next(err);
        }
    }

    async getAll(req, res, next) {
        const query = `SELECT * FROM event`;

        try {
            const results = await sequelize.query(query, {
                type: sequelize.QueryTypes.SELECT,
            });

            res.status(200).json(results); // Возвращаем все события
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        const { id } = req.params;
        const query = `DELETE FROM event WHERE id = :id RETURNING *`;

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
                    message: "Захід було видалено або ж зовсім не існував.",
                });
            }
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        const { id } = req.params;
        const { name, date, time, employee_id } = req.body;

        const query = `
            UPDATE event
            SET name = :name, date = :date, time = :time, employee_id = :employee_id
            WHERE id = :id
            RETURNING *;
        `;

        try {
            const [result] = await sequelize.query(query, {
                replacements: {
                    id,
                    name,
                    date,
                    time,
                    employee_id,
                },
                type: sequelize.QueryTypes.UPDATE,
            });

            if (result.length) {
                res.status(200).json(result[0]);
            } else {
                res.status(404).json({ message: "Захід не знайдено." });
            }
        } catch (err) {
            next(err);
        }
    }
}

export const Controller = new EventController();
