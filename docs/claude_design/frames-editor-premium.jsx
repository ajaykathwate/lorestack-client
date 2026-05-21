// frames-editor-premium.jsx — Premium editor + Publication popover + Format popover
//
// Naming: the two topbar pickers are FORMAT (was "Type") and PUBLICATION (was "For").
// Both pickers open as anchored popovers — same primitive, same shape, same UX.
// The only difference: PUBLICATION is search-first / empty-by-default because
// a user may belong to many companies.

// ─── Shared chrome used by all three frames ──────────────────────────────
// Topbar = three logical zones (left: nav + meta · center: status · right: actions).
// Spacing is built on an 8px grid; pills use a generous 10/12 padding so they
// don't crowd the "My Blogs" back button.
const PremiumChrome = ({ savedState, publicationActive, formatActive, children, overlay }) => (
  <div style={{display:'flex',flexDirection:'column',height:'100%',background:'var(--bg)',position:'relative'}}>
    {/* ─── TOPBAR ─── */}
    <header style={{
      display:'grid',
      gridTemplateColumns:'1fr auto 1fr',
      alignItems:'center',
      padding:'14px 28px',
      borderBottom:'1px solid var(--line)',
      background:'var(--bg)',
      gap:24,
    }}>
      {/* LEFT: My Blogs + meta pills */}
      <div style={{display:'flex',alignItems:'center',gap:18}}>
        <button style={{
          display:'inline-flex',alignItems:'center',gap:6,
          padding:'7px 12px 7px 10px',
          background:'transparent',border:'1px solid transparent',borderRadius:6,
          color:'var(--ink-2)',fontSize:13,fontWeight:500,cursor:'pointer',
          fontFamily:'var(--sans)',
        }}>
          <span style={{fontSize:14,color:'var(--ink-3)'}}>‹</span>
          My Blogs
        </button>

        <div style={{height:20,width:1,background:'var(--line)'}}/>

        {/* FORMAT picker (was "Type") */}
        <button style={{
          display:'inline-flex',alignItems:'stretch',
          border:`1px solid ${formatActive ? 'var(--accent)' : 'var(--line)'}`,borderRadius:6,
          background: formatActive ? 'var(--bg-soft)' : 'var(--bg)',
          color:'var(--ink)',cursor:'pointer',
          fontFamily:'var(--sans)',height:32,
          boxShadow: formatActive ? '0 0 0 3px var(--accent-soft)' : 'none',
        }}>
          <span style={{
            display:'inline-flex',alignItems:'center',
            padding:'0 10px',
            background:'var(--bg-soft)',
            borderRight:'1px solid var(--line)',
            font:'600 9px/1 var(--mono)',letterSpacing:1.2,
            color:'var(--ink-3)',textTransform:'uppercase',
            borderRadius:'5px 0 0 5px',
          }}>Format</span>
          <span style={{display:'inline-flex',alignItems:'center',gap:8,padding:'0 12px',fontSize:13,fontWeight:500}}>
            Scaling story
            <span style={{color:'var(--ink-3)',fontSize:10}}>▾</span>
          </span>
        </button>

        {/* PUBLICATION picker (was "For") */}
        <button style={{
          display:'inline-flex',alignItems:'stretch',
          border:`1px solid ${publicationActive ? 'var(--accent)' : 'var(--line)'}`,borderRadius:6,
          background: publicationActive ? 'var(--bg-soft)' : 'var(--bg)',
          color:'var(--ink)',cursor:'pointer',
          fontFamily:'var(--sans)',height:32,
          boxShadow: publicationActive ? '0 0 0 3px var(--accent-soft)' : 'none',
        }}>
          <span style={{
            display:'inline-flex',alignItems:'center',
            padding:'0 10px',
            background:'var(--bg-soft)',
            borderRight:'1px solid var(--line)',
            font:'600 9px/1 var(--mono)',letterSpacing:1.2,
            color:'var(--ink-3)',textTransform:'uppercase',
            borderRadius:'5px 0 0 5px',
          }}>Publication</span>
          <span style={{display:'inline-flex',alignItems:'center',gap:8,padding:'0 12px',fontSize:13,fontWeight:500}}>
            <span style={{width:16,height:16,borderRadius:4,background:'var(--bg-soft)',border:'1px solid var(--line)',display:'inline-flex',alignItems:'center',justifyContent:'center',font:'600 9px var(--mono)',color:'var(--ink-2)'}}>P</span>
            Personal
            <span style={{color:'var(--ink-3)',fontSize:10}}>▾</span>
          </span>
        </button>
      </div>

      {/* CENTER: save status */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
        <span style={{
          display:'inline-flex',alignItems:'center',gap:8,
          padding:'6px 12px',
          background:'var(--bg-soft)',border:'1px solid var(--line-soft)',
          borderRadius:99,
          font:'500 12px var(--sans)',color:'var(--ink-2)',
        }}>
          {savedState === 'unsaved' && (<>
            <span style={{width:7,height:7,borderRadius:99,background:'var(--accent)'}}/>
            Unsaved changes
          </>)}
          {savedState === 'saved' && (<>
            <span style={{width:7,height:7,borderRadius:99,background:'#5a8b5e'}}/>
            All changes saved · 2s ago
          </>)}
          {savedState === 'saving' && (<>
            <span style={{width:7,height:7,borderRadius:99,background:'var(--ink-3)'}}/>
            Saving…
          </>)}
        </span>
      </div>

      {/* RIGHT: actions */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'flex-end',gap:8}}>
        <button style={{padding:'7px 14px',background:'transparent',border:'1px solid var(--line)',borderRadius:6,fontSize:13,fontWeight:500,color:'var(--ink)',cursor:'pointer',fontFamily:'var(--sans)',height:32}}>Preview</button>
        <button style={{padding:'7px 14px',background:'transparent',border:'1px solid var(--line)',borderRadius:6,fontSize:13,fontWeight:500,color:'var(--ink)',cursor:'pointer',fontFamily:'var(--sans)',height:32}}>Save draft</button>
        <div style={{display:'flex',height:32,borderRadius:6,overflow:'hidden',boxShadow:'0 1px 2px rgba(0,0,0,.06)'}}>
          <button style={{padding:'0 18px',background:'var(--ink)',border:'none',color:'var(--bg)',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'var(--sans)'}}>Publish</button>
          <button style={{padding:'0 9px',background:'var(--ink)',border:'none',borderLeft:'1px solid rgba(255,255,255,.15)',color:'var(--bg)',fontSize:10,cursor:'pointer'}}>▾</button>
        </div>
      </div>
    </header>

    {children}
    {overlay}
  </div>
);

