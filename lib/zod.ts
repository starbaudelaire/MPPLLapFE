//lanjutin sebelumnya
import {object, string, number, coerce} from "zod";

export const RoomSchema = object({
    name: string().min(1),
    description: string().min(50),
    capacity: number().gt(0),
    price: coerce.number().gt(0), 
})
