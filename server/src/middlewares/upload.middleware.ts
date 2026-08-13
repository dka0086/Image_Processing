import multer from "multer"
import path, { extname } from "path"
import { randomUUID } from "crypto"

const storage = multer.diskStorage({
  destination: "./images",
  filename: (req, file, cb) => {
    const extFile = path.extname(file.originalname)
    return cb(
      null,
      `${randomUUID()}${extFile}`
    );
  },
});

export const upload = multer({ storage: storage, limits: {fileSize: 1024*1024*15},
 fileFilter: (req, file, cb) => {
        const allowed = ["image/png", "image/jpeg", "image/webp"];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Formato de imagem não suportado"));
        }
        cb(null, true);
    }})

const maxFotos = 5