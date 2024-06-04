import sequelize from "../db.js";

class EventController {
    async create(req, res, next) {
        const { name, date, time } = req.body;
        const employee_id = req.user.extraId;

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
            console.error(err);
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
        const { name, date, time } = req.body;
        const employee_id = req.user.extraId;

        try {
            const [existingEvent] = await sequelize.query(
                `SELECT id FROM event WHERE id = :id`,
                {
                    replacements: { id },
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            if (!existingEvent || existingEvent.length === 0) {
                return next(ApiError.notFound("Захід не знайдено."));
            }

            const query = `
                UPDATE event
                SET name = :name, date = :date, time = :time, employee_id = :employee_id
                WHERE id = :id
                RETURNING *;
            `;

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

    async registration(req, res, next) {
        // в теории event_id должен браться из
        const { event_id } = req.body;
        const client_id = req.user.extraId;

        try {
            const [event] = await sequelize.query(
                `SELECT id FROM event WHERE id = :event_id`,
                {
                    replacements: { event_id },
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            if (!event || event.length === 0) {
                return next(ApiError.notFound("Захід з таким id не знайден."));
            }

            const [client] = await sequelize.query(
                `SELECT id FROM client WHERE id = :client_id`,
                {
                    replacements: { client_id },
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            if (!client || client.length === 0) {
                return next(ApiError.notFound("Клієнт з таким id не знайден."));
            }

            const query = `
            INSERT INTO event_client (client_id, event_id)
            VALUES (:client_id, :event_id)
            RETURNING *;
        `;

            const [result] = await sequelize.query(query, {
                replacements: {
                    client_id,
                    event_id,
                },
                type: sequelize.QueryTypes.INSERT,
            });

            res.status(201).json(result[0]);
        } catch (error) {
            console.error(error);
            next(ApiError.badRequest("Помилка при реєстрації на захід."));
        }
    }
}

export const Controller = new EventController();
