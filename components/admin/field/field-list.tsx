// components/admin/field/field-list.tsx
"use client";

import { FieldWithAmenities } from "@/lib/data";
import { useState } from "react";
import { deleteField } from "@/lib/action";
import { useRouter } from "next/navigation";

type FieldListProps = {
  fields: FieldWithAmenities[] | null;
};

const FieldList = ({ fields }: FieldListProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this field?")) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteField(id);
      router.refresh(); // Refresh the page to update the list
    } catch (error) {
      console.error("Failed to delete field:", error);
      alert("Failed to delete field");
    } finally {
      setDeletingId(null);
    }
  };

  if (!fields || fields.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500">No fields found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price/Hour
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Capacity
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {fields.map((field) => (
            <tr key={field.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="h-16 w-16">
                  <img
                    src={field.image}
                    alt={field.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{field.name}</div>
                <div className="text-sm text-gray-500 line-clamp-2">{field.description.substring(0, 50)}...</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                  {field.type.replace(/_/g, " ")}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Rp {field.pricePerHour.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {field.capacity} people
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <a
                    href={`/admin/field/edit/${field.id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => handleDelete(field.id)}
                    disabled={deletingId === field.id}
                    className={`${
                      deletingId === field.id ? "text-gray-400" : "text-red-600 hover:text-red-900"
                    }`}
                  >
                    {deletingId === field.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FieldList;