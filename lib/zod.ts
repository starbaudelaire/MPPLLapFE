//lanjutin sebelumnya
import {object, string, array, coerce} from "zod";
//paling atas
export const RoomSchema = object({
    name: string().min(1),
    description: string().min(50),
    capacity: coerce.number().gt(0),
    price: coerce.number().gt(0), 
    amenities: array(string()).nonempty(),
})