// ─── 31 · PREMIUM EDITOR VIEW ────────────────────────────────────────────
const PremiumEditor = () => (
  <Frame label="31 · Premium Editor View" sub="refined topbar · article settings rail · all options preserved">
    <PremiumChrome savedState="unsaved">
      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',flex:1,minHeight:0}}>

        {/* ─── EDITING CANVAS ─── */}
        <div style={{overflow:'auto',display:'flex',justifyContent:'center'}}>
          <div style={{width:'100%',maxWidth:780,padding:'56px 48px 96px',display:'flex',flexDirection:'column',gap:18}}>

            {/* Title */}
            <h1 contentEditable suppressContentEditableWarning style={{
              font:'700 52px/1.05 var(--serif)',
              color:'var(--ink-4)',
              letterSpacing:'-1px',
              margin:0,outline:'none',
            }}>
              Article title…
            </h1>

            {/* One-line summary */}
            <div contentEditable suppressContentEditableWarning style={{
              font:'400 19px/1.5 var(--serif)',
              fontStyle:'italic',
              color:'var(--ink-4)',
              outline:'none',
              paddingBottom:8,
              borderBottom:'1px dashed var(--line)',
            }}>
              A one-line summary shown on article cards…
            </div>

            {/* Formatting toolbar — single row, grouped with subtle dividers */}
            <div style={{
              display:'flex',alignItems:'center',gap:6,
              padding:'8px 10px',
              background:'var(--bg-soft)',
              border:'1px solid var(--line)',borderRadius:8,
              marginTop:4,
              fontFamily:'var(--sans)',
              boxShadow:'inset 0 1px 0 rgba(255,255,255,.6)',
            }}>
              <div style={{display:'flex',alignItems:'center',gap:6,padding:'6px 10px',background:'var(--bg)',border:'1px solid var(--line)',borderRadius:5,fontSize:12,color:'var(--ink-2)',minWidth:96}}>
                Default
                <span style={{flex:1}}/>
                <span style={{color:'var(--ink-3)',fontSize:10}}>▾</span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:6,padding:'6px 10px',background:'var(--bg)',border:'1px solid var(--line)',borderRadius:5,fontSize:12,color:'var(--ink-2)',minWidth:64}}>
                16
                <span style={{flex:1}}/>
                <span style={{color:'var(--ink-3)',fontSize:10}}>▾</span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:6,padding:'6px 10px',background:'var(--bg)',border:'1px solid var(--line)',borderRadius:5,fontSize:12,color:'var(--ink-2)',minWidth:88}}>
                Normal
                <span style={{flex:1}}/>
                <span style={{color:'var(--ink-3)',fontSize:10}}>▾</span>
              </div>

              <span style={{width:1,height:20,background:'var(--line)',margin:'0 4px'}}/>

              {[
                {l:'B',s:{fontWeight:700}},
                {l:'I',s:{fontStyle:'italic'}},
                {l:'U',s:{textDecoration:'underline'}},
                {l:'S',s:{textDecoration:'line-through'}},
              ].map((b,i) => (
                <button key={i} style={{width:30,height:30,display:'inline-flex',alignItems:'center',justifyContent:'center',border:'1px solid transparent',borderRadius:5,background:'transparent',color:'var(--ink)',fontFamily:'var(--serif)',fontSize:14,cursor:'pointer',...b.s}}>{b.l}</button>
              ))}

              <button style={{width:30,height:30,display:'inline-flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:2,border:'1px solid transparent',borderRadius:5,background:'transparent',cursor:'pointer'}}>
                <span style={{fontFamily:'var(--serif)',fontSize:14,lineHeight:.9}}>A</span>
                <span style={{width:14,height:3,background:'var(--ink)'}}/>
              </button>
              <button style={{width:30,height:30,display:'inline-flex',alignItems:'center',justifyContent:'center',border:'1px solid transparent',borderRadius:5,background:'transparent',cursor:'pointer'}}>
                <span style={{fontFamily:'var(--serif)',fontSize:14,background:'var(--warn-soft)',padding:'0 3px'}}>A</span>
              </button>

              <button style={{width:30,height:30,display:'inline-flex',alignItems:'flex-end',justifyContent:'center',border:'1px solid transparent',borderRadius:5,background:'transparent',cursor:'pointer',fontSize:12}}>x<sub style={{fontSize:8}}>2</sub></button>
              <button style={{width:30,height:30,display:'inline-flex',alignItems:'flex-start',justifyContent:'center',border:'1px solid transparent',borderRadius:5,background:'transparent',cursor:'pointer',fontSize:12}}>x<sup style={{fontSize:8}}>2</sup></button>

              <span style={{width:1,height:20,background:'var(--line)',margin:'0 4px'}}/>

              <button style={{width:30,height:30,display:'inline-flex',alignItems:'center',justifyContent:'center',border:'1px solid transparent',borderRadius:5,background:'transparent',cursor:'pointer',color:'var(--ink-2)',fontSize:14}}>❝</button>
              <button style={{width:30,height:30,display:'inline-flex',alignItems:'center',justifyContent:'center',border:'1px solid transparent',borderRadius:5,background:'transparent',cursor:'pointer',color:'var(--ink-2)',fontFamily:'var(--mono)',fontSize:12}}>{'<>'}</button>

              <span style={{flex:1}}/>
              <span style={{font:'500 11px/1 var(--mono)',color:'var(--ink-3)'}}>0 words</span>
            </div>

            {/* Secondary toolbar — list / indent / align / link / image */}
            <div style={{
              display:'flex',alignItems:'center',gap:4,
              padding:'6px 10px',
              borderBottom:'1px solid var(--line-soft)',
              marginTop:-12,
              fontFamily:'var(--sans)',
            }}>
              <button style={{width:30,height:30,display:'inline-flex',alignItems:'center',justifyContent:'center',border:'1px solid transparent',borderRadius:5,background:'transparent',cursor:'pointer',color:'var(--ink-2)',fontFamily:'var(--mono)',fontSize:11}}>1≡</button>
              <button style={{width:30,height:30,display:'inline-flex',alignItems:'center',justifyContent:'center',border:'1px solid transparent',borderRadius:5,background:'transparent',cursor:'pointer',color:'var(--ink-2)',fontSize:14}}>•≡</button>
              <button style={{width:30,height:30,display:'inline-flex',alignItems:'center',justifyContent:'center',border:'1px solid transparent',borderRadius:5,background:'transparent',cursor:'pointer',color:'var(--ink-2)',fontSize:12}}>⇤</button>
              <button style={{width:30,height:30,display:'inline-flex',alignItems:'center',justifyContent:'center',border:'1px solid transparent',borderRadius:5,background:'transparent',cursor:'pointer',color:'var(--ink-2)',fontSize:12}}>⇥</button>
              <div style={{display:'flex',alignItems:'center',gap:4,padding:'5px 8px',border:'1px solid var(--line-soft)',borderRadius:5,marginLeft:6,color:'var(--ink-2)',fontSize:12}}>
                <span>≡</span><span style={{color:'var(--ink-3)',fontSize:10}}>▾</span>
              </div>
              <span style={{width:1,height:18,background:'var(--line-soft)',margin:'0 6px'}}/>
              <button style={{width:30,height:30,display:'inline-flex',alignItems:'center',justifyContent:'center',border:'1px solid transparent',borderRadius:5,background:'transparent',cursor:'pointer',color:'var(--ink-2)',fontSize:14}}>🔗</button>
              <button style={{width:30,height:30,display:'inline-flex',alignItems:'center',justifyContent:'center',border:'1px solid transparent',borderRadius:5,background:'transparent',cursor:'pointer',color:'var(--ink-2)',fontSize:14}}>🖼</button>
              <span style={{width:1,height:18,background:'var(--line-soft)',margin:'0 6px'}}/>
              <button style={{display:'inline-flex',alignItems:'center',gap:4,padding:'5px 8px',border:'1px solid transparent',borderRadius:5,background:'transparent',cursor:'pointer',color:'var(--ink-2)',fontSize:11,fontFamily:'var(--mono)'}}>Tₓ <span style={{fontSize:9}}>clear</span></button>
            </div>

            {/* Body placeholder */}
            <div contentEditable suppressContentEditableWarning style={{
              font:'400 19px/1.7 var(--serif)',
              fontStyle:'italic',
              color:'var(--ink-4)',
              outline:'none',
              minHeight:240,
              padding:'12px 0',
            }}>
              Start writing your story…
            </div>
          </div>
        </div>

        {/* ─── RIGHT RAIL: ARTICLE SETTINGS ─── */}
        <aside style={{
          borderLeft:'1px solid var(--line)',
          background:'var(--bg-soft)',
          overflow:'auto',
          padding:'24px 22px 96px',
          display:'flex',flexDirection:'column',gap:24,
          fontFamily:'var(--sans)',
        }}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingBottom:14,borderBottom:'1px solid var(--line)'}}>
            <span className="wf-eyebrow" style={{letterSpacing:1.6}}>Article Settings</span>
            <span style={{font:'500 11px var(--mono)',color:'var(--ink-3)'}}>1 of 3</span>
          </div>

          <section>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:8}}>
              <h3 style={{margin:0,font:'600 14px var(--sans)',color:'var(--ink)'}}>Tags</h3>
              <span style={{font:'500 11px var(--mono)',color:'var(--ink-3)'}}>0 / 5</span>
            </div>
            <p style={{margin:'0 0 10px',fontSize:12,color:'var(--ink-3)',lineHeight:1.5}}>
              Help readers and SEO find this. Press Enter to add.
            </p>
            <div style={{
              padding:'10px 12px',
              background:'var(--bg)',border:'1px solid var(--line)',borderRadius:6,
              minHeight:42,display:'flex',alignItems:'center',
              color:'var(--ink-4)',fontSize:13,
            }}>
              <span style={{color:'var(--accent-ink)',marginRight:4}}>+</span>
              Add tag, press Enter
            </div>
          </section>

          <section>
            <h3 style={{margin:'0 0 8px',font:'600 14px var(--sans)',color:'var(--ink)'}}>Cover image</h3>
            <p style={{margin:'0 0 10px',fontSize:12,color:'var(--ink-3)',lineHeight:1.5}}>
              Shown on cards and social previews. Recommended 1200×630.
            </p>
            <div style={{
              padding:'28px 16px',
              background:'var(--bg)',border:'1px dashed var(--line-strong)',borderRadius:8,
              display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,
            }}>
              <span style={{
                width:36,height:36,display:'inline-flex',alignItems:'center',justifyContent:'center',
                background:'var(--bg-soft)',border:'1px solid var(--line)',borderRadius:99,
                color:'var(--ink-2)',fontSize:16,
              }}>↑</span>
              <span style={{fontSize:13,color:'var(--ink)',fontWeight:500}}>Upload image</span>
              <span style={{fontSize:11,color:'var(--ink-3)'}}>or drop a file · PNG, JPG, WebP · max 4MB</span>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:10,margin:'10px 0'}}>
              <span style={{flex:1,height:1,background:'var(--line-soft)'}}/>
              <span style={{font:'500 10px var(--mono)',color:'var(--ink-3)',letterSpacing:.6}}>OR</span>
              <span style={{flex:1,height:1,background:'var(--line-soft)'}}/>
            </div>
            <div style={{padding:'10px 12px',background:'var(--bg)',border:'1px solid var(--line)',borderRadius:6,color:'var(--ink-4)',fontSize:13}}>
              …or paste a URL
            </div>
          </section>

          <section>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:8}}>
              <h3 style={{margin:0,font:'600 14px var(--sans)',color:'var(--ink)'}}>Summary</h3>
              <span style={{font:'500 11px var(--mono)',color:'var(--ink-3)'}}>0 / 300</span>
            </div>
            <p style={{margin:'0 0 10px',fontSize:12,color:'var(--ink-3)',lineHeight:1.5}}>
              A brief description that shows on cards, search, and social.
            </p>
            <div style={{
              padding:'12px 14px',
              background:'var(--bg)',border:'1px solid var(--line)',borderRadius:6,
              minHeight:96,color:'var(--ink-4)',fontSize:13,lineHeight:1.55,fontStyle:'italic',
            }}>
              A brief summary shown on cards and search results…
            </div>
          </section>

          <section style={{borderTop:'1px solid var(--line)',paddingTop:18}}>
            <button style={{
              width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',
              background:'transparent',border:'none',padding:0,cursor:'pointer',
              font:'600 14px var(--sans)',color:'var(--ink)',
            }}>
              SEO settings
              <span style={{color:'var(--ink-3)',fontSize:12}}>▾</span>
            </button>
          </section>
        </aside>
      </div>
    </PremiumChrome>

    <Annot n={1} x={70} y={56} w={170}>Topbar split into 3 zones (nav · status · actions) on a strict 8px grid.</Annot>
    <Annot n={2} x={196} y={68} w={170}>FORMAT and PUBLICATION are framed pill-buttons — label and value visually separated.</Annot>
    <Annot n={3} x={20} y={50} align="right" w={210}>Publish split button — primary action prominent, dropdown for Schedule variants.</Annot>
    <Annot n={4} x={32} y={750} align="right" w={220}>Right rail uses a soft surface to separate it from the canvas. All original fields preserved + tightened hierarchy.</Annot>
  </Frame>
);

