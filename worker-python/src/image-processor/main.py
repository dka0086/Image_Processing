import redis
import json
import os
import image_processor as imgp
from dotenv import load_dotenv
from models import image_job
import requests

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
r = redis.from_url(REDIS_URL)

TASKS = {
    "Upscale": lambda job, output_path: imgp.resizeLanczos3(
        job.image_path, output_path, job.scale
    ),
    "Filter: BW": lambda job, output_path: imgp.filterBlackAndWhite(
        job.image_path, job.output_path
    ),
}

def notify_callback(callback_url: str, payload: dict):
    try:
        requests.post(callback_url, json=payload, timeout=5)
    except requests.RequestException as e:
        print(f"Falha ao notificar callback {callback_url}: {e}")


def process_job(raw_json: str) -> None:
    job = image_job.model_validate_json(raw_json)
    output_path = f"/data/output/{job.job_id}.png"

    r.set(f"job {job.jobId} - status", "processing")
    try:
        task = TASKS.get(job.type)
        if task==None:
            raise ValueError("Task not found", job.type)

        task(job, output_path)
        r.set(f"job {job.job_id} - status:", "completed")
        r.set(f"job {job.job_id} - result:", output_path)

        notify_callback(job.callback_url, {
            "jobId": job.job_id,
            "status": "completed",
            "resultPath": output_path,
        })
    except Exception as e:
        r.set(f"job {job.jobId} - status", "fail")
        r.set(f"job:{job.job_id}:error", str(e))

        notify_callback(job.callback_url, {
            "jobId": job.job_id,
            "status": "failed",
            "error": str(e),
        })


    

def main():
    while True:
        try:
            _, raw = r.blpop("image-processing-queue")
            #blpop faz o Python travar ali e esperar sem gastar CPU até o Node.js mandar um pedido (job) de imagem.
            job_data = json.loads(raw)
            #Converte JSON em um dicionario 
            print(f"🔄 Processando job: {job_data.get('job_id')}")
            
            process_job(job_data)
            print(f"✅ Job {job_data.get('job_id')} concluído com sucesso!")
            
        except Exception as e:
            print(f"❌ Erro ao processar job: {e}")
            if 'job_data' in locals() and "job_id" in job_data:
                r.set(f"job:{job_data['job_id']}:status", "failed")
                r.set(f"job:{job_data['job_id']}:error", str(e))

if __name__ == "__main__":
    main()


