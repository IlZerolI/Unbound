import { useState, useEffect } from 'react';
import { t } from '@/i18n/bs';
import { generateQRCode } from '@/utils/qr';

export function QRScreen() {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    generateQR();
  }, []);

  const generateQR = async () => {
    setGenerating(true);
    try {
      const baseUrl = window.location.origin;
      const png = await generateQRCode(`${baseUrl}/Unbound/`, { width: 1000 });
      setQrDataUrl(png);
    } catch (error) {
      console.error('QR generation failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  const siteUrl = `${window.location.origin}/Unbound/`;

  return (
    <div className="qr-screen" style={{ padding: 'var(--spacing-md)', paddingBottom: 'calc(var(--nav-height) + var(--safe-area-bottom) + var(--spacing-md))' }}>
      <header style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1 className="section-title" style={{ marginBottom: 'var(--spacing-xs)' }}>{t('qr.title')}</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          Skenirajte QR kod da otvorite Unbound na svom telefonu
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
        <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-xl)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)', maxWidth: '300px', width: '100%' }}>
          {generating ? (
            <div style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <div className="spinner" style={{ margin: '0 auto var(--spacing-md)' }} />
              <p>{t('common.loading')}</p>
            </div>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>
                <img
                  src={qrDataUrl}
                  alt="Unbound QR kod"
                  style={{ width: '220px', height: '220px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                />
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textAlign: 'center', wordBreak: 'break-all' }}>
                {siteUrl}
              </p>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-md)', width: '100%', maxWidth: '300px' }}>
          <button className="btn btn-primary" onClick={() => { navigator.clipboard.writeText(siteUrl); alert(t('qr.copied')); }} disabled={generating} style={{ flex: 1, minHeight: 'var(--touch-target)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginRight: 'var(--spacing-xs)' }}>
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {t('qr.copyLink')}
          </button>
        </div>
      </div>
    </div>
  );
}