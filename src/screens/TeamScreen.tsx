const teamMembers = [
  { name: 'Emina Abaz', photo: 'team/abaz-emina.jpg' },
  { name: 'Irmela Mršo', photo: 'team/mrso-irmela.jpg' },
  { name: 'Denin Jusufranić', photo: 'team/jusufranic-denin.jpg' },
  { name: 'Ema Korać', photo: 'team/korac-ema.jpg' },
  { name: 'Sumeja Ajanović', photo: 'team/ajanovic-sumeja.jpg' }
];

export function TeamScreen() {
  return (
    <div className="team-screen" style={{ padding: 'var(--spacing-md)', paddingBottom: 'calc(var(--nav-height) + var(--safe-area-bottom) + var(--spacing-md))' }}>
      <header style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <h1 className="section-title" style={{ marginBottom: 'var(--spacing-xs)' }}>Naš tim</h1>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 'var(--spacing-lg)',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="card"
            style={{
              padding: 'var(--spacing-lg)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              overflow: 'hidden',
              background: 'var(--color-light)',
              border: '3px solid var(--color-primary)',
              boxShadow: 'var(--shadow-md)'
            }}>
              <img
                src={member.photo}
                alt={member.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%230B7A4B"/%3E%3Ctext x="40" y="45" text-anchor="middle" fill="white" font-size="20" font-family="Arial" font-weight="bold"' + (member.name.charAt(0)) + '%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text)' }}>{member.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}