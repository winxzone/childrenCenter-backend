import ApiError from "../error/ApiError.js";
import { v4 as uuidv4 } from "uuid";
import { resolve } from "path";

const imageUpload = async (req, fieldName, dirName, next) => {
    try {
        if (req.files && req.files[fieldName]) {
            let image = req.files[fieldName];
            if (Array.isArray(image)) {
                image = image[0];
            }

            const allowedExtensions = ["jpg", "jpeg", "png"];
            const fileExtension = image.name.split(".").pop().toLowerCase();

            if (!allowedExtensions.includes(fileExtension)) {
                return next(
                    ApiError.badRequest(
                        "Неприпустиме розширення файлу. Допустимі розширення: jpg, jpeg, png"
                    )
                );
            }

            const fileName = uuidv4() + "." + fileExtension;
            const uploadPath = resolve("static", dirName, fileName);

            await image.mv(uploadPath);
            return fileName;
        }
    } catch (error) {
        next(ApiError.badRequest(error.message));
    }
};

export default imageUpload;
