import { useState, useEffect } from 'react';
import { useChallengeStore } from '@/stores';
import { t } from '@/i18n/bs';
import { ChallengeEntry } from '@/types';
import { schools } from '@/data/stations';

function SchoolSelector({ onSelect }: { onSelect: (schoolId: string) => void }) {
  const { selectedSchoolId } = useChallengeStore();

  return (
    <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)', border: '1px solid var(--color-border)', marginBottom: 'var(--spacing-lg)' }}>
      <h2 className="section-title" style={{ marginBottom: 'var(--spacing-md)' }}>{t('challenge.selectSchool')}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
        {schools.map(school => (
          <button
            key={school.id}
            type="button"
            onClick={() => onSelect(school.id)}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)', borderRadius: 'var(--radius-full)',
              border: `2px solid ${selectedSchoolId === school.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
              background: selectedSchoolId === school.id ? 'rgba(11, 122, 75, 0.1)' : 'transparent',
              color: selectedSchoolId === school.id ? 'var(--color-primary)' : 'var(--color-text)',
              fontWeight: selectedSchoolId === school.id ? 600 : 500,
              fontSize: 'var(--text-sm)', minHeight: 'var(--touch-target)',
              cursor: 'pointer', transition: 'all 0.2s ease'
            }}
            aria-pressed={selectedSchoolId === school.id}
          >
            {school.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function CategoryCard({ label, points, color, icon }: { label: string; points: number; color: string; icon: React.ReactNode }) {
  return (
    <div style={{ flex: 1, minWidth: '120px' }}>
      <div style={{
        background: 'var(--color-white)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)',
        border: '1px solid var(--color-border)', textAlign: 'center'
      }}>
        <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color, margin: '0 auto var(--spacing-sm)' }}>
          {icon}
        </div>
        <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-text)', marginBottom: '2px' }}>{points.toLocaleString('bs-BA')}</p>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{label}</p>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{t('challenge.points')}</p>
      </div>
    </div>
  );
}

function LeaderboardRow({ entry, rank, isCurrentSchool, schoolName }: { entry: ChallengeEntry; rank: number; isCurrentSchool: boolean; schoolName: string }) {
  const total = entry.energyPoints + entry.transportPoints + entry.habitsPoints + entry.ideasPoints;

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '40px 1fr repeat(4, 70px) 80px',
      gap: 'var(--spacing-sm)', alignItems: 'center', padding: 'var(--spacing-sm) var(--spacing-md)',
      background: isCurrentSchool ? 'rgba(11, 122, 75, 0.08)' : 'transparent',
      borderRadius: 'var(--radius-md)', border: isCurrentSchool ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
      marginBottom: 'var(--spacing-xs)'
    }}>
      <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: rank <= 3 ? 'var(--color-accent)' : 'var(--color-text)', textAlign: 'center' }}>{rank}.</span>
      <span style={{ fontWeight: isCurrentSchool ? 700 : 500, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {schoolName} {isCurrentSchool && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', marginLeft: '4px' }}>(Vi)</span>}
      </span>
      <span style={{ textAlign: 'right', fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{entry.energyPoints}</span>
      <span style={{ textAlign: 'right', fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{entry.transportPoints}</span>
      <span style={{ textAlign: 'right', fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{entry.habitsPoints}</span>
      <span style={{ textAlign: 'right', fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>{entry.ideasPoints}</span>
      <span style={{ textAlign: 'right', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--color-primary)' }}>{total}</span>
    </div>
  );
}

const EnergyIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /><circle cx="12" cy="12" r="4" /></svg>;
const TransportIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8H4V8a2 2 0 0 1 2-2h2V6Z" /><circle cx="8" cy="18" r="2" /><circle cx="16" cy="18" r="2" /></svg>;
const HabitsIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;
const IdeasIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /><circle cx="12" cy="12" r="4" /></svg>;

export function ChallengeScreen() {
  const { entries, selectedSchoolId, schools: allSchools, loadData, selectSchool, addPoints } = useChallengeStore();
  const [pointCategory, setPointCategory] = useState<keyof Omit<ChallengeEntry, 'schoolId' | 'updatedAt'>>('energyPoints');
  const [pointAmount, setPointAmount] = useState(10);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const sortedEntries = [...entries].sort((a, b) => {
    const totalA = a.energyPoints + a.transportPoints + a.habitsPoints + a.ideasPoints;
    const totalB = b.energyPoints + b.transportPoints + b.habitsPoints + b.ideasPoints;
    return totalB - totalA;
  });

  const selectedSchool = allSchools.find(s => s.id === selectedSchoolId);
  const selectedEntry = entries.find(e => e.schoolId === selectedSchoolId);

  return (
    <div className="challenge-screen" style={{ padding: 'var(--spacing-md)', paddingBottom: 'calc(var(--nav-height) + var(--safe-area-bottom) + var(--spacing-md))' }}>
      <header style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1 className="section-title" style={{ marginBottom: 'var(--spacing-xs)' }}>{t('challenge.title')}</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{t('home.tiles.challenge.description')}</p>
      </header>

      <SchoolSelector onSelect={selectSchool} />

      {selectedSchool && selectedEntry && (
        <section aria-labelledby="your-school-heading" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h2 id="your-school-heading" className="section-title">{t('challenge.yourSchool')}: {selectedSchool.name}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
            <CategoryCard label={t('challenge.categories.energy')} points={selectedEntry.energyPoints} color="var(--color-success)" icon={<EnergyIcon />} />
            <CategoryCard label={t('challenge.categories.transport')} points={selectedEntry.transportPoints} color="var(--color-primary)" icon={<TransportIcon />} />
            <CategoryCard label={t('challenge.categories.habits')} points={selectedEntry.habitsPoints} color="var(--color-accent)" icon={<HabitsIcon />} />
            <CategoryCard label={t('challenge.categories.ideas')} points={selectedEntry.ideasPoints} color="var(--color-primary-light)" icon={<IdeasIcon />} />
          </div>
          <div style={{ marginTop: 'var(--spacing-md)', padding: 'var(--spacing-md)', background: 'rgba(11, 122, 75, 0.1)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <p style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-primary)' }}>
              {t('challenge.totalPoints')}: {(selectedEntry.energyPoints + selectedEntry.transportPoints + selectedEntry.habitsPoints + selectedEntry.ideasPoints).toLocaleString('bs-BA')}
            </p>
          </div>
        </section>
      )}

      <section aria-labelledby="leaderboard-heading" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2 id="leaderboard-heading" className="section-title">{t('challenge.leaderboard')}</h2>
        <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '40px 1fr repeat(4, 70px) 80px',
            gap: 'var(--spacing-sm)', padding: 'var(--spacing-sm) var(--spacing-md)',
            background: 'var(--color-light)', borderBottom: '1px solid var(--color-border)',
            fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase'
          }}>
            <span>#</span>
            <span>{t('challenge.yourSchool')}</span>
            <span style={{ textAlign: 'right' }}>{t('challenge.categories.energy')}</span>
            <span style={{ textAlign: 'right' }}>{t('challenge.categories.transport')}</span>
            <span style={{ textAlign: 'right' }}>{t('challenge.categories.habits')}</span>
            <span style={{ textAlign: 'right' }}>{t('challenge.categories.ideas')}</span>
            <span style={{ textAlign: 'right' }}>{t('challenge.totalPoints')}</span>
          </div>
          <div style={{ padding: 'var(--spacing-sm) var(--spacing-md)', maxHeight: '400px', overflow: 'auto' }}>
            {sortedEntries.map((entry, index) => {
              const school = allSchools.find(s => s.id === entry.schoolId);
              return (
                <LeaderboardRow
                  key={entry.schoolId}
                  entry={entry}
                  rank={index + 1}
                  isCurrentSchool={entry.schoolId === selectedSchoolId}
                  schoolName={school?.name || entry.schoolId}
                />
              );
            })}
          </div>
        </div>
      </section>

      {selectedSchoolId && (
        <section aria-labelledby="add-points-heading">
          <h2 id="add-points-heading" className="section-title" style={{ marginBottom: 'var(--spacing-md)' }}>Dodaj bodove (demo)</h2>
          <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
              {(['energyPoints', 'transportPoints', 'habitsPoints', 'ideasPoints'] as const).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setPointCategory(cat)}
                  className={`btn ${pointCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ minHeight: 'var(--touch-target)' }}
                >
                  {t(`challenge.categories.${cat.replace('Points', '')}`)}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
              <label className="label" style={{ marginBottom: 0, minWidth: '80px' }}>{t('challenge.points')}</label>
              <input type="number" value={pointAmount} onChange={e => setPointAmount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))} className="input" style={{ width: '80px' }} min="1" max="100" />
              <button className="btn btn-primary" onClick={() => { addPoints(selectedSchoolId!, pointCategory, pointAmount); }} style={{ flex: 1, minHeight: 'var(--touch-target)' }}>
                Dodaj
              </button>
            </div>
          </div>
        </section>
      )}

      {!selectedSchoolId && (
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ marginBottom: 'var(--spacing-sm)', opacity: 0.5 }} aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <p>{t('challenge.noSchool')}</p>
        </div>
      )}
    </div>
  );
}