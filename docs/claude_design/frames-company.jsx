// frames-company.jsx — Create company, company dashboard, public company page, invite modal

const CreateCompany = () => (
  <Frame label="12 · Create company" sub="single-page form — no wizard">
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'auto'}}>
      <TopNav loggedIn />
      <div style={{padding:'32px 48px',maxWidth:900,width:'100%',margin:'0 auto'}}>
        <span className="wf-eyebrow">New company</span>
        <h1 className="wf-h1" style={{fontSize:32,marginTop:6}}>Create your company profile.</h1>
        <p className="wf-serif wf-muted2" style={{margin:'8px 0 24px',fontSize:14,maxWidth:560}}>
          You'll become the Company Owner. Invite your team after — it takes about a minute.
        </p>

        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:32}}>
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <Input label="Company name" required placeholder="Aurora Labs"/>
            <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:0,alignItems:'flex-end'}}>
              <div style={{display:'flex',alignItems:'center',padding:'9px 11px',border:'var(--wf-stroke-w) solid var(--wf-line)',borderRight:'none',borderRadius:'3px 0 0 3px',background:'var(--wf-fill)',color:'var(--wf-ink-2)',fontFamily:'var(--wf-mono)',fontSize:12,minHeight:36,marginTop:24}}>
                lorestack.com/company/
              </div>
              <Input label="Handle" required value="aurora-labs" hint="Lowercase letters, numbers, hyphens. URL is permanent (redirect on change)." style={{}}/>
            </div>
            <Input label="Tagline" required placeholder="Infra for the AI-native era" hint="Max 160 characters · shown on every company card"/>
            <Input label="Website" placeholder="https://aurora-labs.com"/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div>
                <label style={{font:'600 11px var(--wf-sans)',color:'var(--wf-ink-2)',marginBottom:6,display:'block'}}>Industry</label>
                <Box style={{padding:'9px 11px',display:'flex',justifyContent:'space-between',color:'var(--wf-ink-3)',fontSize:12}}>
                  <span>SaaS</span><span>▾</span>
                </Box>
              </div>
              <div>
                <label style={{font:'600 11px var(--wf-sans)',color:'var(--wf-ink-2)',marginBottom:6,display:'block'}}>Tech stack</label>
                <Box style={{padding:'7px 11px',fontSize:11,display:'flex',flexWrap:'wrap',gap:4}}>
                  <Chip variant="solid">postgres ×</Chip>
                  <Chip variant="solid">go ×</Chip>
                  <Chip variant="solid">k8s ×</Chip>
                  <span style={{color:'var(--wf-ink-3)'}}>+ add</span>
                </Box>
              </div>
            </div>
            <Input label="Founder Twitter/X or LinkedIn" placeholder="@auroralabs / linkedin.com/in/founder"/>
          </div>

          {/* Right column: logo upload + live card preview */}
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div>
              <label style={{font:'600 11px var(--wf-sans)',color:'var(--wf-ink-2)',marginBottom:6,display:'block'}}>Company logo</label>
              <Box dashed style={{padding:20,textAlign:'center'}}>
                <Img label="" h={80} w={80} style={{margin:'0 auto 10px',borderStyle:'dashed'}}/>
                <div style={{fontSize:12,color:'var(--wf-ink-2)'}}>Drop PNG / JPG / SVG</div>
                <div className="wf-muted" style={{fontSize:10,marginTop:2}}>max 2MB · square</div>
              </Box>
            </div>
            <div>
              <div className="wf-eyebrow" style={{marginBottom:8}}>Live preview</div>
              <Box style={{padding:14,display:'flex',gap:12,alignItems:'flex-start'}}>
                <Logo initials="A" size={44}/>
                <div>
                  <div style={{font:'700 14px var(--wf-serif)'}}>Aurora Labs</div>
                  <div className="wf-muted" style={{fontSize:11,marginTop:2}}>Infra for the AI-native era</div>
                  <div style={{display:'flex',gap:4,marginTop:8}}>
                    <Badge style={{fontSize:9}}>SaaS</Badge>
                    <Badge style={{fontSize:9}}>0 posts</Badge>
                  </div>
                </div>
              </Box>
              <div className="wf-muted" style={{fontSize:11,marginTop:8,fontFamily:'var(--wf-mono)'}}>lorestack.com/company/aurora-labs</div>
            </div>
          </div>
        </div>

        <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:28,paddingTop:18,borderTop:'1px solid var(--wf-line-soft)'}}>
          <Btn variant="ghost">Cancel</Btn>
          <Btn variant="primary" size="lg">Create company</Btn>
        </div>
      </div>
    </div>
    <Annot n={1} x={30} y={250} w={210}>Handle auto-suggests from name and updates lowercase-hyphenated as you type.</Annot>
    <Annot n={2} x={20} y={350} align="right" w={210}>Live card preview to the right — shows the user exactly what their company will look like.</Annot>
  </Frame>
);

