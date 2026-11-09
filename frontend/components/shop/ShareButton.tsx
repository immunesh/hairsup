'use client';

import { useState } from 'react';
import { Share2 } from 'lucide-react';

/** Opens the device share sheet; where there is none, copies the link. */
export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      /* the visitor closed the share sheet */
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-2 min-h-[44px] px-1 text-[0.9375rem] text-ink-soft hover:text-accent transition-colors rounded-sm"
    >
      <Share2 className="w-4 h-4" aria-hidden />
      <span aria-live="polite">{copied ? 'Link copied' : 'Share'}</span>
    </button>
  );
}
