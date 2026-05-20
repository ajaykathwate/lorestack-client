// frames-auth.jsx — Sign up, Log in, Forgot, Onboarding (desktop)

const AuthSplit = ({ side }) => (
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',height:'100%'}}>
    {/* Editorial left panel */}
    <div style={{padding:'46px 44px',background:'var(--wf-fill)',borderRight:'var(--wf-stroke-w) solid var(--wf-line)',display:'flex',flexDirection:'column',gap:24}}>
      <Wordmark size={22}/>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',gap:18,maxWidth:380}}>
        <span className="wf-eyebrow">A home for engineering stories</span>
        <h1 className="wf-h1" style={{fontSize:38}}>Write the post-mortem the world needs to read.</h1>
        <p className="wf-serif wf-muted2" style={{fontSize:15,lineHeight:1.55,margin:0}}>
          Long-form engineering blogs, architecture deep-dives, and build-in-public timelines — under your name or your company's.
        </p>
        <div style={{display:'flex',gap:10,alignItems:'center',marginTop:14}}>
          <Avatar size={26} initials="A"/><Avatar size={26} initials="B" style={{marginLeft:-8}}/><Avatar size={26} initials="C" style={{marginLeft:-8}}/>
          <span className="wf-muted" style={{fontSize:12}}>2,400+ writers shipping</span>
        </div>
      </div>
      <div style={{fontSize:11,color:'var(--wf-ink-3)'}}>lorestack.com · est. 2025</div>
    </div>

    {/* Form right panel */}
    <div style={{padding:'46px 56px',display:'flex',flexDirection:'column',gap:18,justifyContent:'center'}}>
      <div style={{maxWidth:380,width:'100%',margin:'0 auto',display:'flex',flexDirection:'column',gap:14}}>
        <h2 className="wf-h2">{side==='signup' ? 'Create your account' : 'Welcome back'}</h2>
        <Btn>
          <span className="wf-mono">G</span>
          Continue with Google
        </Btn>
        <div style={{display:'flex',alignItems:'center',gap:10,color:'var(--wf-ink-3)',fontSize:11,margin:'6px 0'}}>
          <span style={{flex:1,height:1,background:'var(--wf-line-soft)'}}/>
          OR
          <span style={{flex:1,height:1,background:'var(--wf-line-soft)'}}/>
        </div>
        {side==='signup' && <Input label="Full name" required placeholder="Zara Khan" />}
        <Input label="Email address" required placeholder="you@studio.dev" />
        <Input label="Password" required placeholder="••••••••" hint={side==='signup' ? 'Minimum 8 characters' : null} type="password" />
        {side==='signup' && <Input label="Confirm password" required placeholder="••••••••" type="password" />}
        {side==='login' && (
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:12}}>
            <label style={{display:'flex',gap:6,alignItems:'center',color:'var(--wf-ink-2)'}}>
              <span className="wf-box" style={{width:14,height:14,display:'inline-block',borderRadius:2}}/>
              Remember me
            </label>
            <span style={{color:'var(--wf-accent)',textDecoration:'underline'}}>Forgot password?</span>
          </div>
        )}
        <Btn variant="primary" size="lg" style={{marginTop:6}}>{side==='signup' ? 'Create account' : 'Log in'}</Btn>
        <div style={{fontSize:12,color:'var(--wf-ink-2)',textAlign:'center',marginTop:8}}>
          {side==='signup' ? 'Already have an account? ' : "Don't have an account? "}
          <span style={{color:'var(--wf-accent)',textDecoration:'underline'}}>{side==='signup' ? 'Log in' : 'Sign up'}</span>
        </div>
      </div>
    </div>

    <Annot n={1} x={64} y={92}>Editorial hero: serif headline + 1-line value prop, no marketing fluff.</Annot>
    <Annot n={2} x={50} y={350} align="right" w={210}>Google OAuth is primary — same flow for signup &amp; login (path A vs path B).</Annot>
    <Annot n={3} x={50} y={560} align="right" w={210}>Inline validation: email taken, weak password, mismatch — all shown beneath the field.</Annot>
  </div>
);

