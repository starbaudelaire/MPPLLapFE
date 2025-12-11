// app/field/[id]/page.tsx
import { getFieldById } from "@/lib/data";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

const FieldDetailPage = async ({ params }: Props) => {
  const field = await getFieldById(params.id);
  
  if (!field) {
    return <div>Field not found</div>;
  }

  // Jika pengguna tidak login, tampilkan informasi dasar
  // Jika login, tampilkan tombol booking
  const session = await auth();
  
  return (
    <div className="max-w-screen-xl px-4 py-8 mt-10 mx-auto">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="h-96 w-full relative">
          <img
            src={field.image}
            alt={field.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{field.name}</h1>
              <div className="mt-2 flex items-center">
                <span className="text-2xl font-semibold text-gray-900">Rp {field.pricePerHour.toLocaleString()}</span>
                <span className="text-gray-500 ml-2">per hour</span>
              </div>
            </div>
            
            {session ? (
              <a 
                href={`/booking?fieldId=${field.id}`}
                className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90"
              >
                Book Now
              </a>
            ) : (
              <a 
                href="/signin"
                className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90"
              >
                Sign in to Book
              </a>
            )}
          </div>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Description</h2>
            <p className="text-gray-600">{field.description}</p>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Details</h3>
              <ul className="space-y-1">
                <li className="flex">
                  <span className="font-medium w-32">Capacity:</span>
                  <span>{field.capacity} people</span>
                </li>
                <li className="flex">
                  <span className="font-medium w-32">Type:</span>
                  <span className="capitalize">{field.type.replace(/_/g, " ")}</span>
                </li>
                <li className="flex">
                  <span className="font-medium w-32">Address:</span>
                  <span>{field.address || "Address not specified"}</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Amenities</h3>
              <ul className="space-y-1">
                {field.amenities.map((amenity: any) => (
                  <li key={amenity.id} className="flex items-center">
                    <span className="mr-2">•</span>
                    <span className="capitalize">{amenity.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldDetailPage;