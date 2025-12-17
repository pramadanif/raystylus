/**
 * Sphere Renderer for Aesthetic Preview
 * 
 * Renders a 3D-like sphere with lighting effects for visual preview
 * before minting an aesthetic NFT
 */

export interface SphereConfig {
  sphereColor: { r: number; g: number; b: number };
  bgColor1: { r: number; g: number; b: number };
  bgColor2: { r: number; g: number; b: number };
  width?: number;
  height?: number;
}

/**
 * Renders a sphere with Phong lighting to a canvas
 * Simulates the raytracing effect on-chain
 */
export function renderSphereToCanvas(
  canvas: HTMLCanvasElement,
  config: SphereConfig
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = config.width || canvas.width;
  const height = config.height || canvas.height;

  // Create gradient background from bgColor1 (top) to bgColor2 (bottom)
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  const color1 = `rgb(${config.bgColor1.r}, ${config.bgColor1.g}, ${config.bgColor1.b})`;
  const color2 = `rgb(${config.bgColor2.r}, ${config.bgColor2.g}, ${config.bgColor2.b})`;
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Draw sphere
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;

  // Sphere base color
  const sphereColor = `rgb(${config.sphereColor.r}, ${config.sphereColor.g}, ${config.sphereColor.b})`;

  // Create radial gradient for sphere lighting (Phong-like)
  const sphereGradient = ctx.createRadialGradient(
    centerX - radius * 0.3,
    centerY - radius * 0.3,
    0,
    centerX,
    centerY,
    radius
  );

  // Lighter edge (specular highlight)
  const highlightColor = lightenColor(
    config.sphereColor.r,
    config.sphereColor.g,
    config.sphereColor.b,
    50
  );
  sphereGradient.addColorStop(0, `rgb(${highlightColor.r}, ${highlightColor.g}, ${highlightColor.b})`);

  // Mid-tone
  sphereGradient.addColorStop(0.5, sphereColor);

  // Darker edge (shadow)
  const shadowColor = darkenColor(
    config.sphereColor.r,
    config.sphereColor.g,
    config.sphereColor.b,
    60
  );
  sphereGradient.addColorStop(1, `rgb(${shadowColor.r}, ${shadowColor.g}, ${shadowColor.b})`);

  ctx.fillStyle = sphereGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  // Add subtle rim lighting
  ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Add soft shadow beneath sphere
  const shadowGradient = ctx.createRadialGradient(
    centerX,
    centerY + radius + 20,
    0,
    centerX,
    centerY + radius + 20,
    radius * 0.8
  );
  shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
  shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = shadowGradient;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + radius + 20, radius * 0.8, radius * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Lighten a color by adding white
 */
function lightenColor(r: number, g: number, b: number, amount: number) {
  return {
    r: Math.min(255, r + amount),
    g: Math.min(255, g + amount),
    b: Math.min(255, b + amount),
  };
}

/**
 * Darken a color by removing brightness
 */
function darkenColor(r: number, g: number, b: number, amount: number) {
  return {
    r: Math.max(0, r - amount),
    g: Math.max(0, g - amount),
    b: Math.max(0, b - amount),
  };
}

/**
 * Create an animated canvas with rotating sphere (future feature)
 */
export function createAnimatedSphere(
  canvas: HTMLCanvasElement,
  config: SphereConfig
) {
  let animationId: number;
  let rotation = 0;

  const animate = () => {
    rotation += 0.01;
    renderSphereToCanvas(canvas, config);
    animationId = requestAnimationFrame(animate);
  };

  animate();

  return () => {
    cancelAnimationFrame(animationId);
  };
}
