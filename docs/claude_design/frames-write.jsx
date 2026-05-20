// frames-write.jsx — Blog editor, dashboard, schedule flow

const EditorChrome = ({ children, variant }) => (
  <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
    {/* Editor topbar — different from public nav */}
    <div style={{display:'flex',alignItems:'center',gap:14,padding:'10px 18px',borderBottom:'var(--wf-stroke-w) solid var(--wf-line)',background:'var(--wf-bg)'}}>
      <span style={{color:'var(--wf-ink-2)',fontSize:13}}>← My Blogs</span>
      <div style={{flex:1,textAlign:'center',color:'var(--wf-ink-3)',fontSize:12}}>
        <span style={{display:'inline-flex',alignItems:'center',gap:6}}>
          <span style={{width:6,height:6,borderRadius:99,background:'var(--wf-accent)'}}/>
          Auto-saved · just now
        </span>
      </div>
      <Btn size="sm" variant="ghost">Preview</Btn>
      <Btn size="sm">Save draft</Btn>
      <div style={{display:'flex'}}>
        <Btn size="sm" variant="primary">Publish</Btn>
        <span style={{borderTop:'var(--wf-stroke-w) solid var(--wf-line)',borderBottom:'var(--wf-stroke-w) solid var(--wf-line)',borderRight:'var(--wf-stroke-w) solid var(--wf-line)',padding:'5px 8px',background:'var(--wf-ink)',color:'var(--wf-bg)',fontSize:11}}>▾</span>
      </div>
    </div>
    {children}
  </div>
);

// V1: split preview + right settings panel
const EditorSplit = () => (
  <Frame label="05a · Blog editor" sub="split preview · right settings panel">
    <EditorChrome>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 280px',flex:1,minHeight:0}}>
        {/* Markdown pane */}
        <div style={{borderRight:'var(--wf-stroke-w) solid var(--wf-line)',padding:'24px 32px',overflow:'hidden'}}>
          <div className="wf-eyebrow">Markdown</div>
          <div style={{font:'600 26px var(--wf-serif)',marginTop:6,color:'var(--wf-ink)'}}>How we cut p99 latency from 800ms → 120ms</div>
          <div style={{marginTop:14,fontFamily:'var(--wf-mono)',fontSize:12,lineHeight:1.7,color:'var(--wf-ink-2)'}}>
            <span style={{color:'var(--wf-ink-3)'}}># </span>The problem<br/><br/>
            In Q4 our checkout p99 crept past 800ms. SLO budget was<br/>
            burning by lunch. Below is what we tried, what failed,<br/>
            and the one config flip that actually moved the needle.<br/><br/>
            <span style={{color:'var(--wf-ink-3)'}}>## </span>Baseline<br/><br/>
            We ran a flamegraph against the hottest endpoint:<br/>
            <span style={{color:'var(--wf-ink-3)'}}>```bash</span><br/>
            $ perf record -F 99 -p $(pgrep -f checkout) -g<br/>
            <span style={{color:'var(--wf-ink-3)'}}>```</span><br/><br/>
            Three suspects emerged: a chatty Redis call, a<br/>
            JSON-encoding hot loop, and a tail-latency anomaly...
          </div>
        </div>

        {/* Live preview pane */}
        <div style={{padding:'24px 32px',overflow:'hidden',background:'var(--wf-fill)'}}>
          <div className="wf-eyebrow">Live preview</div>
          <h1 className="wf-h1" style={{marginTop:8,fontSize:26}}>How we cut p99 latency from 800ms → 120ms</h1>
          <div style={{display:'flex',gap:10,alignItems:'center',marginTop:10,fontSize:12,color:'var(--wf-ink-2)'}}>
            <Avatar size={22} initials="ZK"/> Zara Khan · 8 min read
          </div>
          <h3 className="wf-h3" style={{marginTop:18}}>The problem</h3>
          <p className="wf-serif" style={{fontSize:13,lineHeight:1.55,color:'var(--wf-ink-2)'}}>In Q4 our checkout p99 crept past 800ms. SLO budget was burning by lunch.</p>
          <h3 className="wf-h3" style={{marginTop:14}}>Baseline</h3>
          <Box variant="tint" style={{padding:10,fontFamily:'var(--wf-mono)',fontSize:11,color:'var(--wf-ink-2)'}}>
            $ perf record -F 99 -p $(pgrep checkout) -g
            <span style={{float:'right',fontSize:10,color:'var(--wf-ink-3)'}}>[copy]</span>
          </Box>
          <TextLines lines={4} style={{marginTop:14}}/>
        </div>

        {/* Settings rail */}
        <div style={{borderLeft:'var(--wf-stroke-w) solid var(--wf-line)',padding:'18px 16px',display:'flex',flexDirection:'column',gap:14,overflow:'auto',fontSize:12}}>
          <div className="wf-eyebrow">Article settings</div>

          <div>
            <div style={{fontWeight:600,marginBottom:6}}>Type <span style={{color:'var(--wf-accent)'}}>*</span></div>
            <Box style={{padding:'8px 10px',display:'flex',justifyContent:'space-between'}}>
              <span>Failure / Postmortem</span><span className="wf-muted">▾</span>
            </Box>
          </div>

          <div>
            <div style={{fontWeight:600,marginBottom:6}}>Publish as</div>
            <Box style={{padding:'8px 10px',display:'flex',alignItems:'center',gap:8}}>
              <Logo initials="A" size={22}/><span>Aurora Labs</span><span style={{marginLeft:'auto'}} className="wf-muted">▾</span>
            </Box>
            <div style={{fontSize:11,color:'var(--wf-ink-3)',marginTop:4}}>or "No company — publish as myself"</div>
          </div>

          <div>
            <div style={{fontWeight:600,marginBottom:6}}>Tags <span className="wf-muted">(max 5)</span></div>
            <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
              <Chip variant="solid">postgres ×</Chip>
              <Chip variant="solid">latency ×</Chip>
              <Chip variant="solid">postmortem ×</Chip>
              <Chip>+ Add</Chip>
            </div>
          </div>

          <div>
            <div style={{fontWeight:600,marginBottom:6}}>Cover image</div>
            <Img label="drop image · 1200×630" h={86}/>
          </div>

          <div>
            <div style={{fontWeight:600,marginBottom:6}}>Summary</div>
            <Box style={{padding:'8px 10px',minHeight:54,color:'var(--wf-ink-3)',fontSize:11}}>
              A walkthrough of how Aurora's checkout team dropped p99...
              <div style={{textAlign:'right',color:'var(--wf-ink-3)',marginTop:6}}>108 / 300</div>
            </Box>
          </div>

          <details style={{borderTop:'1px solid var(--wf-line-soft)',paddingTop:10}}>
            <summary style={{fontWeight:600,cursor:'pointer'}}>SEO settings</summary>
          </details>
        </div>
      </div>
    </EditorChrome>
    <Annot n={1} x={20} y={88} w={170}>Auto-save status is always visible in the chrome.</Annot>
    <Annot n={2} x={20} y={50} align="right" w={210}>Publish dropdown opens Schedule modal (see frame 05c).</Annot>
    <Annot n={3} x={400} y={140}>Live preview kept in sync with markdown on the left.</Annot>
    <Annot n={4} x={6} y={280} align="right" w={200}>"Publish as" only shows if the user is in ≥1 company. Default: as themselves.</Annot>
  </Frame>
);

