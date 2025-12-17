import Link from "next/link";
import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { deleteField } from "@/lib/action";

export function CreateField() {
  return (
    <Link
      href="/admin/field/create"
      className="inline-flex items-center gap-2 bg-[#f64e42] hover:bg-[#d93d32] text-white font-medium px-6 py-3 rounded-full shadow-lg hover:shadow-red-500/30 transition-all hover:-translate-y-0.5 active:scale-95"
    >
      <PlusIcon className="h-5 w-5 stroke-2" />
      <span className="text-sm">Add New Field</span>
    </Link>
  );
}

export function UpdateField({ id }: { id: string }) {
  return (
    <Link
      href={`/admin/field/edit/${id}`}
      className="p-2 bg-white/50 hover:bg-white backdrop-blur-md border border-gray-200 rounded-xl text-gray-600 hover:text-blue-600 transition-all shadow-sm hover:shadow-md group"
      title="Edit Field"
    >
      <PencilIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
    </Link>
  );
}

export function DeleteField({ id }: { id: string }) {
  async function deleteFieldWithId(formData: FormData) {
    "use server";
    await deleteField(id, formData);
  }

  return (
    <form action={deleteFieldWithId}>
      <button
        type="submit"
        className="p-2 bg-white/50 hover:bg-rose-50 backdrop-blur-md border border-gray-200 hover:border-rose-200 rounded-xl text-gray-600 hover:text-rose-600 transition-all shadow-sm hover:shadow-md group"
        title="Delete Field"
      >
        <TrashIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>
    </form>
  );
}
