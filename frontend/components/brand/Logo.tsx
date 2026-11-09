/* eslint-disable @next/next/no-img-element */
import { cn } from '@/lib/utils';

// The lockup is 219 x 64 in its own units: the strand G, "Glamour" and
// "Hair Studios" outlined from Alegreya, so it never waits on a webfont.
const RATIO = 219 / 64;

type Props = {
  /** 'dark' sets ink type on linen; 'light' sets linen type on deep teal. */
  tone?: 'dark' | 'light';
  /** Rendered height in px; width follows the lockup's ratio. */
  height?: number;
  className?: string;
  /** Leave the alt empty when a visible label already names the link. */
  decorative?: boolean;
};

export default function Logo({ tone = 'dark', height = 44, className, decorative = false }: Props) {
  return (
    <img
      src={tone === 'light' ? '/logo-full-light.svg' : '/logo-full.svg'}
      alt={decorative ? '' : 'Glamour Hair Studios'}
      width={Math.round(height * RATIO)}
      height={height}
      className={cn('block h-auto max-w-full', className)}
      style={{ height, width: 'auto' }}
    />
  );
}

export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <img src="/logo-mark.svg" alt="" width={size} height={size} className={cn('block', className)} />
  );
}
