// frames-extras.jsx — Verify email, reset password, accept invite, settings,
//   drafts/scheduled/archived lists, blog analytics, edit company,
//   company analytics, notifications drawer, 404.

// ── AUTH EXTRAS ─────────────────────────────────────────────────────────────

const VerifyEmail = () => (
  <Frame label="01b · Check your inbox" sub="post-signup · awaiting email verification">
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <TopNav />
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'48px'}}>
        <div style={{maxWidth:440,textAlign:'center',display:'flex',flexDirection:'column',gap:14,alignItems:'center'}}>
          <Box style={{width:84,height:84,display:'flex',alignItems:'center',justifyContent:'center',background:'var(--wf-fill)'}}>
            <span style={{fontFamily:'var(--wf-mono)',fontSize:42,color:'var(--wf-accent)'}}>✉</span>
          </Box>
          <span className="wf-eyebrow">Almost there</span>
          <h1 className="wf-h1" style={{fontSize:30}}>Check your inbox.</h1>
          <p className="wf-serif wf-muted2" style={{fontSize:14,margin:0}}>
            We sent a verification link to <b style={{color:'var(--wf-ink)'}}>zara@studio.dev</b>. The link is valid for 24 hours.
          </p>
          <Box variant="soft" style={{padding:14,fontSize:12,color:'var(--wf-ink-2)',textAlign:'left',width:'100%'}}>
            <div style={{display:'flex',gap:8}}><span style={{color:'var(--wf-accent)'}}>1</span>Open the email titled "Verify your Lorestack account"</div>
            <div style={{display:'flex',gap:8,marginTop:6}}><span style={{color:'var(--wf-accent)'}}>2</span>Click <b>Verify email</b>. We'll bring you straight back here.</div>
            <div style={{display:'flex',gap:8,marginTop:6}}><span style={{color:'var(--wf-accent)'}}>3</span>If you don't see it, check spam or use the resend button below.</div>
          </Box>
          <div style={{display:'flex',gap:8,marginTop:6}}>
            <Btn>Resend email</Btn>
            <Btn variant="ghost">Change email</Btn>
          </div>
          <span className="wf-muted" style={{fontSize:11,marginTop:8}}>Wrong account? <span style={{color:'var(--wf-accent)',textDecoration:'underline'}}>Log out</span></span>
        </div>
      </div>
    </div>
    <Annot n={1} x={40} y={300} w={210}>Edge: link expired (&gt;24h) → "Resend" gives a new link. Already used → error toast.</Annot>
  </Frame>
);

const ResetPassword = () => (
  <Frame label="03b · Set new password" sub="after clicking reset link from email">
    <div style={{display:'flex',height:'100%',alignItems:'center',justifyContent:'center',padding:'48px',flexDirection:'column'}}>
      <Wordmark size={20} />
      <div style={{maxWidth:400,width:'100%',display:'flex',flexDirection:'column',gap:14,marginTop:18}}>
        <span className="wf-eyebrow">Step 3 of 3</span>
        <h2 className="wf-h2">Set a new password</h2>
        <p className="wf-muted2" style={{margin:0,fontSize:13}}>For <b>zara@studio.dev</b>. Choose something you'll remember — we'll log you out of all existing sessions.</p>
        <Input label="New password" required placeholder="••••••••" hint="Min 8 characters · use a mix of letters, numbers, symbols" type="password" />
        <Input label="Confirm new password" required placeholder="••••••••" type="password" />
        <Box variant="soft" style={{padding:'8px 12px',fontSize:11,color:'var(--wf-ink-2)',display:'flex',gap:8}}>
          <span style={{color:'var(--wf-accent)'}}>ⓘ</span>
          All other devices will be logged out for security.
        </Box>
        <Btn variant="primary" size="lg">Reset password</Btn>
      </div>
    </div>
    <Annot n={1} x={580} y={200} w={220}>Strength meter (not shown). Edge: weak / mismatched → inline below field.</Annot>
  </Frame>
);

const AcceptInvite = () => (
  <Frame label="16b · Accept team invite" sub="invitee landing · already-logged-in path">
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <TopNav loggedIn />
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'48px'}}>
        <div style={{maxWidth:480,width:'100%',display:'flex',flexDirection:'column',gap:18,alignItems:'center',textAlign:'center'}}>
          <Logo initials="A" size={72}/>
          <span className="wf-eyebrow">Team invitation</span>
          <h1 className="wf-h1" style={{fontSize:30}}>You've been invited to join <em style={{fontStyle:'italic',color:'var(--wf-accent)'}}>Aurora Labs</em>.</h1>
          <p className="wf-serif wf-muted2" style={{fontSize:14,margin:0,maxWidth:400}}>
            <b>Zara Khan</b> invited you as an <b>Author</b>. You'll be able to publish blogs under the Aurora Labs brand and appear on the company's team page.
          </p>

          <Box style={{padding:14,width:'100%',display:'flex',flexDirection:'column',gap:8,textAlign:'left'}}>
            <div className="wf-eyebrow">As an Author you can</div>
            <div style={{fontSize:12,color:'var(--wf-ink-2)',display:'flex',flexDirection:'column',gap:4}}>
              <span>— Write and publish blogs under Aurora Labs</span>
              <span>— Appear on the public team page at /company/aurora-labs</span>
              <span>— Read company analytics</span>
            </div>
            <div className="wf-eyebrow" style={{marginTop:6,color:'var(--wf-ink-3)'}}>You won't be able to</div>
            <div style={{fontSize:12,color:'var(--wf-ink-3)',display:'flex',flexDirection:'column',gap:4}}>
              <span>— Invite others or edit company settings</span>
              <span>— Archive other authors' blogs</span>
            </div>
          </Box>

          <div style={{display:'flex',gap:10}}>
            <Btn variant="ghost">Decline</Btn>
            <Btn variant="accent" size="lg">Accept invitation</Btn>
          </div>
          <span className="wf-muted" style={{fontSize:11}}>Invite expires in <b>6 days</b>. Logged in as <b>devon@studio.dev</b>.</span>
        </div>
      </div>
    </div>
    <Annot n={1} x={30} y={130} w={210}>Path B: invitee is already a Lorestack user. Path A redirects to signup w/ invite context preserved.</Annot>
  </Frame>
);

