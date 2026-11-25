import markUrl from '@/assets/brand/hooksmith-mark.png';
import logoUrl from '@/assets/brand/hooksmith-logo.png';
import iconUrl from '@/assets/brand/hooksmith-icon.png';
import { cn } from '@/lib/cn';

interface BrandImageProps {
  className?: string;
}

/** Bigorna (mark) com fundo transparente — uso em barras e indicadores. */
export function BrandMark({ className }: BrandImageProps) {
  return <img src={markUrl} alt="Hooksmith" draggable={false} className={cn('select-none', className)} />;
}

/** Logotipo completo com tagline “Local API & Webhook Forge”. */
export function BrandWordmark({ className }: BrandImageProps) {
  return (
    <img
      src={logoUrl}
      alt="Hooksmith — Local API & Webhook Forge"
      draggable={false}
      className={cn('select-none', className)}
    />
  );
}

/** Ícone de app (squircle) — mesmo asset usado como favicon/ícone da janela. */
export function BrandIcon({ className }: BrandImageProps) {
  return <img src={iconUrl} alt="" draggable={false} className={cn('select-none', className)} />;
}

/** Nome tipográfico “Hook” + “smith” seguindo as cores do logotipo. */
export function BrandName({ className }: BrandImageProps) {
  return (
    <span className={cn('font-semibold tracking-[-0.01em]', className)}>
      <span className="text-fg">Hook</span>
      <span className="text-brand">smith</span>
    </span>
  );
}

