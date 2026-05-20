// wireframe-primitives.jsx
// Tiny library for building sketchy-but-legible wireframes.

const Frame = ({ children, style, mobile, label, sub, scrollable }) => (
  <div className={"wf-frame wf-rough" + (mobile ? " wf-mobile" : "") + (scrollable ? " wf-scroll" : "")} style={style}>
    {label && (
      <div style={{position:'absolute',left:14,top:10,zIndex:5,display:'flex',alignItems:'baseline',gap:8,pointerEvents:'none'}}>
        <span className="wf-frame-title">{label}</span>
        {sub && <span style={{fontSize:11,color:'var(--wf-ink-3)'}}>{sub}</span>}
      </div>
    )}
    {children}
  </div>
);

// Sketchy box that gets the wobble in sketchy mode
const Box = ({ children, style, variant, dashed, className }) => (
  <div className={"wf-box wf-rough " + (variant || "") + (dashed ? " dashed" : "") + (className ? " " + className : "")} style={style}>
    {children}
  </div>
);

const Btn = ({ children, variant, size, style, icon }) => (
  <span className={"wf-btn wf-rough " + (variant || "") + (size ? " " + size : "")} style={style}>
    {icon && <span style={{fontFamily:'var(--wf-mono)',fontWeight:700}}>{icon}</span>}
    {children}
  </span>
);

const Input = ({ label, placeholder, value, style, required, hint, error, type }) => (
  <div style={{display:'flex',flexDirection:'column',gap:6,...style}}>
    {label && (
      <label style={{font:'600 11px var(--wf-sans)',color:'var(--wf-ink-2)',display:'flex',gap:6,alignItems:'center'}}>
        {label}{required && <span style={{color:'var(--wf-accent)'}}>*</span>}
      </label>
    )}
    <div className="wf-input wf-rough" style={error ? {borderColor:'var(--wf-accent)'} : null}>
      {value
        ? <span style={{color:'var(--wf-ink)'}}>{value}</span>
        : <span style={{color:'var(--wf-ink-3)'}}>{placeholder || ' '}</span>}
      <span style={{flex:1}} />
      {type === 'password' && <span className="wf-mono" style={{color:'var(--wf-ink-3)',fontSize:11}}>👁</span>}
    </div>
    {error && <span style={{fontSize:11,color:'var(--wf-accent)'}}>{error}</span>}
    {hint && !error && <span style={{fontSize:11,color:'var(--wf-ink-3)'}}>{hint}</span>}
  </div>
);

const Avatar = ({ size, initials, style }) => (
  <span className="wf-avatar wf-rough" style={{width:size||28,height:size||28,fontSize:(size||28)*0.36,...style}}>
    {initials || ''}
  </span>
);

const Logo = ({ initials, size, style }) => (
  <span className="wf-logo wf-rough" style={{width:size||32,height:size||32,fontSize:(size||32)*0.4,...style}}>
    {initials || 'L'}
  </span>
);

// Diagonal-stripe placeholder. Used everywhere imagery would go.
const Img = ({ label, h, w, style, ratio, round }) => (
  <div className="wf-img wf-rough" style={{
    height: h || (ratio ? undefined : 120),
    width: w || '100%',
    aspectRatio: ratio,
    borderRadius: round ? 99 : 3,
    ...style
  }}>
    {label || 'image'}
  </div>
);

// Text bars to suggest paragraph runs without committing to copy
const TextLines = ({ lines, w, style }) => (
  <div className="wf-textblock" style={{width: w || '100%', ...style}}>
    {Array.from({length: lines || 3}).map((_, i) => (
      <span key={i} className={i === (lines||3)-1 ? 'wf-line-3' : (i === 0 ? 'wf-line-1' : 'wf-line-2')} />
    ))}
  </div>
);

const Chip = ({ children, variant, style }) => (
  <span className={"wf-chip " + (variant || "")} style={style}>{children}</span>
);

const Badge = ({ children, variant, style }) => (
  <span className={"wf-badge " + (variant || "")} style={style}>{children}</span>
);

// Floating handwritten annotation tied to a coordinate inside the frame
const Annot = ({ n, x, y, w, children, align }) => (
  <div className="wf-annot" style={{
    left: align === 'right' ? undefined : x,
    right: align === 'right' ? x : undefined,
    top: y, width: w || 180, textAlign: align === 'right' ? 'right' : 'left'
  }}>
    {n != null && <span className="pin">{n}</span>}
    {children}
  </div>
);

// Generic "Lorestack" wordmark used in all chromes (kept text-based — no real logo)
const Wordmark = ({ size }) => (
  <span style={{font:`700 ${size||18}px var(--wf-serif)`,letterSpacing:'-.3px',color:'var(--wf-ink)'}}>
    Lorestack<span style={{color:'var(--wf-accent)'}}>.</span>
  </span>
);