const companySidebar = [
  { heading: 'Aurora Labs' },
  { label: 'Overview', icon: '⌂' },
  { label: 'Blogs', icon: '◆', count: 24 },
  { label: 'Team', icon: '◐', count: 6 },
  { label: 'Timeline', icon: '⌒', count: 18 },
  { label: 'Analytics', icon: '∿' },
  { heading: 'Settings' },
  { label: 'Profile', icon: '⚙' },
  { label: 'Billing', icon: '$' },
];

const CompanyDashboard = () => (
  <Frame label="13 · Company dashboard" sub="owner view · team / blogs / timeline">
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <TopNav loggedIn />
      <div style={{display:'grid',gridTemplateColumns:'200px 1fr',flex:1,minHeight:0}}>
        <Sidebar items={companySidebar} active="Team"/>
        <div style={{padding:'24px 32px',overflow:'auto'}}>
          {/* Header */}
          <div style={{display:'flex',gap:14,alignItems:'flex-start',paddingBottom:18,borderBottom:'1px solid var(--wf-line-soft)'}}>
            <Logo initials="A" size={56}/>
            <div style={{flex:1}}>
              <h1 className="wf-h2" style={{fontSize:24}}>Aurora Labs</h1>
              <div className="wf-muted" style={{fontSize:12,marginTop:2}}>lorestack.com/company/aurora-labs · 24 blogs · 6 team</div>
            </div>
            <Btn size="sm">View public page ↗</Btn>
            <Btn size="sm" variant="primary">+ Invite author</Btn>
          </div>

          {/* Tab bar */}
          <div style={{display:'flex',gap:18,marginTop:18,borderBottom:'1px solid var(--wf-line-soft)'}}>
            {['Overview','Blogs','Team','Timeline','Analytics','Settings'].map((t,i) => (
              <div key={t} style={{padding:'10px 0',fontSize:13,fontWeight:i===2?600:400,color:i===2?'var(--wf-ink)':'var(--wf-ink-3)',borderBottom:i===2?'2px solid var(--wf-accent)':'2px solid transparent'}}>
                {t}
              </div>
            ))}
          </div>

          {/* Team list */}
          <div style={{marginTop:20,display:'flex',flexDirection:'column',gap:14}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
              <h3 className="wf-h3" style={{fontSize:16}}>Team <span className="wf-muted">· 6</span></h3>
              <div style={{display:'flex',gap:6}}>
                <Box style={{padding:'4px 10px',fontSize:11}}>⌕ search</Box>
                <Box style={{padding:'4px 10px',fontSize:11}}>Role: All ▾</Box>
              </div>
            </div>

            <Box>
              {[
                ['Zara Khan','zara@aurora.dev','Owner','Mar 12 2026',7],
                ['Mei Lin','mei@aurora.dev','Author','Apr 04 2026',5],
                ['Nikhil Rao','nik@aurora.dev','Author','Apr 18 2026',4],
                ['Sam Jacobs','sam@aurora.dev','Author','May 02 2026',3],
                ['Ria Tan','ria@aurora.dev','Author','May 08 2026',2],
                ['Devon Park','devon@aurora.dev','Author','May 14 2026',0],
              ].map((r,i) => (
                <div key={i} style={{display:'grid',gridTemplateColumns:'40px 1fr 100px 130px 80px 60px',padding:'12px 14px',gap:14,alignItems:'center',borderTop:i?'1px solid var(--wf-line-soft)':'none'}}>
                  <Avatar size={30} initials={r[0].split(' ').map(s=>s[0]).join('')}/>
                  <div>
                    <div style={{fontWeight:600,fontSize:13}}>{r[0]}</div>
                    <div className="wf-muted wf-mono" style={{fontSize:11}}>{r[1]}</div>
                  </div>
                  <Badge variant={r[2]==='Owner'?'accent':''}>{r[2]}</Badge>
                  <span className="wf-muted" style={{fontSize:11}}>joined {r[3]}</span>
                  <span style={{fontSize:12,fontWeight:600}}>{r[4]} posts</span>
                  <span className="wf-muted" style={{textAlign:'right'}}>···</span>
                </div>
              ))}
            </Box>

            {/* Pending invites */}
            <div style={{marginTop:14}}>
              <div className="wf-eyebrow" style={{marginBottom:8}}>Pending invites · 2</div>
              <Box>
                {[
                  ['priya@aurora.dev','sent May 18','expires in 6 days'],
                  ['jamal@aurora.dev','sent May 14','expires in 2 days'],
                ].map((r,i) => (
                  <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 130px 140px 100px',padding:'10px 14px',gap:14,alignItems:'center',borderTop:i?'1px solid var(--wf-line-soft)':'none'}}>
                    <span className="wf-mono" style={{fontSize:12}}>{r[0]}</span>
                    <span className="wf-muted" style={{fontSize:11}}>{r[1]}</span>
                    <span style={{fontSize:11,color:'var(--wf-accent)'}}>{r[2]}</span>
                    <div style={{display:'flex',gap:6,justifyContent:'flex-end'}}>
                      <Btn size="sm" variant="ghost">resend</Btn>
                      <Btn size="sm" variant="ghost">×</Btn>
                    </div>
                  </div>
                ))}
              </Box>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Annot n={1} x={30} y={130} w={210}>Tabbed dashboard. Team tab shown; Blogs/Timeline/Analytics follow same shell.</Annot>
    <Annot n={2} x={20} y={460} align="right" w={210}>Pending invites with 7-day expiry. Resend or revoke from "···".</Annot>
  </Frame>
);

const InviteModal = () => (
  <Frame label="13b · Invite author modal" sub="opens from Team tab">
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <TopNav loggedIn />
      <div style={{display:'grid',gridTemplateColumns:'200px 1fr',flex:1,minHeight:0,opacity:.45}}>
        <Sidebar items={companySidebar} active="Team"/>
        <div style={{padding:'24px 32px'}}>
          <h1 className="wf-h2">Aurora Labs · Team</h1>
        </div>
      </div>
    </div>
    <Modal w={460}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:6}}>
        <h3 className="wf-h2" style={{fontSize:20}}>Invite an author</h3>
        <span className="wf-muted" style={{fontSize:14,cursor:'pointer'}}>×</span>
      </div>
      <p className="wf-muted" style={{margin:'0 0 14px',fontSize:12}}>
        They'll receive an email invite. The link is valid for 7 days.
      </p>
      <Input label="Email address" required placeholder="someone@aurora.dev"/>
      <Box variant="soft" style={{marginTop:14,padding:'10px 12px',display:'flex',gap:8,alignItems:'flex-start'}}>
        <span style={{fontFamily:'var(--wf-mono)',color:'var(--wf-ink-2)'}}>ⓘ</span>
        <div style={{fontSize:11,color:'var(--wf-ink-2)',lineHeight:1.5}}>
          Authors can write blogs under Aurora Labs. They cannot invite others or edit company settings.
          <br/><span className="wf-muted">In MVP: only the Author role exists.</span>
        </div>
      </Box>
      <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:18}}>
        <Btn variant="ghost">Cancel</Btn>
        <Btn variant="primary">Send invite</Btn>
      </div>
    </Modal>
    <Annot n={1} x={620} y={200} w={220}>Single-field form. Role isn't selectable — MVP only has Author.</Annot>
  </Frame>
);