// ── USER SETTINGS ───────────────────────────────────────────────────────────

const settingsSidebar = [
  { heading: 'Settings' },
  { label: 'My profile', icon: '☺' },
  { label: 'Account', icon: '◐' },
  { label: 'Notifications', icon: '⌗' },
  { label: 'Security', icon: '⊕' },
  { label: 'Connected accounts', icon: '↔' },
  { label: 'Email preferences', icon: '✉' },
  { heading: 'Danger zone' },
  { label: 'Delete account', icon: '×' },
];

const SettingsProfile = () => (
  <Frame label="19 · Settings · My profile" sub="edit display name, username, bio, social">
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <TopNav loggedIn />
      <div style={{display:'grid',gridTemplateColumns:'220px 1fr',flex:1,minHeight:0}}>
        <Sidebar items={settingsSidebar} active="My profile"/>
        <div style={{padding:'24px 40px',overflow:'auto',maxWidth:880}}>
          <span className="wf-eyebrow">Settings</span>
          <h1 className="wf-h2" style={{fontSize:24,marginTop:4}}>My profile</h1>
          <p className="wf-muted2" style={{margin:'4px 0 22px',fontSize:13}}>
            Public information about you. Visible at <span className="wf-mono" style={{color:'var(--wf-ink)'}}>lorestack.com/author/zarakhan</span>.
          </p>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
            <div style={{gridColumn:'1 / -1',display:'flex',gap:18,alignItems:'center',paddingBottom:18,borderBottom:'1px solid var(--wf-line-soft)'}}>
              <Avatar size={80} initials="ZK"/>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:14}}>Profile photo</div>
                <div className="wf-muted" style={{fontSize:11,marginTop:2}}>JPG, PNG or WebP. Max 2MB. Square works best.</div>
                <div style={{display:'flex',gap:8,marginTop:10}}>
                  <Btn size="sm">Upload new</Btn>
                  <Btn size="sm" variant="ghost">Remove</Btn>
                </div>
              </div>
            </div>

            <Input label="Display name" required value="Zara Khan"/>
            <Input label="Username" required value="zarakhan" hint="Letters, numbers, hyphens, underscores."/>
            <div style={{gridColumn:'1 / -1'}}>
              <Input label="Bio" value="Distributed systems @ Aurora · ex-Stripe · postgres apologist." hint="296 / 300"/>
            </div>

            <div style={{gridColumn:'1 / -1'}}>
              <label style={{font:'600 11px var(--wf-sans)',color:'var(--wf-ink-2)',display:'block',marginBottom:6}}>Expertise tags <span className="wf-muted">· max 10</span></label>
              <Box style={{padding:'8px 10px',display:'flex',flexWrap:'wrap',gap:6,minHeight:42}}>
                {['distributed-systems','postgres','observability','postmortems','latency','migrations'].map(t => (
                  <Chip key={t} variant="solid">{t} ×</Chip>
                ))}
                <span style={{color:'var(--wf-ink-3)',fontSize:11,alignSelf:'center'}}>+ add</span>
              </Box>
            </div>
          </div>

          <div style={{marginTop:24,paddingTop:18,borderTop:'1px solid var(--wf-line-soft)'}}>
            <h3 className="wf-h3" style={{fontSize:15}}>Social links</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginTop:12}}>
              <Input label="Twitter / X" value="@zarakhan"/>
              <Input label="LinkedIn" value="linkedin.com/in/zarakhan"/>
              <Input label="GitHub" value="github.com/zarakhan"/>
              <Input label="Personal website" value="zara.dev"/>
            </div>
          </div>

          <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:22,paddingTop:18,borderTop:'1px solid var(--wf-line-soft)'}}>
            <Btn variant="ghost">Discard changes</Btn>
            <Btn variant="primary">Save profile</Btn>
          </div>
        </div>
      </div>
    </div>
    <Annot n={1} x={20} y={140} w={210}>Username change → 301 redirects old /author/[old] → new URL.</Annot>
  </Frame>
);