// Slack-style command search bar — wide, centered, always visible. Click → opens
// SearchModal. Renders as a single row with a clear visual hierarchy:
//   [⌕]   Search Lorestack — blogs, companies, people, tags…   [⌘ K]
const SearchBar = ({ style }) => (
  <div className="wf-rough" style={{
    display:'flex',alignItems:'center',gap:10,
    padding:'7px 12px',
    border:'var(--wf-stroke-w) solid var(--wf-line)',
    background:'var(--wf-fill)',
    borderRadius:6,
    color:'var(--wf-ink-3)',
    fontSize:13,
    cursor:'text',
    ...style
  }}>
    <span style={{fontFamily:'var(--wf-mono)',fontSize:14,color:'var(--wf-ink-2)'}}>⌕</span>
    <span style={{flex:1}}>Search Lorestack — blogs, companies, people, tags…</span>
    <span style={{display:'flex',gap:3,fontFamily:'var(--wf-mono)',fontSize:10,color:'var(--wf-ink-3)'}}>
      <span style={{border:'1px solid var(--wf-line-soft)',borderRadius:3,padding:'1px 5px',background:'var(--wf-bg)'}}>⌘</span>
      <span style={{border:'1px solid var(--wf-line-soft)',borderRadius:3,padding:'1px 5px',background:'var(--wf-bg)'}}>K</span>
    </span>
  </div>
);

// Top nav — wordmark left, wide search bar dead-center, account/CTA right.
const TopNav = ({ loggedIn, active }) => (
  <div style={{display:'grid',gridTemplateColumns:'auto 1fr auto',alignItems:'center',gap:24,padding:'10px 24px',borderBottom:'var(--wf-stroke-w) solid var(--wf-line)',background:'var(--wf-bg)'}}>
    {/* Left: wordmark + tabs */}
    <div style={{display:'flex',alignItems:'center',gap:22}}>
      <Wordmark />
      <div style={{display:'flex',gap:18,fontSize:13,color:'var(--wf-ink-2)'}}>
        {['Explore','Tags','Companies'].map(t => (
          <span key={t} style={{fontWeight: active===t ? 600 : 400, color: active===t ? 'var(--wf-ink)' : 'inherit', borderBottom: active===t ? '2px solid var(--wf-accent)' : 'none', paddingBottom:2}}>{t}</span>
        ))}
      </div>
    </div>

    {/* Center: wide search */}
    <div style={{maxWidth:520,width:'100%',margin:'0 auto'}}>
      <SearchBar />
    </div>

    {/* Right: account / CTAs */}
    <div style={{display:'flex',alignItems:'center',gap:10}}>
      {loggedIn ? (
        <>
          <span style={{fontSize:16,color:'var(--wf-ink-2)',cursor:'pointer'}} title="Notifications">⌗</span>
          <Btn variant="primary" size="sm">+ Write</Btn>
          <Avatar initials="ZK" size={28} />
        </>
      ) : (
        <>
          <Btn variant="ghost" size="sm">Log in</Btn>
          <Btn variant="accent" size="sm">Sign up</Btn>
        </>
      )}
    </div>
  </div>
);

