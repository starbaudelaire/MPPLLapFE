// lib/data.ts
import { prisma } from "@/lib/prisma";

export const getAmenities = async () => {
  try {
    // Ganti 'amenity' jadi 'amenities' sesuai schema
    const result = await prisma.amenities.findMany();
    return result;
  } catch (error) {
    console.log(error);
  }
};

export type FieldWithAmenities = Awaited<ReturnType<typeof getAllFields>> extends (infer U)[] ? U : never;

export const getAllFields = async () => {
  try {
    const result = await prisma.field.findMany({
      include: {
        FieldAmenities: {
          include: {
            Amenities: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transformasi data agar lebih mudah digunakan di komponen
    return result.map(field => ({
      ...field,
      amenities: field.FieldAmenities.map(fa => fa.Amenities)
    }));
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getFieldById = async (id: string) => {
  try {
    const result = await prisma.field.findUnique({
      where: {
        id: id,
      },
      include: {
        FieldAmenities: {
          include: {
            Amenities: true
          }
        }
      }
    });

    if (!result) {
      return null;
    }

    return {
      ...result,
      amenities: result.FieldAmenities.map(fa => fa.Amenities)
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
