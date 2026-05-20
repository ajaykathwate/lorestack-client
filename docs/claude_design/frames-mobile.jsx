// frames-mobile.jsx — Mobile companions for key screens

const MStatusBar = () => (
  <div className="wf-statusbar">
    <span>9:41</span>
    <span style={{fontFamily:'var(--wf-mono)'}}>•••  ▮▮▮</span>
  </div>
);

const MTopBar = ({ title, back, action, logo }) => (
  <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 14px',borderBottom:'1px solid var(--wf-line-soft)'}}>
    {back && <span style={{fontSize:18,color:'var(--wf-ink-2)'}}>‹</span>}
    {logo && <Wordmark size={15}/>}
    {title && <span style={{flex:1,font:'600 14px var(--wf-serif)'}}>{title}</span>}
    {!title && <span style={{flex:1}}/>}
    {action || <span style={{fontSize:18,color:'var(--wf-ink-2)'}}>≡</span>}
  </div>
);

const MTabBar = ({ active }) => (
  <div style={{display:'flex',padding:'8px 0 16px',borderTop:'1px solid var(--wf-line-soft)',background:'var(--wf-bg)'}}>
    {[['⌂','Home'],['⌕','Explore'],['+','Write'],['◔','Saved'],['☺','You']].map(([i,l]) => (
      <div key={l} style={{flex:1,textAlign:'center',fontSize:10,color:l===active?'var(--wf-ink)':'var(--wf-ink-3)',fontWeight:l===active?600:400}}>
        <div style={{fontFamily:'var(--wf-mono)',fontSize:18,marginBottom:2,color:l===active?'var(--wf-accent)':'var(--wf-ink-2)'}}>{i}</div>
        {l}
      </div>
    ))}
  </div>
);

// 01M · Sign up mobile
const MSignUp = () => (
  <Frame mobile label="01M · Sign up" sub="mobile">
    <MStatusBar/>
    <div style={{padding:'18px 20px',display:'flex',flexDirection:'column',gap:14,height:'100%'}}>
      <Wordmark size={20}/>
      <span className="wf-eyebrow" style={{marginTop:14}}>Welcome</span>
      <h1 className="wf-h2" style={{fontSize:22}}>Create your account.</h1>
      <Btn>G · Continue with Google</Btn>
      <div style={{display:'flex',alignItems:'center',gap:8,fontSize:10,color:'var(--wf-ink-3)',margin:'2px 0'}}>
        <span style={{flex:1,height:1,background:'var(--wf-line-soft)'}}/>OR<span style={{flex:1,height:1,background:'var(--wf-line-soft)'}}/>
      </div>
      <Input label="Full name" required placeholder="Zara Khan"/>
      <Input label="Email" required placeholder="you@studio.dev"/>
      <Input label="Password" required placeholder="••••••••" hint="Min 8 characters" type="password"/>
      <Btn variant="primary" size="lg" style={{marginTop:6}}>Create account</Btn>
      <span style={{textAlign:'center',fontSize:11,color:'var(--wf-ink-2)',marginTop:'auto',paddingBottom:6}}>
        Have an account? <span style={{color:'var(--wf-accent)',textDecoration:'underline'}}>Log in</span>
      </span>
    </div>
  </Frame>
);

// 04M · Onboarding mobile
const MOnboarding = () => (
  <Frame mobile label="04M · Onboarding" sub="mobile">
    <MStatusBar/>
    <div style={{padding:'18px 20px',display:'flex',flexDirection:'column',gap:14,height:'100%'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <Wordmark size={18}/><span className="wf-muted" style={{fontSize:11}}>Skip</span>
      </div>
      <span className="wf-eyebrow" style={{marginTop:18}}>Welcome to Lorestack</span>
      <h2 className="wf-h2" style={{fontSize:20}}>How should we introduce you?</h2>
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8,marginTop:8}}>
        <Avatar size={80} initials="?"/>
        <Btn size="sm" variant="ghost">Upload photo</Btn>
      </div>
      <Input label="Display name" required value="Zara Khan"/>
      <Input label="Short bio (optional)" placeholder="Distributed systems @ Aurora..." hint="200 char max"/>
      <Btn variant="primary" size="lg" style={{marginTop:'auto'}}>Go to Lorestack →</Btn>
    </div>
  </Frame>
);