// PUBLIC COMPANY PAGE
const PublicCompany = () => (
  <Frame label="14 · Public company page" sub="/company/[handle] · tabs Blogs / Team / Timeline">
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'auto'}}>
      <TopNav active="Companies"/>
      {/* Banner */}
      <div style={{padding:'40px 48px 24px',display:'grid',gridTemplateColumns:'auto 1fr auto',gap:20,alignItems:'flex-start',borderBottom:'1px solid var(--wf-line-soft)'}}>
        <Logo initials="A" size={88}/>
        <div>
          <span className="wf-eyebrow">Company</span>
          <h1 className="wf-h1" style={{fontSize:34,marginTop:6}}>Aurora Labs</h1>
          <p className="wf-serif wf-muted2" style={{maxWidth:540,marginTop:8,fontSize:15}}>
            Infra for the AI-native era. We build the boring underlying systems so other teams can ship something interesting.
          </p>
          <div style={{display:'flex',gap:6,marginTop:12,flexWrap:'wrap'}}>
            <Badge variant="accent">SaaS</Badge>
            <Chip>postgres</Chip><Chip>go</Chip><Chip>kubernetes</Chip><Chip>kafka</Chip>
          </div>
          <div style={{display:'flex',gap:14,marginTop:14,fontSize:12,color:'var(--wf-ink-2)'}}>
            <span className="wf-mono">↗ aurora-labs.com</span>
            <span className="wf-mono">↗ @auroralabs</span>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:8,alignItems:'flex-end'}}>
          <Btn variant="accent">+ Follow</Btn>
          <div className="wf-muted" style={{fontSize:11}}>2,419 followers · 24 posts</div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{display:'flex',gap:24,padding:'0 48px',borderBottom:'1px solid var(--wf-line-soft)'}}>
        {['Blogs · 24','Team · 6','Timeline · 18'].map((t,i) => (
          <div key={t} style={{padding:'14px 0',fontSize:13,fontWeight:i===0?600:400,color:i===0?'var(--wf-ink)':'var(--wf-ink-3)',borderBottom:i===0?'2px solid var(--wf-accent)':'2px solid transparent'}}>{t}</div>
        ))}
      </div>

      {/* Blogs tab content */}
      <div style={{padding:'24px 48px',display:'grid',gridTemplateColumns:'1fr 280px',gap:32}}>
        <div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
            <div style={{display:'flex',gap:6}}>
              <Chip variant="solid">All</Chip>
              <Chip>Engineering</Chip>
              <Chip>Postmortem</Chip>
              <Chip>Founder note</Chip>
            </div>
            <Box style={{padding:'4px 8px',fontSize:11}}>Sort: Newest ▾</Box>
          </div>

          <div style={{display:'flex',flexDirection:'column'}}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 200px',gap:18,padding:'18px 0',borderTop:'1px solid var(--wf-line-soft)'}}>
                <div>
                  <Badge>{['Postmortem','Architecture','Case study','Tutorial'][i-1]}</Badge>
                  <h3 className="wf-h2" style={{fontSize:22,marginTop:8}}>
                    {['How we cut p99 latency from 800ms → 120ms','The boring postgres migration that wasn\'t','Rewriting our billing pipeline live','Three things Postgres taught us'][i-1]}
                  </h3>
                  <p className="wf-serif wf-muted2" style={{margin:'6px 0 0',fontSize:13,lineHeight:1.5,maxWidth:500}}>A walkthrough of how the checkout team dropped p99 in three weeks...</p>
                  <div style={{display:'flex',gap:8,alignItems:'center',marginTop:10,fontSize:11,color:'var(--wf-ink-3)'}}>
                    <Avatar size={16} initials="ZK"/>Zara Khan · May {16-i} · 8 min · 4.2k reads
                  </div>
                </div>
                <Img label="cover" h={120}/>
              </div>
            ))}
          </div>
        </div>

        {/* Right rail */}
        <div style={{display:'flex',flexDirection:'column',gap:18}}>
          <div>
            <div className="wf-eyebrow" style={{marginBottom:8}}>The team</div>
            <Box style={{padding:'10px 12px',display:'flex',flexDirection:'column',gap:8}}>
              {[
                ['Zara Khan','Owner'],['Mei Lin','Author'],['Nikhil Rao','Author'],['Sam Jacobs','Author']
              ].map(([n,r]) => (
                <div key={n} style={{display:'flex',gap:8,alignItems:'center'}}>
                  <Avatar size={26} initials={n.split(' ').map(s=>s[0]).join('')}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:600}}>{n}</div>
                    <div className="wf-muted" style={{fontSize:10}}>{r}</div>
                  </div>
                </div>
              ))}
              <span style={{fontSize:11,color:'var(--wf-accent)',textDecoration:'underline',textAlign:'center'}}>See all 6 →</span>
            </Box>
          </div>
          <div>
            <div className="wf-eyebrow" style={{marginBottom:8}}>Recent milestones</div>
            <Box style={{padding:'10px 12px',display:'flex',flexDirection:'column',gap:10}}>
              {[
                ['LAUNCH','Aurora v2 is live','May 12'],
                ['MILESTONE','Crossed 1,000 paying teams','May 4'],
                ['INFRA','Cut p99 to 120ms','Apr 28'],
              ].map(([k,t,d]) => (
                <div key={t} style={{display:'flex',gap:8}}>
                  <span style={{width:8,height:8,borderRadius:99,background:'var(--wf-accent)',marginTop:6}}/>
                  <div style={{flex:1}}>
                    <span className="wf-mono" style={{fontSize:10,color:'var(--wf-ink-3)'}}>{k}</span>
                    <div style={{fontSize:12,fontWeight:600,fontFamily:'var(--wf-serif)'}}>{t}</div>
                    <div className="wf-muted" style={{fontSize:10}}>{d}</div>
                  </div>
                </div>
              ))}
              <span style={{fontSize:11,color:'var(--wf-accent)',textDecoration:'underline',textAlign:'center'}}>View full timeline →</span>
            </Box>
          </div>
        </div>
      </div>
    </div>
    <Annot n={1} x={20} y={220} w={210}>Blogs tab is default. Other tabs use the same content shell.</Annot>
    <Annot n={2} x={20} y={460} align="right" w={210}>Right rail surfaces team + timeline; both have deeper tab views.</Annot>
  </Frame>
);

