import { redirect } from "next/navigation";

export default function DirectorsRedirectPage() {
  redirect("/admin/directors/directors");
}