const SettingsAccount = () => (
  <Frame label="19b · Settings · Account" sub="email, password, 2FA, sessions">
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <TopNav loggedIn />
      <div style={{display:'grid',gridTemplateColumns:'220px 1fr',flex:1,minHeight:0}}>
        <Sidebar items={settingsSidebar} active="Account"/>
        <div style={{padding:'24px 40px',overflow:'auto',maxWidth:880}}>
          <span className="wf-eyebrow">Settings</span>
          <h1 className="wf-h2" style={{fontSize:24,marginTop:4}}>Account</h1>
          <p className="wf-muted2" style={{margin:'4px 0 22px',fontSize:13}}>Login credentials, two-factor auth, and active sessions.</p>

          <Box style={{padding:18,marginBottom:14,display:'grid',gridTemplateColumns:'1fr auto',gap:14,alignItems:'center'}}>
            <div>
              <h3 className="wf-h3" style={{fontSize:15}}>Email address</h3>
              <div style={{fontFamily:'var(--wf-mono)',fontSize:13,marginTop:4}}>zara@studio.dev</div>
              <div className="wf-muted" style={{fontSize:11,marginTop:4}}>Verified · changing this triggers re-verification</div>
            </div>
            <Btn>Change email</Btn>
          </Box>

          <Box style={{padding:18,marginBottom:14,display:'grid',gridTemplateColumns:'1fr auto',gap:14,alignItems:'center'}}>
            <div>
              <h3 className="wf-h3" style={{fontSize:15}}>Password</h3>
              <div className="wf-muted" style={{fontSize:11,marginTop:4}}>Last changed Mar 12, 2026 · 70 days ago</div>
            </div>
            <Btn>Change password</Btn>
          </Box>

          <Box style={{padding:18,marginBottom:14}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h3 className="wf-h3" style={{fontSize:15}}>Connected accounts</h3>
              <span className="wf-muted" style={{fontSize:11}}>1 connected</span>
            </div>
            <div style={{marginTop:10,display:'flex',flexDirection:'column',gap:10}}>
              {[['Google','zara@studio.dev · connected','disconnect'],['GitHub','—','Connect'],['Twitter/X','—','Connect']].map(([k,s,a]) => (
                <div key={k} style={{display:'grid',gridTemplateColumns:'32px 1fr auto',gap:10,alignItems:'center',padding:'8px 0',borderTop:'1px dashed var(--wf-line-soft)'}}>
                  <Box style={{width:28,height:28,display:'inline-flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--wf-mono)',fontWeight:700,fontSize:12}}>{k[0]}</Box>
                  <div>
                    <div style={{fontWeight:600,fontSize:12}}>{k}</div>
                    <div className="wf-muted" style={{fontSize:11}}>{s}</div>
                  </div>
                  <Btn size="sm" variant={a==='Connect'?'primary':'ghost'}>{a}</Btn>
                </div>
              ))}
            </div>
          </Box>

          <Box style={{padding:18}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <h3 className="wf-h3" style={{fontSize:15}}>Active sessions</h3>
              <Btn size="sm" variant="ghost">Sign out everywhere</Btn>
            </div>
            {[
              ['MacBook Pro · Chrome','Bangalore, IN · this session','current'],
              ['iPhone 15 · Safari','Bangalore, IN · 2h ago',''],
              ['Linux · Firefox','Mumbai, IN · yesterday','revoke'],
            ].map(([d,s,t],i) => (
              <div key={i} style={{display:'grid',gridTemplateColumns:'1fr auto auto',gap:10,alignItems:'center',padding:'10px 0',borderTop:'1px solid var(--wf-line-soft)'}}>
                <div>
                  <div style={{fontWeight:600,fontSize:12}}>{d}</div>
                  <div className="wf-muted" style={{fontSize:11}}>{s}</div>
                </div>
                {t==='current' && <Badge variant="accent">current</Badge>}
                {t==='revoke' && <Btn size="sm" variant="ghost">Revoke</Btn>}
                {t==='' && <span/>}
              </div>
            ))}
          </Box>
        </div>
      </div>
    </div>
  </Frame>
);

// ── DRAFTS / SCHEDULED / ARCHIVED ───────────────────────────────────────────

const DashShellHeader = ({ title, sub, action }) => (
  <div style={{padding:'24px 32px 14px',display:'flex',justifyContent:'space-between',alignItems:'baseline',borderBottom:'1px solid var(--wf-line-soft)'}}>
    <div>
      <span className="wf-eyebrow">Dashboard</span>
      <h1 className="wf-h2" style={{marginTop:4,fontSize:24}}>{title}</h1>
      {sub && <p className="wf-muted2" style={{margin:'4px 0 0',fontSize:12}}>{sub}</p>}
    </div>
    {action}
  </div>
);

const userSidebar = [
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

const Drafts = () => (
  <Frame label="20 · Drafts" sub="dashboard · auto-saved + manual drafts">
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <TopNav loggedIn />
      <div style={{display:'grid',gridTemplateColumns:'200px 1fr',flex:1,minHeight:0}}>
        <Sidebar items={userSidebar} active="Drafts"/>
        <div style={{overflow:'auto'}}>
          <DashShellHeader title="Drafts · 3" sub="Auto-saved every 30s. Local backup in your browser if offline."
            action={<Btn variant="accent">+ New blog</Btn>}/>
          <div style={{padding:'18px 32px'}}>
            <div style={{display:'flex',gap:6,marginBottom:14}}>
              <Chip variant="solid">All</Chip>
              <Chip>With title</Chip>
              <Chip>Untitled</Chip>
              <span style={{flex:1}}/>
              <Box style={{padding:'4px 8px',fontSize:11}}>Sort: Last edited ▾</Box>
            </div>
            <Box>
              {[
                ['A pragmatic guide to feature flags','Personal','1,284','2d ago','Tutorial'],
                ['Untitled draft','—','86','5d ago','—'],
                ['Notes for a quarterly engineering review','Aurora Labs','3,420','1w ago','Founder note'],
              ].map((r,i) => (
                <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 130px 120px 110px 100px',padding:'14px',gap:14,alignItems:'center',borderTop:i?'1px solid var(--wf-line-soft)':'none'}}>
                  <div>
                    <div style={{font:'600 14px var(--wf-serif)'}}>{r[0]}</div>
                    <div style={{display:'flex',gap:6,alignItems:'center',marginTop:4}}>
                      <Badge>{r[4]}</Badge>
                      <span className="wf-muted" style={{fontSize:11}}>{r[1]}</span>
                    </div>
                  </div>
                  <span className="wf-muted wf-mono" style={{fontSize:11}}>{r[2]} words</span>
                  <span className="wf-muted" style={{fontSize:11}}>edited {r[3]}</span>
                  <Btn size="sm">Continue</Btn>
                  <span className="wf-muted" style={{textAlign:'right'}}>···</span>
                </div>
              ))}
            </Box>
            <Box variant="soft" style={{marginTop:14,padding:'10px 14px',fontSize:11,color:'var(--wf-ink-2)',display:'flex',gap:8,alignItems:'center'}}>
              <span style={{color:'var(--wf-accent)'}}>⚠</span>
              <span><b>One draft is queued offline.</b> "Notes for a quarterly engineering review" hasn't synced — connection is required to save.</span>
              <span style={{flex:1}}/>
              <Btn size="sm">Retry sync</Btn>
            </Box>
          </div>
        </div>
      </div>
    </div>
    <Annot n={1} x={30} y={460} align="right" w={210}>Offline backup banner appears only when localStorage has unsynced content.</Annot>
  </Frame>
);

const Scheduled = () => (
  <Frame label="21 · Scheduled" sub="dashboard · auto-publish queue">
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <TopNav loggedIn />
      <div style={{display:'grid',gridTemplateColumns:'200px 1fr',flex:1,minHeight:0}}>
        <Sidebar items={userSidebar} active="Scheduled"/>
        <div style={{overflow:'auto'}}>
          <DashShellHeader title="Scheduled · 2" sub="Blogs queued to auto-publish at a specific date and time."
            action={<Btn variant="accent">+ New blog</Btn>}/>
          <div style={{padding:'18px 32px'}}>
            <Box>
              {[
                { title:'Why we shipped slower this quarter', co:'Hexa.io', when:'Wed, Jun 4 · 09:00 IST', cd:'in 2 days · 4 hrs', stat:'Scheduled', type:'Founder note' },
                { title:'A pragmatic guide to feature flags', co:'Personal', when:'Mon, Jun 9 · 18:00 IST', cd:'in 1 week', stat:'Scheduled', type:'Tutorial' },
              ].map((r,i) => (
                <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 200px 150px 140px',padding:'18px',gap:14,alignItems:'center',borderTop:i?'1px solid var(--wf-line-soft)':'none'}}>
                  <div>
                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                      <Badge variant="yellow">{r.stat}</Badge>
                      <Badge>{r.type}</Badge>
                    </div>
                    <div style={{font:'600 15px var(--wf-serif)',marginTop:6}}>{r.title}</div>
                    <div className="wf-muted" style={{fontSize:11,marginTop:4}}>{r.co}</div>
                  </div>
                  <div>
                    <div style={{fontSize:12,fontWeight:600}}>{r.when}</div>
                    <div className="wf-muted" style={{fontSize:11,marginTop:2}}>{r.cd}</div>
                  </div>
                  <div style={{display:'flex',gap:6}}>
                    <Btn size="sm">Edit</Btn>
                    <Btn size="sm" variant="ghost">Reschedule</Btn>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <Btn size="sm" variant="ghost">Cancel schedule</Btn>
                  </div>
                </div>
              ))}
            </Box>

            <Box variant="soft" style={{marginTop:14,padding:'10px 14px',fontSize:11,color:'var(--wf-ink-2)',display:'flex',gap:8,alignItems:'center'}}>
              <span className="wf-mono" style={{color:'var(--wf-accent)'}}>ⓘ</span>
              <span>You'll get an in-app and email notification when a scheduled blog goes live. Publish failures retry once, then surface here.</span>
            </Box>
          </div>
        </div>
      </div>
    </div>
    <Annot n={1} x={30} y={210} w={210}>Cancel schedule → blog reverts to Draft. Reschedule opens the schedule modal pre-filled.</Annot>
  </Frame>
);

const Archived = () => (
  <Frame label="22 · Archived" sub="hidden from public, restorable">
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <TopNav loggedIn />
      <div style={{display:'grid',gridTemplateColumns:'200px 1fr',flex:1,minHeight:0}}>
        <Sidebar items={userSidebar} active="Archived"/>
        <div style={{overflow:'auto'}}>
          <DashShellHeader title="Archived · 4" sub="Hidden from all public pages. Only you (and company owners) can see them."/>
          <div style={{padding:'18px 32px'}}>
            <Box>
              {[
                ['Old draft — first attempt at the migration story','Aurora Labs','Mar 04','Postmortem'],
                ['Half-baked thoughts on type systems','Personal','Feb 18','Opinion'],
                ['Rewrite of the billing pipeline (v1)','Aurora Labs','Jan 22','Case study'],
                ['Internal-only retro','Hexa.io','Jan 02','Founder note'],
              ].map((r,i) => (
                <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 140px 120px 120px',padding:'14px',gap:14,alignItems:'center',borderTop:i?'1px solid var(--wf-line-soft)':'none',opacity:.85}}>
                  <div>
                    <div style={{font:'600 14px var(--wf-serif)'}}>{r[0]}</div>
                    <div style={{display:'flex',gap:6,alignItems:'center',marginTop:4}}>
                      <Badge>{r[3]}</Badge>
                      <span className="wf-muted" style={{fontSize:11}}>{r[1]} · archived {r[2]}</span>
                    </div>
                  </div>
                  <Badge style={{justifySelf:'flex-start'}}>Archived</Badge>
                  <Btn size="sm">Unarchive</Btn>
                  <span className="wf-muted" style={{textAlign:'right',fontSize:11,textDecoration:'underline',color:'var(--wf-accent)'}}>Delete forever</span>
                </div>
              ))}
            </Box>
          </div>
        </div>
      </div>
    </div>
    <Annot n={1} x={30} y={300} align="right" w={210}>Archive ≠ delete. Unarchive restores to Published and re-adds the URL to sitemap.</Annot>
  </Frame>
);

// ── BLOG ANALYTICS ──────────────────────────────────────────────────────────

const BlogAnalytics = () => (
  <Frame label="23 · Blog analytics" sub="per-blog stats · readers, sources, time">
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <TopNav loggedIn />
      <div style={{padding:'24px 56px',overflow:'auto',flex:1,display:'flex',flexDirection:'column',gap:18}}>
        {/* Breadcrumb + title */}
        <div style={{display:'flex',gap:8,alignItems:'baseline'}}>
          <span className="wf-muted wf-mono" style={{fontSize:11}}>dashboard / my blogs /</span>
          <span style={{fontSize:11,color:'var(--wf-ink-2)'}}>How we cut p99 latency...</span>
        </div>
        <div style={{display:'flex',gap:14,alignItems:'flex-start'}}>
          <Img label="cover" w={140} h={84}/>
          <div style={{flex:1}}>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <Badge variant="accent">Postmortem</Badge>
              <Badge>Published</Badge>
              <span className="wf-muted" style={{fontSize:11}}>May 16 · Aurora Labs</span>
            </div>
            <h1 className="wf-h2" style={{fontSize:22,marginTop:6}}>How we cut p99 latency from 800ms → 120ms</h1>
            <div className="wf-mono wf-muted" style={{fontSize:11,marginTop:4}}>lorestack.com/blog/how-we-cut-p99-latency-800ms-120ms</div>
          </div>
          <div style={{display:'flex',gap:6}}>
            <Btn size="sm">View public ↗</Btn>
            <Btn size="sm">Edit</Btn>
            <Btn size="sm" variant="ghost">···</Btn>
          </div>
        </div>

        {/* Time range */}
        <div style={{display:'flex',gap:6}}>
          {['24h','7d','30d','90d','All-time'].map((t,i) => (
            <Chip key={t} variant={i===2?'solid':''}>{t}</Chip>
          ))}
          <span style={{flex:1}}/>
          <span className="wf-muted" style={{fontSize:11}}>vs. previous 30d</span>
        </div>

        {/* Stat strip */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10}}>
          {[
            ['Reads','4,218','+38%'],
            ['Unique readers','3,108','+42%'],
            ['Avg time on page','6m 24s','+12%'],
            ['Read-completion','62%','+4pts'],
            ['Shares','148','+12%'],
          ].map(([k,v,c]) => (
            <Box key={k} style={{padding:12}}>
              <div className="wf-eyebrow">{k}</div>
              <div style={{font:'600 22px var(--wf-serif)',marginTop:4}}>{v}</div>
              <div style={{fontSize:11,color:'var(--wf-accent)',marginTop:2}}>{c}</div>
            </Box>
          ))}
        </div>

        {/* Charts row */}
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:14}}>
          <Box style={{padding:14,height:220,display:'flex',flexDirection:'column'}}>
            <div style={{display:'flex',justifyContent:'space-between'}}>
              <h3 className="wf-h3" style={{fontSize:14}}>Reads over time</h3>
              <span className="wf-mono wf-muted" style={{fontSize:11}}>daily · 30d</span>
            </div>
            {/* fake bar/line chart */}
            <div style={{flex:1,display:'flex',gap:3,alignItems:'flex-end',marginTop:10}}>
              {Array.from({length:30}).map((_,i) => (
                <div key={i} style={{flex:1,background:i===17?'var(--wf-accent)':'var(--wf-line-soft)',height: (20+ (Math.sin(i*0.7)+1)*60 + (i>15?60:0)) + 'px'}}/>
              ))}
            </div>
          </Box>

          <Box style={{padding:14}}>
            <h3 className="wf-h3" style={{fontSize:14}}>Top referrers</h3>
            <div style={{display:'flex',flexDirection:'column',gap:8,marginTop:10,fontSize:12}}>
              {[['Hacker News','38%','1,602'],['Twitter / X','24%','1,012'],['Direct','18%','759'],['Google','12%','506'],['LinkedIn','5%','211'],['Other','3%','128']].map(([s,p,n]) => (
                <div key={s} style={{display:'grid',gridTemplateColumns:'90px 1fr 50px 60px',gap:8,alignItems:'center'}}>
                  <span>{s}</span>
                  <div style={{height:6,background:'var(--wf-line-soft)',borderRadius:99,overflow:'hidden'}}><div style={{width:p,height:'100%',background:'var(--wf-accent)'}}/></div>
                  <span className="wf-mono wf-muted">{p}</span>
                  <span className="wf-mono" style={{textAlign:'right'}}>{n}</span>
                </div>
              ))}
            </div>
          </Box>
        </div>

        {/* Geo + devices */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          <Box style={{padding:14}}>
            <h3 className="wf-h3" style={{fontSize:14}}>Where readers came from</h3>
            <div style={{display:'flex',flexDirection:'column',gap:6,marginTop:10,fontSize:12}}>
              {[['United States','1,108'],['India','842'],['Germany','318'],['United Kingdom','246'],['Brazil','142']].map(([c,n]) => (
                <div key={c} style={{display:'flex',justifyContent:'space-between',borderBottom:'1px dashed var(--wf-line-soft)',padding:'4px 0'}}>
                  <span>{c}</span><span className="wf-mono wf-muted">{n}</span>
                </div>
              ))}
            </div>
          </Box>
          <Box style={{padding:14}}>
            <h3 className="wf-h3" style={{fontSize:14}}>Devices</h3>
            <div style={{display:'flex',gap:14,marginTop:14}}>
              {[['Desktop','62%'],['Mobile','31%'],['Tablet','7%']].map(([k,v]) => (
                <div key={k} style={{flex:1,textAlign:'center'}}>
                  <div style={{font:'600 22px var(--wf-serif)'}}>{v}</div>
                  <div className="wf-muted" style={{fontSize:11,marginTop:2}}>{k}</div>
                </div>
              ))}
            </div>
          </Box>
        </div>
      </div>
    </div>
    <Annot n={1} x={30} y={140} w={210}>Per-blog deep dive. Company-level rolled up in Company Analytics (frame 25).</Annot>
  </Frame>
);

// ── COMPANY EXTRAS ──────────────────────────────────────────────────────────

const coSidebar = [
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

const EditCompany = () => (
  <Frame label="24 · Edit company profile" sub="company settings · owner-only">
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <TopNav loggedIn />
      <div style={{display:'grid',gridTemplateColumns:'200px 1fr',flex:1,minHeight:0}}>
        <Sidebar items={coSidebar} active="Profile"/>
        <div style={{padding:'24px 40px',overflow:'auto',maxWidth:1000}}>
          <span className="wf-eyebrow">Aurora Labs · Settings</span>
          <h1 className="wf-h2" style={{fontSize:24,marginTop:4}}>Company profile</h1>
          <p className="wf-muted2" style={{margin:'4px 0 22px',fontSize:13}}>Changes go live immediately on <span className="wf-mono">lorestack.com/company/aurora-labs</span>.</p>

          <div style={{display:'grid',gridTemplateColumns:'1fr 280px',gap:32}}>
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              <Input label="Company name" required value="Aurora Labs"/>
              <div>
                <Input label="Handle (URL slug)" required value="aurora-labs" hint="Changing this 301-redirects the old URL automatically."/>
                <Box variant="soft" style={{marginTop:8,padding:'8px 12px',fontSize:11,color:'var(--wf-ink-2)',display:'flex',gap:8,alignItems:'center'}}>
                  <span style={{color:'var(--wf-accent)'}}>⚠</span>
                  Old URL <span className="wf-mono">/company/aurora-labs</span> will redirect to the new one. Existing shares stay live.
                </Box>
              </div>
              <Input label="Tagline" required value="Infra for the AI-native era"/>
              <Input label="Website" value="https://aurora-labs.com"/>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                <div>
                  <label style={{font:'600 11px var(--wf-sans)',color:'var(--wf-ink-2)',marginBottom:6,display:'block'}}>Industry</label>
                  <Box style={{padding:'9px 11px',display:'flex',justifyContent:'space-between',fontSize:12}}>
                    SaaS<span>▾</span>
                  </Box>
                </div>
                <div>
                  <label style={{font:'600 11px var(--wf-sans)',color:'var(--wf-ink-2)',marginBottom:6,display:'block'}}>Tech stack</label>
                  <Box style={{padding:'7px 11px',display:'flex',flexWrap:'wrap',gap:4}}>
                    <Chip variant="solid">postgres ×</Chip>
                    <Chip variant="solid">go ×</Chip>
                    <Chip variant="solid">kubernetes ×</Chip>
                    <Chip variant="solid">kafka ×</Chip>
                  </Box>
                </div>
              </div>
              <Input label="Founder social" value="@auroralabs"/>
            </div>

            <div>
              <label style={{font:'600 11px var(--wf-sans)',color:'var(--wf-ink-2)',marginBottom:8,display:'block'}}>Company logo</label>
              <Box style={{padding:18,textAlign:'center',display:'flex',flexDirection:'column',gap:10,alignItems:'center'}}>
                <Logo initials="A" size={80}/>
                <Btn size="sm">Replace logo</Btn>
                <span className="wf-muted" style={{fontSize:10}}>PNG/JPG/SVG · max 2MB</span>
              </Box>

              <div className="wf-eyebrow" style={{marginTop:18,marginBottom:8}}>Danger zone</div>
              <Box style={{padding:14,border:'var(--wf-stroke-w) solid var(--wf-accent)'}}>
                <div style={{fontSize:12,fontWeight:600,color:'var(--wf-accent)'}}>Delete this company</div>
                <div className="wf-muted" style={{fontSize:11,marginTop:4,lineHeight:1.5}}>
                  This removes the company page, revokes all team memberships, and unlinks all blogs (they remain attributed to their authors).
                </div>
                <Btn size="sm" style={{marginTop:10,background:'var(--wf-accent)',color:'#fff',borderColor:'var(--wf-accent)'}}>Delete company</Btn>
              </Box>
            </div>
          </div>

          <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:24,paddingTop:18,borderTop:'1px solid var(--wf-line-soft)'}}>
            <Btn variant="ghost">Discard</Btn>
            <Btn variant="primary">Save changes</Btn>
          </div>
        </div>
      </div>
    </div>
  </Frame>
);

