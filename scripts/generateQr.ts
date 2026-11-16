import QRCode from 'qrcode';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));
const homepage = packageJson.homepage || 'https://ilzeroli.github.io/Unbound/';
const baseUrl = homepage.replace(/\/$/, '');

const QR_OPTIONS = {
  width: 1000,
  errorCorrectionLevel: 'H' as const,
  margin: 2,
  color: {
    dark: '#10231C',
    light: '#F4F7F5'
  }
};

async function generateQRCode(data: string, options = QR_OPTIONS): Promise<{ png: Buffer; svg: string }> {
  const [png, svg] = await Promise.all([
    QRCode.toBuffer(data, { ...options, type: 'png' }),
    QRCode.toString(data, { ...options, type: 'svg' })
  ]);
  return { png, svg };
}

async function main() {
  const qrDir = join(__dirname, '..', 'qr');
  const distQrDir = join(__dirname, '..', 'dist', 'qr');

  if (!existsSync(qrDir)) mkdirSync(qrDir, { recursive: true });
  if (!existsSync(distQrDir)) mkdirSync(distQrDir, { recursive: true });

  console.log('Generating Unbound QR code...');

  const siteUrl = `${baseUrl}/`;
  const { png: sitePng, svg: siteSvg } = await generateQRCode(siteUrl);
  writeFileSync(join(qrDir, 'unbound.png'), sitePng);
  writeFileSync(join(qrDir, 'unbound.svg'), siteSvg);
  writeFileSync(join(distQrDir, 'unbound.png'), sitePng);
  writeFileSync(join(distQrDir, 'unbound.svg'), siteSvg);
  console.log('✓ Generated Unbound QR code');
  console.log(`URL: ${siteUrl}`);

  console.log('\nQR code generated successfully!');
  console.log(`Output directory: ${qrDir}`);
  console.log(`Also copied to: ${distQrDir}`);
}

main().catch(err => {
  console.error('Error generating QR code:', err);
  process.exit(1);
});