import type { MembershipFunction, MembershipDegrees } from '../types/fuzzy';

/**
 * Evaluate a triangular membership function μ(x) = max(0, min((x-a)/(b-a), (c-x)/(c-b)))
 */
export function triangularMF(x: number, a: number, b: number, c: number): number {
  if (b === a && b === c) return x === b ? 1 : 0;
  const left  = b > a ? (x - a) / (b - a) : (x >= b ? 1 : 0);
  const right = c > b ? (c - x) / (c - b) : (x <= b ? 1 : 0);
  return Math.max(0, Math.min(left, right));
}

/**
 * Evaluate a trapezoidal membership function
 * μ(x) = max(0, min((x-a)/(b-a), 1, (d-x)/(d-c)))
 */
export function trapezoidalMF(x: number, a: number, b: number, c: number, d: number): number {
  if (x < a || x > d) return 0;
  const left  = b > a ? (x - a) / (b - a) : 1;
  const right = d > c ? (d - x) / (d - c) : 1;
  return Math.max(0, Math.min(left, 1, right));
}

/**
 * Evaluate any MembershipFunction at x
 */
export function evaluateMF(mf: MembershipFunction, x: number): number {
  if (mf.type === 'triangular') {
    return triangularMF(x, mf.a, mf.b, mf.c);
  } else {
    return trapezoidalMF(x, mf.a, mf.b, mf.c, mf.d);
  }
}

/**
 * Evaluate all membership functions for a crisp value x
 */
export function evaluateAllMFs(
  mfs: MembershipFunction[],
  x: number
): MembershipDegrees {
  const result: MembershipDegrees = {};
  for (const mf of mfs) {
    result[mf.label] = parseFloat(evaluateMF(mf, x).toFixed(6));
  }
  return result;
}

/**
 * Generate sample points for plotting a membership function curve
 */
export function sampleMF(
  mf: MembershipFunction,
  min: number,
  max: number,
  steps = 200
): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = min + (i / steps) * (max - min);
    pts.push({ x, y: evaluateMF(mf, x) });
  }
  return pts;
}

/**
 * Generate clipped (implication) points for a consequent MF given firing strength alpha
 */
export function clipMF(
  mf: MembershipFunction,
  alpha: number,
  min: number,
  max: number,
  steps = 200
): { x: number; y: number }[] {
  return sampleMF(mf, min, max, steps).map(pt => ({
    x: pt.x,
    y: Math.min(pt.y, alpha),
  }));
}
