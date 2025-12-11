// components/admin/field/edit-field-form-wrapper.tsx
import { getAmenities } from "@/lib/data";
import EditFieldFormClient from "@/components/admin/field/edit-field-form-client";

type EditFieldFormWrapperProps = {
  field: any; // Sesuaikan dengan type field Anda
};

const EditFieldFormWrapper = async ({ field }: EditFieldFormWrapperProps) => {
  const amenities = await getAmenities();

  if (!amenities) {
    return <div>Failed to load amenities</div>;
  }

  return <EditFieldFormClient field={field} amenities={amenities} />;
};

export default EditFieldFormWrapper;