const SignUp  = () => <Frame label="01 · Sign Up"  sub="auth — email + Google"><AuthSplit side="signup"/></Frame>;
const LogIn   = () => <Frame label="02 · Log In"   sub="auth — email + Google"><AuthSplit side="login"/></Frame>;

const Forgot = () => (
  <Frame label="03 · Forgot password" sub="reset link flow">
    <div style={{display:'flex',height:'100%',alignItems:'center',justifyContent:'center',padding:'48px'}}>
      <div style={{maxWidth:400,width:'100%',display:'flex',flexDirection:'column',gap:14}}>
        <Wordmark size={20}/>
        <span className="wf-eyebrow" style={{marginTop:24}}>Step 1 of 3</span>
        <h2 className="wf-h2">Reset your password</h2>
        <p className="wf-muted2" style={{margin:0,fontSize:13}}>Enter the email tied to your account. We'll send a reset link valid for 1 hour.</p>
        <Input label="Email address" required placeholder="you@studio.dev" style={{marginTop:8}}/>
        <Btn variant="primary" size="lg">Send reset link</Btn>
        <span style={{textAlign:'center',color:'var(--wf-accent)',fontSize:12,textDecoration:'underline'}}>← Back to log in</span>

        <Box style={{marginTop:24,padding:14,background:'var(--wf-fill)'}}>
          <div className="wf-eyebrow" style={{marginBottom:6}}>What happens next</div>
          <div style={{fontSize:12,color:'var(--wf-ink-2)',lineHeight:1.55}}>
            1. Check your inbox (link valid 1 hour)<br/>
            2. Tap the link → new password screen<br/>
            3. All existing sessions invalidated on save
          </div>
        </Box>
      </div>
    </div>
    <Annot n={1} x={620} y={160} w={240}>Security: even if email isn't registered, show the same confirmation message — never reveal account existence.</Annot>
  </Frame>
);

const Onboarding = () => (
  <Frame label="04 · Onboarding" sub="post-verify · 2 fields max">
    <div style={{padding:'40px 80px',height:'100%',display:'flex',flexDirection:'column'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <Wordmark size={20}/>
        <span style={{color:'var(--wf-ink-3)',fontSize:12}}>Step 1 of 1 · <span style={{textDecoration:'underline'}}>Skip for now</span></span>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',maxWidth:520,margin:'0 auto',gap:18,width:'100%'}}>
        <span className="wf-eyebrow">Welcome to Lorestack</span>
        <h2 className="wf-h2" style={{fontSize:28}}>How should we introduce you?</h2>
        <p className="wf-muted2" style={{margin:'-6px 0 6px',fontSize:13}}>You can change anything later in Settings.</p>

        <div style={{display:'flex',gap:18,alignItems:'flex-start'}}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
            <Avatar size={86} initials="?"/>
            <Btn variant="ghost" size="sm">Upload photo</Btn>
            <span style={{fontSize:10,color:'var(--wf-ink-3)'}}>or skip</span>
          </div>
          <div style={{flex:1,display:'flex',flexDirection:'column',gap:12}}>
            <Input label="Display name" required value="Zara Khan" />
            <Input label="Short bio (optional)" placeholder="Distributed systems @ Aurora · ex-Stripe · postgres apologist" hint="Max 200 characters · you can add this later"/>
          </div>
        </div>

        <Btn variant="primary" size="lg" style={{alignSelf:'flex-start',marginTop:14}}>Go to Lorestack →</Btn>
      </div>
    </div>
    <Annot n={1} x={580} y={120} w={220}>No role selection. Roles emerge later from actions (create company / accept invite).</Annot>
    <Annot n={2} x={80} y={520} w={240}>Bio &amp; photo are deliberately optional — friction kills onboarding completion.</Annot>
  </Frame>
);

Object.assign(window, { SignUp, LogIn, Forgot, Onboarding });
