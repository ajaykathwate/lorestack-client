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

// EXPLORE
const Explore = () => (
  <Frame label="10 · Explore — browse all" sub="filterable / sortable">
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'auto'}}>
      <TopNav active="Explore"/>
      <div style={{padding:'24px 48px 14px'}}>
        <span className="wf-eyebrow">Explore</span>
        <h1 className="wf-h2" style={{marginTop:4}}>Every blog on Lorestack <span className="wf-muted" style={{fontSize:14}}>· 1,284 articles</span></h1>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'240px 1fr',gap:28,padding:'0 48px 32px',flex:1}}>
        {/* Filter rail */}
        <div style={{display:'flex',flexDirection:'column',gap:18,fontSize:12}}>
          <div>
            <div className="wf-eyebrow" style={{marginBottom:6}}>Article type</div>
            {['Engineering blog','Architecture','Case study','Founder note','Tutorial','Postmortem','AI experiment','Opinion','Open source','Other'].map((t,i) => (
              <label key={t} style={{display:'flex',gap:6,alignItems:'center',padding:'3px 0',color:'var(--wf-ink-2)'}}>
                <span className="wf-box" style={{width:13,height:13,borderRadius:2,background:i<2?'var(--wf-ink)':'var(--wf-bg)',display:'inline-block'}}/>
                {t}
              </label>
            ))}
          </div>
          <div>
            <div className="wf-eyebrow" style={{marginBottom:6}}>Tags</div>
            <Box style={{padding:'6px 10px',color:'var(--wf-ink-3)',fontSize:11}}>⌕ search tags</Box>
            <div style={{display:'flex',flexWrap:'wrap',gap:4,marginTop:6}}>
              <Chip variant="solid">postgres ×</Chip>
              <Chip>llm</Chip><Chip>latency</Chip><Chip>kafka</Chip>
            </div>
          </div>
          <div>
            <div className="wf-eyebrow" style={{marginBottom:6}}>Company</div>
            <Box style={{padding:'6px 10px',color:'var(--wf-ink-3)',fontSize:11}}>⌕ pick a company</Box>
          </div>
          <div>
            <div className="wf-eyebrow" style={{marginBottom:6}}>Date range</div>
            {['Last week','Last month','Last 6 months','All time'].map((t,i) => (
              <label key={t} style={{display:'flex',gap:6,alignItems:'center',padding:'3px 0',color:'var(--wf-ink-2)'}}>
                <span style={{width:11,height:11,borderRadius:99,border:'var(--wf-stroke-w) solid var(--wf-line)',background:i===1?'var(--wf-ink)':'transparent'}}/>
                {t}
              </label>
            ))}
          </div>
        </div>

        {/* Results */}
        <div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
              <span className="wf-muted" style={{fontSize:12}}>Active filters:</span>
              <Chip variant="solid">type: Engineering ×</Chip>
              <Chip variant="solid">tag: postgres ×</Chip>
              <Chip variant="solid">last month ×</Chip>
              <span style={{fontSize:11,color:'var(--wf-accent)',textDecoration:'underline',marginLeft:6}}>Clear all</span>
            </div>
            <Box style={{padding:'4px 8px',fontSize:11}}>Sort: Newest ▾</Box>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:14}}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{display:'grid',gridTemplateColumns:'120px 1fr',gap:10,padding:'10px 0',borderTop: i===1?'1px solid var(--wf-line-soft)':'1px solid var(--wf-line-soft)'}}>
                <Img label="" h={80}/>
                <div style={{display:'flex',flexDirection:'column',gap:4}}>
                  <Badge style={{alignSelf:'flex-start'}}>{['Engineering','Postmortem','Architecture','Case study','Tutorial','Founder note'][i-1]}</Badge>
                  <div style={{font:'600 14px var(--wf-serif)',lineHeight:1.25}}>
                    {['How we cut p99 latency from 800ms → 120ms','3 hours of cascading Redis failover','The boring postgres migration that wasn\'t','Rewriting our billing pipeline live','A pragmatic guide to feature flags','Why we shipped slower this quarter'][i-1]}
                  </div>
                  <div className="wf-muted" style={{fontSize:11,display:'flex',gap:6,alignItems:'center'}}>
                    <Avatar size={14} initials="A"/>Aurora · May {16-i}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{textAlign:'center',marginTop:18}}>
            <Btn variant="ghost">Load more</Btn>
          </div>
        </div>
      </div>
    </div>
    <Annot n={1} x={20} y={130} w={170}>URL syncs with filters: /explore?type=tutorial&amp;tag=react — shareable.</Annot>
  </Frame>
);

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
