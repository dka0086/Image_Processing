import { Request, Response, NextFunction} from "express";
import { randomUUID } from "crypto"
import { upload } from "../middlewares/upload.middleware"
import { z } from "zod"

export class ImageController {
    imageSchema = z.object({
            fileName: z.string().min(2).max(70),
            scale: z.number(),
            size: z.string().min(5).max(50),
        })

    public upscaleLanczos3 = (req: Request, res: Response, next: NextFunction) => {
        const jobId = randomUUID()
        const jobObject = {
            job_id: jobId,
            type: "Upscale",
            image_path: req.file?.path,
            size: this.imageSchema.parse(req.body["size"]),
            callback_url: `${process.env.API_BASE_URL}/images/callback`
        } 
    }
}