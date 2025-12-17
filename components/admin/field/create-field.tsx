import CreateForm from "./create-form";
import { getAllAmenities } from "@/lib/data";

const CreateField = async () => {
  const amenities = await getAllAmenities();
  if (!amenities) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Create New Field
      </h1>{" "}
      {/* <-- Ganti nama */}
      <CreateForm amenities={amenities} />
    </div>
  );
};

export default CreateField; // <-- Ganti nama