// 06M · Dashboard mobile
const MDashboard = () => (
  <Frame mobile label="06M · Dashboard" sub="mobile">
    <MStatusBar/>
    <MTopBar logo action={<Avatar size={24} initials="ZK"/>}/>
    <div style={{padding:'14px 16px',display:'flex',flexDirection:'column',gap:12,overflow:'auto',flex:1}}>
      <span className="wf-eyebrow">Tuesday</span>
      <h2 className="wf-h2" style={{fontSize:20,margin:0}}>Good morning, Zara.</h2>
      <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:4}}>
        <Btn variant="accent" size="sm">+ Write</Btn>
        <Btn size="sm">Drafts (3)</Btn>
        <Btn size="sm">Scheduled (2)</Btn>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        {[['Published','12'],['Reads 30d','24.1k']].map(([k,v]) => (
          <Box key={k} style={{padding:10}}>
            <div className="wf-eyebrow">{k}</div>
            <div style={{font:'600 18px var(--wf-serif)',marginTop:4}}>{v}</div>
          </Box>
        ))}
      </div>
      <div style={{display:'flex',gap:6,marginTop:4}}>
        <Chip variant="solid">All</Chip><Chip>Aurora</Chip><Chip>Personal</Chip>
      </div>
      {[1,2,3].map(i => (
        <Box key={i} style={{padding:0,overflow:'hidden'}}>
          <Img label="" h={90}/>
          <div style={{padding:10}}>
            <Badge style={{fontSize:9}}>Postmortem</Badge>
            <div style={{font:'600 13px var(--wf-serif)',marginTop:6,lineHeight:1.3}}>How we cut p99 latency from 800ms → 120ms</div>
            <div className="wf-muted" style={{fontSize:10,marginTop:4}}>Aurora · May 16 · 4.2k reads</div>
          </div>
        </Box>
      ))}
    </div>
    <MTabBar active="Home"/>
  </Frame>
);

// 05M · Editor mobile
const MEditor = () => (
  <Frame mobile label="05M · Editor" sub="mobile · focus mode">
    <MStatusBar/>
    <div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 14px',borderBottom:'1px solid var(--wf-line-soft)'}}>
      <span style={{fontSize:16,color:'var(--wf-ink-2)'}}>‹</span>
      <span style={{flex:1,fontSize:11,color:'var(--wf-accent)'}}>• Saved</span>
      <Btn size="sm">Preview</Btn>
      <Btn size="sm" variant="primary">Publish</Btn>
    </div>
    <div style={{padding:'14px 16px',flex:1,overflow:'auto',display:'flex',flexDirection:'column',gap:10}}>
      <div style={{display:'flex',gap:6}}>
        <Badge variant="accent">Postmortem</Badge>
        <Chip>Aurora ▾</Chip>
      </div>
      <div style={{font:'700 22px var(--wf-serif)',lineHeight:1.1}}>How we cut p99 latency from 800ms → 120ms</div>
      <div style={{borderTop:'1px dashed var(--wf-line-soft)',paddingTop:8,color:'var(--wf-ink-3)',fontStyle:'italic',fontSize:12}}>A walkthrough of Aurora's checkout dropping p99…</div>
      <p className="wf-serif" style={{fontSize:14,margin:0,lineHeight:1.6}}>In Q4 our checkout p99 crept past 800ms. SLO budget was burning by lunch...</p>
      <TextLines lines={4}/>
      <Box variant="tint" style={{padding:10,fontFamily:'var(--wf-mono)',fontSize:11}}>
        $ perf record -F 99 -p $(pgrep checkout) -g
      </Box>
      <TextLines lines={3}/>
    </div>
    {/* sticky toolbar */}
    <Box variant="tint" className="wf-rough" style={{margin:'0 12px 10px',padding:'6px 10px',display:'flex',gap:10,alignItems:'center',fontSize:13,color:'var(--wf-ink-2)'}}>
      <span style={{fontWeight:700}}>B</span><span style={{fontStyle:'italic'}}>I</span><span>H1</span><span className="wf-mono">{'<>'}</span><span>↗</span><span>img</span>
      <span style={{flex:1}}/>
      <span className="wf-muted" style={{fontSize:10}}>1,284 w</span>
    </Box>
  </Frame>
);

