import { useState, useEffect } from 'react';
import { useAppStore, useReportStore } from '@/stores';
import { t } from '@/i18n/bs';
import { ReportCategory, ReportStatus } from '@/types';

const categories: { id: ReportCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'bench', label: t('report.categories.bench'), icon: <BenchIcon /> },
  { id: 'lighting', label: t('report.categories.lighting'), icon: <LightingIcon /> },
  { id: 'glass', label: t('report.categories.glass'), icon: <GlassIcon /> },
  { id: 'screen', label: t('report.categories.screen'), icon: <ScreenIcon /> },
  { id: 'cleanliness', label: t('report.categories.cleanliness'), icon: <CleanlinessIcon /> }
];

function BenchIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 16V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" /><path d="M6 16v6M18 16v6" /></svg>; }
function LightingIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /><circle cx="12" cy="12" r="4" /></svg>; }
function GlassIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h16v16H4z" /><path d="M8 8l8 8M16 8l-8 8" /></svg>; }
function ScreenIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>; }
function CleanlinessIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 2v2M14 2v2M6 6h12v12H6z" /><path d="M10 10h4M10 14h4" /></svg>; }

function StatusBadge({ status }: { status: ReportStatus }) {
  const config = {
    pending: { label: t('report.status.pending'), class: 'badge-warning' },
    inProgress: { label: t('report.status.inProgress'), class: 'badge-info' },
    resolved: { label: t('report.status.resolved'), class: 'badge-primary' },
    rejected: { label: t('report.status.rejected'), class: 'badge-error' }
  };
  const c = config[status];
  return <span className={`badge ${c.class}`}>{c.label}</span>;
}

function ReportForm() {
  const { createReport } = useReportStore();
  const { selectedStationId } = useAppStore();
  const [category, setCategory] = useState<ReportCategory>('bench');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStationId) return;
    setSubmitting(true);
    try {
      let photoUrl: string | undefined;
      if (photo) {
        photoUrl = URL.createObjectURL(photo);
      }
      await createReport({ stationId: selectedStationId, category, description: description.trim(), photoUrl });
      setSuccess(true);
      setCategory('bench');
      setDescription('');
      setPhoto(null);
      setPhotoPreview(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      alert(t('report.error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)', border: '1px solid var(--color-border)', marginBottom: 'var(--spacing-lg)' }}>
      <h2 className="section-title">{t('report.title')}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <fieldset>
          <legend className="label">{t('report.categories.bench')}</legend>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  padding: 'var(--spacing-sm) var(--spacing-md)', borderRadius: 'var(--radius-md)',
                  border: `2px solid ${category === cat.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  background: category === cat.id ? 'rgba(11, 122, 75, 0.1)' : 'transparent',
                  color: category === cat.id ? 'var(--color-primary)' : 'var(--color-text)',
                  minWidth: '80px', minHeight: 'var(--touch-target)', cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                aria-pressed={category === cat.id}
              >
                <span style={{ color: category === cat.id ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>{cat.icon}</span>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 500 }}>{cat.label}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label className="label" htmlFor="description">{t('report.description')}</label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={t('report.descriptionPlaceholder')}
            rows={3}
            className="input"
            style={{ resize: 'vertical', minHeight: '80px', fontFamily: 'inherit' }}
          />
        </div>

        <div>
          <label className="label">{t('report.photo')}</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoChange}
            className="input"
            style={{ padding: 'var(--spacing-sm)' }}
            aria-label={t('report.takePhoto')}
          />
          {photoPreview && (
            <div style={{ marginTop: 'var(--spacing-sm)', position: 'relative', display: 'inline-block' }}>
              <img src={photoPreview} alt={t('report.photo')} style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }} />
              <button type="button" onClick={() => { setPhoto(null); setPhotoPreview(null); }} style={{
                position: 'absolute', top: '4px', right: '4px', width: '28px', height: '28px', borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }} aria-label={t('common.delete')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: '100%', minHeight: 'var(--touch-target)' }}>
          {submitting ? t('common.loading') : t('report.submit')}
        </button>

        {success && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-success)', background: 'var(--color-success-light)', padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            {t('report.success')}
          </p>
        )}
      </form>
    </div>
  );
}

function MyReports() {
  const { reports } = useReportStore();
  const { selectedStationId, stations: allStations } = useAppStore();
  const station = allStations.find(s => s.id === selectedStationId);
  // selectedStationName reserved for future use
  void station?.name;

  if (reports.length === 0) {
    return (
      <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-xl)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ marginBottom: 'var(--spacing-sm)', opacity: 0.5, margin: '0 auto var(--spacing-sm)' }} aria-hidden="true">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12.01" y2="18" />
          <line x1="12" y1="12" x2="12.01" y2="12" />
          <line x1="12" y1="6" x2="12.01" y2="6" />
        </svg>
        <p style={{ color: 'var(--color-text-muted)' }}>{t('report.noReports')}</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      <div style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>{t('report.myReports')}</h2>
        <span className="badge badge-info">{reports.length}</span>
      </div>
      <ul style={{ padding: 'var(--spacing-sm)' }}>
        {reports.map(report => {
          const cat = categories.find(c => c.id === report.category);
          return (
            <li key={report.id} style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                  {cat && <span style={{ color: 'var(--color-primary)' }}>{cat.icon}</span>}
                  <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{cat?.label || report.category}</span>
                </div>
                <StatusBadge status={report.status} />
              </div>
              {report.description && (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-light)' }}>{report.description}</p>
              )}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                <span>{allStations.find(s => s.id === report.stationId)?.name ?? report.stationId}</span>
                <span>{new Date(report.createdAt).toLocaleDateString('bs-BA', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ReportScreen() {
  const { loadReports } = useReportStore();

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  return (
    <div className="report-screen" style={{ padding: 'var(--spacing-md)', paddingBottom: 'calc(var(--nav-height) + var(--safe-area-bottom) + var(--spacing-md))' }}>
      <header style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1 className="section-title" style={{ marginBottom: 'var(--spacing-xs)' }}>{t('report.title')}</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{t('home.tiles.report.description')}</p>
      </header>
      <ReportForm />
      <MyReports />
    </div>
  );
}