// V2: focused single-column writing mode with collapsible settings
const EditorFocus = () => (
  <Frame label="05b · Editor — focus mode" sub="alt variant · distraction-free">
    <EditorChrome>
      <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',padding:'40px 60px',overflow:'auto',background:'var(--wf-bg)'}}>
        <div style={{width:'100%',maxWidth:680,display:'flex',flexDirection:'column',gap:18}}>
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <Badge variant="accent">Failure / Postmortem</Badge>
            <Chip>Aurora Labs ▾</Chip>
            <span style={{flex:1}}/>
            <Btn size="sm" variant="ghost" icon="⚙">Settings</Btn>
          </div>

          <div style={{font:'600 36px var(--wf-serif)',color:'var(--wf-ink)',lineHeight:1.1}} contentEditable suppressContentEditableWarning>
            How we cut p99 latency from 800ms → 120ms
          </div>

          <Box variant="flat" style={{borderBottom:'1px dashed var(--wf-line-soft)',padding:'6px 0',color:'var(--wf-ink-3)',fontStyle:'italic'}}>
            A walkthrough of how Aurora's checkout team dropped p99…
          </Box>

          <Box variant="tint" style={{padding:'6px 10px',display:'flex',gap:14,alignItems:'center',fontSize:12,color:'var(--wf-ink-2)'}}>
            <span style={{fontWeight:600}}>B</span><span style={{fontStyle:'italic'}}>I</span><span style={{textDecoration:'underline'}}>U</span><span>H1</span><span>H2</span>
            <span style={{width:1,height:14,background:'var(--wf-line-soft)'}}/>
            <span className="wf-mono">{'<>'}</span>
            <span>Link</span>
            <span>Image</span>
            <span>Quote</span>
            <span style={{flex:1}}/>
            <span className="wf-muted" style={{fontSize:11}}>1,284 words · 7 min</span>
          </Box>

          <p className="wf-serif" style={{fontSize:18,lineHeight:1.65,color:'var(--wf-ink)',margin:0}}>
            In Q4 our checkout p99 crept past 800ms. SLO budget was burning by lunch. Below is what we tried, what failed, and the one config flip that actually moved the needle.
          </p>
          <h3 className="wf-h3" style={{fontSize:20}}>The problem</h3>
          <TextLines lines={4}/>
          <Box variant="tint" style={{padding:14,fontFamily:'var(--wf-mono)',fontSize:12}}>
            $ perf record -F 99 -p $(pgrep checkout) -g
          </Box>
          <TextLines lines={3}/>
        </div>
      </div>
    </EditorChrome>
    <Annot n={1} x={50} y={140} w={170}>Type + company picker inline above title — fastest path to publish.</Annot>
    <Annot n={2} x={20} y={250} align="right" w={210}>Floating toolbar appears on selection (not shown here).</Annot>
  </Frame>
);

