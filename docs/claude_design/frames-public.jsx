// frames-public.jsx — Homepage variants, blog reading, author profile, explore, tag page

// HOMEPAGE V1: editorial grid (large hero feature + sidebar)
const HomeEditorial = () => (
  <Frame label="07a · Homepage — editorial" sub="logged-out · hero feature + sidebar">
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'auto'}}>
      <TopNav />
      {/* Hero strip */}
      <div style={{padding:'28px 48px 14px',display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:24}}>
        <div style={{maxWidth:540}}>
          <span className="wf-eyebrow">A home for engineering stories</span>
          <h1 className="wf-h1" style={{fontSize:36,marginTop:8}}>Long-form writing for the people who actually ship.</h1>
        </div>
        <div style={{display:'flex',gap:8}}>
          <Btn>Explore articles</Btn>
          <Btn variant="accent">Start writing — it's free</Btn>
        </div>
      </div>

      <div style={{padding:'12px 48px 32px',display:'grid',gridTemplateColumns:'2fr 1fr',gap:28}}>
        {/* Left column — feature */}
        <div style={{display:'flex',flexDirection:'column',gap:18}}>
          <span className="wf-eyebrow" style={{borderTop:'var(--wf-stroke-w) solid var(--wf-line)',paddingTop:10}}>Featured · Architecture deep dive</span>
          <Img label="cover · 1200 × 630" h={260}/>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <Badge variant="accent">Architecture deep dive</Badge>
            <Chip>postgres</Chip><Chip>latency</Chip>
          </div>
          <h2 className="wf-h2" style={{fontSize:30,maxWidth:580}}>How we cut p99 latency from 800ms to 120ms — and the three rewrites that didn't work.</h2>
          <div style={{display:'flex',gap:10,alignItems:'center',fontSize:12,color:'var(--wf-ink-2)'}}>
            <Avatar size={26} initials="ZK"/>
            <span>Zara Khan</span>
            <span className="wf-muted">·</span>
            <Logo initials="A" size={20}/>
            <span>Aurora Labs</span>
            <span className="wf-muted">· May 16 · 8 min read</span>
          </div>

          {/* Trending row */}
          <div style={{marginTop:14}}>
            <div style={{display:'flex',alignItems:'baseline',gap:14,marginBottom:10}}>
              <span className="wf-eyebrow">Trending this week</span>
              <div style={{flex:1,height:1,background:'var(--wf-line-soft)'}}/>
            </div>
            {/* Type filter pills */}
            <div style={{display:'flex',gap:6,marginBottom:14,overflow:'hidden'}}>
              <Chip variant="solid">All</Chip>
              <Chip>Engineering</Chip>
              <Chip>Case study</Chip>
              <Chip>Founder note</Chip>
              <Chip>Tutorial</Chip>
              <Chip>Postmortem</Chip>
              <Chip>AI experiment</Chip>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              {[
                ['Case study','Rewriting our billing pipeline, live in prod','Aurora Labs','Mei L','May 14','6 min'],
                ['Founder note','Why we shipped slower this quarter','Hexa.io','Ria T','May 13','4 min'],
                ['Postmortem','3 hours of cascading Redis failover','Stripe Crew','Nikhil','May 11','9 min'],
                ['Tutorial','A pragmatic guide to feature flags','—','Sam J','May 09','12 min'],
              ].map((row,i) => (
                <Box key={i} style={{padding:0,overflow:'hidden'}}>
                  <Img label="cover" h={110}/>
                  <div style={{padding:'10px 12px'}}>
                    <Badge>{row[0]}</Badge>
                    <div style={{font:'600 15px var(--wf-serif)',marginTop:6,lineHeight:1.25}}>{row[1]}</div>
                    <div style={{display:'flex',gap:6,fontSize:11,color:'var(--wf-ink-3)',marginTop:6,alignItems:'center'}}>
                      <Avatar size={16} initials={row[3][0]}/>{row[3]} · {row[2]} · {row[4]} · {row[5]}
                    </div>
                  </div>
                </Box>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — sidebar */}
        <div style={{display:'flex',flexDirection:'column',gap:22}}>
          <div>
            <div className="wf-eyebrow" style={{borderTop:'var(--wf-stroke-w) solid var(--wf-line)',paddingTop:10,marginBottom:10}}>Featured companies</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {['Aurora Labs','Hexa.io','Northstar','Quiver','Lambdacat','Verge'].map(c => (
                <Box key={c} style={{padding:'8px 10px',display:'flex',alignItems:'center',gap:10}}>
                  <Logo initials={c[0]} size={28}/>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:12}}>{c}</div>
                    <div className="wf-muted" style={{fontSize:11}}>Building infra for the AI-native era</div>
                  </div>
                  <span className="wf-muted" style={{fontSize:11}}>12 posts</span>
                </Box>
              ))}
            </div>
          </div>

          <div>
            <div className="wf-eyebrow" style={{borderTop:'var(--wf-stroke-w) solid var(--wf-line)',paddingTop:10,marginBottom:10}}>Trending tags</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {['postgres','latency','feature-flags','llm','observability','postmortem','migrations','kafka','dx','onboarding'].map(t => (
                <Chip key={t}>#{t}</Chip>
              ))}
            </div>
          </div>

          <div>
            <div className="wf-eyebrow" style={{borderTop:'var(--wf-stroke-w) solid var(--wf-line)',paddingTop:10,marginBottom:10}}>Recent deep dives</div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {[1,2,3].map(i => (
                <div key={i} style={{display:'flex',gap:10}}>
                  <Img label="" w={56} h={56} style={{flex:'0 0 56px'}}/>
                  <div>
                    <Badge style={{fontSize:9}}>Architecture</Badge>
                    <div style={{font:'600 12px var(--wf-serif)',marginTop:4,lineHeight:1.3}}>The boring postgres migration that wasn't</div>
                    <div className="wf-muted" style={{fontSize:10,marginTop:2}}>Aurora Labs · May 10</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{padding:'18px 48px',borderTop:'var(--wf-stroke-w) solid var(--wf-line)',display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:11,color:'var(--wf-ink-3)'}}>
        <Wordmark size={14}/>
        <span>About · Writers · Terms · Privacy · RSS</span>
        <span>© 2026</span>
      </div>
    </div>
    <Annot n={1} x={20} y={130} w={170}>Hero is editorial, not marketing. Featured article does the heavy lifting.</Annot>
    <Annot n={2} x={460} y={300}>Type-filter pills are the same set used on /explore.</Annot>
    <Annot n={3} x={20} y={520} align="right" w={200}>Sidebar is admin-curated for featured companies; everything else is algorithmic.</Annot>
  </Frame>
);

// HOMEPAGE V2: feed-first, signed-in
const HomeFeed = () => (
  <Frame label="07b · Homepage — signed in" sub="alt variant · personalised feed">
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'auto'}}>
      <TopNav loggedIn />
      {/* Quick-action strip */}
      <div style={{padding:'18px 48px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'var(--wf-fill)',borderBottom:'var(--wf-stroke-w) solid var(--wf-line)'}}>
        <div>
          <span className="wf-eyebrow">Tuesday morning</span>
          <h2 className="wf-h2" style={{marginTop:4,fontSize:24}}>Good morning, Zara.</h2>
        </div>
        <div style={{display:'flex',gap:8}}>
          <Btn>View drafts <span className="wf-muted">(3)</span></Btn>
          <Btn>My dashboard</Btn>
          <Btn variant="accent">+ Write blog</Btn>
        </div>
      </div>

      <div style={{padding:'24px 48px',display:'grid',gridTemplateColumns:'2fr 1fr',gap:28}}>
        <div>
          <div style={{display:'flex',gap:6,marginBottom:14}}>
            <Chip variant="solid">For you</Chip>
            <Chip>Following</Chip>
            <Chip>Latest</Chip>
            <Chip>From your companies</Chip>
          </div>

          {[1,2,3,4].map(i => (
            <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 180px',gap:18,padding:'18px 0',borderTop:i===1?'var(--wf-stroke-w) solid var(--wf-line)':'1px solid var(--wf-line-soft)'}}>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                <div style={{display:'flex',gap:8,alignItems:'center',fontSize:11,color:'var(--wf-ink-3)'}}>
                  <Logo initials="A" size={18}/> Aurora Labs · <Avatar size={16} initials="ZK"/> Zara Khan · May 16
                </div>
                <h3 className="wf-h2" style={{fontSize:22}}>How we cut p99 latency from 800ms → 120ms</h3>
                <p className="wf-serif wf-muted2" style={{margin:0,fontSize:14,lineHeight:1.5,maxWidth:520}}>
                  A walkthrough of how Aurora's checkout team dropped p99 in three weeks — and the two rewrites we threw away to get there.
                </p>
                <div style={{display:'flex',gap:6,marginTop:4}}>
                  <Chip>postgres</Chip><Chip>latency</Chip><Chip>postmortem</Chip>
                  <span style={{flex:1}}/>
                  <span className="wf-muted" style={{fontSize:11}}>8 min · 4.2k reads</span>
                </div>
              </div>
              <Img label="cover" h={120}/>
            </div>
          ))}
        </div>

        {/* Right rail */}
        <div style={{display:'flex',flexDirection:'column',gap:18}}>
          <Box variant="soft" style={{padding:14}}>
            <div className="wf-eyebrow">Continue writing</div>
            <div style={{font:'600 14px var(--wf-serif)',marginTop:6}}>A pragmatic guide to feature flags</div>
            <div className="wf-muted" style={{fontSize:11,marginTop:4}}>edited 2d ago · 1,284 words</div>
            <Btn size="sm" style={{marginTop:10}}>Resume</Btn>
          </Box>
          <div>
            <div className="wf-eyebrow" style={{marginBottom:8}}>Your companies</div>
            {[['Aurora Labs','7 posts'],['Hexa.io','2 posts']].map(([n,m]) => (
              <Box key={n} style={{padding:'8px 10px',display:'flex',gap:10,alignItems:'center',marginBottom:6}}>
                <Logo initials={n[0]} size={28}/>
                <div><div style={{fontWeight:600,fontSize:12}}>{n}</div><div className="wf-muted" style={{fontSize:11}}>{m}</div></div>
              </Box>
            ))}
          </div>
          <div>
            <div className="wf-eyebrow" style={{marginBottom:8}}>Trending tags</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {['postgres','llm','feature-flags','postmortem','dx'].map(t => <Chip key={t}>#{t}</Chip>)}
            </div>
          </div>
        </div>
      </div>
    </div>
    <Annot n={1} x={30} y={130} w={210}>Logged-in hero replaces marketing with a quick-action strip — fastest path to writing.</Annot>
  </Frame>
);

// BLOG READING
const BlogReading = () => (
  <Frame label="08 · Public blog reading" sub="/blog/[slug] · public, no login required">
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'auto'}}>
      <TopNav />
      <div style={{padding:'0',display:'grid',gridTemplateColumns:'1fr min(680px, 100%) 1fr',gap:0}}>
        <div/>
        <article style={{padding:'40px 0 24px'}}>
          <Badge variant="accent">Failure / Postmortem</Badge>
          <h1 className="wf-h1" style={{fontSize:40,marginTop:14,marginBottom:14,lineHeight:1.05}}>How we cut p99 latency from 800ms → 120ms</h1>
          <p className="wf-serif wf-muted2" style={{fontSize:18,lineHeight:1.5,margin:'0 0 22px'}}>
            A walkthrough of how Aurora's checkout team dropped p99 in three weeks — and the two rewrites we threw away to get there.
          </p>
          <div style={{display:'flex',alignItems:'center',gap:12,paddingBottom:18,borderBottom:'var(--wf-stroke-w) solid var(--wf-line)'}}>
            <Avatar size={36} initials="ZK"/>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:600}}>Zara Khan</div>
              <div className="wf-muted" style={{fontSize:11}}>writing for <span style={{color:'var(--wf-ink-2)',textDecoration:'underline'}}>Aurora Labs</span> · May 16 · 8 min read</div>
            </div>
            <Btn size="sm" variant="ghost" icon="↗">Share</Btn>
            <Btn size="sm" variant="ghost" icon="◔">Bookmark</Btn>
          </div>

          <Img label="cover · 1200 × 630" h={300} style={{marginTop:24}}/>

          <div style={{marginTop:24,display:'flex',flexDirection:'column',gap:14}}>
            <p className="wf-serif" style={{fontSize:17,lineHeight:1.65,margin:0}}>
              In Q4 our checkout p99 crept past 800ms. SLO budget was burning by lunch. Below is what we tried, what failed, and the one config flip that actually moved the needle.
            </p>
            <h3 className="wf-h2" style={{fontSize:22}}>The problem</h3>
            <TextLines lines={3}/>
            <Box variant="tint" style={{padding:14,fontFamily:'var(--wf-mono)',fontSize:12,display:'flex',justifyContent:'space-between'}}>
              <span>$ perf record -F 99 -p $(pgrep checkout) -g</span>
              <span className="wf-muted" style={{fontSize:11}}>copy</span>
            </Box>
            <TextLines lines={4}/>
            <Box variant="soft" style={{padding:14,borderLeft:'3px solid var(--wf-accent)',fontFamily:'var(--wf-serif)',fontStyle:'italic',fontSize:14}}>
              "The blame was the cache. The cache was always the blame."
            </Box>
            <TextLines lines={3}/>
          </div>

          {/* Tag row */}
          <div style={{marginTop:28,display:'flex',gap:6,flexWrap:'wrap'}}>
            <Chip>#postgres</Chip><Chip>#latency</Chip><Chip>#postmortem</Chip>
          </div>

          {/* Author / company cards */}
          <div style={{marginTop:28,display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <Box style={{padding:16,display:'flex',gap:12}}>
              <Avatar size={48} initials="ZK"/>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:14}}>Zara Khan</div>
                <div className="wf-muted" style={{fontSize:11,marginBottom:6}}>Distributed systems @ Aurora</div>
                <Btn size="sm">+ Follow</Btn>
              </div>
            </Box>
            <Box style={{padding:16,display:'flex',gap:12}}>
              <Logo initials="A" size={48}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:14}}>Aurora Labs</div>
                <div className="wf-muted" style={{fontSize:11,marginBottom:6}}>Infra for the AI-native era</div>
                <Btn size="sm">+ Follow company</Btn>
              </div>
            </Box>
          </div>

          {/* Related */}
          <div style={{marginTop:28}}>
            <div className="wf-eyebrow" style={{marginBottom:10}}>Related from Aurora Labs</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
              {[1,2,3].map(i => (
                <Box key={i} style={{padding:0,overflow:'hidden'}}>
                  <Img label="" h={80}/>
                  <div style={{padding:10}}>
                    <Badge style={{fontSize:9}}>Case study</Badge>
                    <div style={{font:'600 12px var(--wf-serif)',marginTop:6,lineHeight:1.3}}>Rewriting our billing pipeline live</div>
                  </div>
                </Box>
              ))}
            </div>
          </div>
        </article>
        <div/>
      </div>
    </div>
    <Annot n={1} x={30} y={170} w={210}>Type badge, serif headline, generous lede. Editorial feel above the fold.</Annot>
    <Annot n={2} x={30} y={460} align="right" w={200}>Author + company cards side-by-side at end of article. Both can be followed.</Annot>
  </Frame>
);

