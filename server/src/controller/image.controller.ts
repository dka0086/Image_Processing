import { Request, Response, NextFunction} from "express";
import { upload } from "../middlewares/upload.middleware"
import { z } from "zod"
import { Imageservice } from "../services/image-service";

export class ImageController {
    constructor(private service = new Imageservice()){}
    imageSchema = z.object({
            fileName: z.string().min(2).max(70),
            scale: z.number(),
            sizeW: z.number().positive().max(10000),
            sizeH: z.number().positive().max(10000),
        })

    public upscaleLanczos3 = async (req: Request, res: Response, next: NextFunction) => {
        try {
          if (!req.file) {
            throw new Error("Imagem não enviada");
          }
          const imageBody = this.imageSchema.parse(req.body)
          const jobId = this.service.setJobObject(req.file?.path, imageBody.sizeW, imageBody.sizeH)
          
          res.status(202).json({ jobId, status: "queued" })
        } catch (err) {
          next(err)
        }
    }
}