// ─── Shared anchored popover shell ────────────────────────────────────────
// Used by both pickers. Anchored under its trigger pill, NOT a drawer.
const Popover = ({ x, y, width, children }) => (
  <>
    {/* Light backdrop so the popover feels anchored without dimming the page */}
    <div style={{position:'absolute',inset:0,background:'rgba(20,18,14,.12)',zIndex:10}}/>
    <div style={{
      position:'absolute',
      top:y,left:x,
      width,
      background:'var(--bg)',
      border:'1px solid var(--line)',borderRadius:10,
      boxShadow:'0 18px 48px rgba(20,18,14,.18), 0 0 0 1px rgba(20,18,14,.02)',
      zIndex:11,
      display:'flex',flexDirection:'column',
      fontFamily:'var(--sans)',
      overflow:'hidden',
    }}>
      {children}
    </div>
  </>
);

const PopoverHeader = ({ eyebrow, title, body, onClose }) => (
  <div style={{padding:'14px 16px 12px',borderBottom:'1px solid var(--line-soft)',display:'flex',alignItems:'flex-start',gap:10}}>
    <div style={{flex:1}}>
      <span className="wf-eyebrow" style={{letterSpacing:1.6}}>{eyebrow}</span>
      <h3 style={{margin:'4px 0 0',font:'600 16px var(--serif)',color:'var(--ink)'}}>{title}</h3>
      {body && <p style={{margin:'4px 0 0',fontSize:11,color:'var(--ink-3)',lineHeight:1.55}}>{body}</p>}
    </div>
    {onClose && (
      <button style={{
        width:26,height:26,display:'inline-flex',alignItems:'center',justifyContent:'center',
        border:'1px solid transparent',background:'transparent',borderRadius:5,
        cursor:'pointer',color:'var(--ink-3)',fontSize:14,
      }}>×</button>
    )}
  </div>
);

