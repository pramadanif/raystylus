/**
 * BMP Image Renderer
 * 
 * Converts raw BMP byte data returned from the smart contract
 * into displayable format (Blob/URL for <img> tags)
 */

/**
 * Converts raw BMP bytes to a Blob object
 * 
 * @param bmpBytes - The BMP byte data from render_token
 * @returns A Blob with MIME type 'image/bmp'
 * 
 * @example
 * const bytes = await readContract({ functionName: 'render_token', args: [0] });
 * const blob = bytesToBlob(bytes);
 * const url = URL.createObjectURL(blob);
 * imgElement.src = url;
 */
export function bytesToBlob(bmpBytes: ArrayLike<number> | Uint8Array | string): Blob {
  let byteArray: Uint8Array;

  // Handle different input formats
  if (typeof bmpBytes === 'string') {
    // If it's a hex string, convert to bytes
    if (bmpBytes.startsWith('0x')) {
      const hexString = bmpBytes.slice(2);
      byteArray = new Uint8Array(hexString.length / 2);
      for (let i = 0; i < hexString.length; i += 2) {
        byteArray[i / 2] = parseInt(hexString.substr(i, 2), 16);
      }
    } else {
      throw new Error('Invalid BMP byte string format. Expected hex string starting with 0x');
    }
  } else if (ArrayBuffer.isView(bmpBytes)) {
    // Handle any ArrayBufferView (including Uint8Array)
    byteArray = new Uint8Array(bmpBytes as any);
  } else if (Array.isArray(bmpBytes)) {
    byteArray = new Uint8Array(bmpBytes);
  } else {
    throw new Error('Invalid BMP byte input. Expected Uint8Array, Array, or hex string');
  }

  // Convert to array of numbers then back to Uint8Array for proper Blob compatibility
  const arr = Array.from(byteArray);
  return new Blob([new Uint8Array(arr)], { type: 'image/bmp' });
}

/**
 * Creates a data URL from raw BMP bytes for use in <img src="">
 * 
 * @param bmpBytes - The BMP byte data from render_token
 * @returns A data URL string that can be used directly in img.src
 * 
 * @example
 * const bytes = await readContract({ functionName: 'render_token', args: [0] });
 * const dataUrl = bytesToDataUrl(bytes);
 * imgElement.src = dataUrl; // Direct assignment, no URL.createObjectURL needed
 */
export function bytesToDataUrl(bmpBytes: ArrayLike<number> | Uint8Array | string): string {
  let byteArray: Uint8Array;

  if (typeof bmpBytes === 'string') {
    if (bmpBytes.startsWith('0x')) {
      const hexString = bmpBytes.slice(2);
      byteArray = new Uint8Array(hexString.length / 2);
      for (let i = 0; i < hexString.length; i += 2) {
        byteArray[i / 2] = parseInt(hexString.substr(i, 2), 16);
      }
    } else {
      throw new Error('Invalid BMP byte string format. Expected hex string starting with 0x');
    }
  } else if (ArrayBuffer.isView(bmpBytes)) {
    // Handle any ArrayBufferView
    byteArray = new Uint8Array(bmpBytes as any);
  } else if (Array.isArray(bmpBytes)) {
    byteArray = new Uint8Array(bmpBytes);
  } else {
    throw new Error('Invalid BMP byte input');
  }

  // Convert to base64
  let binaryString = '';
  for (let i = 0; i < byteArray.length; i++) {
    binaryString += String.fromCharCode(byteArray[i]);
  }
  const base64String = btoa(binaryString);

  return `data:image/bmp;base64,${base64String}`;
}

export function bytesToObjectUrl(bmpBytes: ArrayLike<number> | Uint8Array | string): string {
  const blob = bytesToBlob(bmpBytes);
  return URL.createObjectURL(blob);
}

/**
 * Validates BMP file format by checking the magic bytes
 * BMP files should start with 0x424D ('BM')
 * 
 * @param bmpBytes - The potential BMP byte data
 * @returns true if the data appears to be valid BMP format, false otherwise
 * 
 * @example
 * const bytes = await readContract({ functionName: 'render_token', args: [0] });
 * if (isValidBmp(bytes)) {
 *   // Safe to display
 * }
 */
export function isValidBmp(bmpBytes: Uint8Array | Uint8Array): boolean {
  if (bmpBytes.length < 2) {
    return false;
  }

  // Check BMP magic bytes: 'BM' (0x42 0x4D)
  return bmpBytes[0] === 0x42 && bmpBytes[1] === 0x4d;
}

