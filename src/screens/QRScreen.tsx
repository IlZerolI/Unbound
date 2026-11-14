import { useState, useEffect } from 'react';
import { useAppStore } from '@/stores';
import { t } from '@/i18n/bs';
import { getStationById } from '@/data/stations';
import { generateStationQR } from '@/utils/qr';
import { getStationUrl } from '@/utils/helpers';

export function QRScreen() {
  const { selectedStationId, stations: allStations } = useAppStore();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [generating, setGenerating] = useState(false);
  const [shareSupported, setShareSupported] = useState(false);

  const selectedStation = allStations.find(s => s.id === selectedStationId);

  useEffect(() => {
    setShareSupported('share' in navigator);
    if (selectedStationId) {
      generateQR();
    }
  }, [selectedStationId]);

  const generateQR = async () => {
    if (!selectedStationId) return;
    setGenerating(true);
    try {
      const baseUrl = window.location.origin;
      const { png } = await generateStationQR(selectedStationId, baseUrl);
      setQrDataUrl(png);
    } catch (error) {
      console.error('QR generation failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!selectedStationId) return;
    const url = getStationUrl(selectedStationId);
    const station = getStationById(selectedStationId);
    const text = station ? `${t('qr.scanText')} ${station.name}: ${url}` : url;

    if (shareSupported && navigator.share) {
      try {
        await navigator.share({ title: t('qr.title'), text, url });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          await copyToClipboard(url);
        }
      }
    } else {
      await copyToClipboard(url);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(t('qr.copied'));
    } catch {
      alert(t('common.error'));
    }
  };

  return (
    <div className="qr-screen" style={{ padding: 'var(--spacing-md)', paddingBottom: 'calc(var(--nav-height) + var(--safe-area-bottom) + var(--spacing-md))' }}>
      <header style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1 className="section-title" style={{ marginBottom: 'var(--spacing-xs)' }}>{t('qr.title')}</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          {selectedStation ? `${selectedStation.name}` : t('qr.generalQR')}
        </p>
      </header>

      {!selectedStationId ? (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ marginBottom: 'var(--spacing-md)', opacity: 0.5, margin: '0 auto var(--spacing-md)' }} aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text)', marginBottom: 'var(--spacing-sm)' }}>
            {t('qr.stationQR')}
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)', maxWidth: '300px', margin: '0 auto var(--spacing-lg)' }}>
            Odaberite stanicu na Početnoj stranici kako biste generisali QR kod za nju.
          </p>
          <button className="btn btn-primary" onClick={() => window.location.hash = '#/select-station'} style={{ minHeight: 'var(--touch-target)' }}>
            {t('home.changeStation')}
          </button>
        </div>
      ) : (
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
                    alt={`${t('qr.stationQR')} ${selectedStation?.name}`}
                    style={{ width: '200px', height: '200px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                  />
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textAlign: 'center', wordBreak: 'break-all' }}>
                  {getStationUrl(selectedStationId)}
                </p>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-md)', width: '100%', maxWidth: '300px' }}>
            <button className="btn btn-primary" onClick={handleShare} disabled={generating} style={{ flex: 1, minHeight: 'var(--touch-target)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginRight: 'var(--spacing-xs)' }}>
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="M8.59 13.51l1.71 1.71a2 2 0 0 0 2.83 0l3.54-3.54" />
                <path d="M8.59 10.49l1.71-1.71a2 2 0 0 1 2.83 0l3.54 3.54" />
              </svg>
              {t('qr.shareLink')}
            </button>
            <button className="btn btn-secondary" onClick={() => copyToClipboard(getStationUrl(selectedStationId!))} disabled={generating} style={{ flex: 1, minHeight: 'var(--touch-target)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginRight: 'var(--spacing-xs)' }}>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              {t('qr.copyLink')}
            </button>
          </div>

          <button className="btn btn-secondary" onClick={() => { useAppStore.getState().setSelectedStation(''); window.location.hash = '#/'; }} style={{ maxWidth: '300px', minHeight: 'var(--touch-target)' }}>
            {t('home.changeStation')}
          </button>
        </div>
      )}
    </div>
  );
}