import express from "express";
import dotenv from "dotenv";
import sequelize from "./db.js";
import cors from "cors";
import router from "./routes/index.js";
import ErrorHandlingMiddleware from "./middleware/ErrorHandlingMiddleware.js";

dotenv.config();

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);

// - Оброботка ошибок, последний Middleware
app.use(ErrorHandlingMiddleware);

app.get("/", (req, res) => {
    res.status(200).json({ message: "WORKING!!!" });
});

const start = async () => {
    try {
        await sequelize
            .authenticate()
            .then(() => {
                console.log("The connection to the database was established successfully.");
            })
            .catch((err) => {
                console.error("Error connecting to database:", err);
            });
        await sequelize.sync(app);

        app.listen(PORT, () => console.log(`Server started on PORT:${PORT}`));
    } catch (err) {
        console.error("Error starting server:", err);
    }
};
start();
