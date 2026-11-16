import QRCode from 'qrcode';

export async function generateQRCode(
  data: string,
  options: { width?: number; errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H' } = {}
): Promise<string> {
  return QRCode.toDataURL(data, {
    width: options.width || 1000,
    errorCorrectionLevel: options.errorCorrectionLevel || 'H',
    margin: 2,
    color: {
      dark: '#10231C',
      light: '#F4F7F5'
    }
  });
}

export async function generateQRCodeSVG(
  data: string,
  options: { width?: number; errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H' } = {}
): Promise<string> {
  return QRCode.toString(data, {
    type: 'svg',
    width: options.width || 1000,
    errorCorrectionLevel: options.errorCorrectionLevel || 'H',
    margin: 2,
    color: {
      dark: '#10231C',
      light: '#F4F7F5'
    }
  });
}

export async function generateStationQR(
  stationId: string,
  baseUrl: string
): Promise<{ png: string; svg: string }> {
  const url = `${baseUrl}/student_stop/#/?station=${stationId}`;
  const [png, svg] = await Promise.all([
    generateQRCode(url, { width: 1000 }),
    generateQRCodeSVG(url, { width: 1000 })
  ]);
  return { png, svg };
}

export async function generateGeneralQR(baseUrl: string): Promise<{ png: string; svg: string }> {
  const url = `${baseUrl}/student_stop/`;
  const [png, svg] = await Promise.all([
    generateQRCode(url, { width: 1000 }),
    generateQRCodeSVG(url, { width: 1000 })
  ]);
  return { png, svg };
}