import ApiError from "../error/ApiError.js";
import sequelize from "../db.js";

class UserController {
    async registration(req, res) {
        const { name, email, password } = req.body;
    }

    async login(req, res) {}

    async check(req, res, next) {
        // const { id } = req.query;
        // if (!id) {
        //     return next(ApiError.badRequest("Не задан id"));
        // }
        // res.json(id);
    }

    // async getOne(req, res, next) {}
}

export const Controller = new UserController();