// Search results modal — opens on click of TopNav search or ⌘K.
// Shows grouped results: blogs · companies · people · tags. Keyboardable.
const SearchModal = ({ query }) => {
  const q = query || 'postgres';
  return (
    <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.45)',display:'flex',justifyContent:'center',paddingTop:80,zIndex:8}}>
      <div className="wf-box wf-rough" style={{width:640,maxHeight:'min(560px, 80%)',display:'flex',flexDirection:'column',background:'var(--wf-bg)',overflow:'hidden'}}>
        {/* Input header */}
        <div style={{display:'flex',alignItems:'center',gap:10,padding:'14px 18px',borderBottom:'1px solid var(--wf-line-soft)'}}>
          <span style={{fontFamily:'var(--wf-mono)',fontSize:18,color:'var(--wf-ink-2)'}}>⌕</span>
          <input style={{flex:1,border:'none',outline:'none',background:'transparent',font:'400 18px var(--wf-serif)',color:'var(--wf-ink)'}} defaultValue={q}/>
          <span className="wf-mono" style={{fontSize:10,color:'var(--wf-ink-3)',border:'1px solid var(--wf-line-soft)',padding:'2px 6px',borderRadius:3}}>esc</span>
        </div>

        <div style={{flex:1,overflow:'auto'}}>
          {/* Filter row */}
          <div style={{display:'flex',gap:6,padding:'10px 18px',borderBottom:'1px solid var(--wf-line-soft)'}}>
            <Chip variant="solid">All · 248</Chip>
            <Chip>Blogs · 186</Chip>
            <Chip>Companies · 14</Chip>
            <Chip>People · 32</Chip>
            <Chip>Tags · 16</Chip>
          </div>

          {/* Groups */}
          {[
            { kind:'Blogs', icon:'◆', items:[
              ['How we cut p99 latency from 800ms → 120ms','Aurora Labs · Zara Khan · postmortem'],
              ['Three things Postgres taught us this year','Hexa.io · Mei Lin · architecture'],
              ['The boring postgres migration that wasn\'t','Aurora Labs · Zara Khan · case study'],
            ]},
            { kind:'Companies', icon:'◧', items:[
              ['Postgres.fm','Podcast company · 14 posts'],
              ['PgVerge','Database tooling · 6 posts'],
            ]},
            { kind:'People', icon:'☺', items:[
              ['Zara Khan · @zarakhan','Distributed systems @ Aurora'],
              ['Postgres Mike · @pgmike','Loud opinions, mostly correct'],
            ]},
            { kind:'Tags', icon:'#', items:[
              ['#postgres','186 articles'],
              ['#postgresql','3 articles · suggested merge → #postgres'],
            ]},
          ].map((g,i) => (
            <div key={g.kind}>
              <div style={{display:'flex',justifyContent:'space-between',padding:'10px 18px 4px',background:'var(--wf-fill)'}}>
                <span className="wf-eyebrow">{g.kind}</span>
                <span style={{fontSize:11,color:'var(--wf-accent)'}}>See all →</span>
              </div>
              {g.items.map((it,j) => (
                <div key={j} style={{display:'flex',gap:12,padding:'10px 18px',borderBottom:'1px solid var(--wf-line-soft)',background: i===0&&j===0 ? 'var(--wf-fill-2)' : 'transparent',alignItems:'center'}}>
                  <span style={{width:28,height:28,display:'inline-flex',alignItems:'center',justifyContent:'center',border:'1px solid var(--wf-line)',borderRadius:4,fontFamily:'var(--wf-mono)',fontSize:13,color:'var(--wf-ink-2)',background:'var(--wf-bg)'}}>{g.icon}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontFamily:'var(--wf-serif)',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{it[0]}</div>
                    <div className="wf-muted" style={{fontSize:11,marginTop:2}}>{it[1]}</div>
                  </div>
                  {i===0&&j===0 && <span className="wf-mono" style={{fontSize:10,color:'var(--wf-ink-3)',border:'1px solid var(--wf-line-soft)',padding:'2px 6px',borderRadius:3}}>↵</span>}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer keyboard hints */}
        <div style={{display:'flex',gap:14,alignItems:'center',padding:'10px 18px',borderTop:'1px solid var(--wf-line-soft)',background:'var(--wf-fill)',fontSize:11,color:'var(--wf-ink-3)',fontFamily:'var(--wf-mono)'}}>
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>⌘↵ open in new tab</span>
          <span style={{flex:1}}/>
          <span>powered by /search · view all 248 →</span>
        </div>
      </div>
    </div>
  );
};

// Sidebar used in dashboard / company dashboard
const Sidebar = ({ items, active, footer }) => (
  <div style={{width:200,borderRight:'var(--wf-stroke-w) solid var(--wf-line)',padding:'16px 12px',display:'flex',flexDirection:'column',gap:4,background:'var(--wf-bg)'}}>
    {items.map(it => {
      if (it.heading) return <div key={it.heading} className="wf-eyebrow" style={{margin:'12px 8px 4px'}}>{it.heading}</div>;
      const on = it.label === active;
      return (
        <div key={it.label} style={{
          padding:'7px 10px',borderRadius:4,fontSize:13,
          background: on ? 'var(--wf-fill)' : 'transparent',
          color: on ? 'var(--wf-ink)' : 'var(--wf-ink-2)',
          fontWeight: on ? 600 : 400,
          display:'flex',alignItems:'center',gap:8,
          borderLeft: on ? '2px solid var(--wf-accent)' : '2px solid transparent'
        }}>
          <span style={{fontFamily:'var(--wf-mono)',color:'var(--wf-ink-3)',fontSize:11}}>{it.icon}</span>
          {it.label}
          {it.count != null && <span style={{marginLeft:'auto',fontSize:11,color:'var(--wf-ink-3)'}}>{it.count}</span>}
        </div>
      );
    })}
    <div style={{flex:1}} />
    {footer}
  </div>
);

// Modal scaffolding shown overlaid on a faded page bg
const Modal = ({ children, style, w }) => (
  <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.35)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:8}}>
    <div className="wf-box wf-rough" style={{width:w||420,background:'var(--wf-bg)',padding:22,...style}}>{children}</div>
  </div>
);

Object.assign(window, { Frame, Box, Btn, Input, Avatar, Logo, Img, TextLines, Chip, Badge, Annot, Wordmark, TopNav, SearchBar, SearchModal, Sidebar, Modal });
