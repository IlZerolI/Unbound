import QRCode from 'qrcode';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJson = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));
const homepage = packageJson.homepage || 'https://IlZerolI.github.io/student_stop/';
const baseUrl = homepage.replace(/\/$/, '');

const stations = [
  { id: 'tehnicka-skola', name: 'Tehnička škola' },
  { id: 'pocetno-stajaliste', name: 'Početno stajalište' },
  { id: 'zmaja-od-bosne', name: 'Zmaja od Bosne' },
  { id: 'marsal-tito', name: 'Maršal Tito' },
  { id: 'skenderija', name: 'Skenderija' },
  { id: 'univerzitet', name: 'Univerzitet' }
];

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

  console.log('Generating QR codes...');

  // General site QR
  const siteUrl = `${baseUrl}/`;
  const { png: sitePng, svg: siteSvg } = await generateQRCode(siteUrl);
  writeFileSync(join(qrDir, 'site.png'), sitePng);
  writeFileSync(join(qrDir, 'site.svg'), siteSvg);
  writeFileSync(join(distQrDir, 'site.png'), sitePng);
  writeFileSync(join(distQrDir, 'site.svg'), siteSvg);
  console.log('✓ Generated site QR');

  // Station QRs
  for (const station of stations) {
    const stationUrl = `${baseUrl}/#/?station=${station.id}`;
    const { png, svg } = await generateQRCode(stationUrl);
    writeFileSync(join(qrDir, `station-${station.id}.png`), png);
    writeFileSync(join(qrDir, `station-${station.id}.svg`), svg);
    writeFileSync(join(distQrDir, `station-${station.id}.png`), png);
    writeFileSync(join(distQrDir, `station-${station.id}.svg`), svg);
    console.log(`✓ Generated QR for ${station.name} (${station.id})`);
  }

  // Generate print.html
  const printHtml = generatePrintHtml(stations, baseUrl);
  writeFileSync(join(qrDir, 'print.html'), printHtml);
  writeFileSync(join(distQrDir, 'print.html'), printHtml);
  console.log('✓ Generated print.html');

  console.log('\nAll QR codes generated successfully!');
  console.log(`Output directory: ${qrDir}`);
  console.log(`Also copied to: ${distQrDir}`);
}

function generatePrintHtml(stations: Array<{ id: string; name: string }>, baseUrl: string): string {
  const stationCards = stations.map(station => `
    <div class="station-card">
      <div class="qr-container">
        <img src="station-${station.id}.svg" alt="QR kod za stajalište ${station.name}" />
      </div>
      <div class="station-info">
        <h2>${station.name}</h2>
        <p class="scan-text">Skeniraj i prati tramvaj</p>
        <p class="url">${baseUrl}/#/?station=${station.id}</p>
      </div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="bs">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>STUDENT STOP - QR kodovi za štampu</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @page { size: A4; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F4F7F5; color: #10231C; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #0B7A4B; }
    .logo { display: inline-flex; align-items: center; gap: 12px; margin-bottom: 10px; }
    .logo-icon { width: 60px; height: 60px; background: #0B7A4B; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .logo-icon svg { width: 36px; height: 36px; stroke: white; }
    .logo-text h1 { font-size: 28px; font-weight: 700; color: #0B7A4B; line-height: 1.2; }
    .logo-text p { font-size: 14px; color: #6B8E7A; }
    .subtitle { font-size: 16px; color: #4A6F5A; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .station-card { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #D0DCD6; page-break-inside: avoid; display: flex; flex-direction: column; align-items: center; }
    .qr-container { width: 180px; height: 180px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center; }
    .qr-container img { width: 100%; height: 100%; object-fit: contain; }
    .station-info { text-align: center; width: 100%; }
    .station-info h2 { font-size: 20px; font-weight: 700; color: #10231C; margin-bottom: 8px; }
    .scan-text { font-size: 14px; font-weight: 600; color: #0B7A4B; margin-bottom: 8px; }
    .url { font-size: 11px; color: #6B8E7A; word-break: break-all; font-family: monospace; }
    @media print {
      body { background: white; padding: 0; }
      .grid { gap: 15px; }
      .station-card { box-shadow: none; border: 1px solid #ccc; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">
      <div class="logo-icon">
        <svg viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="currentColor" />
          <path d="M8 16L14 22L24 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
      <div class="logo-text">
        <h1>STUDENT STOP</h1>
        <p>Pametno stajalište za pametnu mladež</p>
      </div>
    </div>
    <p class="subtitle">QR kodovi za sva stajališta – spremni za štampu na A4</p>
  </div>

  <div class="grid">
    ${stationCards}
  </div>
</body>
</html>`;
}

main().catch(err => {
  console.error('Error generating QR codes:', err);
  process.exit(1);
});