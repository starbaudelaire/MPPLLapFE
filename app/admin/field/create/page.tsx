// app/admin/field/create/page.tsx
import { redirect } from "next/navigation";

const AdminCreateFieldPage = () => {
  // Redirect ke halaman create field yang sebenarnya
  redirect("/field/create");
};

export default AdminCreateFieldPage;