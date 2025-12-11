import CreateForm from "./create-form";
import { getAmenities } from "@/lib/data";

const CreateField = async () => {
  const amenities = await getAmenities();
  if (!amenities) return <div>Failed to load amenities</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Create New Field
      </h1>
      <CreateForm amenities={amenities} />
    </div>
  );
};

export default CreateField;
