import multer from "multer";
import path from "path"

function uploader(filePath = "uploads") {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, filePath);
        },
        filename: (req, file, cb) => {
            const unique = Date.now() + "-" + Math.round(Math.random() * 1E9);
            const fileType = path.extname(file.originalname);
            cb(null, file.fieldname + "_" + unique + fileType);
        }
    });

    const upload = multer({storage: storage});

    return upload
}

export {
    uploader
}