const PopoverFooter = ({ left, right }) => (
  <div style={{
    padding:'10px 14px',borderTop:'1px solid var(--line-soft)',background:'var(--bg-soft)',
    display:'flex',alignItems:'center',gap:10,
  }}>
    <span style={{fontSize:10,color:'var(--ink-3)',fontFamily:'var(--mono)',display:'flex',gap:8}}>{left}</span>
    <span style={{flex:1}}/>
    {right}
  </div>
);

// ─── 31b · PUBLICATION POPOVER (was company drawer) ──────────────────────
const PublicationPopover = () => (
  <Frame label="31b · Publication — popover" sub="opens from PUBLICATION pill · search-first · same popover primitive">
    <PremiumChrome
      savedState="unsaved"
      publicationActive
      overlay={
        <Popover x={252} y={60} width={360}>
          <PopoverHeader
            eyebrow="Publication"
            title="Where should this be published?"
            body="Choose Personal to publish under your name, or pick a company you belong to."
            onClose
          />

          {/* Currently selected strip */}
          <div style={{padding:'10px 16px',background:'var(--bg-soft)',borderBottom:'1px solid var(--line-soft)',display:'flex',alignItems:'center',gap:10}}>
            <span style={{font:'600 10px var(--mono)',color:'var(--ink-3)',letterSpacing:1.2,textTransform:'uppercase'}}>Selected</span>
            <span style={{width:1,height:12,background:'var(--line)'}}/>
            <span style={{width:20,height:20,borderRadius:4,background:'var(--bg)',border:'1px solid var(--line)',display:'inline-flex',alignItems:'center',justifyContent:'center',font:'600 10px var(--mono)',color:'var(--ink-2)'}}>P</span>
            <span style={{fontSize:12,fontWeight:600,color:'var(--ink)'}}>Personal</span>
          </div>

          {/* Search */}
          <div style={{padding:'12px 16px',borderBottom:'1px solid var(--line-soft)'}}>
            <div style={{
              display:'flex',alignItems:'center',gap:10,
              padding:'9px 12px',
              background:'var(--bg)',border:'1px solid var(--line-strong)',borderRadius:7,
              boxShadow:'0 0 0 3px var(--accent-soft)',
            }}>
              <span style={{fontFamily:'var(--mono)',fontSize:13,color:'var(--ink-3)'}}>⌕</span>
              <span style={{flex:1,color:'var(--ink-4)',fontSize:13}}>Search your companies…</span>
              <span style={{font:'500 10px var(--mono)',color:'var(--ink-3)',border:'1px solid var(--line-soft)',padding:'2px 6px',borderRadius:3}}>esc</span>
            </div>
          </div>

          {/* Results area — empty by default */}
          <div style={{padding:'18px 16px',minHeight:260,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10,textAlign:'center'}}>
            <span style={{
              width:40,height:40,borderRadius:99,
              background:'var(--bg-soft)',border:'1px solid var(--line)',
              display:'inline-flex',alignItems:'center',justifyContent:'center',
              color:'var(--ink-3)',fontFamily:'var(--mono)',fontSize:16,
            }}>⌕</span>
            <p style={{margin:0,font:'500 13px var(--serif)',color:'var(--ink-2)'}}>Please search to find a company.</p>
            <p style={{margin:0,fontSize:11,color:'var(--ink-3)',maxWidth:220,lineHeight:1.55}}>
              We don't load the full list — you may belong to many. Type at least two characters to start.
            </p>
          </div>

          {/* Quick options + create */}
          <div style={{padding:'10px 16px',borderTop:'1px solid var(--line-soft)',display:'flex',flexDirection:'column',gap:8}}>
            <button style={{
              display:'flex',alignItems:'center',gap:10,
              padding:'8px 10px',background:'transparent',border:'1px solid transparent',borderRadius:6,
              cursor:'pointer',textAlign:'left',
            }}>
              <span style={{width:24,height:24,borderRadius:5,background:'var(--bg-soft)',border:'1px solid var(--line)',display:'inline-flex',alignItems:'center',justifyContent:'center',font:'600 11px var(--mono)',color:'var(--ink-2)'}}>P</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:500,color:'var(--ink)'}}>Personal</div>
                <div style={{fontSize:11,color:'var(--ink-3)',marginTop:2}}>Publish under your own name</div>
              </div>
              <span style={{font:'500 10px var(--mono)',color:'var(--ink-3)'}}>always</span>
            </button>
            <button style={{
              display:'flex',alignItems:'center',gap:10,
              padding:'8px 10px',background:'transparent',border:'1px solid transparent',borderRadius:6,
              cursor:'pointer',textAlign:'left',
            }}>
              <span style={{width:24,height:24,borderRadius:5,background:'var(--accent-soft)',display:'inline-flex',alignItems:'center',justifyContent:'center',color:'var(--accent-ink)',fontSize:14,fontWeight:600}}>+</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:500,color:'var(--ink)'}}>Create a new company</div>
                <div style={{fontSize:11,color:'var(--ink-3)',marginTop:2}}>Set up a brand, invite teammates, then publish</div>
              </div>
            </button>
          </div>

          <PopoverFooter
            left={<><span>↑↓</span><span>↵ select</span><span>esc close</span></>}
            right={<span style={{fontSize:11,color:'var(--accent-ink)',textDecoration:'underline',cursor:'pointer'}}>Manage your companies</span>}
          />
        </Popover>
      }
    >
      <div style={{flex:1,background:'var(--bg-soft)'}}/>
    </PremiumChrome>

    <Annot n={1} x={20} y={140} w={210}>Anchored popover under the PUBLICATION pill — same primitive as the Format picker, consistent UX.</Annot>
    <Annot n={2} x={20} y={340} w={210}>Empty-by-default results area. Only the search input + helpful copy. No infinite list.</Annot>
    <Annot n={3} x={20} y={560} w={210}>Persistent quick rows below — "Personal" (always available) and "Create a new company" shortcut.</Annot>
  </Frame>
);