// 07M · Homepage mobile
const MHomepage = () => (
  <Frame mobile label="07M · Homepage" sub="mobile · logged out">
    <MStatusBar/>
    <MTopBar logo action={<Btn size="sm" variant="accent">Sign up</Btn>}/>
    <div style={{padding:'14px 16px',flex:1,overflow:'auto',display:'flex',flexDirection:'column',gap:14}}>
      <span className="wf-eyebrow">A home for engineering stories</span>
      <h1 className="wf-h1" style={{fontSize:26,lineHeight:1.1,margin:0}}>Long-form writing for the people who actually ship.</h1>
      <div style={{display:'flex',gap:6,overflowX:'auto'}}>
        <Chip variant="solid">Trending</Chip><Chip>Engineering</Chip><Chip>Postmortem</Chip><Chip>Founder note</Chip>
      </div>
      <Box style={{padding:0,overflow:'hidden'}}>
        <Img label="cover" h={140}/>
        <div style={{padding:12}}>
          <Badge variant="accent">Architecture</Badge>
          <h2 className="wf-h2" style={{fontSize:18,marginTop:8}}>How we cut p99 latency from 800ms → 120ms</h2>
          <div className="wf-muted" style={{fontSize:10,marginTop:6,display:'flex',alignItems:'center',gap:5}}>
            <Avatar size={14} initials="ZK"/>Zara · Aurora · May 16 · 8 min
          </div>
        </div>
      </Box>
      {[1,2,3].map(i => (
        <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 80px',gap:10,paddingTop:i?12:0,borderTop:i?'1px solid var(--wf-line-soft)':'none'}}>
          <div>
            <Badge style={{fontSize:9}}>{['Case study','Tutorial','Postmortem'][i-1]}</Badge>
            <div style={{font:'600 13px var(--wf-serif)',marginTop:6,lineHeight:1.3}}>
              {['Rewriting our billing pipeline live','A pragmatic guide to feature flags','3 hours of cascading Redis failover'][i-1]}
            </div>
            <div className="wf-muted" style={{fontSize:10,marginTop:4}}>Aurora · {16-i*2}d ago</div>
          </div>
          <Img label="" h={70}/>
        </div>
      ))}
    </div>
    <MTabBar active="Home"/>
  </Frame>
);

// 08M · Blog reading mobile
const MBlogReading = () => (
  <Frame mobile label="08M · Reading" sub="mobile · /blog/[slug]">
    <MStatusBar/>
    <div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 14px',borderBottom:'1px solid var(--wf-line-soft)'}}>
      <span style={{fontSize:18,color:'var(--wf-ink-2)'}}>‹</span>
      <Wordmark size={14}/>
      <span style={{flex:1}}/>
      <span style={{fontSize:14,color:'var(--wf-ink-2)'}}>↗</span>
      <span style={{fontSize:14,color:'var(--wf-ink-2)'}}>◔</span>
    </div>
    <div style={{padding:'14px 18px',flex:1,overflow:'auto',display:'flex',flexDirection:'column',gap:10}}>
      <Badge variant="accent">Postmortem</Badge>
      <h1 className="wf-h1" style={{fontSize:24,lineHeight:1.1,margin:0}}>How we cut p99 latency from 800ms → 120ms</h1>
      <p className="wf-serif wf-muted2" style={{fontSize:14,lineHeight:1.4,margin:0}}>A walkthrough of how Aurora's checkout team dropped p99 in three weeks.</p>
      <div style={{display:'flex',gap:8,alignItems:'center',paddingTop:8,paddingBottom:8,borderTop:'1px solid var(--wf-line-soft)',borderBottom:'1px solid var(--wf-line-soft)'}}>
        <Avatar size={28} initials="ZK"/>
        <div style={{flex:1}}>
          <div style={{fontSize:12,fontWeight:600}}>Zara Khan</div>
          <div className="wf-muted" style={{fontSize:10}}>Aurora · May 16 · 8 min</div>
        </div>
        <Btn size="sm">+ Follow</Btn>
      </div>
      <Img label="cover" h={160}/>
      <p className="wf-serif" style={{fontSize:15,lineHeight:1.65,margin:'8px 0 0'}}>
        In Q4 our checkout p99 crept past 800ms. SLO budget was burning by lunch. Below is what we tried, what failed, and the one config flip that actually moved the needle.
      </p>
      <h3 className="wf-h2" style={{fontSize:18}}>The problem</h3>
      <TextLines lines={3}/>
      <Box variant="tint" style={{padding:10,fontFamily:'var(--wf-mono)',fontSize:11}}>
        $ perf record -F 99 -p $(pgrep checkout) -g
      </Box>
      <TextLines lines={3}/>
    </div>
  </Frame>
);

