// frames-admin.jsx — Platform admin (internal Lorestack staff)

const adminSidebar = [
  { heading: 'Admin' },
  { label: 'Overview', icon: '⌂' },
  { label: 'Featured', icon: '★' },
  { label: 'Moderation', icon: '⚑', count: 4 },
  { label: 'Tags', icon: '#', count: 12 },
  { label: 'Users', icon: '◐' },
  { label: 'Companies', icon: '◧' },
  { label: 'Reports', icon: '∿' },
];

const AdminOverview = () => (
  <Frame label="16 · Admin · Overview" sub="platform admins only · curated + moderation">
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      {/* admin top stripe is darker */}
      <div style={{padding:'10px 24px',background:'var(--wf-ink)',color:'var(--wf-bg)',display:'flex',alignItems:'center',gap:14,fontSize:12}}>
        <span style={{font:'700 13px var(--wf-serif)'}}>Lorestack <span style={{opacity:.6,fontWeight:400}}>· Admin</span></span>
        <Badge style={{background:'var(--wf-accent)',color:'#fff',borderColor:'var(--wf-accent)'}}>Internal</Badge>
        <div style={{flex:1}}/>
        <Avatar size={24} initials="OP"/>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'200px 1fr',flex:1,minHeight:0}}>
        <Sidebar items={adminSidebar} active="Overview"/>
        <div style={{padding:'24px 32px',overflow:'auto'}}>
          <h1 className="wf-h2">Platform overview</h1>
          <p className="wf-muted" style={{margin:'4px 0 18px',fontSize:13}}>Snapshot of the last 7 days · last refreshed 2 min ago</p>

          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:18}}>
            {[
              ['New users','248','+12%'],
              ['New blogs','86','+4%'],
              ['New companies','9','+50%'],
              ['Reports open','4','attention'],
            ].map(([k,v,s],i) => (
              <Box key={k} style={{padding:14}}>
                <div className="wf-eyebrow">{k}</div>
                <div style={{font:'600 24px var(--wf-serif)',marginTop:4}}>{v}</div>
                <div style={{fontSize:11,color: i===3?'var(--wf-accent)':'var(--wf-ink-3)',marginTop:2}}>{s}</div>
              </Box>
            ))}
          </div>

          {/* Two columns: moderation queue + featured curation */}
          <div style={{display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:18}}>
            <Box style={{padding:0,overflow:'hidden'}}>
              <div style={{padding:'12px 14px',borderBottom:'1px solid var(--wf-line-soft)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <h3 className="wf-h3" style={{fontSize:14}}>Moderation queue · 4</h3>
                <span style={{fontSize:11,color:'var(--wf-accent)'}}>View all →</span>
              </div>
              {[
                ['REPORT','"How to bypass billing in $thing"','flagged by 3 users','spam'],
                ['NEW TAG','#newjs (near-duplicate of #javascript)','auto-flagged','duplicate'],
                ['REPORT','User @spam-bot · 14 short posts','flagged by 1 user','quality'],
                ['NEW TAG','#sql server','contains space','format'],
              ].map((r,i) => (
                <div key={i} style={{display:'grid',gridTemplateColumns:'90px 1fr 130px 80px 110px',padding:'10px 14px',gap:10,alignItems:'center',borderTop:'1px solid var(--wf-line-soft)',fontSize:12}}>
                  <Badge variant={r[0]==='REPORT'?'accent':''}>{r[0]}</Badge>
                  <span style={{fontFamily:'var(--wf-serif)',fontSize:13}}>{r[1]}</span>
                  <span className="wf-muted" style={{fontSize:11}}>{r[2]}</span>
                  <Chip>{r[3]}</Chip>
                  <div style={{display:'flex',gap:4,justifyContent:'flex-end'}}>
                    <Btn size="sm" variant="ghost">✓</Btn>
                    <Btn size="sm" variant="ghost">×</Btn>
                  </div>
                </div>
              ))}
            </Box>

            <Box style={{padding:0,overflow:'hidden'}}>
              <div style={{padding:'12px 14px',borderBottom:'1px solid var(--wf-line-soft)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <h3 className="wf-h3" style={{fontSize:14}}>Homepage · featured companies</h3>
                <Btn size="sm">+ Add slot</Btn>
              </div>
              <div style={{padding:14,display:'flex',flexDirection:'column',gap:8}}>
                {['Aurora Labs','Hexa.io','Northstar','Quiver','Lambdacat','Verge'].map((c,i) => (
                  <Box key={c} style={{padding:'8px 10px',display:'flex',gap:10,alignItems:'center'}}>
                    <span style={{fontFamily:'var(--wf-mono)',color:'var(--wf-ink-3)',fontSize:11,width:14}}>{i+1}</span>
                    <Logo initials={c[0]} size={24}/>
                    <span style={{fontSize:12,fontWeight:600,flex:1}}>{c}</span>
                    <span className="wf-muted" style={{fontSize:10}}>≡ drag</span>
                  </Box>
                ))}
              </div>
            </Box>
          </div>

          {/* Recent admin actions */}
          <div style={{marginTop:22}}>
            <div className="wf-eyebrow" style={{marginBottom:8}}>Recent admin actions</div>
            <Box style={{padding:0}}>
              {[
                ['Merged tag #js → #javascript','olivia · 2h ago'],
                ['Suspended user @spam-bot','olivia · 5h ago'],
                ['Featured Aurora Labs on homepage','priya · yesterday'],
                ['Removed blog "How to bypass…"','priya · 2d ago'],
              ].map((r,i) => (
                <div key={i} style={{display:'flex',padding:'8px 14px',borderTop:i?'1px solid var(--wf-line-soft)':'none',fontSize:12}}>
                  <span style={{flex:1}}>{r[0]}</span>
                  <span className="wf-muted">{r[1]}</span>
                </div>
              ))}
            </Box>
          </div>
        </div>
      </div>
    </div>
    <Annot n={1} x={20} y={120} w={210}>Admin panel sits behind /admin · only Platform Admin role passes the gate.</Annot>
    <Annot n={2} x={20} y={420} align="right" w={210}>New tags are auto-approved but flagged here for merge/cleanup.</Annot>
  </Frame>
);

const AdminTags = () => (
  <Frame label="17 · Admin · Tag moderation" sub="merge / approve / delete tags">
    <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
      <div style={{padding:'10px 24px',background:'var(--wf-ink)',color:'var(--wf-bg)',display:'flex',alignItems:'center',gap:14,fontSize:12}}>
        <span style={{font:'700 13px var(--wf-serif)'}}>Lorestack <span style={{opacity:.6,fontWeight:400}}>· Admin</span></span>
        <Badge style={{background:'var(--wf-accent)',color:'#fff',borderColor:'var(--wf-accent)'}}>Internal</Badge>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'200px 1fr',flex:1,minHeight:0}}>
        <Sidebar items={adminSidebar} active="Tags"/>
        <div style={{padding:'24px 32px',overflow:'auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:14}}>
            <div>
              <h1 className="wf-h2">Tags</h1>
              <p className="wf-muted" style={{margin:'2px 0 0',fontSize:12}}>1,284 platform-wide tags · 12 pending review</p>
            </div>
            <div style={{display:'flex',gap:8}}>
              <Box style={{padding:'6px 10px',color:'var(--wf-ink-3)',fontSize:11,minWidth:200}}>⌕ search</Box>
              <Btn size="sm">+ Merge tags</Btn>
            </div>
          </div>

          {/* Filter row */}
          <div style={{display:'flex',gap:6,marginBottom:14}}>
            <Chip variant="solid">Pending · 12</Chip>
            <Chip>All approved · 1,272</Chip>
            <Chip>Single-use · 86</Chip>
            <Chip>Recently merged · 24</Chip>
          </div>

          {/* Tag table */}
          <Box style={{padding:0,overflow:'hidden'}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 200px 120px 120px 140px',padding:'10px 14px',fontSize:11,fontFamily:'var(--wf-mono)',color:'var(--wf-ink-3)',textTransform:'uppercase',letterSpacing:.5,borderBottom:'1px solid var(--wf-line-soft)',background:'var(--wf-fill)'}}>
              <span>Tag</span><span>Suggested merge</span><span>Posts</span><span>Created</span><span style={{textAlign:'right'}}>Actions</span>
            </div>
            {[
              ['#js','#javascript',1,'May 18','duplicate'],
              ['#newjs','#javascript',1,'May 17','duplicate'],
              ['#postgresql','#postgres',3,'May 14','duplicate'],
              ['#sql server','—',1,'May 12','format · contains space'],
              ['#a','—',1,'May 10','too short'],
              ['#feature flag','#feature-flags',2,'May 09','format'],
              ['#k8s','#kubernetes',6,'May 02','duplicate'],
            ].map((r,i) => (
              <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 200px 120px 120px 140px',padding:'12px 14px',gap:10,alignItems:'center',borderTop:i?'1px solid var(--wf-line-soft)':'none',fontSize:12}}>
                <div>
                  <span style={{fontFamily:'var(--wf-mono)',fontWeight:600}}>{r[0]}</span>
                  <div className="wf-muted" style={{fontSize:10,marginTop:2}}>flag: {r[4]}</div>
                </div>
                <span className="wf-mono">{r[1]}</span>
                <span>{r[2]}</span>
                <span className="wf-muted">{r[3]}</span>
                <div style={{display:'flex',gap:6,justifyContent:'flex-end'}}>
                  <Btn size="sm">Merge</Btn>
                  <Btn size="sm" variant="ghost">Approve</Btn>
                  <Btn size="sm" variant="ghost">Delete</Btn>
                </div>
              </div>
            ))}
          </Box>
        </div>
      </div>
    </div>
    <Annot n={1} x={20} y={200} w={210}>Smart suggestions surface duplicates; admin one-click merges. Old tag URL 301s to new.</Annot>
  </Frame>
);

Object.assign(window, { AdminOverview, AdminTags });
