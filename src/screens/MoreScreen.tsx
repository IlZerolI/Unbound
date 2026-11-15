import { Link } from 'react-router-dom';
import { useAppStore } from '@/stores';
import { t } from '@/i18n/bs';

function MoreScreen() {
  const { userPreferences, setUserPreferences, theme, setTheme, highContrast, setHighContrast, largeText, setLargeText } = useAppStore();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };

  const handleLanguageChange = (language: 'bs' | 'en') => {
    setUserPreferences({ ...userPreferences, language });
  };

  const handleHighContrastChange = (enabled: boolean) => {
    setHighContrast(enabled);
  };

  const handleLargeTextChange = (enabled: boolean) => {
    setLargeText(enabled);
  };

  const sections = [
    {
      title: t('more.sections.appearance'),
      items: [
        {
          label: t('settings.theme'),
          type: 'select' as const,
          value: theme,
          options: [
            { value: 'system', label: t('settings.themeSystem') },
            { value: 'light', label: t('settings.themeLight') },
            { value: 'dark', label: t('settings.themeDark') }
          ],
          onChange: handleThemeChange as (value: string) => void
        },
        {
          label: t('settings.language'),
          type: 'select' as const,
          value: userPreferences.language,
          options: [
            { value: 'bs', label: 'Bosanski' },
            { value: 'en', label: 'English' }
          ],
          onChange: handleLanguageChange as (value: string) => void
        },
        {
          label: t('settings.highContrast'),
          type: 'toggle' as const,
          value: highContrast,
          onChange: handleHighContrastChange as (value: boolean) => void
        },
        {
          label: t('settings.largeText'),
          type: 'toggle' as const,
          value: largeText,
          onChange: handleLargeTextChange as (value: boolean) => void
        }
      ]
    },
    {
      title: t('more.sections.notifications'),
      items: [
        {
          label: t('settings.notifications'),
          type: 'toggle' as const,
          value: userPreferences.notificationsEnabled,
          onChange: ((v: boolean) => setUserPreferences({ ...userPreferences, notificationsEnabled: v })) as (value: boolean) => void
        }
      ]
    },
    {
      title: t('more.sections.about'),
      items: [
        {
          label: t('more.about.version'),
          type: 'info' as const,
          value: 'v0.20.5'
        },
        {
          label: t('more.about.appName'),
          type: 'info' as const,
          value: t('app.name')
        },
        {
          label: t('more.about.description'),
          type: 'info' as const,
          value: t('app.tagline')
        }
      ]
    },
    {
      title: t('more.sections.links'),
      items: [
        {
          label: t('more.links.privacy'),
          type: 'link' as const,
          path: '/settings'
        },
        {
          label: t('more.links.github'),
          type: 'external' as const,
          path: 'https://github.com/IlZerolI/student_stop'
        },
        {
          label: t('more.links.reportIssue'),
          type: 'external' as const,
          path: 'https://github.com/IlZerolI/student_stop/issues'
        }
      ]
    }
  ];

  return (
    <div className="more-screen" style={{ padding: 'var(--spacing-md)', paddingBottom: 'calc(var(--nav-height) + var(--safe-area-bottom) + var(--spacing-md))' }}>
      <h1 className="section-title" style={{ marginBottom: 'var(--spacing-lg)' }}>{t('nav.more')}</h1>

      {sections.map((section, sectionIndex) => (
        <section key={section.title} style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--spacing-md)' }}>{section.title}</h2>
          <div className="card" style={{ overflow: 'hidden' }}>
            {section.items.map((item, itemIndex) => (
              <div key={`${sectionIndex}-${itemIndex}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-md)', borderBottom: itemIndex < section.items.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 'var(--text-base)', fontWeight: 500, color: 'var(--color-text)' }}>{item.label}</p>
                  {item.type === 'info' && (
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: '2px' }}>{item.value}</p>
                  )}
                </div>
                {item.type === 'select' && (
                  <select
                    value={item.value}
                    onChange={(e) => item.onChange(e.target.value as 'light' | 'dark' | 'system' | 'bs' | 'en')}
                    className="input"
                    style={{ width: 'auto', minWidth: '140px', paddingRight: '32px', fontSize: 'var(--text-sm)' }}
                  >
                    {item.options.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                )}
                {item.type === 'toggle' && (
                  <label style={{ position: 'relative', width: '48px', height: '28px', flexShrink: 0 }}>
                    <input
                      type="checkbox"
                      checked={item.value}
                      onChange={(e) => item.onChange(e.target.checked)}
                      style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                    />
                    <span style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      background: item.value ? 'var(--color-primary)' : 'var(--color-border)',
                      borderRadius: 'var(--radius-full)', transition: 'background 0.2s ease',
                      cursor: 'pointer'
                    }}>
                      <span style={{
                        position: 'absolute', top: '2px', left: item.value ? '24px' : '2px',
                        width: '24px', height: '24px', background: 'var(--color-white)',
                        borderRadius: '50%', boxShadow: 'var(--shadow-sm)',
                        transition: 'left 0.2s ease'
                      }} />
                    </span>
                  </label>
                )}
                {item.type === 'link' && (
                  <Link to={item.path} style={{ color: 'var(--color-primary)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                    {t('common.open')} →
                  </Link>
                )}
                {item.type === 'external' && (
                  <a href={item.path} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                    {t('common.open')} →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
        <p>{t('app.name')} &copy; 2024</p>
        <p style={{ marginTop: 'var(--spacing-xs)' }}>Made with ❤️ for Sarajevo</p>
      </div>
    </div>
  );
}

export { MoreScreen };