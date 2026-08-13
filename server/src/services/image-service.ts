import { redis } from "../redis/client";
import { randomUUID, UUID } from "crypto"

type JobStatus = "queued" | "processing" | "completed" | "failed"

export class Imageservice {
    private jobKey(jobId: string, field: "status" | "result" | "error"): string {
        return `job ${jobId} - ${field}:`;
    }

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

    public jobStatus = async (uuid: string) => {
        const status = await redis.get(this.jobKey(uuid, "status"));
        const result = await redis.get(this.jobKey(uuid, "result"));
        const error = await redis.get(this.jobKey(uuid, "error"));

        return { status: status as JobStatus | null, result, error };
    }
}