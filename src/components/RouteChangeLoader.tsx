"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function RouteChangeLoader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Next.js App Router does not expose router.events, so we use a workaround
    // Listen to push/replace and set loading state
    const originalPush = router.push;
    const originalReplace = router.replace;

    function start() { setLoading(true); }
    function stop() { setLoading(false); }

    router.push = async (...args) => {
      start();
      try {
        await originalPush.apply(router, args);
      } finally {
        stop();
      }
    };
    router.replace = async (...args) => {
      start();
      try {
        await originalReplace.apply(router, args);
      } finally {
        stop();
      }
    };

    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [router]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid" />
      <span className="sr-only">Carregando...</span>
    </div>
  );
}
