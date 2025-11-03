//lanjutin sbelumnya
import { RoomSchema} from "@/lib/zod"
import { redirect } from "next/navigation"
import { prisma } from "./prisma"

export const saveRoom = async (image: string, prevState: unknown, formData: FormData) => {
    if(!image) return { message: "Image is Required."}

    const rawData = {
        name: formData.get("name"),
        description: formData.get("description"),
        capacity: formData.get("capacity"),
        price: formData.get("price"),
        amenities: formData.getAll("amenities"),
    }

    const validateFields = RoomSchema.safeParse(rawData)
    if(!validateFields.success){
        return{error: validateFields.error.flatten().fieldErrors}
    }
    
    const {name, description, price, capacity, amenities} = validateFields.data

    try{
        await prisma.room.create({
            data: {
                name,
                description,
                image,
                price,
                capacity,
                RoomAmenties:{
                    createMany:{
                        data: amenities.map((item) => ({
                            amenitiesId: item
                        }))
                    }
                }
            }
        })
    } catch(error){
        console.log(error);
    }
    redirect("/admin/room")
}