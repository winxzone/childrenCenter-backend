import express from "express";
import dotenv from "dotenv";
import sequelize from "./db.js";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync(app);

        app.listen(PORT, () => console.log(`Server started on PORT:${PORT}`));
    } catch (err) {
        console.error("Error starting server:", err);
    }
};
start();
