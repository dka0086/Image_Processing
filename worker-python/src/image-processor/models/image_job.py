from typing import Literal
from pydantic import BaseModel, Field


class ImageJob(BaseModel):
    job_id: str = Field(..., min_length=1)
    type: str = Literal["Upscale", "Filter: BW", "Filter: Sepia", "Filter: Blue", "Filter: Red", "Resize", 
                        "Convolution", "Change Format", "Flip", ""]
    image_path: str = Field(..., min_length=1)
    scale: float = Field(..., gt=0)
    callback_url: str