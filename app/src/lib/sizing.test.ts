import { describe, it, expect } from 'vitest';
import { LITRES_PER_US_GAL, cylinderVolumeLitres, capsuleVolumeLitres, litresToUsGallons } from './sizing';

describe('sizing', () => {
  it('computes cylinder volume in litres', () => {
    // 1000mm dia, 1000mm length => V = pi*r^2*h = pi*500^2*1000 mm^3 = ~785,398,163 mm^3 = 785.398 L
    const v = cylinderVolumeLitres(1000, 1000);
    expect(v).toBeCloseTo(785.398, 3);
  });

  it('computes capsule (cylinder + two hemispheres) volume in litres', () => {
    // For 1000mm dia, 1000mm straight: V = cyl + sphere
    const cyl = Math.PI * 500 * 500 * 1000;
    const sphere = (4 / 3) * Math.PI * 500 ** 3;
    const expectedL = (cyl + sphere) / 1_000_000;
    const v = capsuleVolumeLitres(1000, 1000);
    expect(v).toBeCloseTo(expectedL, 6);
  });

  it('converts litres to US gallons using constant', () => {
    expect(litresToUsGallons(LITRES_PER_US_GAL)).toBeCloseTo(1, 10);
    expect(litresToUsGallons(0)).toBe(0);
    expect(litresToUsGallons(1000)).toBeCloseTo(264.172052, 3);
  });
});
