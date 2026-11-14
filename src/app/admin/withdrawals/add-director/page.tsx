import { redirect } from "next/navigation";

// The Withdrawals director list was merged into Directors (one director store).
export default function Page() {
  redirect("/admin/directors/create-directors");
}
