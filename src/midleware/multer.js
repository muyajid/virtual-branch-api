import multer from "multer";
import path from "path";
import { deserialize } from "v8";

const config = multer.diskStorage({
    destination: (req, path, cb) => {
        cb(null, "../../uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

export default {
    config
}