// 09M · Author profile mobile
const MAuthorProfile = () => (
  <Frame mobile label="09M · Author" sub="mobile · /author/[u]">
    <MStatusBar/>
    <MTopBar back action={<span style={{fontSize:14,color:'var(--wf-ink-2)'}}>↗</span>}/>
    <div style={{padding:'14px 18px',display:'flex',flexDirection:'column',gap:12,flex:1,overflow:'auto'}}>
      <Avatar size={72} initials="ZK" style={{alignSelf:'flex-start'}}/>
      <div>
        <h1 className="wf-h1" style={{fontSize:22,margin:0}}>Zara Khan</h1>
        <div className="wf-mono wf-muted" style={{fontSize:11,marginTop:2}}>@zarakhan · 1.2k followers</div>
      </div>
      <p className="wf-serif wf-muted2" style={{fontSize:13,margin:0,lineHeight:1.5}}>
        Distributed systems @ Aurora. ex-Stripe. Writing about postgres, latency budgets, and the boring engineering that ships products.
      </p>
      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
        {['distributed','postgres','observability'].map(t => <Chip key={t}>{t}</Chip>)}
      </div>
      <div style={{display:'flex',gap:8}}>
        <Btn variant="accent" style={{flex:1}}>+ Follow</Btn>
        <Btn>↗</Btn>
      </div>
      <div className="wf-eyebrow" style={{marginTop:8}}>Writing for</div>
      <div style={{display:'flex',gap:8}}>
        {['Aurora Labs','Hexa.io'].map(c => (
          <Box key={c} style={{padding:'6px 10px',display:'flex',gap:6,alignItems:'center'}}>
            <Logo initials={c[0]} size={20}/><span style={{fontSize:11,fontWeight:600}}>{c}</span>
          </Box>
        ))}
      </div>
      <div className="wf-eyebrow" style={{marginTop:8}}>Articles · 12</div>
      {[1,2,3].map(i => (
        <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 70px',gap:10,paddingTop:i?12:0,borderTop:i?'1px solid var(--wf-line-soft)':'none'}}>
          <div>
            <Badge style={{fontSize:9}}>Postmortem</Badge>
            <div style={{font:'600 12px var(--wf-serif)',marginTop:4,lineHeight:1.3}}>How we cut p99 latency from 800ms → 120ms</div>
            <div className="wf-muted" style={{fontSize:10,marginTop:4}}>Aurora · May {16-i}</div>
          </div>
          <Img label="" h={60}/>
        </div>
      ))}
    </div>
  </Frame>
);

// 14M · Public company page mobile
const MCompany = () => (
  <Frame mobile label="14M · Company" sub="mobile · /company/[h]">
    <MStatusBar/>
    <MTopBar back action={<span style={{fontSize:14,color:'var(--wf-ink-2)'}}>↗</span>}/>
    <div style={{padding:'14px 18px',display:'flex',flexDirection:'column',gap:12,flex:1,overflow:'auto'}}>
      <Logo initials="A" size={64}/>
      <div>
        <span className="wf-eyebrow">Company</span>
        <h1 className="wf-h1" style={{fontSize:24,margin:'4px 0 0'}}>Aurora Labs</h1>
        <p className="wf-serif wf-muted2" style={{fontSize:13,margin:'6px 0 0',lineHeight:1.5}}>
          Infra for the AI-native era. Boring systems so other teams can ship interesting things.
        </p>
      </div>
      <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
        <Badge variant="accent">SaaS</Badge>
        <Chip>postgres</Chip><Chip>go</Chip><Chip>k8s</Chip>
      </div>
      <Btn variant="accent">+ Follow company</Btn>

      <div style={{display:'flex',gap:14,borderBottom:'1px solid var(--wf-line-soft)'}}>
        {['Blogs · 24','Team · 6','Timeline · 18'].map((t,i) => (
          <div key={t} style={{padding:'8px 0',fontSize:12,fontWeight:i===0?600:400,color:i===0?'var(--wf-ink)':'var(--wf-ink-3)',borderBottom:i===0?'2px solid var(--wf-accent)':'2px solid transparent'}}>{t}</div>
        ))}
      </div>

      {[1,2,3].map(i => (
        <Box key={i} style={{padding:0,overflow:'hidden'}}>
          <Img label="" h={90}/>
          <div style={{padding:10}}>
            <Badge style={{fontSize:9}}>{['Postmortem','Architecture','Case study'][i-1]}</Badge>
            <div style={{font:'600 13px var(--wf-serif)',marginTop:6,lineHeight:1.3}}>
              {['How we cut p99 latency from 800ms → 120ms','The boring postgres migration that wasn\'t','Rewriting billing pipeline live'][i-1]}
            </div>
            <div className="wf-muted" style={{fontSize:10,marginTop:4,display:'flex',alignItems:'center',gap:5}}>
              <Avatar size={14} initials="ZK"/>Zara · May {16-i*2}
            </div>
          </div>
        </Box>
      ))}
    </div>
  </Frame>
);

Object.assign(window, { MSignUp, MOnboarding, MDashboard, MEditor, MHomepage, MBlogReading, MAuthorProfile, MCompany });