const ScheduleModal = () => (
  <Frame label="05c · Schedule blog" sub="modal over editor">
    <EditorChrome>
      <div style={{flex:1,background:'var(--wf-fill)',opacity:.5}}/>
    </EditorChrome>
    <Modal w={460}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:6}}>
        <h3 className="wf-h2" style={{fontSize:20}}>Schedule blog</h3>
        <span className="wf-muted" style={{fontSize:14,cursor:'pointer'}}>×</span>
      </div>
      <p className="wf-muted" style={{margin:'0 0 14px',fontSize:12}}>Set when this blog should auto-publish. You can edit or cancel before then.</p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
        <Input label="Date" value="Wed, Jun 4 2026"/>
        <Input label="Time" value="09:00"/>
      </div>
      <Input label="Timezone" value="Asia / Kolkata (auto-detected)" style={{marginTop:10}}/>
      <Box variant="soft" style={{marginTop:14,padding:10,fontSize:11,color:'var(--wf-ink-2)',display:'flex',gap:8}}>
        <span style={{color:'var(--wf-accent)',fontFamily:'var(--wf-mono)'}}>!</span>
        Selected time is more than 6 months away — confirm date?
      </Box>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:18}}>
        <Btn variant="ghost">Cancel</Btn>
        <Btn variant="primary">Schedule blog</Btn>
      </div>
    </Modal>
    <Annot n={1} x={620} y={160} w={220}>Past times blocked. Far-future warns but doesn't block. Cancellable until publish time.</Annot>
  </Frame>
);

const dashSidebar = [
  { heading: 'Writing' },
  { label: 'Published', icon: '◆', count: 12 },
  { label: 'Drafts', icon: '◇', count: 3 },
  { label: 'Scheduled', icon: '⏱', count: 2 },
  { label: 'Archived', icon: '⌫', count: 4 },
  { heading: 'Companies' },
  { label: 'Aurora Labs', icon: '◧' },
  { label: 'Hexa.io', icon: '◧' },
  { label: '+ Create company', icon: '+' },
  { heading: 'You' },
  { label: 'Profile', icon: '☺' },
  { label: 'Settings', icon: '⚙' },
];