const CompanyAnalytics = () => (
  <Frame label="25 · Company analytics" sub="rolled-up reads, top posts, contributors">
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <TopNav loggedIn />
      <div style={{display:'grid',gridTemplateColumns:'200px 1fr',flex:1,minHeight:0}}>
        <Sidebar items={coSidebar} active="Analytics"/>
        <div style={{padding:'24px 32px',overflow:'auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:18}}>
            <div>
              <span className="wf-eyebrow">Aurora Labs</span>
              <h1 className="wf-h2" style={{fontSize:24,marginTop:4}}>Analytics</h1>
              <p className="wf-muted2" style={{margin:'4px 0 0',fontSize:12}}>Reads, reach, and contributor performance across 24 blogs.</p>
            </div>
            <div style={{display:'flex',gap:6}}>
              {['7d','30d','90d','All-time'].map((t,i) => <Chip key={t} variant={i===1?'solid':''}>{t}</Chip>)}
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:14}}>
            {[
              ['Total reads','148,206','+18%'],
              ['Unique readers','92,418','+22%'],
              ['New followers','+412','+8%'],
              ['Published this period','6','last: May 16']
            ].map(([k,v,c],i) => (
              <Box key={k} style={{padding:12}}>
                <div className="wf-eyebrow">{k}</div>
                <div style={{font:'600 22px var(--wf-serif)',marginTop:4}}>{v}</div>
                <div style={{fontSize:11,color:i===3?'var(--wf-ink-3)':'var(--wf-accent)',marginTop:2}}>{c}</div>
              </Box>
            ))}
          </div>

          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:14,marginBottom:14}}>
            <Box style={{padding:14,height:220,display:'flex',flexDirection:'column'}}>
              <h3 className="wf-h3" style={{fontSize:14}}>Reads · daily</h3>
              <div style={{flex:1,display:'flex',gap:3,alignItems:'flex-end',marginTop:10}}>
                {Array.from({length:30}).map((_,i) => (
                  <div key={i} style={{flex:1,background:'var(--wf-accent)',opacity:.4+ (Math.sin(i*0.5)+1)*0.3,height: (40+ (Math.sin(i*0.4)+1.2)*60) + 'px'}}/>
                ))}
              </div>
            </Box>
            <Box style={{padding:14}}>
              <h3 className="wf-h3" style={{fontSize:14}}>Top contributors</h3>
              <div style={{display:'flex',flexDirection:'column',gap:6,marginTop:10,fontSize:12}}>
                {[
                  ['ZK','Zara Khan','7 posts','22.4k'],
                  ['ML','Mei Lin','5 posts','18.1k'],
                  ['NR','Nikhil Rao','4 posts','11.2k'],
                  ['SJ','Sam Jacobs','3 posts','6.8k'],
                ].map(([i,n,p,r]) => (
                  <div key={n} style={{display:'grid',gridTemplateColumns:'28px 1fr 60px 60px',gap:8,alignItems:'center'}}>
                    <Avatar size={24} initials={i}/>
                    <span>{n}</span>
                    <span className="wf-muted" style={{fontSize:11}}>{p}</span>
                    <span className="wf-mono" style={{textAlign:'right'}}>{r}</span>
                  </div>
                ))}
              </div>
            </Box>
          </div>

          <Box style={{padding:0}}>
            <div style={{padding:'12px 14px',borderBottom:'1px solid var(--wf-line-soft)',display:'flex',justifyContent:'space-between'}}>
              <h3 className="wf-h3" style={{fontSize:14}}>Top posts this period</h3>
              <span style={{fontSize:11,color:'var(--wf-accent)'}}>Export CSV ↓</span>
            </div>
            {[
              ['How we cut p99 latency from 800ms → 120ms','Zara','Postmortem','4,218','62%','148'],
              ['The boring postgres migration that wasn\'t','Mei','Architecture','3,108','58%','98'],
              ['Rewriting our billing pipeline live','Nikhil','Case study','2,564','51%','64'],
              ['Three things Postgres taught us this year','Mei','Architecture','1,902','64%','48'],
            ].map((r,i) => (
              <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 100px 130px 80px 80px 80px',padding:'10px 14px',gap:10,alignItems:'center',borderTop:'1px solid var(--wf-line-soft)',fontSize:12}}>
                <span style={{fontFamily:'var(--wf-serif)',fontWeight:600}}>{r[0]}</span>
                <span className="wf-muted">{r[1]}</span>
                <Badge>{r[2]}</Badge>
                <span className="wf-mono" style={{textAlign:'right'}}>{r[3]}</span>
                <span className="wf-mono wf-muted" style={{textAlign:'right'}}>{r[4]}</span>
                <span className="wf-mono" style={{textAlign:'right'}}>{r[5]}</span>
              </div>
            ))}
          </Box>
        </div>
      </div>
    </div>
    <Annot n={1} x={30} y={140} w={210}>Both Owner and Company Authors can view; only Owner can export.</Annot>
  </Frame>
);

