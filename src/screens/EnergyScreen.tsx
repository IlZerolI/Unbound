import { useEffect, useRef } from 'react';
import { useEnergyStore } from '@/stores';
import { t } from '@/i18n/bs';
import { EnergyData } from '@/types';

function BatteryBar({ level, status }: { level: number; status: EnergyData['batteryStatus'] }) {
  const getColor = () => {
    if (level > 60) return 'var(--color-success)';
    if (level > 30) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  const getStatusText = () => {
    switch (status) {
      case 'charging': return t('energy.charging');
      case 'discharging': return t('energy.discharging');
      default: return t('energy.stable');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{t('energy.batteryLevel')}</span>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: getStatusText() === t('energy.charging') ? 'var(--color-success)' : getStatusText() === t('energy.discharging') ? 'var(--color-warning)' : 'var(--color-text)' }}>
          {getStatusText()}
        </span>
      </div>
      <div style={{ height: '16px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden', position: 'relative' }}>
        <div
          style={{
            height: '100%',
            width: `${level}%`,
            background: getColor(),
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.5s ease, background 0.3s ease'
          }}
        />
        {level > 15 && (
          <span style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            color: 'var(--color-white)',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}>
            {level}%
          </span>
        )}
      </div>
    </div>
  );
}

function EnergyCard({ label, value, unit, icon, color, trend }: { label: string; value: number; unit: string; icon: React.ReactNode; color: string; trend?: 'up' | 'down' | 'stable' }) {
  return (
    <div className="energy-card" style={{
      background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)',
      border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
            {icon}
          </div>
          <div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
            <p style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text)' }}>
              {value.toLocaleString('bs-BA')} <span style={{ fontSize: 'var(--text-sm)', fontWeight: 400, color: 'var(--color-text-muted)' }}>{unit}</span>
            </p>
          </div>
        </div>
        {trend && (
          <span style={{
            fontSize: 'var(--text-xs)', fontWeight: 600,
            color: trend === 'up' ? 'var(--color-success)' : trend === 'down' ? 'var(--color-error)' : 'var(--color-text-muted)',
            display: 'flex', alignItems: 'center', gap: '2px'
          }}>
            {trend === 'up' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden="true"><polyline points="18 15 12 9 6 15" /></svg>}
            {trend === 'down' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>}
            {trend === 'stable' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /></svg>}
          </span>
        )}
      </div>
    </div>
  );
}

function HourlyChart({ data }: { data: Array<{ hour: number; solar: number; kinetic: number; consumption: number; battery: number }> }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const width = 320;
  const height = 160;
  const padding = { top: 20, right: 10, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map(d => Math.max(d.solar, d.kinetic, d.consumption, d.battery * 10)));
  const minValue = 0;

  const xScale = (i: number) => padding.left + (i / (data.length - 1)) * chartWidth;
  const yScale = (value: number) => padding.top + chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;

  const drawLine = (values: number[], color: string, strokeWidth = 2) => {
    const points = data.map((_, i) => `${xScale(i)},${yScale(values[i])}`).join(' ');
    return <polyline fill="none" stroke={color} strokeWidth={strokeWidth} points={points} />;
  };

  const drawBars = (values: number[], color: string, opacity = 0.3) => {
    return (
      <g fill={color} fillOpacity={opacity}>
        {data.map((_, i) => (
          <rect
            key={i}
            x={xScale(i) - chartWidth / data.length / 2}
            y={yScale(values[i])}
            width={chartWidth / data.length * 0.8}
            height={chartHeight - (yScale(values[i]) - padding.top)}
          />
        ))}
      </g>
    );
  };

  return (
    <div style={{ width: '100%', maxWidth: `${width}px`, margin: '0 auto' }}>
      <svg ref={svgRef} width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={t('energy.hourlyChart')}>
        <defs>
          <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-border)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-border)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="2 4">
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
            <line key={ratio} x1={padding.left} y1={padding.top + ratio * chartHeight} x2={width - padding.right} y2={padding.top + ratio * chartHeight} />
          ))}
        </g>

        <g fontSize="10" fill="var(--color-text-muted)">
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <text key={i} x={padding.left - 8} y={padding.top + ratio * chartHeight + 3} textAnchor="end" dominantBaseline="middle">
              {Math.round(maxValue * (1 - ratio))}
            </text>
          ))}
          {data.filter((_, i) => i % 3 === 0).map((d, i) => (
            <text key={d.hour} x={xScale(i * 3)} y={height - padding.bottom + 16} textAnchor="middle" dominantBaseline="hanging">
              {d.hour}:00
            </text>
          ))}
        </g>

        {drawBars(data.map(d => d.solar), 'var(--color-accent)', 0.2)}
        {drawBars(data.map(d => d.kinetic), 'var(--color-primary)', 0.2)}
        {drawLine(data.map(d => d.consumption), 'var(--color-error)', 2)}
        {drawLine(data.map(d => d.battery * 10), 'var(--color-primary)', 3)}

        <g fontSize="10" style={{ fontFamily: 'var(--font-sans)' }}>
          <text x={width - padding.right - 80} y={padding.top + 12} fill="var(--color-accent)" textAnchor="end">☀ {t('energy.solar')}</text>
          <text x={width - padding.right - 80} y={padding.top + 26} fill="var(--color-primary)" textAnchor="end">⚡ {t('energy.kinetic')}</text>
          <text x={width - padding.right - 80} y={padding.top + 40} fill="var(--color-error)" textAnchor="end">⚡ {t('energy.consumption')}</text>
          <text x={width - padding.right - 80} y={padding.top + 54} fill="var(--color-primary)" textAnchor="end">🔋 {t('energy.battery')} ×10</text>
        </g>
      </svg>
    </div>
  );
}

const SolarIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>;
const KineticIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>;
const ConsumptionIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /><circle cx="12" cy="12" r="4" /></svg>;

export function EnergyScreen() {
  const { currentData, hourlyData, subscribe } = useEnergyStore();

  useEffect(() => {
    const unsub = subscribe();
    return unsub;
  }, [subscribe]);

  if (!currentData) {
    return (
      <div className="energy-screen" style={{ padding: 'var(--spacing-md)', paddingBottom: 'calc(var(--nav-height) + var(--safe-area-bottom) + var(--spacing-md))', textAlign: 'center' }}>
        <div className="app-loading" style={{ minHeight: '300px' }}>
          <div className="spinner" />
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="energy-screen" style={{ padding: 'var(--spacing-md)', paddingBottom: 'calc(var(--nav-height) + var(--safe-area-bottom) + var(--spacing-md))' }}>
      <header style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1 className="section-title" style={{ marginBottom: 'var(--spacing-xs)' }}>{t('energy.title')}</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{t('energy.live')} • {t('energy.simulator')}</p>
      </header>

      <section aria-labelledby="battery-heading" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2 id="battery-heading" className="section-title">{t('energy.battery')}</h2>
        <BatteryBar level={currentData.batteryLevel} status={currentData.batteryStatus} />
      </section>

      <section aria-labelledby="production-heading" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2 id="production-heading" className="section-title">{t('energy.solar')} & {t('energy.kinetic')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
          <EnergyCard
            label={t('energy.solar')}
            value={currentData.solar}
            unit={t('energy.watts')}
            icon={<SolarIcon />}
            color="var(--color-accent)"
            trend={currentData.solar > 400 ? 'up' : 'stable'}
          />
          <EnergyCard
            label={t('energy.kinetic')}
            value={currentData.kinetic}
            unit={t('energy.watts')}
            icon={<KineticIcon />}
            color="var(--color-primary)"
            trend={currentData.kinetic > 40 ? 'up' : 'stable'}
          />
        </div>
      </section>

      <section aria-labelledby="consumption-heading" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2 id="consumption-heading" className="section-title">{t('energy.consumption')}</h2>
        <EnergyCard
          label={t('energy.consumption')}
          value={currentData.consumption}
          unit={t('energy.watts')}
          icon={<ConsumptionIcon />}
          color="var(--color-error)"
          trend={currentData.consumption > 350 ? 'up' : 'down'}
        />
      </section>

      <section aria-labelledby="hourly-heading">
        <h2 id="hourly-heading" className="section-title">{t('energy.hourlyChart')}</h2>
        <HourlyChart data={hourlyData} />
      </section>
    </div>
  );
}