// TIMELINE TAB
const TimelineTab = () => (
  <Frame label="15 · Company timeline" sub="build-in-public log · public, anchored URLs">
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'auto'}}>
      <TopNav active="Companies"/>
      <div style={{padding:'32px 48px 18px',display:'flex',gap:18,alignItems:'flex-start',borderBottom:'1px solid var(--wf-line-soft)'}}>
        <Logo initials="A" size={48}/>
        <div style={{flex:1}}>
          <h1 className="wf-h2">Aurora Labs · Timeline</h1>
          <p className="wf-muted" style={{margin:0,fontSize:12}}>The journey of shipping Aurora — milestones, launches, scars.</p>
        </div>
        <Btn size="sm" icon="↗">Share timeline</Btn>
      </div>
      <div style={{display:'flex',gap:24,padding:'0 48px',borderBottom:'1px solid var(--wf-line-soft)'}}>
        {['Blogs · 24','Team · 6','Timeline · 18'].map((t,i) => (
          <div key={t} style={{padding:'14px 0',fontSize:13,fontWeight:i===2?600:400,color:i===2?'var(--wf-ink)':'var(--wf-ink-3)',borderBottom:i===2?'2px solid var(--wf-accent)':'2px solid transparent'}}>{t}</div>
        ))}
      </div>

      <div style={{padding:'24px 48px',display:'grid',gridTemplateColumns:'180px 1fr',gap:40,position:'relative'}}>
        <div style={{position:'sticky',top:0,height:'fit-content'}}>
          <div className="wf-eyebrow" style={{marginBottom:8}}>Jump to</div>
          {['May 2026','April 2026','March 2026','February 2026'].map((m,i) => (
            <div key={m} style={{padding:'5px 0',fontSize:12,fontWeight:i===0?600:400,color:i===0?'var(--wf-ink)':'var(--wf-ink-3)'}}>{m}</div>
          ))}
        </div>

        <div style={{borderLeft:'var(--wf-stroke-w) solid var(--wf-line)',paddingLeft:24,position:'relative'}}>
          {[
            { m:'May 2026', items:[
              { type:'LAUNCH', t:'Aurora v2 is live', d:'May 12', desc:'Rebuilt the read path on Foundation. Public beta opens to all teams.', metric:'10× write throughput' },
              { type:'MILESTONE', t:'Crossed 1,000 paying teams', d:'May 4', desc:'Took 18 months. The next 1,000 will be faster.', metric:null },
            ]},
            { m:'April 2026', items:[
              { type:'INFRA', t:'p99 latency: 800ms → 120ms', d:'Apr 28', desc:null, metric:'120ms p99 globally' },
              { type:'HIRING', t:'Two senior infra engineers joined', d:'Apr 14', desc:null, metric:null },
            ]},
            { m:'March 2026', items:[
              { type:'PARTNERSHIP', t:'Designated partner for AI-native infra at re:Cloud', d:'Mar 22', desc:null, metric:null },
              { type:'FUNDING', t:'Closed Series A · $14M', d:'Mar 03', desc:'Led by Lemma Capital. Building out the platform team.', metric:'$14M Series A' },
            ]},
          ].map(group => (
            <div key={group.m} style={{marginBottom:28}}>
              <div className="wf-eyebrow" style={{marginBottom:14,fontSize:11,color:'var(--wf-ink-2)'}}>— {group.m} —</div>
              <div style={{display:'flex',flexDirection:'column',gap:18}}>
                {group.items.map(it => (
                  <div key={it.t} style={{position:'relative'}}>
                    <span style={{position:'absolute',left:-31,top:6,width:12,height:12,borderRadius:99,background:'var(--wf-bg)',border:'var(--wf-stroke-w) solid var(--wf-accent)'}}/>
                    <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:4}}>
                      <Badge>{it.type}</Badge>
                      <span className="wf-muted" style={{fontSize:11}}>{it.d}</span>
                    </div>
                    <h3 className="wf-h3" style={{fontSize:17}}>{it.t}</h3>
                    {it.desc && <p className="wf-serif" style={{margin:'4px 0 0',fontSize:13,color:'var(--wf-ink-2)',lineHeight:1.55,maxWidth:560}}>{it.desc}</p>}
                    {it.metric && <Chip variant="accent" style={{marginTop:8}}>{it.metric}</Chip>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Annot n={1} x={20} y={210} w={210}>Each milestone has anchored URL: /company/aurora#timeline-id — shareable individually.</Annot>
    <Annot n={2} x={20} y={400} align="right" w={210}>Type chip + impact metric chip. Color-coded per milestone type.</Annot>
  </Frame>
);

Object.assign(window, { CreateCompany, CompanyDashboard, InviteModal, PublicCompany, TimelineTab });
