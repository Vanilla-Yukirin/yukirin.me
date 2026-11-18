'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

type Counter = {
  no_onload: boolean;
  no_events: boolean;
  endpoint: string;
  count?: (visit: { path: string; title: string }) => void;
};

declare global {
  interface Window { goatcounter?: Counter }
}

let client: Promise<Counter | null> | undefined;

// Load once across App Router navigation and React's development effect replay.
function loadClient(): Promise<Counter | null> {
  if (client) return client;
  client = new Promise((resolve) => {
    // Keep the endpoint after the loader tag is removed, including later SPA pageviews.
    window.goatcounter = { no_onload: true, no_events: true, endpoint: 'https://cnt.yukirin.me/count' };
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://cnt.yukirin.me/count.js';
    script.dataset.goatcounter = 'https://cnt.yukirin.me/count';
    const timeout = window.setTimeout(() => finish(null), 4000);
    function finish(counter: Counter | null) {
      window.clearTimeout(timeout);
      script.onload = script.onerror = null;
      script.remove();
      resolve(counter);
    }
    script.onload = () => finish(window.goatcounter?.count ? window.goatcounter : null);
    script.onerror = () => finish(null);
    document.head.appendChild(script);
  });
  return client;
}

export default function GoatCounter() {
  const pathname = usePathname();

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !pathname ||
        !['https://yukirin.me', 'https://www.yukirin.me'].includes(location.origin)) return;

    let cancelled = false;
    const track = async () => {
      const counter = await loadClient();
      if (cancelled || !counter) return;
      let path = pathname;
      try { path = decodeURI(pathname); } catch { /* Keep malformed escapes intact. */ }
      counter.count?.({ path, title: document.title });
    };

    // Statistics never delay initial content. A route change cancels stale work.
    if (document.readyState === 'complete') void track();
    else window.addEventListener('load', track, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener('load', track);
    };
  }, [pathname]);

  return null;
}
