// app.jsx — Top-level: assembles all frames into a DesignCanvas + wires Tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "annotations": true,
  "state": "full"
}/*EDITMODE-END*/;

const DESKTOP_W = 1280;
const DESKTOP_H = 800;
const MOBILE_W = 360;
const MOBILE_H = 720;

const App = () => {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply tweak state to body classes — primitives + styles react to it.
  React.useEffect(() => {
    const b = document.body;
    b.classList.toggle('no-annot',  !t.annotations);
    b.classList.toggle('state-empty', t.state === 'empty');
    b.classList.toggle('state-full',  t.state === 'full');
  }, [t.annotations, t.state]);

  // Helpers for artboards. Mobile = 360×720; Desktop = 1280×800.
  const D = (id, label, Comp, width=DESKTOP_W, height=DESKTOP_H) => (
    <DCArtboard id={id} label={label} width={width} height={height}><Comp/></DCArtboard>
  );
  const M = (id, label, Comp) => (
    <DCArtboard id={id} label={label} width={MOBILE_W} height={MOBILE_H}><Comp/></DCArtboard>
  );

  return (
    <>
      <DesignCanvas>

        <DCSection id="intro" title="Lorestack · Wireframes" subtitle="All pages · 27+ screens with desktop & mobile · low-fi editorial">
          <DCArtboard id="readme" label="00 · Readme" width={520} height={680}>
            <div style={{padding:'34px 32px',height:'100%',background:'var(--wf-bg)',color:'var(--wf-ink)',display:'flex',flexDirection:'column',gap:14,overflow:'hidden'}}>
              <Wordmark size={22}/>
              <span className="wf-eyebrow">Wireframe pack · v2</span>
              <h1 className="wf-h1" style={{fontSize:30,margin:'4px 0 0'}}>All pages, one canvas.</h1>
              <p className="wf-serif" style={{fontSize:14,lineHeight:1.5,margin:0,color:'var(--wf-ink-2)'}}>
                Every page in the PRD — auth (with verify, reset, accept-invite), editor, dashboards (drafts, scheduled, archived, blog analytics), public reading + discovery, the rich homepage, search, company management (create, edit, analytics, timeline), user settings, notifications, 404, and admin.
              </p>
              <div className="wf-eyebrow" style={{marginTop:8}}>How to read these</div>
              <ul style={{margin:0,padding:0,listStyle:'none',display:'flex',flexDirection:'column',gap:6,fontSize:13,color:'var(--wf-ink-2)'}}>
                <li><span className="wf-mono" style={{color:'var(--wf-accent)'}}>—</span> Pan with space-drag. Zoom with ⌘/Ctrl + scroll.</li>
                <li><span className="wf-mono" style={{color:'var(--wf-accent)'}}>—</span> Click any frame's expand icon to open it fullscreen.</li>
                <li><span className="wf-mono" style={{color:'var(--wf-accent)'}}>—</span> Open <b>Tweaks</b> (top-right) to flip sketchy↔clean, light↔dark, hide annotations, empty↔populated.</li>
                <li><span className="wf-mono" style={{color:'var(--wf-accent)'}}>—</span> Homepage is tall — start there, then 18 · Search modal.</li>
              </ul>
              <div className="wf-eyebrow" style={{marginTop:8}}>Sections</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,fontSize:12,color:'var(--wf-ink-2)'}}>
                <div>① Auth &amp; Onboarding</div>
                <div>② Editor &amp; Dashboard</div>
                <div>③ Public Reading</div>
                <div>④ Public Discovery</div>
                <div>⑤ Company</div>
                <div>⑥ User &amp; System</div>
                <div>⑦ Marketing &amp; Legal</div>
                <div>⑧ Platform Admin</div>
              </div>
              <span style={{flex:1}}/>
              <Box variant="soft" style={{padding:10,fontSize:11,color:'var(--wf-ink-2)'}}>
                <b style={{fontFamily:'var(--wf-serif)'}}>Note</b> · these are wireframes, not visual designs. Stripes = "image goes here", line-bars = "copy goes here", red handwriting = annotations.
              </Box>
            </div>
          </DCArtboard>
        </DCSection>

        <DCSection id="auth" title="① Auth & Onboarding" subtitle="Sign up · Log in · Verify · Reset · Forgot · Onboarding · Invite">
          {D('signup', '01 · Sign up', SignUp)}
          {D('verify', '01b · Check inbox', VerifyEmail)}
          {D('login',  '02 · Log in', LogIn)}
          {D('forgot', '03 · Forgot password', Forgot)}
          {D('reset',  '03b · Set new password', ResetPassword)}
          {D('onboarding', '04 · Onboarding', Onboarding)}
          {D('accept-invite', '16b · Accept invite', AcceptInvite)}
          {M('m-signup', '01M · Sign up', MSignUp)}
          {M('m-onboarding', '04M · Onboarding', MOnboarding)}
        </DCSection>

        <DCSection id="editor" title="② Editor & Dashboard" subtitle="Two editor directions · two dashboard directions · schedule · drafts · scheduled · archived · analytics">
          {D('editor-split', '05a · Editor — split preview', EditorSplit)}
          {D('editor-focus', '05b · Editor — focus mode', EditorFocus)}
          {D('editor-schedule', '05c · Schedule modal', ScheduleModal)}
          {D('dash-list', '06a · Dashboard — list', DashboardList)}
          {D('dash-cards', '06b · Dashboard — cards', DashboardCards)}
          {D('drafts', '20 · Drafts', Drafts)}
          {D('scheduled', '21 · Scheduled', Scheduled)}
          {D('archived', '22 · Archived', Archived)}
          {D('blog-analytics', '23 · Blog analytics', BlogAnalytics)}
          {M('m-editor', '05M · Editor', MEditor)}
          {M('m-dash', '06M · Dashboard', MDashboard)}
        </DCSection>

        <DCSection id="public-read" title="③ Public Reading" subtitle="Blog reading view · Author profile">
          {D('blog-reading', '08 · Blog reading', BlogReading, 1280, 1500)}
          {D('author', '09 · Author profile', AuthorProfile, 1280, 880)}
          {M('m-blog', '08M · Reading', MBlogReading)}
          {M('m-author', '09M · Author', MAuthorProfile)}
        </DCSection>

        <DCSection id="discovery" title="④ Public Discovery" subtitle="Homepage (logged-out + signed-in) · Search modal · Explore · Tag pages">
          {D('home-public', '07a · Homepage — logged out', HomepagePublic, 1280, 2900)}
          {D('home-loggedin', '07b · Homepage — logged in', HomepageLoggedIn, 1280, 2300)}
          {D('search-modal', '18 · Search modal', SearchModalFrame)}
          {D('explore', '10 · Explore (redesigned)', Explore, 1280, 2050)}
          {D('tag', '11 · Tag page', TagPage, 1280, 1100)}
          {D('not-found', '27 · 404 / not found', NotFound)}
          {M('m-home', '07M · Homepage', MHomepage)}
        </DCSection>

        <DCSection id="company" title="⑤ Company" subtitle="Create · Dashboard · Edit profile · Analytics · Public page · Timeline">
          {D('co-create', '12 · Create company', CreateCompany)}
          {D('co-dash', '13 · Company dashboard', CompanyDashboard)}
          {D('co-invite', '13b · Invite modal', InviteModal)}
          {D('co-edit', '24 · Edit company profile', EditCompany)}
          {D('co-analytics', '25 · Company analytics', CompanyAnalytics)}
          {D('co-public', '14 · Public company page', PublicCompany, 1280, 1100)}
          {D('co-timeline', '15 · Timeline tab', TimelineTab, 1280, 1500)}
          {M('m-co', '14M · Public company', MCompany)}
        </DCSection>

        <DCSection id="user" title="⑥ User · Settings & System" subtitle="Profile · Account · Notifications">
          {D('settings-profile', '19 · Settings · My profile', SettingsProfile)}
          {D('settings-account', '19b · Settings · Account', SettingsAccount)}
          {D('notifications', '26 · Notifications drawer', Notifications)}
        </DCSection>

        <DCSection id="legal" title="⑦ Marketing & Legal" subtitle="Contact us · Privacy policy · Terms of service">
          {D('contact', '28 · Contact us', ContactUs, 1280, 1900)}
          {D('privacy', '29 · Privacy policy', PrivacyPolicy, 1280, 2400)}
          {D('terms',   '30 · Terms of service', TermsOfService, 1280, 2650)}
        </DCSection>

        <DCSection id="admin" title="⑧ Platform Admin" subtitle="Internal Lorestack staff · curation + moderation">
          {D('admin-overview', '16 · Admin overview', AdminOverview)}
          {D('admin-tags', '17 · Tag moderation', AdminTags)}
        </DCSection>

      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label="View">
          <TweakToggle label="Show annotations" value={t.annotations} onChange={v => setTweak('annotations', v)}/>
        </TweakSection>
        <TweakSection label="Content state">
          <TweakRadio label="Sample data" value={t.state} onChange={v => setTweak('state', v)}
            options={[{value:'full',label:'Populated'},{value:'empty',label:'Empty'}]}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
