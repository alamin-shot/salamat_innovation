import { redirect } from "next/navigation";

export default function WithdrawalsRedirectPage() {
  redirect("/admin/withdrawals/withdrawals");
}