const AuthorProfile = () => (
  <Frame label="09 · Public author profile" sub="/author/[username]">
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'auto'}}>
      <TopNav />
      {/* Profile header */}
      <div style={{padding:'40px 48px 24px',display:'flex',gap:24,alignItems:'flex-start',borderBottom:'1px solid var(--wf-line-soft)'}}>
        <Avatar size={96} initials="ZK"/>
        <div style={{flex:1}}>
          <h1 className="wf-h1" style={{fontSize:30}}>Zara Khan</h1>
          <div className="wf-mono wf-muted" style={{fontSize:12,marginTop:2}}>@zarakhan</div>
          <p className="wf-serif wf-muted2" style={{marginTop:8,maxWidth:540,fontSize:14}}>
            Distributed systems @ Aurora. ex-Stripe. Writing about postgres, latency budgets, and the boring engineering that ships products.
          </p>
          <div style={{display:'flex',gap:6,marginTop:10,flexWrap:'wrap'}}>
            {['distributed-systems','postgres','observability','postmortems'].map(t => <Chip key={t}>{t}</Chip>)}
          </div>
          <div style={{display:'flex',gap:14,marginTop:14,fontSize:12,color:'var(--wf-ink-2)'}}>
            <span className="wf-mono">↗ twitter</span>
            <span className="wf-mono">↗ linkedin</span>
            <span className="wf-mono">↗ github</span>
            <span className="wf-mono">↗ zara.dev</span>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'flex-end'}}>
          <Btn variant="accent">+ Follow</Btn>
          <div className="wf-muted" style={{fontSize:11}}>1,284 followers</div>
        </div>
      </div>

      {/* Writing for */}
      <div style={{padding:'18px 48px',display:'flex',gap:14,alignItems:'center',background:'var(--wf-fill)',borderBottom:'1px solid var(--wf-line-soft)'}}>
        <span className="wf-eyebrow">Writing for</span>
        <div style={{display:'flex',gap:10}}>
          {['Aurora Labs','Hexa.io'].map(c => (
            <Box key={c} style={{padding:'6px 10px',display:'flex',gap:8,alignItems:'center'}}>
              <Logo initials={c[0]} size={20}/><span style={{fontSize:12,fontWeight:600}}>{c}</span>
            </Box>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div style={{padding:'24px 48px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:14}}>
          <h3 className="wf-h2" style={{fontSize:20}}>Articles <span className="wf-muted">· 12</span></h3>
          <Box style={{padding:'4px 8px',fontSize:11}}>Sort: Newest ▾</Box>
        </div>
        <div className="wf-when-full" style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
          {[1,2,3,4,5,6].map(i => (
            <Box key={i} style={{padding:0,overflow:'hidden'}}>
              <Img label="" h={100}/>
              <div style={{padding:'10px 12px'}}>
                <Badge>{['Postmortem','Architecture','Tutorial','Case study','Founder note','Opinion'][i-1]}</Badge>
                <div style={{font:'600 14px var(--wf-serif)',marginTop:6,lineHeight:1.25}}>
                  {['How we cut p99 latency from 800ms → 120ms','The boring postgres migration that wasn\'t','A pragmatic guide to feature flags','Rewriting our billing pipeline live','Why we shipped slower this quarter','Against the new framework treadmill'][i-1]}
                </div>
                <div className="wf-muted" style={{fontSize:11,marginTop:6}}>Aurora Labs · May {16-i} · {7-i % 3} min</div>
              </div>
            </Box>
          ))}
        </div>
        <div className="wf-when-empty" style={{display:'none'}}>
          <Box style={{padding:40,textAlign:'center'}}>
            <p className="wf-muted">No published articles yet.</p>
          </Box>
        </div>
      </div>
    </div>
    <Annot n={1} x={20} y={130} w={170}>SEO meta: "Zara Khan — Articles on Lorestack". OG image auto-generated.</Annot>
    <Annot n={2} x={20} y={300} align="right" w={210}>Companies the author is in are linked here. Each → company page.</Annot>
  </Frame>
);

// ─── EXPLORE (redesigned · modern alignment) ───────────────────────────────
// Single-column layout: results-first with a compact filter toolbar at top.
// No more left rail — filters consolidated into the toolbar so the grid
// breathes wider. Consistent card heights, 16:9 covers, clear meta hierarchy.
const Explore = () => {
  const types = ['All','Engineering','Architecture','Case study','Founder note','Postmortem','Tutorial','AI experiment','Opinion','Open source','Showcase'];
  const articles = [
    { type:'Postmortem', title:'How we cut p99 latency from 800ms → 120ms', co:'Aurora Labs', logo:'A', author:'Zara Khan', date:'May 16', reads:'4.2k', mins:'8 min', tags:['postgres','latency'], featured:true },
    { type:'Architecture', title:'The boring postgres migration that wasn\'t — five hours we\'d like back', co:'Aurora Labs', logo:'A', author:'Mei Lin', date:'May 14', reads:'8.4k', mins:'12 min', tags:['postgres','migrations'] },
    { type:'Case study', title:'Rewriting our billing pipeline live in prod', co:'Aurora Labs', logo:'A', author:'Nikhil Rao', date:'May 12', reads:'5.6k', mins:'9 min', tags:['billing','postgres'] },
    { type:'Founder note', title:'Why we shipped slower this quarter', co:'Hexa.io', logo:'H', author:'Ria Tan', date:'May 11', reads:'2.1k', mins:'5 min', tags:['process','team'] },
    { type:'Tutorial', title:'A pragmatic guide to feature flags', co:'Personal', logo:'S', author:'Sam Jacobs', date:'May 09', reads:'3.4k', mins:'12 min', tags:['feature-flags','dx'] },
    { type:'Postmortem', title:'3 hours of cascading Redis failover', co:'Stripe Crew', logo:'S', author:'Nikhil', date:'May 06', reads:'9.1k', mins:'9 min', tags:['redis','postmortem'] },
    { type:'Architecture', title:'When to reach for pg_partman (and when not to)', co:'Quiver', logo:'Q', author:'Ana Brown', date:'May 05', reads:'1.8k', mins:'8 min', tags:['postgres','partitioning'] },
    { type:'Opinion', title:'The case against your microservice', co:'Northstar', logo:'N', author:'David K', date:'May 02', reads:'12.4k', mins:'6 min', tags:['architecture','opinion'] },
    { type:'Architecture', title:'Three things Postgres taught us this year', co:'Hexa.io', logo:'H', author:'Mei Lin', date:'May 01', reads:'4.4k', mins:'11 min', tags:['postgres','lessons'] },
  ];

  return (
  <Frame label="10 · Explore — browse all" sub="redesigned · modern toolbar · clean grid">
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'auto',background:'var(--bg)'}}>
      <TopNav active="Explore"/>

      {/* ── HEADER ── */}
      <header style={{padding:'40px 56px 24px',background:'var(--bg)',borderBottom:'1px solid var(--line-soft)'}}>
        <div style={{maxWidth:1240,margin:'0 auto'}}>
          <span className="wf-eyebrow">Explore</span>
          <h1 className="wf-h1" style={{fontSize:40,marginTop:8,letterSpacing:'-.6px'}}>Engineering writing, hand-collected.</h1>
          <p className="wf-serif wf-muted2" style={{fontSize:15,lineHeight:1.55,marginTop:10,maxWidth:560}}>
            <span style={{color:'var(--ink)',fontWeight:600}}>1,284 articles</span> across 486 companies. Filter by type, tag, company or date.
          </p>
        </div>
      </header>

      {/* ── TOOLBAR ── consolidated filter bar (no left rail) ── */}
      <div style={{padding:'18px 56px',position:'sticky',top:0,background:'var(--bg)',zIndex:5,borderBottom:'1px solid var(--line-soft)'}}>
        <div style={{maxWidth:1240,margin:'0 auto',display:'flex',flexDirection:'column',gap:12}}>
          {/* Row 1: type filter pills, scrollable horizontally if overflow */}
          <div style={{display:'flex',gap:14,alignItems:'center'}}>
            <span className="wf-eyebrow" style={{flex:'0 0 auto'}}>Type</span>
            <div style={{display:'flex',gap:6,flex:1,overflow:'auto'}}>
              {types.map((t,i) => <Chip key={t} variant={i===1?'solid':''}>{t}</Chip>)}
            </div>
          </div>

          {/* Row 2: combobox filters + sort + view toggle */}
          <div style={{display:'grid',gridTemplateColumns:'1.4fr 1.2fr 1fr 140px auto',gap:10,alignItems:'center'}}>
            {/* Tag combobox */}
            <Box style={{padding:'8px 12px',display:'flex',alignItems:'center',gap:8,fontSize:12,color:'var(--ink-2)',background:'var(--bg-soft)'}}>
              <span className="wf-mono" style={{color:'var(--ink-3)'}}>#</span>
              <span style={{flex:1}}>postgres, llm <span className="wf-muted">+ add tag</span></span>
              <span className="wf-mono wf-muted">▾</span>
            </Box>
            {/* Company combobox */}
            <Box style={{padding:'8px 12px',display:'flex',alignItems:'center',gap:8,fontSize:12,color:'var(--ink-3)',background:'var(--bg-soft)'}}>
              <span className="wf-mono">◧</span>
              <span style={{flex:1}}>Any company</span>
              <span className="wf-mono wf-muted">▾</span>
            </Box>
            {/* Date range segmented */}
            <div style={{display:'flex',border:'1px solid var(--line)',borderRadius:'var(--r-sm)',overflow:'hidden',background:'var(--bg-soft)'}}>
              {['Week','Month','6mo','All'].map((d,i) => (
                <div key={d} style={{flex:1,padding:'7px 0',textAlign:'center',fontSize:11,fontWeight: i===1?600:400,color:i===1?'var(--bg)':'var(--ink-2)',background:i===1?'var(--ink)':'transparent',cursor:'pointer'}}>{d}</div>
              ))}
            </div>
            {/* Sort */}
            <Box style={{padding:'8px 12px',display:'flex',alignItems:'center',gap:6,fontSize:12,background:'var(--bg-soft)'}}>
              <span className="wf-mono wf-muted">↕</span>
              <span style={{flex:1}}>Trending</span>
              <span className="wf-mono wf-muted">▾</span>
            </Box>
            {/* View toggle */}
            <div style={{display:'flex',border:'1px solid var(--line)',borderRadius:'var(--r-sm)',overflow:'hidden'}}>
              <div style={{padding:'7px 10px',background:'var(--ink)',color:'var(--bg)',fontFamily:'var(--mono)',fontSize:12,cursor:'pointer'}}>▦</div>
              <div style={{padding:'7px 10px',background:'var(--bg)',color:'var(--ink-3)',fontFamily:'var(--mono)',fontSize:12,cursor:'pointer'}}>≡</div>
            </div>
          </div>

          {/* Row 3: active filters + result count */}
          <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
            <span className="wf-muted" style={{fontSize:11,fontFamily:'var(--mono)',letterSpacing:.4}}>
              <span style={{color:'var(--ink)',fontWeight:600}}>248 articles</span> match your filters
            </span>
            <span style={{width:3,height:3,borderRadius:99,background:'var(--ink-3)'}}/>
            <Chip variant="solid">Engineering ×</Chip>
            <Chip variant="solid">#postgres ×</Chip>
            <Chip variant="solid">#llm ×</Chip>
            <Chip variant="solid">Last month ×</Chip>
            <span style={{fontSize:11,color:'var(--accent-ink)',textDecoration:'underline',cursor:'pointer'}}>Clear all</span>
          </div>
        </div>
      </div>

      {/* ── FEATURED PINNED CARD ── */}
      <section style={{padding:'24px 56px 8px'}}>
        <div style={{maxWidth:1240,margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:12}}>
            <span className="wf-eyebrow">Featured this week</span>
            <span style={{flex:1,borderTop:'1px solid var(--line-soft)'}}/>
          </div>
          <Box style={{padding:0,overflow:'hidden',display:'grid',gridTemplateColumns:'1.4fr 1fr',background:'var(--bg-soft)'}}>
            <Img label="cover · 1200 × 630" h={260}/>
            <div style={{padding:'28px 32px',display:'flex',flexDirection:'column',justifyContent:'center',gap:12}}>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <Badge variant="accent">Postmortem</Badge>
                <span className="wf-mono wf-muted" style={{fontSize:11}}>· editor's pick</span>
              </div>
              <h2 className="wf-h2" style={{fontSize:26,lineHeight:1.15}}>How we cut p99 latency from 800ms → 120ms</h2>
              <p className="wf-serif wf-muted2" style={{margin:0,fontSize:14,lineHeight:1.55}}>
                A walkthrough of how Aurora's checkout team dropped p99 in three weeks — and the two rewrites we threw away to get there.
              </p>
              <div style={{display:'flex',alignItems:'center',gap:10,marginTop:6,fontSize:12,color:'var(--ink-2)'}}>
                <Avatar size={22} initials="ZK"/>Zara Khan
                <span className="wf-muted">·</span>
                <Logo initials="A" size={20}/>Aurora Labs
                <span className="wf-muted">· May 16 · 8 min · 4.2k reads</span>
              </div>
              <div style={{display:'flex',gap:6,marginTop:4}}>
                <Chip>postgres</Chip><Chip>latency</Chip><Chip>postmortem</Chip>
              </div>
            </div>
          </Box>
        </div>
      </section>

      {/* ── RESULT GRID ── uniform 3-col cards, fixed 16:9 covers ── */}
      <section style={{padding:'24px 56px 32px'}}>
        <div style={{maxWidth:1240,margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'baseline',gap:10,marginBottom:14}}>
            <span className="wf-eyebrow">All results</span>
            <span style={{flex:1,borderTop:'1px solid var(--line-soft)'}}/>
            <span className="wf-muted wf-mono" style={{fontSize:11}}>showing 1–9 of 248</span>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20}}>
            {articles.map((a,i) => (
              <article key={i} style={{display:'flex',flexDirection:'column',cursor:'pointer',transition:'transform .15s'}}>
                <div style={{aspectRatio:'16/9',background:'var(--bg-soft)',borderRadius:'var(--r-sm)',overflow:'hidden',border:'1px solid var(--line)',position:'relative'}}>
                  <div className="wf-img" style={{width:'100%',height:'100%',border:'none',borderRadius:0}}>cover</div>
                  <div style={{position:'absolute',top:10,left:10}}>
                    <Badge>{a.type}</Badge>
                  </div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:8,padding:'14px 0 0'}}>
                  <h3 className="wf-h3" style={{fontSize:17,lineHeight:1.25,letterSpacing:'-.2px'}}>{a.title}</h3>
                  <div style={{display:'flex',gap:8,alignItems:'center',fontSize:12,color:'var(--ink-2)'}}>
                    <Avatar size={18} initials={a.author.split(' ').map(s=>s[0]).join('')}/>
                    <span>{a.author}</span>
                    {a.co !== 'Personal' && (
                      <>
                        <span className="wf-muted">·</span>
                        <Logo initials={a.logo} size={16}/>
                        <span>{a.co}</span>
                      </>
                    )}
                  </div>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                    {a.tags.map(t => <Chip key={t}>#{t}</Chip>)}
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'auto',paddingTop:8,borderTop:'1px solid var(--line-soft)',fontSize:11,color:'var(--ink-3)',fontFamily:'var(--mono)'}}>
                    <span>{a.date}</span>
                    <span style={{display:'flex',gap:10}}>
                      <span>↻ {a.reads}</span>
                      <span>⧗ {a.mins}</span>
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginTop:36,paddingTop:24,borderTop:'1px solid var(--line-soft)'}}>
            <Btn size="sm" variant="ghost">‹ Prev</Btn>
            {['1','2','3','4','…','28'].map((p,i) => (
              <div key={i} style={{
                minWidth:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:12,fontWeight: p==='1'?600:400,
                color: p==='1'?'var(--bg)':'var(--ink-2)',
                background: p==='1'?'var(--ink)':'transparent',
                borderRadius:'var(--r-sm)',cursor:'pointer',
                fontFamily:'var(--mono)',
              }}>{p}</div>
            ))}
            <Btn size="sm">Next ›</Btn>
          </div>
        </div>
      </section>
    </div>
    <Annot n={1} x={30} y={210} w={210}>Toolbar replaces the old left rail — every filter visible in one row, sticky on scroll.</Annot>
    <Annot n={2} x={30} y={460} align="right" w={220}>Featured card pinned above the grid — one editor's pick per week, gently set apart by the soft background.</Annot>
    <Annot n={3} x={30} y={780} align="right" w={210}>Uniform 16:9 covers + consistent meta footer keep the grid visually aligned at any width.</Annot>
  </Frame>
  );
};

