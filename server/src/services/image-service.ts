import { redis } from "../redis/client";
import { randomUUID } from "crypto"

export class Imageservice {
    public setJobObject = async (path: string, sizeW: number, sizeH: number) => {
        
        const jobId = randomUUID();
          const jobObject = {
            job_id: jobId,
            type: "Upscale",
            image_path: path,
            sizeW: sizeW,
            sizeH: sizeH,
            callback_url: `${process.env.API_BASE_URL}/images/callback`,
          }

          await redis.set(`job: ${jobId} - status:`, "queued");
          await redis.rpush("image-processing-queue", JSON.stringify(jobObject));

          return jobId
    }
}