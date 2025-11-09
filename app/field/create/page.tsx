// app/field/create/page.tsx

// v-- GANTI IMPORT PATH & NAMA KOMPONENNYA --v
import CreateField from "@/components/admin/field/create-field";

// v-- GANTI NAMA PAGE-NYA (OPSIONAL TAPI RAPI) --v
const CreateFieldPage = () => {
  return (
    <div className="max-w-screen-xl px-4 py-16 mt-10 mx-auto">
      <CreateField /> {/* <-- GANTI KOMPONENNYA */}
    </div>
  );
};

export default CreateFieldPage; // <-- GANTI EXPORT-NYA
