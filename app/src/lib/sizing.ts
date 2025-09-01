export const LITRES_PER_US_GAL = 3.785411784;

export function cylinderVolumeLitres(diameterMm: number, lengthMm: number) {
  const r = diameterMm / 2;
  const volMm3 = Math.PI * r * r * lengthMm;
  return volMm3 / 1_000_000; // mm^3 → L
}

export function capsuleVolumeLitres(diameterMm: number, straightLengthMm: number) {
  const r = diameterMm / 2;
  const cyl = Math.PI * r * r * straightLengthMm;
  const sphere = (4 / 3) * Math.PI * Math.pow(r, 3); // two hemispheres = one sphere
  return (cyl + sphere) / 1_000_000;
}

export function litresToUsGallons(l: number) { return l / LITRES_PER_US_GAL; }