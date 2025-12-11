// app/field/page.tsx
import { getAllFields } from "@/lib/data";
import { Card } from "@/components/card"; // Perlu membuat versi yang bisa menerima field data
import HeaderSection from "@/components/header-section";

// Membuat komponen Card yang menerima data field
const FieldCard = ({ field }: { field: any }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl transition duration-200 hover:shadow-lg overflow-hidden">
      <div className="h-[260px] w-auto relative">
        <img
          src={field.image}
          width={384}
          height={256}
          alt={field.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h4 className="text-2xl font-semibold">
          <a
            href={`/field/${field.id}`}
            className="hover:text-gray-800 transition duration-150"
          >
            {field.name}
          </a>
        </h4>
        <h4 className="text-lg mb-6">
          <span className="font-semibold text-gray-700">Rp {field.pricePerHour.toLocaleString()}</span>
          <span className="text-gray-500 text-sm">/Hour</span>
        </h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-600">
            <span className="text-sm">Up to {field.capacity} people</span>
          </div>
          <a
            href={`/field/${field.id}`}
            className="text-[#f64e42] text-lg font-normal hover:underline"
          >
            View Details &gt;
          </a>
        </div>
      </div>
    </div>
  );
};

const FieldPage = async () => {
  const fields = await getAllFields();

  return (
    <div className="py-20 mt-10">
      <HeaderSection title="Available Fields" />
      <div className="max-w-screen-xl py-6 pb-20 px-4 mx-auto">
        <div className="grid gap-7 md:grid-cols-3">
          {fields && fields.length > 0 ? (
            fields.map((field) => (
              <FieldCard key={field.id} field={field} />
            ))
          ) : (
            <div className="col-span-3 text-center">
              <p className="text-gray-500 text-lg">No fields available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FieldPage;
