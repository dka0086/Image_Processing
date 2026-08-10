import redis
import json
import os
import image_processor as imgp
from dotenv import load_dotenv
from pydantic import BaseModel, Field, positive_float

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
r = redis.from_url(REDIS_URL)

class ImageJob(BaseModel):
    job_id: str = Field(..., min_length=1)
    image_path: str = Field(..., min_length=1)
    scale: float = Field(..., gt=0)

def process_job(raw_json: str):
    job = ImageJob.model_validate_json(raw_json)
    output_path = f"/data/output/{job.job_id}.png"

    #Request do frontend

    r.set(f"job:{job.jobId}:status", "processing")

def main():
    while True:
        try:
            _, raw = r.blpop("image-processing-queue")
            job_data = json.loads(raw)
            print(f"🔄 Processando job: {job_data.get('jobId')}")
            
            process_job(job_data)
            print(f"✅ Job {job_data.get('jobId')} concluído com sucesso!")
            
        except Exception as e:
            print(f"❌ Erro ao processar job: {e}")
            if 'job_data' in locals() and "jobId" in job_data:
                r.set(f"job:{job_data['jobId']}:status", "failed")
                r.set(f"job:{job_data['jobId']}:error", str(e))

if __name__ == "__main__":
    main()


