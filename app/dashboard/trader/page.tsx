import { redirect } from "next/navigation";

export default function LegacyTraderRouteRedirect() {
  redirect("/dashboard");
}
