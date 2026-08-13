import { Request, Response, NextFunction} from "express";
import { z } from "zod"
import { Imageservice } from "../services/image-service";
import { NotFoundError } from "../errors/notfound-error";

export class ImageController {
    constructor(private service = new Imageservice()){}
    imageSchema = z.object({
            fileName: z.string().min(2).max(70),
            scale: z.number(),
            sizeW: z.number().positive().max(10000),
            sizeH: z.number().positive().max(10000),
        })

    jobIdParamSchema = z.object({
        jobId: z.uuid(),
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

    public getStatus = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { jobId } = this.jobIdParamSchema.parse(req.params)
            const jobStatus = await this.service.jobStatus(jobId);

            if (!jobStatus.status) {
                throw new NotFoundError("Job não encontrado");
            }

            res.json({ jobId, ...jobStatus });
        } catch (err) {
            next(err);
        }
    }
}