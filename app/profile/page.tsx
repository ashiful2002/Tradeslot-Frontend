"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacyProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/profile");
  }, [router]);

  return (
    <div className="max-w-md mx-auto py-20 text-center text-xs text-slate-400">
      Redirecting to dashboard profile...
    </div>
  );
}