// V1: dashboard as a list with status filters
const DashboardList = () => (
  <Frame label="06a · Personal dashboard" sub="list + filters">
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <TopNav loggedIn active="" />
      <div style={{display:'grid',gridTemplateColumns:'200px 1fr',flex:1,minHeight:0}}>
        <Sidebar items={dashSidebar} active="Published"/>
        <div style={{padding:'24px 32px',overflow:'auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:14}}>
            <div>
              <span className="wf-eyebrow">Dashboard</span>
              <h1 className="wf-h2" style={{marginTop:4}}>Good morning, Zara.</h1>
            </div>
            <Btn variant="accent">+ Write blog</Btn>
          </div>

          {/* Stat strip */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(4, 1fr)',gap:10,marginBottom:18}}>
            {[
              ['Published','12','+2 this month'],
              ['Total reads','24,108','last 30d'],
              ['Drafts','3','last edit 2d ago'],
              ['Scheduled','2','next: Jun 4']
            ].map(([k,v,s]) => (
              <Box key={k} style={{padding:12}}>
                <div className="wf-eyebrow">{k}</div>
                <div style={{font:'600 22px var(--wf-serif)',marginTop:4}}>{v}</div>
                <div className="wf-muted" style={{fontSize:11,marginTop:2}}>{s}</div>
              </Box>
            ))}
          </div>

          {/* Filter row */}
          <div style={{display:'flex',gap:8,marginBottom:12,alignItems:'center'}}>
            <Chip variant="solid">All · 12</Chip>
            <Chip>Aurora Labs · 7</Chip>
            <Chip>Hexa · 2</Chip>
            <Chip>Personal · 3</Chip>
            <div style={{flex:1}}/>
            <Box style={{padding:'4px 8px',fontSize:11,color:'var(--wf-ink-3)'}}>Sort: Newest ▾</Box>
          </div>

          <div className="wf-when-full">
            {/* Article list */}
            <Box>
              {[
                ['Failure / Postmortem','How we cut p99 latency from 800ms → 120ms','Aurora Labs','Published','May 16','4.2k reads'],
                ['Architecture','The boring postgres migration that wasn\'t','Aurora Labs','Published','May 10','3.1k reads'],
                ['Founder Note','Why we shipped slower this quarter','Hexa.io','Scheduled','Jun 4 · 09:00 IST','—'],
                ['Tutorial','A pragmatic guide to feature flags','Personal','Draft','edited 2d ago','—'],
                ['Case Study','Rewriting our billing pipeline live','Aurora Labs','Published','Apr 28','5.6k reads'],
              ].map((row,i) => (
                <div key={i} style={{display:'grid',gridTemplateColumns:'140px 1fr 140px 110px 110px 30px',padding:'14px 14px',borderTop: i ? '1px solid var(--wf-line-soft)' : 'none',gap:14,alignItems:'center'}}>
                  <Badge variant={row[3]==='Scheduled'?'yellow':(row[3]==='Draft'?'':'accent')}>{row[0]}</Badge>
                  <div>
                    <div style={{font:'600 14px var(--wf-serif)'}}>{row[1]}</div>
                    <div className="wf-muted" style={{fontSize:11,marginTop:2}}>{row[2]} · /blog/how-we-cut-p99...</div>
                  </div>
                  <span style={{fontSize:12,color:'var(--wf-ink-2)'}}>{row[3]}</span>
                  <span style={{fontSize:12,color:'var(--wf-ink-2)'}}>{row[4]}</span>
                  <span style={{fontSize:12,color:'var(--wf-ink-3)'}}>{row[5]}</span>
                  <span className="wf-muted">···</span>
                </div>
              ))}
            </Box>
          </div>
          <div className="wf-when-empty" style={{display:'none'}}>
            <Box style={{padding:40,textAlign:'center'}}>
              <Img label="empty illustration" h={120} w={120} style={{margin:'0 auto'}}/>
              <h3 className="wf-h3" style={{marginTop:14}}>Your library is empty</h3>
              <p className="wf-muted" style={{margin:'6px 0 16px',fontSize:13}}>Write your first blog or import a draft from Markdown.</p>
              <Btn variant="primary">+ Write your first blog</Btn>
            </Box>
          </div>
        </div>
      </div>
    </div>
    <Annot n={1} x={250} y={150} w={200}>Empty/populated state toggle: flip via the Tweaks panel.</Annot>
    <Annot n={2} x={20} y={300} align="right" w={200}>Status pills filter the list. Active = solid chip.</Annot>
  </Frame>
);

// V2: dashboard as a card grid with cover images
const DashboardCards = () => (
  <Frame label="06b · Dashboard — card grid" sub="alt variant · visual-first">
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <TopNav loggedIn />
      <div style={{display:'grid',gridTemplateColumns:'200px 1fr',flex:1,minHeight:0}}>
        <Sidebar items={dashSidebar} active="Published"/>
        <div style={{padding:'24px 32px',overflow:'auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:14}}>
            <h1 className="wf-h2">My published blogs</h1>
            <div style={{display:'flex',gap:8}}>
              <Btn size="sm" variant="ghost">Import draft</Btn>
              <Btn variant="accent">+ Write blog</Btn>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
            {[
              ['How we cut p99 latency from 800ms → 120ms','Aurora Labs','4.2k','May 16'],
              ['The boring postgres migration that wasn\'t','Aurora Labs','3.1k','May 10'],
              ['A pragmatic guide to feature flags','Personal','—','draft'],
              ['Rewriting our billing pipeline live','Aurora Labs','5.6k','Apr 28'],
              ['Why we shipped slower this quarter','Hexa.io','—','Scheduled Jun 4'],
              ['Lessons from 6 months of on-call','Aurora Labs','2.4k','Apr 12'],
            ].map(([t,c,r,d],i) => (
              <Box key={i} style={{padding:0,overflow:'hidden',display:'flex',flexDirection:'column'}}>
                <Img label="cover" h={92}/>
                <div style={{padding:'10px 12px',display:'flex',flexDirection:'column',gap:6}}>
                  <Badge>Postmortem</Badge>
                  <div style={{font:'600 14px var(--wf-serif)',lineHeight:1.25}}>{t}</div>
                  <div style={{display:'flex',gap:6,fontSize:11,color:'var(--wf-ink-3)',alignItems:'center'}}>
                    <Logo initials="A" size={16}/>{c} · {d} · {r}
                    <span style={{flex:1}}/>
                    <span>···</span>
                  </div>
                </div>
              </Box>
            ))}
          </div>
        </div>
      </div>
    </div>
  </Frame>
);

Object.assign(window, { EditorSplit, EditorFocus, ScheduleModal, DashboardList, DashboardCards });
