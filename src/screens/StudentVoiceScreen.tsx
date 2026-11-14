import { useState, useEffect } from 'react';
import { useStudentVoiceStore } from '@/stores';
import { t } from '@/i18n/bs';
import { Survey } from '@/types';

function SurveyCard({ survey, hasVoted, onVote }: { survey: Survey; hasVoted: boolean; onVote: (optionId: string) => void }) {
  const totalVotes = survey.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)', border: '1px solid var(--color-border)', marginBottom: 'var(--spacing-md)' }}>
      <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--spacing-md)' }}>{survey.question}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
        {survey.options.map(option => {
          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
          const voted = hasVoted;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => !voted && onVote(option.id)}
              disabled={voted}
              style={{
                display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)',
                padding: 'var(--spacing-sm) var(--spacing-md)', borderRadius: 'var(--radius-md)',
                background: voted ? 'var(--color-light)' : 'transparent',
                border: `1px solid ${voted ? 'var(--color-border)' : 'var(--color-primary)'}`,
                color: 'var(--color-text)', textAlign: 'left', width: '100%',
                cursor: voted ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease',
                opacity: voted ? 0.7 : 1
              }}
              aria-pressed={voted}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text)' }}>{option.text}</p>
                <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginTop: '4px' }}>
                  <div style={{
                    height: '100%', width: `${percentage}%`,
                    background: voted ? 'var(--color-primary)' : 'var(--color-primary-light)',
                    borderRadius: 'var(--radius-full)', transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', minWidth: '80px' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text)' }}>{option.votes}</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{percentage}%</span>
              </div>
            </button>
          );
        })}
      </div>
      {hasVoted && (
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', textAlign: 'center', marginTop: 'var(--spacing-sm)' }}>
          {t('studentVoice.voted')} • {t('studentVoice.thankYou')}
        </p>
      )}
    </div>
  );
}

function RatingStars({ label, value, onChange, max = 5 }: { label: string; value: number; onChange: (v: number) => void; max?: number }) {
  return (
    <div style={{ marginBottom: 'var(--spacing-md)' }}>
      <label className="label">{label}</label>
      <div style={{ display: 'flex', gap: '4px' }}>
        {[...Array(max)].map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            style={{
              width: '40px', height: '40px', borderRadius: 'var(--radius-sm)',
              background: i < value ? 'var(--color-accent)' : 'var(--color-border)',
              color: i < value ? 'var(--color-dark)' : 'var(--color-text-muted)',
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease', minWidth: 'var(--touch-target)', minHeight: 'var(--touch-target)'
            }}
            aria-label={`${label} ${i + 1} od ${max}`}
            aria-pressed={i < value}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={i < value ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

function SuggestionForm({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    await onSubmit(text.trim());
    setText('');
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)', border: '1px solid var(--color-border)' }}>
      <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text)', marginBottom: 'var(--spacing-md)' }}>{t('studentVoice.suggestion')}</h3>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={t('studentVoice.suggestionPlaceholder')}
        rows={3}
        className="input"
        style={{ resize: 'vertical', minHeight: '80px', fontFamily: 'inherit', marginBottom: 'var(--spacing-sm)' }}
      />
      <button type="submit" className="btn btn-primary" disabled={!text.trim() || submitting} style={{ width: '100%', minHeight: 'var(--touch-target)' }}>
        {submitting ? t('common.loading') : t('studentVoice.submitSuggestion')}
      </button>
    </form>
  );
}

function SuggestionsList() {
  const { suggestions } = useStudentVoiceStore();

  if (suggestions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ marginBottom: 'var(--spacing-sm)', opacity: 0.5 }} aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <p>Nema prijedloga još</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
      {suggestions.map(s => (
        <div key={s.id} style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', marginBottom: 'var(--spacing-xs)' }}>{s.text}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{new Date(s.createdAt).toLocaleDateString('bs-BA')}</span>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-primary)', background: 'rgba(11, 122, 75, 0.1)', padding: '1px 6px', borderRadius: 'var(--radius-full)' }}>
              {s.votes} glasova
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StudentVoiceScreen() {
  const { surveys, loadData, voteSurvey, submitRating, submitSuggestion, votedSurveys } = useStudentVoiceStore();
  const [cleanliness, setCleanliness] = useState(0);
  const [safety, setSafety] = useState(0);
  const [comfort, setComfort] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRatingSubmit = async () => {
    if (!cleanliness || !safety || !comfort) return;
    await submitRating({ cleanliness, safety, comfort, stationId: 'current' });
    setRatingSubmitted(true);
    setTimeout(() => setRatingSubmitted(false), 3000);
  };

  return (
    <div className="student-voice-screen" style={{ padding: 'var(--spacing-md)', paddingBottom: 'calc(var(--nav-height) + var(--safe-area-bottom) + var(--spacing-md))' }}>
      <header style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1 className="section-title" style={{ marginBottom: 'var(--spacing-xs)' }}>{t('studentVoice.title')}</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>{t('home.tiles.studentVoice.description')}</p>
      </header>

      <section aria-labelledby="surveys-heading" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2 id="surveys-heading" className="section-title">{t('studentVoice.surveys')}</h2>
        {surveys.length === 0 ? (
          <p style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>{t('studentVoice.noSurveys')}</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {surveys.map(survey => (
              <SurveyCard
                key={survey.id}
                survey={survey}
                hasVoted={survey.options.some(opt => votedSurveys.has(`${survey.id}:${opt.id}`))}
                onVote={optionId => voteSurvey(survey.id, optionId)}
              />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="ratings-heading" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2 id="ratings-heading" className="section-title">{t('studentVoice.ratings')}</h2>
        <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)', border: '1px solid var(--color-border)' }}>
          <RatingStars label={t('studentVoice.cleanliness')} value={cleanliness} onChange={setCleanliness} />
          <RatingStars label={t('studentVoice.safety')} value={safety} onChange={setSafety} />
          <RatingStars label={t('studentVoice.comfort')} value={comfort} onChange={setComfort} />
          <button className="btn btn-primary" onClick={handleRatingSubmit} disabled={!cleanliness || !safety || !comfort} style={{ width: '100%', minHeight: 'var(--touch-target)' }}>
            {t('studentVoice.submitRating')}
          </button>
          {ratingSubmitted && (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-success)', textAlign: 'center', marginTop: 'var(--spacing-sm)' }}>
              {t('studentVoice.thankYou')}
            </p>
          )}
        </div>
      </section>

      <section aria-labelledby="suggestions-heading" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2 id="suggestions-heading" className="section-title">{t('studentVoice.suggestion')}</h2>
        <SuggestionForm onSubmit={submitSuggestion} />
      </section>

      <section aria-labelledby="suggestions-list-heading">
        <h2 id="suggestions-list-heading" className="section-title" style={{ marginBottom: 'var(--spacing-md)' }}>Svi prijedlozi</h2>
        <SuggestionsList />
      </section>
    </div>
  );
}