// ── NOTIFICATIONS ───────────────────────────────────────────────────────────

const Notifications = () => (
  <Frame label="26 · Notifications" sub="drawer · drops from bell in topnav">
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <TopNav loggedIn />
      <div style={{flex:1,padding:'24px 56px',background:'var(--wf-fill)',opacity:.55}}>
        <h1 className="wf-h2">Dashboard</h1>
      </div>
    </div>
    {/* Drawer */}
    <div style={{position:'absolute',top:50,right:50,width:380,maxHeight:540,background:'var(--wf-bg)',border:'var(--wf-stroke-w) solid var(--wf-line)',borderRadius:6,boxShadow:'0 12px 40px rgba(0,0,0,.25)',display:'flex',flexDirection:'column'}}>
      <div style={{display:'flex',alignItems:'center',padding:'12px 16px',borderBottom:'1px solid var(--wf-line-soft)'}}>
        <h3 className="wf-h3" style={{fontSize:14}}>Notifications</h3>
        <span className="wf-mono wf-muted" style={{fontSize:11,marginLeft:8}}>· 4 new</span>
        <span style={{flex:1}}/>
        <span style={{fontSize:11,color:'var(--wf-accent)',textDecoration:'underline'}}>Mark all read</span>
      </div>
      <div style={{display:'flex',gap:6,padding:'8px 16px',borderBottom:'1px solid var(--wf-line-soft)'}}>
        <Chip variant="solid">All</Chip>
        <Chip>Mentions</Chip>
        <Chip>Companies</Chip>
        <Chip>System</Chip>
      </div>
      <div style={{flex:1,overflow:'auto'}}>
        {[
          { type:'invite', dot:true, title:'You were invited to Aurora Labs', body:'Accept to join as Author', time:'2m ago' },
          { type:'publish', dot:true, title:'"How we cut p99 latency…" is live', body:'Scheduled blog auto-published 2 minutes ago', time:'just now' },
          { type:'follow', dot:true, title:'@meilin started following you', body:'Architecture writer at Hexa.io', time:'1h ago' },
          { type:'archive', dot:true, title:'Your blog was archived by an owner', body:'Aurora Labs · "Internal-only retro" hidden from public.', time:'3h ago' },
          { type:'tag', dot:false, title:'Your tag #postgres now has 186 posts', body:'You\'re featured among top tags this week.', time:'yesterday' },
          { type:'follow', dot:false, title:'+12 followers this week', body:'Aurora Labs gained 12 new followers', time:'2d ago' },
        ].map((n,i) => (
          <div key={i} style={{display:'grid',gridTemplateColumns:'8px 1fr',gap:8,padding:'10px 16px',borderTop:i?'1px solid var(--wf-line-soft)':'none',background:n.dot?'var(--wf-fill-2)':'transparent'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',marginTop:6}}>
              {n.dot && <span style={{width:7,height:7,borderRadius:99,background:'var(--wf-accent)'}}/>}
            </div>
            <div>
              <div style={{font:'600 13px var(--wf-serif)',lineHeight:1.3}}>{n.title}</div>
              <div className="wf-muted" style={{fontSize:11,marginTop:4}}>{n.body}</div>
              <div style={{fontSize:10,color:'var(--wf-ink-3)',marginTop:4,fontFamily:'var(--wf-mono)'}}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{padding:'10px 16px',borderTop:'1px solid var(--wf-line-soft)',textAlign:'center',fontSize:11,color:'var(--wf-accent)'}}>
        View all notifications →
      </div>
    </div>
    <Annot n={1} x={50} y={170} w={210}>Click bell icon in TopNav → drawer drops. Tabs filter by category.</Annot>
    <Annot n={2} x={50} y={420} w={210}>Unread row has a dot + subtle bg tint. Triggered by invites, schedule publishes, follows, owner-archive actions, etc.</Annot>
  </Frame>
);

// ── 404 ─────────────────────────────────────────────────────────────────────

const NotFound = () => (
  <Frame label="27 · 404 / not found" sub="archived blog, missing user, mistyped URL">
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <TopNav />
      <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'48px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,maxWidth:900,alignItems:'center'}}>
          <div>
            <span className="wf-eyebrow">404 · This article is no longer available</span>
            <h1 className="wf-h1" style={{fontSize:46,lineHeight:1.05,marginTop:10}}>
              The page you're looking for has been archived or moved.
            </h1>
            <p className="wf-serif wf-muted2" style={{fontSize:14,lineHeight:1.55,marginTop:14,maxWidth:420}}>
              The author may have unpublished it, or the URL might be a typo. Here are a few things you can do from here.
            </p>
            <div style={{display:'flex',gap:10,marginTop:18}}>
              <Btn variant="primary">← Back to homepage</Btn>
              <Btn>Browse Explore</Btn>
            </div>
          </div>
          <div>
            <div className="wf-eyebrow" style={{marginBottom:10}}>You might also like</div>
            <Box style={{padding:0}}>
              {[1,2,3].map(i => (
                <div key={i} style={{display:'grid',gridTemplateColumns:'72px 1fr',gap:10,padding:'10px 12px',borderTop:i>1?'1px solid var(--wf-line-soft)':'none'}}>
                  <Img label="" h={60}/>
                  <div>
                    <Badge style={{fontSize:9}}>Postmortem</Badge>
                    <div style={{font:'600 13px var(--wf-serif)',marginTop:4,lineHeight:1.3}}>
                      {['How we cut p99 latency from 800ms → 120ms','3 hours of cascading Redis failover','The boring postgres migration that wasn\'t'][i-1]}
                    </div>
                    <div className="wf-muted" style={{fontSize:10,marginTop:4}}>Aurora · May {16-i*2}</div>
                  </div>
                </div>
              ))}
            </Box>
          </div>
        </div>
      </div>
    </div>
  </Frame>
);

Object.assign(window, {
  VerifyEmail, ResetPassword, AcceptInvite,
  SettingsProfile, SettingsAccount,
  Drafts, Scheduled, Archived, BlogAnalytics,
  EditCompany, CompanyAnalytics,
  Notifications, NotFound
});
