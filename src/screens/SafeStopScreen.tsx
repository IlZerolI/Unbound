import { useState } from 'react';
import { useAppStore, useStationEquipmentStore, useReportStore } from '@/stores';
import { t } from '@/i18n/bs';
import { StationEquipment } from '@/types';

function EquipmentCard({ label, status, lastChecked, icon }: { label: string; status: StationEquipment[keyof Pick<StationEquipment, 'lighting' | 'cameras' | 'screen' | 'bench'>]; lastChecked: number; icon: React.ReactNode }) {
  const statusConfig = {
    working: { label: t('safeStop.status.working'), color: 'var(--color-success)', bg: 'var(--color-success-light)', iconColor: 'var(--color-success)' },
    warning: { label: t('safeStop.status.warning'), color: 'var(--color-warning)', bg: 'var(--color-warning-light)', iconColor: 'var(--color-warning)' },
    broken: { label: t('safeStop.status.broken'), color: 'var(--color-error)', bg: 'var(--color-error-light)', iconColor: 'var(--color-error)' }
  };

  const config = statusConfig[status];

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)',
      padding: 'var(--spacing-md)', background: 'var(--color-white)', borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)'
    }}>
      <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: config.iconColor, flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)' }}>{label}</p>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{new Date(lastChecked).toLocaleDateString('bs-BA', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
      </div>
      <span className="badge" style={{ background: config.bg, color: config.color }}>{config.label}</span>
    </div>
  );
}

const LightingIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /><circle cx="12" cy="12" r="4" /></svg>;
const CameraIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="12" r="4" /></svg>;
const ScreenIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>;
const BenchIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 16V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" /><path d="M6 16v6M18 16v6" /></svg>;

function SOSButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [calling, setCalling] = useState(false);

  const handleCall = () => {
    setCalling(true);
    window.location.href = 'tel:112';
    setTimeout(() => {
      setCalling(false);
      setShowConfirm(false);
    }, 3000);
  };

  if (showConfirm) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-md)', zIndex: 300 }}>
        <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-lg)', maxWidth: '320px', width: '100%', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--color-error-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-md)', color: 'var(--color-error)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
          </div>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--spacing-xs)' }}>{t('safeStop.sos')}</h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-lg)' }}>{t('safeStop.sosConfirm')}</p>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            <button className="btn btn-secondary" onClick={() => setShowConfirm(false)} style={{ flex: 1 }}>{t('common.cancel')}</button>
            <button className="btn btn-danger" onClick={handleCall} disabled={calling} style={{ flex: 1 }}>{calling ? t('safeStop.sosCalling') : t('common.confirm')}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      className="btn btn-danger"
      onClick={() => setShowConfirm(true)}
      style={{
        width: '100%', padding: 'var(--spacing-lg)', fontSize: 'var(--text-lg)',
        fontWeight: 700, borderRadius: 'var(--radius-lg)', minHeight: '60px'
      }}
      aria-label={t('safeStop.sos')}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginRight: 'var(--spacing-sm)' }}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
      {t('safeStop.sos')}
    </button>
  );
}

function SuspiciousReportForm() {
  const { createSuspiciousReport } = useReportStore();
  const { selectedStationId } = useAppStore();
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !selectedStationId) return;
    setSubmitting(true);
    try {
      await createSuspiciousReport({ stationId: selectedStationId, description: description.trim() });
      setSuccess(true);
      setDescription('');
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      alert(t('safeStop.reportError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
      <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text)' }}>{t('safeStop.reportSuspicious')}</h3>
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder={t('safeStop.reportPlaceholder')}
        maxLength={500}
        rows={4}
        className="input"
        style={{ resize: 'vertical', minHeight: '100px', fontFamily: 'inherit' }}
        aria-label={t('safeStop.reportSuspicious')}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 'var(--text-xs)', color: description.length > 450 ? 'var(--color-error)' : 'var(--color-text-muted)' }}>
          {500 - description.length} {t('safeStop.charsLeft')}
        </span>
        <button type="submit" className="btn btn-primary" disabled={!description.trim() || submitting} style={{ minHeight: 'var(--touch-target)' }}>
          {submitting ? t('common.loading') : t('safeStop.reportSubmit')}
        </button>
      </div>
      {success && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-success)', background: 'var(--color-success-light)', padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          {t('safeStop.reportSuccess')}
        </p>
      )}
    </form>
  );
}

export function SafeStopScreen() {
  const { selectedStationId, stations: allStations } = useAppStore();
  const { getEquipment } = useStationEquipmentStore();
  const selectedStation = allStations.find(s => s.id === selectedStationId || allStations[0].id);
  const stationId = selectedStation?.id || allStations[0].id;
  const equipment = getEquipment(stationId) ?? {
    lighting: 'working' as const,
    cameras: 'working' as const,
    screen: 'working' as const,
    bench: 'working' as const,
    lastChecked: Date.now()
  };

  return (
    <div className="safe-stop-screen" style={{ padding: 'var(--spacing-md)', paddingBottom: 'calc(var(--nav-height) + var(--safe-area-bottom) + var(--spacing-md))' }}>
      <header style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1 className="section-title" style={{ marginBottom: 'var(--spacing-xs)' }}>{t('safeStop.title')}</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          {selectedStation?.name || t('common.loading')}
        </p>
      </header>

      <section aria-labelledby="equipment-heading" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2 id="equipment-heading" className="section-title">{t('safeStop.lighting')}, {t('safeStop.cameras')}, {t('safeStop.equipment')}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          <EquipmentCard label={t('safeStop.lighting')} status={equipment.lighting} lastChecked={equipment.lastChecked} icon={<LightingIcon />} />
          <EquipmentCard label={t('safeStop.cameras')} status={equipment.cameras} lastChecked={equipment.lastChecked} icon={<CameraIcon />} />
          <EquipmentCard label={t('safeStop.screen')} status={equipment.screen} lastChecked={equipment.lastChecked} icon={<ScreenIcon />} />
          <EquipmentCard label={t('safeStop.bench')} status={equipment.bench} lastChecked={equipment.lastChecked} icon={<BenchIcon />} />
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--spacing-sm)', textAlign: 'center' }}>
          {t('safeStop.lastChecked')} {new Date(equipment.lastChecked).toLocaleDateString('bs-BA', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
      </section>

      <section aria-labelledby="sos-heading" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2 id="sos-heading" className="section-title" style={{ display: 'none' }}>{t('safeStop.sos')}</h2>
        <SOSButton />
      </section>

      <section aria-labelledby="report-heading">
        <h2 id="report-heading" className="section-title">{t('safeStop.reportSuspicious')}</h2>
        <SuspiciousReportForm />
      </section>
    </div>
  );
}