import { useEffect, useState } from 'react';
import logoUrl from '../assets/charlatte-logo.svg';

export default function BrandLogo({ height = 28 }: { height?: number }) {
  const [hostLogo, setHostLogo] = useState<string | null>(null);
  const [brandName, setBrandName] = useState<string>('Charlatte Réservoirs');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const cs = getComputedStyle(document.documentElement);
    const url = cs.getPropertyValue('--brand-logo-url').trim();
    const name = cs.getPropertyValue('--brand-name').trim();
    if (name) setBrandName(name.replace(/^"|"$/g, ''));
    if (url) setHostLogo(url.replace(/^url\(|\)$/g, '').replace(/^"|"$/g, ''));
  }, []);

  const src = hostLogo || logoUrl;
  return (
    <img
      src={src}
      alt={brandName}
      style={{ height, display: 'block' }}
    />
  );
}

