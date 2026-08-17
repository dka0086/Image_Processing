import { redis } from "../redis/client";
import { randomUUID, UUID } from "crypto"
import { ImageRepository } from "../repository/images.repository";
import { ImageModel } from "../model/images.model";
import { ImageDTO } from "../dtos/image.dto";

type JobStatus = "queued" | "processing" | "completed" | "failed"

export class Imageservice {
    constructor(private repository = new ImageRepository()) {}
    private jobKey(jobId: string, field: "status" | "result" | "error"): string {
        return `job ${jobId} - ${field}:`;
    }

    public insertImageJob = async (path: string, type: string , sizeW: number, sizeH: number) => {   
        const jobObject: ImageDTO = {
            user_id: ,
            imgInputPath: path,
            type: type,
            scale: 1,
            width: sizeW,
            height: sizeH,
        }

        callback_url: `${process.env.API_BASE_URL}/images/callback`
        this.repository.save(jobObject)
        await redis.set(`job: ${jobId} - status:`, "queued");
        await redis.rpush("image-processing-queue", JSON.stringify(jobObject));

        return jobId
    }

    public jobStatus = async (uuid: string) => {
        const status = await redis.get(this.jobKey(uuid, "status"));
        const result = await redis.get(this.jobKey(uuid, "result"));
        const error = await redis.get(this.jobKey(uuid, "error"));

        return { status: status as JobStatus | null, result, error };
    }
}