// TAG PAGE
const TagPage = () => (
  <Frame label="11 · Tag page" sub="/tag/[tagname] · auto-generated, SEO surface">
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'auto'}}>
      <TopNav active="Tags"/>
      <div style={{padding:'40px 48px 18px',display:'grid',gridTemplateColumns:'2fr 1fr',gap:32,alignItems:'end',borderBottom:'1px solid var(--wf-line-soft)'}}>
        <div>
          <span className="wf-eyebrow">Topic</span>
          <h1 className="wf-h1" style={{fontSize:44,marginTop:6}}>#postgres</h1>
          <p className="wf-serif wf-muted2" style={{maxWidth:520,marginTop:8,fontSize:14}}>
            Engineering writing about Postgres on Lorestack — migrations, performance, gotchas, war stories. <span className="wf-muted">186 articles · 14 companies</span>
          </p>
        </div>
        <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
          <Btn>+ Follow tag</Btn>
          <Btn variant="ghost" icon="↗">RSS</Btn>
        </div>
      </div>

      <div style={{padding:'18px 48px',display:'flex',gap:14,alignItems:'center',background:'var(--wf-fill)',borderBottom:'1px solid var(--wf-line-soft)'}}>
        <span className="wf-eyebrow">Companies writing about Postgres</span>
        <div style={{display:'flex',gap:8}}>
          {['Aurora','Hexa','Northstar','Quiver','Lambda','Verge','Sift','Plume'].map(c => (
            <Logo key={c} initials={c[0]} size={28}/>
          ))}
        </div>
        <span style={{flex:1}}/>
        <span className="wf-muted" style={{fontSize:11}}>see all →</span>
      </div>

      <div style={{padding:'24px 48px',display:'grid',gridTemplateColumns:'2fr 1fr',gap:28}}>
        <div>
          <div style={{display:'flex',gap:6,marginBottom:12}}>
            <Chip variant="solid">Newest</Chip>
            <Chip>Most read</Chip>
            <Chip>Trending</Chip>
          </div>
          {[1,2,3,4,5].map(i => (
            <div key={i} style={{padding:'14px 0',borderTop:'1px solid var(--wf-line-soft)',display:'grid',gridTemplateColumns:'1fr 160px',gap:18}}>
              <div>
                <div style={{display:'flex',gap:8,alignItems:'center',fontSize:11,color:'var(--wf-ink-3)'}}>
                  <Logo initials="A" size={18}/> Aurora Labs · May {16-i} · 8 min
                </div>
                <h3 className="wf-h2" style={{fontSize:20,marginTop:8}}>
                  {['How we cut p99 latency from 800ms → 120ms','The boring postgres migration that wasn\'t','Three things Postgres taught us this year','When to reach for pg_partman (and when not to)','Vacuum is not your enemy'][i-1]}
                </h3>
                <p className="wf-serif wf-muted2" style={{margin:'6px 0 0',fontSize:13,lineHeight:1.5}}>
                  A walkthrough of how Aurora's checkout team dropped p99 in three weeks...
                </p>
                <div style={{display:'flex',gap:6,marginTop:8}}><Chip>postgres</Chip><Chip>latency</Chip></div>
              </div>
              <Img label="" h={100}/>
            </div>
          ))}
        </div>
        <div>
          <div className="wf-eyebrow" style={{marginBottom:8}}>Related tags</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {['kafka','migrations','observability','sqlite','vacuum','indices','replication','wal'].map(t => <Chip key={t}>#{t}</Chip>)}
          </div>
        </div>
      </div>
    </div>
    <Annot n={1} x={20} y={130} w={210}>Every tag used in any blog auto-generates this page. Compounding SEO.</Annot>
    <Annot n={2} x={20} y={300} align="right" w={200}>Description is admin-editable. Default placeholder if not set.</Annot>
  </Frame>
);

Object.assign(window, { HomeEditorial, HomeFeed, BlogReading, AuthorProfile, Explore, TagPage });
