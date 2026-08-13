import { Request, Response, NextFunction} from "express";
import { randomUUID } from "crypto"
import { upload } from "../middlewares/upload.middleware"

export class ImageController {
    public upscaleLanczos3 = (req: Request, res: Response, next: NextFunction) => {
        const fileName = req.body //COMO EXTRAI O "file" do objeot!?!?!?!?
        upload(req, )
        jobObject = {
            job_id: randomUUID(),
            type: "Upscale",
            image_path: ,
            scale: float = Field(..., gt=0),
            callback_url:
        } 
    }
}