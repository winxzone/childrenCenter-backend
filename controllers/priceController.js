import sequelize from "../db.js";
import ApiError from "../error/ApiError.js";

class priceController {
    async setPrice(req, res, next) {
        const { lessons_id, price } = req.body;

        try {
            const [result] = await sequelize.query(
                `INSERT INTO price (lessons_id, price, date) 
                 VALUES (:lessons_id, :price, NOW()) RETURNING id`,
                {
                    replacements: { lessons_id, price },
                    type: sequelize.QueryTypes.INSERT,
                }
            );

            res.status(201).json({
                message: "Ціна успішно встановлена.",
                price_id: result[0].id,
            });
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }
}

export const Controller = new priceController();
