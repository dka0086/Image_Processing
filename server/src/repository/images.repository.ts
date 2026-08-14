import {knex} from "../database/knex"
import { UUID } from "node:crypto"
import { ImageModel } from "../model/images.model"
import { ImageDTO } from "../dtos/image.dto"

export class ImageRepository {
    public save = async (image: ImageDTO) => {
        const [newImage] = await knex<ImageModel>("images").insert(
                        { 
                            user_id: image.user_id,
                            type: image.type,
                            imgInputPath: image.imgInputPath,
                            scale: image.scale,
                            width: image.width,
                            height: image.height,
                            status: image.status,
                            created_at: new Date(),
                            updated_at: new Date(),
                        }).returning("*")
                return newImage
    }
}