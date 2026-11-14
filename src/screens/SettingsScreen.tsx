import { useState, useEffect } from 'react';
import { useAppStore } from '@/stores';
import { t } from '@/i18n/bs';

export function SettingsScreen() {
  const { userPreferences, setUserPreferences, setTheme, setHighContrast, setLargeText, theme, highContrast, largeText } = useAppStore();
  const [notifyEnabled, setNotifyEnabled] = useState(false);

  useEffect(() => {
    setNotifyEnabled(userPreferences.notificationsEnabled);
    if ('Notification' in window) {
      setNotifyEnabled(Notification.permission === 'granted');
    }
  }, [userPreferences.notificationsEnabled]);

  const handleNotifyToggle = async () => {
    if (!('Notification' in window)) {
      alert('Obavijesti nisu podržane u ovom pregledniku.');
      return;
    }
    if (Notification.permission === 'granted') {
      setNotifyEnabled(false);
      await setUserPreferences({ notificationsEnabled: false });
    } else if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotifyEnabled(permission === 'granted');
      await setUserPreferences({ notificationsEnabled: permission === 'granted' });
    } else {
      alert(t('bus.notifyInfo'));
    }
  };

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    await setTheme(newTheme);
  };

  return (
    <div className="settings-screen" style={{ padding: 'var(--spacing-md)', paddingBottom: 'calc(var(--nav-height) + var(--safe-area-bottom) + var(--spacing-md))' }}>
      <header style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h1 className="section-title" style={{ marginBottom: 'var(--spacing-xs)' }}>{t('settings.title')}</h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Prilagodite aplikaciju svojim potrebama</p>
      </header>

      <section aria-labelledby="appearance-heading" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2 id="appearance-heading" className="section-title">{t('settings.theme')}</h2>
        <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
            {(['light', 'dark', 'system'] as const).map(tm => (
              <button
                key={tm}
                type="button"
                onClick={() => handleThemeChange(tm)}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)', borderRadius: 'var(--radius-full)',
                  border: `2px solid ${theme === tm ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  background: theme === tm ? 'rgba(11, 122, 75, 0.1)' : 'transparent',
                  color: theme === tm ? 'var(--color-primary)' : 'var(--color-text)',
                  fontWeight: theme === tm ? 600 : 500,
                  fontSize: 'var(--text-sm)', minHeight: 'var(--touch-target)',
                  cursor: 'pointer', transition: 'all 0.2s ease'
                }}
                aria-pressed={theme === tm}
              >
                {t(`settings.${tm}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="accessibility-heading" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2 id="accessibility-heading" className="section-title">{t('settings.largeText')} / {t('settings.highContrast')}</h2>
        <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', minHeight: 'var(--touch-target)' }}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text)' }}>{t('settings.largeText')}</span>
            <button
              role="switch"
              aria-checked={largeText}
              onClick={() => setLargeText(!largeText)}
              style={{
                width: '48px', height: '28px', borderRadius: 'var(--radius-full)',
                background: largeText ? 'var(--color-primary)' : 'var(--color-border)',
                border: 'none', position: 'relative', cursor: 'pointer', flexShrink: 0,
                transition: 'background 0.2s ease'
              }}
            >
              <span style={{
                position: 'absolute', top: '2px', left: largeText ? '24px' : '2px',
                width: '24px', height: '24px', borderRadius: '50%',
                background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                transition: 'left 0.2s ease'
              }} />
            </button>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', minHeight: 'var(--touch-target)' }}>
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text)' }}>{t('settings.highContrast')}</span>
            <button
              role="switch"
              aria-checked={highContrast}
              onClick={() => setHighContrast(!highContrast)}
              style={{
                width: '48px', height: '28px', borderRadius: 'var(--radius-full)',
                background: highContrast ? 'var(--color-primary)' : 'var(--color-border)',
                border: 'none', position: 'relative', cursor: 'pointer', flexShrink: 0,
                transition: 'background 0.2s ease'
              }}
            >
              <span style={{
                position: 'absolute', top: '2px', left: highContrast ? '24px' : '2px',
                width: '24px', height: '24px', borderRadius: '50%',
                background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                transition: 'left 0.2s ease'
              }} />
            </button>
          </label>
        </div>
      </section>

      <section aria-labelledby="notifications-heading" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2 id="notifications-heading" className="section-title">{t('settings.notifications')}</h2>
        <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)', border: '1px solid var(--color-border)' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', minHeight: 'var(--touch-target)' }}>
            <div>
              <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text)' }}>{t('bus.notifyMe')}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Primajte obavijesti o dolasku autobusa</p>
            </div>
            <button
              role="switch"
              aria-checked={notifyEnabled}
              onClick={handleNotifyToggle}
              style={{
                width: '48px', height: '28px', borderRadius: 'var(--radius-full)',
                background: notifyEnabled ? 'var(--color-primary)' : 'var(--color-border)',
                border: 'none', position: 'relative', cursor: 'pointer', flexShrink: 0,
                transition: 'background 0.2s ease'
              }}
            >
              <span style={{
                position: 'absolute', top: '2px', left: notifyEnabled ? '24px' : '2px',
                width: '24px', height: '24px', borderRadius: '50%',
                background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                transition: 'left 0.2s ease'
              }} />
            </button>
          </label>
        </div>
      </section>

      <section aria-labelledby="privacy-heading" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h2 id="privacy-heading" className="section-title">{t('settings.privacy')}</h2>
        <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', lineHeight: 1.6, marginBottom: 'var(--spacing-md)' }}>
            {t('settings.dataStoredLocally')}
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Lokacija se koristi samo za prikaz najbližih stanica i ne šalje se nikakvom serveru.
            Prijave problema i glasovi u anketama ostaju isključivo na vašem uređaju.
          </p>
        </div>
      </section>

      <section aria-labelledby="about-heading">
        <h2 id="about-heading" className="section-title">{t('settings.about')}</h2>
        <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none" aria-hidden="true" style={{ marginBottom: 'var(--spacing-sm)', margin: '0 auto var(--spacing-sm)' }}>
            <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
            <path d="M8 16L14 22L24 10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--spacing-xs)' }}>{t('app.name')}</h3>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-md)' }}>{t('app.tagline')}</p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{t('settings.version')} 1.0.0</p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--spacing-sm)' }}>
            Napravljeno za srednjoškolce u BiH ❤️
          </p>
        </div>
      </section>
    </div>
  );
}