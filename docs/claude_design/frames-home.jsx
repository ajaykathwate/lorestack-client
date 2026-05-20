// frames-home.jsx — Rich homepage (logged out + logged in variants) + Search modal frame

// Big, content-rich homepage as the user's first impression.
// Logged-out: editorial hero, top blogs, featured companies, trending tags,
// build-in-public highlights, writer CTA, newsletter signup, footer.
const HomepageRich = ({ loggedIn }) => (
  <Frame label={loggedIn ? "07b · Homepage — logged in" : "07a · Homepage — logged out"} sub={loggedIn ? "personalised + content-rich" : "first-impression landing"}>
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'auto'}}>
      <TopNav loggedIn={loggedIn} />

      {/* ────── HERO ────── */}
      {!loggedIn ? (
        <section style={{padding:'48px 56px 32px',display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:48,alignItems:'center',borderBottom:'1px solid var(--wf-line-soft)'}}>
          <div>
            <span className="wf-eyebrow">A home for engineering stories</span>
            <h1 className="wf-h1" style={{fontSize:54,lineHeight:1.02,marginTop:10,maxWidth:580}}>
              Long-form writing for the people who actually <em style={{fontStyle:'italic',color:'var(--wf-accent)'}}>ship</em>.
            </h1>
            <p className="wf-serif wf-muted2" style={{fontSize:17,lineHeight:1.55,marginTop:16,maxWidth:520}}>
              Engineering blogs, architecture deep-dives, post-mortems and build-in-public timelines — under your name or your company's.
            </p>
            <div style={{display:'flex',gap:10,marginTop:24}}>
              <Btn variant="accent" size="lg">Start writing — it's free</Btn>
              <Btn size="lg">Explore articles</Btn>
            </div>
            {/* Stat strip */}
            <div style={{display:'flex',gap:36,marginTop:32,paddingTop:20,borderTop:'1px solid var(--wf-line-soft)'}}>
              {[['2,419','writers shipping'],['14,206','articles'],['486','companies'],['1.3M','reads / month']].map(([n,l]) => (
                <div key={l}>
                  <div style={{font:'600 22px var(--wf-serif)'}}>{n}</div>
                  <div className="wf-muted" style={{fontSize:11,marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{position:'relative'}}>
            <Img label="cover · this week's lead story" h={300}/>
            <Box style={{position:'absolute',bottom:-20,left:-20,right:32,padding:14,background:'var(--wf-bg)'}}>
              <Badge variant="accent">This week's lead</Badge>
              <div style={{font:'600 18px var(--wf-serif)',marginTop:8,lineHeight:1.25}}>How we cut p99 latency from 800ms → 120ms</div>
              <div className="wf-muted" style={{fontSize:11,marginTop:8,display:'flex',gap:6,alignItems:'center'}}>
                <Avatar size={16} initials="ZK"/>Zara Khan · Aurora Labs · 8 min
              </div>
            </Box>
          </div>
        </section>
      ) : (
        <section style={{padding:'24px 56px',background:'var(--wf-fill)',borderBottom:'1px solid var(--wf-line-soft)'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <span className="wf-eyebrow">Good morning</span>
              <h1 className="wf-h2" style={{fontSize:26,marginTop:4}}>Welcome back, Zara.</h1>
              <p className="wf-muted2" style={{margin:'4px 0 0',fontSize:13}}>You have <span style={{color:'var(--wf-accent)'}}>3 drafts</span> waiting, and <span style={{color:'var(--wf-accent)'}}>1 scheduled</span> post going live in 2 days.</p>
            </div>
            <div style={{display:'flex',gap:8}}>
              <Btn>View drafts (3)</Btn>
              <Btn>My dashboard</Btn>
              <Btn variant="accent">+ Write blog</Btn>
            </div>
          </div>
        </section>
      )}

      {/* ────── BROWSE BY TYPE ────── */}
      <section style={{padding:'24px 56px 0',display:'flex',alignItems:'center',gap:14,overflow:'hidden'}}>
        <span className="wf-eyebrow" style={{flex:'0 0 auto'}}>Browse by type</span>
        <div style={{display:'flex',gap:6,overflow:'auto',flex:1}}>
          {['All','Engineering','Architecture','Case study','Founder note','Postmortem','Tutorial','AI experiment','Opinion','Open source','Project showcase'].map((t,i) => (
            <Chip key={t} variant={i===0?'solid':''}>{t}</Chip>
          ))}
        </div>
      </section>

      {/* ────── TOP BLOGS THIS WEEK ────── */}
      <section style={{padding:'18px 56px 32px'}}>
        <div style={{display:'flex',alignItems:'baseline',gap:14,marginBottom:14}}>
          <h2 className="wf-h2">Trending this week</h2>
          <div style={{flex:1,borderTop:'1px solid var(--wf-line-soft)'}}/>
          <span style={{fontSize:11,color:'var(--wf-accent)',textDecoration:'underline'}}>See all →</span>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:18}}>
          {/* Big feature card (left, spans full height) */}
          <Box style={{padding:0,overflow:'hidden',display:'flex',flexDirection:'column'}}>
            <Img label="cover · 1200 × 630" h={260}/>
            <div style={{padding:'18px 20px',display:'flex',flexDirection:'column',gap:8}}>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <Badge variant="accent">Architecture deep dive</Badge>
                <span className="wf-mono wf-muted" style={{fontSize:11}}>#1 trending</span>
              </div>
              <h3 className="wf-h2" style={{fontSize:24,lineHeight:1.15}}>The boring postgres migration that wasn't — and the five hours we'd like back.</h3>
              <p className="wf-serif wf-muted2" style={{margin:0,fontSize:14,lineHeight:1.5}}>
                A meticulous walk-through of a "simple" 9.6 → 16 upgrade that turned into a 5-hour incident — what we did wrong, what saved us, and the dashboard we now bet our SLOs on.
              </p>
              <div style={{display:'flex',alignItems:'center',gap:10,marginTop:6,fontSize:12,color:'var(--wf-ink-2)'}}>
                <Avatar size={22} initials="ML"/>Mei Lin
                <span className="wf-muted">·</span>
                <Logo initials="A" size={20}/>Aurora Labs
                <span className="wf-muted">· May 14 · 12 min · 8.4k reads</span>
              </div>
            </div>
          </Box>

          {/* Right column: stacked cards */}
          <div style={{display:'flex',flexDirection:'column',gap:14,gridColumn:'span 2',gridTemplateColumns:'1fr 1fr',display:'grid'}}>
            {[
              ['Postmortem','How we cut p99 latency from 800ms → 120ms','Aurora Labs','Zara Khan','4.2k','8 min'],
              ['Founder note','Why we shipped slower this quarter','Hexa.io','Ria Tan','2.1k','5 min'],
              ['Case study','Rewriting our billing pipeline live in prod','Aurora Labs','Nikhil Rao','5.6k','9 min'],
              ['Tutorial','A pragmatic guide to feature flags','—','Sam Jacobs','3.4k','12 min'],
            ].map((row,i) => (
              <Box key={i} style={{padding:0,overflow:'hidden',display:'flex',flexDirection:'column'}}>
                <Img label="" h={100}/>
                <div style={{padding:'10px 12px',display:'flex',flexDirection:'column',gap:6}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <Badge>{row[0]}</Badge>
                    <span className="wf-mono wf-muted" style={{fontSize:10}}>#{i+2}</span>
                  </div>
                  <div style={{font:'600 14px var(--wf-serif)',lineHeight:1.25}}>{row[1]}</div>
                  <div className="wf-muted" style={{fontSize:11,display:'flex',gap:5,alignItems:'center'}}>
                    <Avatar size={14} initials={row[3].split(' ').map(s=>s[0]).join('')}/>{row[3]} · {row[2]} · {row[5]}
                    <span style={{flex:1}}/>
                    <span className="wf-mono">↻ {row[4]}</span>
                  </div>
                </div>
              </Box>
            ))}
          </div>
        </div>
      </section>

      {/* ────── FEATURED COMPANIES ────── */}
      <section style={{padding:'24px 56px',background:'var(--wf-fill)',borderTop:'1px solid var(--wf-line-soft)',borderBottom:'1px solid var(--wf-line-soft)'}}>
        <div style={{display:'flex',alignItems:'baseline',gap:14,marginBottom:14}}>
          <h2 className="wf-h2">Featured companies</h2>
          <span className="wf-muted" style={{fontSize:12}}>· hand-picked by the Lorestack team</span>
          <div style={{flex:1,borderTop:'1px solid var(--wf-line-soft)'}}/>
          <span style={{fontSize:11,color:'var(--wf-accent)',textDecoration:'underline'}}>Browse all companies →</span>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
          {[
            ['Aurora Labs','Infra for the AI-native era','24'],
            ['Hexa.io','Build-in-public dev tools','18'],
            ['Northstar','Observability, done quietly','14'],
            ['Quiver','Real-time databases for everyone','12'],
            ['Lambdacat','Compilers, runtimes, snark','9'],
            ['Verge','Edge platform for the JS-curious','11'],
            ['Sift','Search infra for the unindexable','7'],
            ['Plume','Distributed cron, finally','5'],
          ].map(([n,t,c]) => (
            <Box key={n} style={{padding:14,display:'flex',flexDirection:'column',gap:8,background:'var(--wf-bg)'}}>
              <div style={{display:'flex',gap:10,alignItems:'center'}}>
                <Logo initials={n[0]} size={36}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{font:'600 13px var(--wf-serif)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{n}</div>
                  <div className="wf-muted" style={{fontSize:10,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{t}</div>
                </div>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:'auto'}}>
                <span className="wf-mono wf-muted" style={{fontSize:11}}>{c} posts</span>
                <Btn size="sm">+ Follow</Btn>
              </div>
            </Box>
          ))}
        </div>
      </section>

      {/* ────── TRENDING TAGS + RECENT DEEP DIVES (split row) ────── */}
      <section style={{padding:'32px 56px',display:'grid',gridTemplateColumns:'2fr 1fr',gap:36}}>
        {/* Recent deep dives */}
        <div>
          <div style={{display:'flex',alignItems:'baseline',gap:14,marginBottom:14}}>
            <h2 className="wf-h2">Recent deep dives</h2>
            <div style={{flex:1,borderTop:'1px solid var(--wf-line-soft)'}}/>
            <Chip variant="solid">Architecture</Chip>
            <Chip>Case study</Chip>
            <Chip>Postmortem</Chip>
          </div>
          <div style={{display:'flex',flexDirection:'column'}}>
            {[
              ['Three things Postgres taught us this year','Architecture','Hexa.io','Mei Lin','May 10','11 min'],
              ['When to reach for pg_partman (and when not to)','Architecture','Quiver','Ana Brown','May 08','8 min'],
              ['3 hours of cascading Redis failover','Postmortem','Stripe Crew','Nikhil','May 06','9 min'],
              ['The case against your microservice','Opinion','Northstar','David K','May 02','6 min'],
            ].map((r,i) => (
              <div key={i} style={{display:'grid',gridTemplateColumns:'40px 1fr 160px',gap:14,padding:'14px 0',borderTop:i?'1px solid var(--wf-line-soft)':'1px solid var(--wf-line-soft)',alignItems:'center'}}>
                <span style={{font:'600 18px var(--wf-serif)',color:'var(--wf-ink-3)'}}>0{i+1}</span>
                <div>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <Badge>{r[1]}</Badge>
                    <span className="wf-muted" style={{fontSize:11}}>{r[4]} · {r[5]}</span>
                  </div>
                  <h3 className="wf-h3" style={{fontSize:16,marginTop:6,lineHeight:1.3}}>{r[0]}</h3>
                  <div className="wf-muted" style={{fontSize:11,marginTop:4,display:'flex',gap:6,alignItems:'center'}}>
                    <Avatar size={14} initials={r[3].split(' ').map(s=>s[0]).join('')}/>{r[3]} · {r[2]}
                  </div>
                </div>
                <Img label="" h={68}/>
              </div>
            ))}
          </div>
        </div>

        {/* Right rail: trending tags + top writers */}
        <div style={{display:'flex',flexDirection:'column',gap:24}}>
          <div>
            <div className="wf-eyebrow" style={{borderTop:'1px solid var(--wf-line-soft)',paddingTop:10,marginBottom:10}}>Trending tags · this week</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {[['postgres',186],['llm',142],['feature-flags',108],['observability',97],['postmortem',88],['kafka',76],['migrations',71],['dx',62],['onboarding',54],['kubernetes',49],['rust',47],['typescript',44]].map(([t,n]) => (
                <Chip key={t} style={{display:'inline-flex',gap:4,alignItems:'center'}}>
                  #{t}<span className="wf-muted" style={{fontSize:10,fontFamily:'var(--wf-mono)'}}>· {n}</span>
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <div className="wf-eyebrow" style={{borderTop:'1px solid var(--wf-line-soft)',paddingTop:10,marginBottom:10}}>Top writers · this week</div>
            <Box style={{padding:0}}>
              {[['ZK','Zara Khan','Aurora Labs','4.2k'],['ML','Mei Lin','Hexa.io','8.4k'],['NR','Nikhil Rao','Aurora Labs','5.6k'],['SJ','Sam Jacobs','—','3.4k']].map((w,i) => (
                <div key={i} style={{display:'flex',gap:10,alignItems:'center',padding:'9px 12px',borderTop:i?'1px solid var(--wf-line-soft)':'none'}}>
                  <span style={{font:'600 12px var(--wf-serif)',color:'var(--wf-ink-3)',width:14}}>{i+1}</span>
                  <Avatar size={26} initials={w[0]}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:600}}>{w[1]}</div>
                    <div className="wf-muted" style={{fontSize:10}}>{w[2]}</div>
                  </div>
                  <span className="wf-mono wf-muted" style={{fontSize:11}}>↻ {w[3]}</span>
                </div>
              ))}
            </Box>
          </div>
        </div>
      </section>

      {/* ────── BUILD-IN-PUBLIC HIGHLIGHTS ────── */}
      <section style={{padding:'32px 56px',background:'var(--wf-fill)',borderTop:'1px solid var(--wf-line-soft)'}}>
        <div style={{display:'flex',alignItems:'baseline',gap:14,marginBottom:14}}>
          <h2 className="wf-h2">Build-in-public this week</h2>
          <span className="wf-muted" style={{fontSize:12}}>· milestones from companies you can follow</span>
          <div style={{flex:1,borderTop:'1px solid var(--wf-line-soft)'}}/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
          {[
            { co:'Aurora Labs', logo:'A', type:'LAUNCH', title:'Aurora v2 is live', d:'May 12', metric:'10× write throughput' },
            { co:'Hexa.io',     logo:'H', type:'MILESTONE', title:'Crossed 5,000 paying teams', d:'May 09', metric:null },
            { co:'Northstar',   logo:'N', type:'FUNDING', title:'Closed Series A', d:'May 06', metric:'$14M' },
            { co:'Quiver',      logo:'Q', type:'INFRA', title:'p99 dropped to 12ms globally', d:'May 04', metric:null },
            { co:'Verge',       logo:'V', type:'PARTNERSHIP', title:'Designated partner for re:Cloud', d:'May 02', metric:null },
            { co:'Plume',       logo:'P', type:'HIRING', title:'Two senior infra engineers joined', d:'Apr 30', metric:null },
          ].map((m,i) => (
            <Box key={i} style={{padding:14,background:'var(--wf-bg)'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                <Logo initials={m.logo} size={24}/>
                <span style={{fontSize:12,fontWeight:600}}>{m.co}</span>
                <Badge style={{fontSize:9,marginLeft:'auto'}}>{m.type}</Badge>
              </div>
              <div style={{font:'600 14px var(--wf-serif)',lineHeight:1.3}}>{m.title}</div>
              <div className="wf-muted" style={{fontSize:11,marginTop:6}}>{m.d}</div>
              {m.metric && <Chip variant="accent" style={{marginTop:8}}>{m.metric}</Chip>}
            </Box>
          ))}
        </div>
      </section>

      {/* ────── WRITER CTA STRIP ────── */}
      {!loggedIn && (
        <section style={{padding:'48px 56px',background:'var(--wf-ink)',color:'var(--wf-bg)',display:'grid',gridTemplateColumns:'2fr 1fr',gap:32,alignItems:'center'}}>
          <div>
            <span style={{font:'600 10px/1 var(--wf-mono)',letterSpacing:1.2,textTransform:'uppercase',color:'var(--wf-accent)'}}>For writers</span>
            <h2 className="wf-h2" style={{fontSize:30,color:'var(--wf-bg)',marginTop:8,maxWidth:580}}>
              Publish under your name, your company, or both. We handle the SEO, the OG images, and the build-in-public timeline.
            </h2>
            <ul style={{margin:'16px 0 0',padding:0,listStyle:'none',display:'flex',gap:24,fontSize:13,opacity:.85}}>
              <li>— Auto-generated tag pages</li>
              <li>— Per-blog and per-company analytics</li>
              <li>— Scheduled publishing across timezones</li>
              <li>— No ads, ever</li>
            </ul>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10,alignItems:'flex-end'}}>
            <Btn variant="accent" size="lg">Create your account</Btn>
            <Btn size="lg" style={{background:'transparent',color:'var(--wf-bg)',borderColor:'var(--wf-bg)'}}>Read the writer guide</Btn>
          </div>
        </section>
      )}

      {/* ────── NEWSLETTER ────── */}
      <section style={{padding:'32px 56px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:32,alignItems:'center',borderTop:'1px solid var(--wf-line-soft)'}}>
        <div>
          <span className="wf-eyebrow">The weekly digest</span>
          <h3 className="wf-h2" style={{fontSize:22,marginTop:6}}>The best engineering writing, in your inbox each Friday.</h3>
          <p className="wf-muted2" style={{margin:'6px 0 0',fontSize:13}}>Hand-picked. 5-minute read. Unsubscribe anytime.</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          <Box style={{padding:'10px 14px',flex:1,color:'var(--wf-ink-3)',fontSize:13}}>you@studio.dev</Box>
          <Btn variant="primary" size="lg">Subscribe</Btn>
        </div>
      </section>

      {/* ────── FOOTER ────── */}
      <footer style={{padding:'24px 56px 32px',borderTop:'var(--wf-stroke-w) solid var(--wf-line)',background:'var(--wf-fill)',display:'grid',gridTemplateColumns:'1.5fr 1fr 1fr 1fr 1fr',gap:24,fontSize:12,color:'var(--wf-ink-2)'}}>
        <div>
          <Wordmark size={16}/>
          <p className="wf-muted2" style={{margin:'10px 0 0',fontSize:11,lineHeight:1.5,maxWidth:240}}>
            A home for engineering stories. Made with care for the people who actually ship.
          </p>
          <div style={{display:'flex',gap:8,marginTop:14,fontFamily:'var(--wf-mono)',fontSize:11}}>
            <span>↗ twitter</span><span>↗ github</span><span>↗ rss</span>
          </div>
        </div>
        {[
          ['Read',['Explore','Companies','Tags','Authors','Featured']],
          ['Write',['Start writing','Writer guide','Editor docs','Schedule blogs','Companies on Lorestack']],
          ['Platform',['Pricing','Roadmap','Changelog','Status']],
          ['Company',['About','Contact','Privacy','Terms']],
        ].map(([h, items]) => (
          <div key={h}>
            <div className="wf-eyebrow" style={{marginBottom:10}}>{h}</div>
            <ul style={{margin:0,padding:0,listStyle:'none',display:'flex',flexDirection:'column',gap:6,fontSize:11}}>
              {items.map(i => <li key={i}>{i}</li>)}
            </ul>
          </div>
        ))}
      </footer>
    </div>

    <Annot n={1} x={20} y={130} w={210}>Slack-style search dead-center in the navbar on every page. Click → modal (see 18 · Search).</Annot>
    {!loggedIn && <Annot n={2} x={20} y={300} w={210}>Editorial hero: serif headline, dual CTA, stat strip. Featured story photo overlaps to break the grid.</Annot>}
    <Annot n={3} x={30} y={620} align="right" w={220}>Trending = view-velocity ranking. Same ranking surfaces on /explore.</Annot>
    <Annot n={4} x={30} y={1080} align="right" w={220}>Build-in-public is a first-class section, not buried under each company.</Annot>
  </Frame>
);

const HomepagePublic = () => <HomepageRich />;
const HomepageLoggedIn = () => <HomepageRich loggedIn />;

// Search modal — over the homepage so it's grounded in context.
const SearchModalFrame = () => (
  <Frame label="18 · Search modal" sub="⌘K · grouped results · open from any page">
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden',opacity:.55}}>
      <TopNav loggedIn />
      <section style={{padding:'48px 56px 32px'}}>
        <h1 className="wf-h1" style={{fontSize:48}}>Long-form writing for the people who ship.</h1>
      </section>
    </div>
    <SearchModal query="postgres"/>
    <Annot n={1} x={120} y={140} w={210}>Opens from the centered search bar in TopNav, ⌘K, or "/" anywhere.</Annot>
    <Annot n={2} x={680} y={300}>Group filters above results: All · Blogs · Companies · People · Tags.</Annot>
    <Annot n={3} x={680} y={520}>Footer = keyboard hints + escape hatch to /search results page for full text query.</Annot>
  </Frame>
);

Object.assign(window, { HomepagePublic, HomepageLoggedIn, SearchModalFrame });