// ─── 31c · FORMAT POPOVER (was Type popover) ─────────────────────────────
const FormatPopover = () => {
  const formats = [
    { k:'Engineering', v:'Engineering blog', d:'How we solve technical problems' },
    { k:'Architecture', v:'Architecture deep dive', d:'System design and trade-offs' },
    { k:'Postmortem', v:'Postmortem', d:'What broke, why, what we learned' },
    { k:'Case study', v:'Case study', d:'A specific customer or project' },
    { k:'Tutorial', v:'Tutorial', d:'Step-by-step how-to' },
    { k:'Founder note', v:'Founder note', d:'Strategy, vision, behind-the-scenes' },
    { k:'AI experiment', v:'AI experiment', d:'Working with LLMs, agents, models' },
    { k:'Opinion', v:'Opinion', d:'A strong, well-reasoned take' },
    { k:'Open source', v:'Open source', d:'OSS releases, contributions, RFCs' },
    { k:'Scaling story', v:'Scaling story', d:'Hitting and beating growth bottlenecks', active:true },
    { k:'Showcase', v:'Project showcase', d:'Something you shipped this week' },
  ];
  return (
  <Frame label="31c · Format — popover" sub="opens from FORMAT pill · scrollable list with descriptions">
    <PremiumChrome
      savedState="unsaved"
      formatActive
      overlay={
        <Popover x={152} y={60} width={340}>
          <PopoverHeader
            eyebrow="Format"
            title="What kind of post is this?"
            body="Format drives the badge readers see and where it appears in Explore."
          />

          {/* Filter */}
          <div style={{padding:'10px 14px',borderBottom:'1px solid var(--line-soft)'}}>
            <div style={{
              display:'flex',alignItems:'center',gap:8,
              padding:'7px 10px',
              background:'var(--bg-soft)',border:'1px solid var(--line)',borderRadius:6,
            }}>
              <span style={{fontFamily:'var(--mono)',fontSize:13,color:'var(--ink-3)'}}>⌕</span>
              <span style={{flex:1,color:'var(--ink-4)',fontSize:12}}>Filter…</span>
            </div>
          </div>

          {/* List */}
          <div style={{maxHeight:340,overflow:'auto'}}>
            {formats.map((t,i) => (
              <button key={t.k} style={{
                width:'100%',display:'flex',alignItems:'flex-start',gap:10,
                padding:'10px 14px',
                background:t.active ? 'var(--accent-soft)' : 'transparent',
                border:'none',borderBottom: i < formats.length-1 ? '1px solid var(--line-soft)' : 'none',
                cursor:'pointer',textAlign:'left',
              }}>
                <span style={{
                  width:18,height:18,borderRadius:99,
                  border:`1.5px solid ${t.active?'var(--accent)':'var(--line-strong)'}`,
                  background: t.active ? 'var(--accent)' : 'var(--bg)',
                  display:'inline-flex',alignItems:'center',justifyContent:'center',marginTop:1,
                  flex:'0 0 18px',
                }}>
                  {t.active && <span style={{width:6,height:6,borderRadius:99,background:'#fff'}}/>}
                </span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{font:`${t.active?600:500} 13px/1.3 var(--sans)`,color:t.active?'var(--accent-ink)':'var(--ink)'}}>{t.v}</div>
                  <div style={{fontSize:11,color:'var(--ink-3)',marginTop:2,lineHeight:1.4}}>{t.d}</div>
                </div>
              </button>
            ))}
          </div>

          <PopoverFooter
            left={<><span>↑↓</span><span>↵ apply</span></>}
            right={<span style={{fontSize:11,color:'var(--accent-ink)',textDecoration:'underline',cursor:'pointer'}}>What's right for me?</span>}
          />
        </Popover>
      }
    >
      <div style={{flex:1,background:'var(--bg-soft)'}}/>
    </PremiumChrome>

    <Annot n={1} x={20} y={140} w={210}>Anchored popover under the FORMAT pill. Identical primitive to the Publication picker — consistent UX.</Annot>
    <Annot n={2} x={20} y={310} align="right" w={210}>Each row has a short helper line — Format is consequential and worth explaining.</Annot>
  </Frame>
  );
};

Object.assign(window, { PremiumEditor, PublicationPopover, FormatPopover });
