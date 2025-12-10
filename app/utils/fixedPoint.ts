/**
 * Fixed-Point Arithmetic Utilities for ML Input Scaling
 * * The on-chain ML model expects input values in fixed-point format (i64)
 * with a scale of 10^18. This module provides utilities to convert user inputs
 * from floating-point (0.0-1.0) to the required format.
 * * Example: 0.75 → 750000000000000000n (BigInt representation)
 */

/**
 * Fixed-point scale constant (10^18)
 * This matches ML_SCALE from the smart contract
 */
// SOLUSI ALTERNATIF (Jika tidak bisa ubah tsconfig):
export const ML_SCALE = BigInt('1000000000000000000');// Didefinisikan sebagai BigInt

/**
 * Maximum safe value for fixed-point operations in JavaScript
 * Kita menggunakan ML_SCALE karena 1.0 adalah batas input maksimum yang logis.
 */
export const MAX_SAFE_FIXED_POINT = ML_SCALE;

/**
 * Converts a floating-point value (0.0-1.0) to fixed-point i64 format (10^18 scale)
 * * CATATAN PERBAIKAN: Menggunakan manipulasi string (toFixed) dan BigInt
 * untuk menghindari kehilangan presisi dari operasi float * 1e18.
 * * @param floatValue - A number between 0.0 and 1.0
 * @returns A BigInt string representation for contract ABI encoding
 * @throws Error if value is out of valid range
 */
export function scaleToFixedPoint(floatValue: number): string {
  // 1. Validasi Input
  if (floatValue < 0.0 || floatValue > 1.0) {
    throw new Error(
      `Invalid input range: ${floatValue}. Expected value between 0.0 and 1.0`
    );
  }

  if (!Number.isFinite(floatValue)) {
    throw new Error(
      `Invalid input: ${floatValue}. Expected a finite number`
    );
  }

  // 2. Konversi berbasis String (Solusi Presisi)
  // Konversi float ke string dengan presisi tinggi (18 digit desimal)
  // toFixed() lebih stabil daripada perkalian langsung dengan 1e18
  const floatString = floatValue.toFixed(18); 

  // Pisahkan bagian integer dan desimal (misal: "0.540000000000000000" -> ["0", "540000000000000000"])
  const [intPart, decPart] = floatString.split('.');
  
  let fixedPointString: string;

  if (intPart === '1') {
      // Jika intPart adalah 1 (berarti inputnya 1.0), hasilnya adalah 10^18
      fixedPointString = ML_SCALE.toString();
  } else {
      // Ambil 18 digit desimal dan konversi langsung ke string BigInt
      // Kita asumsikan input 0.0-1.0, jadi fokus pada desimal
      fixedPointString = decPart.substring(0, 18);
  }
  
  // 3. Validasi Akhir dan Konversi
  const scaledValue = BigInt(fixedPointString);

  // Pastikan hasil tidak melebihi batas 10^18 (yaitu 1.0)
  if (scaledValue > MAX_SAFE_FIXED_POINT) {
    throw new Error(
      `Scaled value ${scaledValue.toString()} exceeds maximum allowed scale (10^18)`
    );
  }

  return scaledValue.toString();
}

/**
 * Converts a percentage value (0-100) to fixed-point format
 * * @param percentage - A number between 0 and 100
 * @returns A BigInt string representation for contract ABI encoding
 * @throws Error if value is out of valid range
 */
export function percentageToFixedPoint(percentage: number): string {
  if (percentage < 0 || percentage > 100) {
    throw new Error(
      `Invalid percentage: ${percentage}. Expected value between 0 and 100`
    );
  }

  // Karena ini memanggil scaleToFixedPoint, perbaikan sudah dilakukan di sana.
  return scaleToFixedPoint(percentage / 100);
}

/**
 * Converts fixed-point i64 value back to floating-point (0.0-1.0)
 * Useful for display/preview purposes
 * * @param fixedPoint - A BigInt or string representation of fixed-point value
 * @returns A number between 0.0 and 1.0
 */
export function fixedPointToFloat(fixedPoint: bigint | string): number {
  const value = typeof fixedPoint === 'string' ? BigInt(fixedPoint) : fixedPoint;
  // NOTE: Hati-hati di sini. Number(ML_SCALE) masih bisa menghasilkan float error
  // namun untuk tampilan (display) ini biasanya cukup.
  return Number(value) / Number(ML_SCALE);
}

/**
 * Batch converts an array of floating-point values to fixed-point format
 * * @param values - Array of numbers between 0.0 and 1.0
 * @returns Array of BigInt string representations
 * @throws Error if any value is invalid
 */
export function batchScaleToFixedPoint(values: number[]): string[] {
  return values.map((value) => scaleToFixedPoint(value));
}

/**
 * Validates that a value is properly formatted as a fixed-point i64
 * * @param value - The value to validate
 * @returns true if valid, false otherwise
 */
export function isValidFixedPoint(value: string | bigint): boolean {
  try {
    const bigValue = typeof value === 'string' ? BigInt(value) : value;
    
    // Must be non-negative
    if (bigValue < BigInt(0)) {
      return false;
    }

    // Must fit in i64 range (Rust i64 max: 2^63-1)
    if (bigValue > BigInt('9223372036854775807')) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Creates a style vector array [Warmth, Intensity, Depth] from individual values
 * * @param warmth - Warmth value (0.0-1.0)
 * @param intensity - Intensity value (0.0-1.0)
 * @param depth - Depth value (0.0-1.0)
 * @returns Array of three BigInt string representations
 * @throws Error if any value is invalid
 */
export function createStyleVector(
  warmth: number,
  intensity: number,
  depth: number
): [string, string, string] {
  return [
    scaleToFixedPoint(warmth),
    scaleToFixedPoint(intensity),
    scaleToFixedPoint(depth),
  ];
}

/**
 * Clamps a value to the valid range [0.0, 1.0]
 * Useful for UI range validation
 * * @param value - The value to clamp
 * @returns A value clamped between 0.0 and 1.0
 */
export function clampValue(value: number): number {
  return Math.max(0.0, Math.min(1.0, value));
}

/**
 * Normalizes a value from an arbitrary range to [0.0, 1.0]
 * * @param value - The value to normalize
 * @param min - Minimum value of the range
 * @param max - Maximum value of the range
 * @returns Normalized value between 0.0 and 1.0
 * @throws Error if min >= max
 */
export function normalizeValue(value: number, min: number, max: number): number {
  if (min >= max) {
    throw new Error('Min value must be less than max value');
  }
  return clampValue((value - min) / (max - min));
}

/**
 * Represents the aesthetic parameters in a structured format
 */
export interface AestheticParameters {
  warmth: number;
  intensity: number;
  depth: number;
}

/**
 * Converts AestheticParameters to fixed-point style vector for contract
 * * @param params - Object with warmth, intensity, depth (0.0-1.0)
 * @returns Array of three BigInt string representations
 * @throws Error if any parameter is invalid
 */
export function aestheticToStyleVector(params: AestheticParameters): [string, string, string] {
  return createStyleVector(params.warmth, params.intensity, params.depth);
}