/**
 * Parses basic BMP header information
 * 
 * @param bmpBytes - The BMP byte data
 * @returns Object with BMP dimensions and file size
 * 
 * @example
 * const bytes = await readContract({ functionName: 'render_token', args: [0] });
 * const info = parseBmpHeader(bytes);
 * console.log(`Image size: ${info.width}x${info.height}, File size: ${info.fileSize} bytes`);
 */
export interface BmpHeaderInfo {
  magic: string;
  fileSize: number;
  width: number;
  height: number;
  bitsPerPixel: number;
  pixelDataOffset: number;
}

export function parseBmpHeader(bmpBytes: Uint8Array): BmpHeaderInfo {
  if (bmpBytes.length < 26) {
    throw new Error('BMP file too small for header parsing');
  }

  // Read magic bytes
  const magic = String.fromCharCode(bmpBytes[0], bmpBytes[1]);

  // Read file size (little-endian, offset 2-5)
  const fileSize = new DataView(bmpBytes.buffer, 2, 4).getUint32(0, true);

  // Read pixel data offset (little-endian, offset 10-13)
  const pixelDataOffset = new DataView(bmpBytes.buffer, 10, 4).getUint32(0, true);

  // Read width (little-endian, offset 18-21)
  const width = new DataView(bmpBytes.buffer, 18, 4).getInt32(0, true);

  // Read height (little-endian, offset 22-25)
  const height = new DataView(bmpBytes.buffer, 22, 4).getInt32(0, true);

  // Read bits per pixel (little-endian, offset 28-29)
  const bitsPerPixel = new DataView(bmpBytes.buffer, 28, 2).getUint16(0, true);

  return {
    magic,
    fileSize,
    width: Math.abs(width),
    height: Math.abs(height),
    bitsPerPixel,
    pixelDataOffset,
  };
}

/**
 * Options for BMP rendering
 */
export interface BmpRenderOptions {
  /** Whether to validate BMP format before rendering */
  validate?: boolean;
  /** Maximum allowed file size in bytes (default: 100KB) */
  maxSize?: number;
}

/**
 * Comprehensive function to handle BMP rendering with error handling
 * 
 * @param bmpBytes - The BMP byte data from render_token
 * @param options - Rendering options
 * @returns A data URL safe for use in img elements
 * @throws Error if BMP is invalid
 * 
 * @example
 * try {
 *   const bytes = await readContract({ functionName: 'render_token', args: [tokenId] });
 *   const dataUrl = renderBmpImage(bytes, { validate: true, maxSize: 10000 });
 *   imgElement.src = dataUrl;
 * } catch (error) {
 *   console.error('Failed to render BMP:', error);
 * }
 */
export function renderBmpImage(
  bmpBytes: ArrayLike<number> | Uint8Array | string,
  options: BmpRenderOptions = {}
): string {
  const { validate = true, maxSize = 102400 } = options;

  // Convert to Uint8Array if needed
  let byteArray: Uint8Array;
  if (typeof bmpBytes === 'string') {
    if (bmpBytes.startsWith('0x')) {
      const hexString = bmpBytes.slice(2);
      byteArray = new Uint8Array(hexString.length / 2);
      for (let i = 0; i < hexString.length; i += 2) {
        byteArray[i / 2] = parseInt(hexString.substr(i, 2), 16);
      }
    } else {
      throw new Error('Invalid hex string format');
    }
  } else if (bmpBytes instanceof Uint8Array) {
    byteArray = bmpBytes;
  } else {
    byteArray = new Uint8Array(bmpBytes);
  }

  // Validate size
  if (byteArray.length > maxSize) {
    throw new Error(
      `BMP file too large: ${byteArray.length} bytes (max: ${maxSize})`
    );
  }

  if (validate && !isValidBmp(byteArray)) {
    throw new Error('Invalid BMP file format (magic bytes check failed)');
  }

  // Return data URL
  return bytesToDataUrl(byteArray);
}

/**
 * Hook-friendly function to manage BMP image lifecycle
 * Automatically handles object URL cleanup
 * 
 * @param bmpBytes - The BMP byte data
 * @returns Object with URL and cleanup function
 * 
 * @example
 * const { url, cleanup } = createManagedBmpUrl(bytes);
 * imgElement.src = url;
 * // On unmount:
 * cleanup();
 */
export function createManagedBmpUrl(bmpBytes: Uint8Array): { url: string; cleanup: () => void } {
  const url = bytesToObjectUrl(bmpBytes);
  const cleanup = () => URL.revokeObjectURL(url);
  return { url, cleanup };
}
