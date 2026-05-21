// frames-legal.jsx — Contact us, Privacy policy, Terms of service.
// Editorial layout. Calm palette. Shared shell for legal docs.

// ──────────────────────────────────────────────────────────────────────────
// Shared editorial document shell — used by Privacy & Terms.
// Left: sticky table of contents. Right: serif long-form. Footer hidden — too tall.
const LegalDoc = ({ kind, title, lastUpdated, sections }) => (
  <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'auto',background:'var(--bg)'}}>
    <TopNav />

    {/* Document header */}
    <header style={{padding:'48px 56px 32px',background:'var(--bg-soft)',borderBottom:'1px solid var(--line)'}}>
      <div style={{maxWidth:1080,margin:'0 auto'}}>
        <span className="wf-eyebrow">{kind}</span>
        <h1 className="wf-h1" style={{fontSize:46,marginTop:8,letterSpacing:'-.6px'}}>{title}</h1>
        <p className="wf-serif wf-muted2" style={{fontSize:15,margin:'12px 0 0',maxWidth:640,lineHeight:1.55}}>
          This document explains, in plain language, what we collect, what we don't, and what you can do about it. We've tried to keep it short.
        </p>
        <div style={{display:'flex',gap:18,alignItems:'center',marginTop:18,fontSize:12,color:'var(--ink-3)'}}>
          <span className="wf-mono">Last updated: {lastUpdated}</span>
          <span style={{width:3,height:3,borderRadius:99,background:'var(--ink-3)'}}/>
          <span className="wf-mono">Effective: {lastUpdated}</span>
          <span style={{width:3,height:3,borderRadius:99,background:'var(--ink-3)'}}/>
          <span style={{color:'var(--accent-ink)',textDecoration:'underline',cursor:'pointer'}}>Download PDF</span>
        </div>
      </div>
    </header>

    {/* Body */}
    <div style={{maxWidth:1080,margin:'0 auto',padding:'40px 56px 64px',display:'grid',gridTemplateColumns:'220px 1fr',gap:48}}>
      {/* TOC */}
      <aside>
        <div style={{position:'sticky',top:24}}>
          <div className="wf-eyebrow" style={{marginBottom:12}}>On this page</div>
          <nav style={{display:'flex',flexDirection:'column',gap:2}}>
            {sections.map((s, i) => (
              <a key={s.heading} style={{
                padding:'6px 10px',
                borderLeft: i === 0 ? '2px solid var(--accent)' : '2px solid transparent',
                color: i === 0 ? 'var(--ink)' : 'var(--ink-3)',
                fontWeight: i === 0 ? 600 : 400,
                fontSize:12, textDecoration:'none', cursor:'pointer',
              }}>{s.heading}</a>
            ))}
          </nav>
          <div style={{marginTop:24,paddingTop:18,borderTop:'1px solid var(--line-soft)'}}>
            <div className="wf-eyebrow" style={{marginBottom:8}}>Questions?</div>
            <p className="wf-muted2" style={{fontSize:12,margin:'0 0 10px',lineHeight:1.5}}>
              Email <span className="wf-mono">legal@lorestack.com</span> or use the contact form.
            </p>
            <Btn size="sm">Contact us</Btn>
          </div>
        </div>
      </aside>

      {/* Long-form */}
      <article style={{maxWidth:680}}>
        {sections.map((s, i) => (
          <section key={s.heading} style={{marginBottom: i === sections.length - 1 ? 0 : 36, scrollMarginTop:80}}>
            <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:10}}>
              <span className="wf-mono" style={{fontSize:11,color:'var(--ink-3)'}}>{String(i+1).padStart(2,'0')}</span>
              <h2 className="wf-h2" style={{fontSize:22}}>{s.heading}</h2>
            </div>
            {s.body.map((para, k) => {
              if (para.type === 'p') {
                return <p key={k} className="wf-serif" style={{fontSize:15,lineHeight:1.65,margin:'0 0 14px',color:'var(--ink-2)'}}>{para.text}</p>;
              }
              if (para.type === 'list') {
                return (
                  <ul key={k} style={{margin:'4px 0 14px',paddingLeft:18,fontFamily:'var(--serif)',fontSize:15,lineHeight:1.65,color:'var(--ink-2)'}}>
                    {para.items.map((it, j) => <li key={j} style={{marginBottom:4}}>{it}</li>)}
                  </ul>
                );
              }
              if (para.type === 'note') {
                return (
                  <Box variant="soft" key={k} style={{padding:'12px 16px',margin:'6px 0 14px',display:'flex',gap:10,alignItems:'flex-start'}}>
                    <span className="wf-mono" style={{color:'var(--accent-ink)',fontWeight:600,marginTop:1}}>ⓘ</span>
                    <div className="wf-serif" style={{fontSize:14,lineHeight:1.55,color:'var(--ink-2)'}}>{para.text}</div>
                  </Box>
                );
              }
              if (para.type === 'h3') {
                return <h3 key={k} className="wf-h3" style={{fontSize:15,margin:'18px 0 8px'}}>{para.text}</h3>;
              }
              return null;
            })}
          </section>
        ))}
        <div style={{marginTop:48,paddingTop:24,borderTop:'1px solid var(--line)',fontSize:12,color:'var(--ink-3)',display:'flex',justifyContent:'space-between'}}>
          <span>Lorestack · est. 2025</span>
          <span>Questions? <span style={{color:'var(--accent-ink)',textDecoration:'underline'}}>legal@lorestack.com</span></span>
        </div>
      </article>
    </div>
  </div>
);

// ──────────────────────────────────────────────────────────────────────────
// 28 · Contact us
// ──────────────────────────────────────────────────────────────────────────
const ContactUs = () => (
  <Frame label="28 · Contact us" sub="public · pre-filled topic dropdown · response SLA">
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'auto',background:'var(--bg)'}}>
      <TopNav />

      {/* Hero */}
      <section style={{padding:'48px 56px 32px',borderBottom:'1px solid var(--line-soft)'}}>
        <div style={{maxWidth:1080,margin:'0 auto',display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:48,alignItems:'end'}}>
          <div>
            <span className="wf-eyebrow">We're listening</span>
            <h1 className="wf-h1" style={{fontSize:48,marginTop:10,maxWidth:560,letterSpacing:'-.6px'}}>
              Get in touch. We answer every message.
            </h1>
            <p className="wf-serif wf-muted2" style={{fontSize:16,lineHeight:1.55,marginTop:14,maxWidth:520}}>
              Whether you're a writer with a question, a company looking to publish, or a journalist asking about the platform — pick a route below or send the form.
            </p>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <Box style={{padding:14,display:'flex',gap:12,alignItems:'center'}}>
              <span style={{width:36,height:36,display:'inline-flex',alignItems:'center',justifyContent:'center',background:'var(--bg-soft)',border:'1px solid var(--line)',borderRadius:6,fontFamily:'var(--mono)',color:'var(--ink-2)'}}>⏱</span>
              <div>
                <div style={{fontWeight:600,fontSize:13}}>Typical response time</div>
                <div className="wf-muted" style={{fontSize:11,marginTop:2}}>Within 1 business day · Mon–Fri 09:00–18:00 IST</div>
              </div>
            </Box>
            <Box style={{padding:14,display:'flex',gap:12,alignItems:'center'}}>
              <span style={{width:36,height:36,display:'inline-flex',alignItems:'center',justifyContent:'center',background:'var(--bg-soft)',border:'1px solid var(--line)',borderRadius:6,fontFamily:'var(--mono)',color:'var(--ink-2)'}}>◉</span>
              <div>
                <div style={{fontWeight:600,fontSize:13}}>System status</div>
                <div className="wf-muted" style={{fontSize:11,marginTop:2}}>All systems operational · <span style={{color:'var(--accent-ink)',textDecoration:'underline'}}>status.lorestack.com</span></div>
              </div>
            </Box>
          </div>
        </div>
      </section>

      {/* Routing tiles */}
      <section style={{padding:'32px 56px'}}>
        <div style={{maxWidth:1080,margin:'0 auto'}}>
          <div className="wf-eyebrow" style={{marginBottom:14}}>Pick a route</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14}}>
            {[
              { icon:'☻', h:'Writer help', body:'Editor questions, publishing issues, formatting bugs.', email:'help@lorestack.com' },
              { icon:'◧', h:'Companies', body:'Set up your company, billing, team management, custom invoices.', email:'companies@lorestack.com' },
              { icon:'✎', h:'Press & media', body:'Interviews, quotes, brand assets, feature requests.', email:'press@lorestack.com' },
              { icon:'⚖', h:'Legal & abuse', body:'DMCA, content reports, privacy & data requests.', email:'legal@lorestack.com' },
            ].map(t => (
              <Box key={t.h} style={{padding:18,display:'flex',flexDirection:'column',gap:8}}>
                <span style={{width:36,height:36,display:'inline-flex',alignItems:'center',justifyContent:'center',background:'var(--accent-soft)',border:'none',borderRadius:6,color:'var(--accent-ink)',fontFamily:'var(--mono)',fontSize:16}}>{t.icon}</span>
                <h3 className="wf-h3" style={{fontSize:15,marginTop:4}}>{t.h}</h3>
                <p className="wf-muted2" style={{margin:0,fontSize:12,lineHeight:1.5}}>{t.body}</p>
                <span className="wf-mono" style={{fontSize:11,color:'var(--accent-ink)',marginTop:'auto',paddingTop:8}}>↗ {t.email}</span>
              </Box>
            ))}
          </div>
        </div>
      </section>

      {/* Form + side info */}
      <section style={{padding:'24px 56px 48px',background:'var(--bg-soft)',borderTop:'1px solid var(--line)',borderBottom:'1px solid var(--line)'}}>
        <div style={{maxWidth:1080,margin:'0 auto',display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:48}}>
          {/* Form */}
          <div>
            <span className="wf-eyebrow">Send us a message</span>
            <h2 className="wf-h2" style={{marginTop:6,fontSize:24}}>Tell us what's up.</h2>
            <p className="wf-muted2" style={{margin:'6px 0 22px',fontSize:13}}>We'll reply to the email you give us. Required fields marked *.</p>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <Input label="Your name" required placeholder="Zara Khan"/>
              <Input label="Email" required placeholder="you@studio.dev"/>
            </div>
            <div style={{marginTop:14,display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div>
                <label style={{font:'600 11px var(--sans)',color:'var(--ink-2)',marginBottom:6,display:'block'}}>Topic <span style={{color:'var(--accent)'}}>*</span></label>
                <Box style={{padding:'10px 12px',display:'flex',justifyContent:'space-between',fontSize:13,background:'var(--bg)'}}>
                  Writer help <span className="wf-muted">▾</span>
                </Box>
              </div>
              <Input label="Company (optional)" placeholder="Aurora Labs"/>
            </div>

            <div style={{marginTop:14}}>
              <label style={{font:'600 11px var(--sans)',color:'var(--ink-2)',marginBottom:6,display:'block'}}>Message <span style={{color:'var(--accent)'}}>*</span></label>
              <Box style={{padding:'12px 14px',minHeight:140,background:'var(--bg)',color:'var(--ink-3)',fontSize:13,display:'flex',flexDirection:'column'}}>
                Tell us as much as you can — paste error screenshots if useful.
                <span style={{flex:1}}/>
                <span style={{textAlign:'right',color:'var(--ink-3)',fontSize:11}}>0 / 2000</span>
              </Box>
            </div>

            <Box variant="soft" style={{padding:'10px 14px',marginTop:14,display:'flex',gap:10,alignItems:'flex-start',background:'var(--bg)',border:'1px solid var(--line-soft)'}}>
              <span style={{width:14,height:14,border:'1px solid var(--line-strong)',borderRadius:3,marginTop:2,flex:'0 0 14px'}}/>
              <label style={{fontSize:12,color:'var(--ink-2)',lineHeight:1.5}}>
                I'm OK with Lorestack storing my message to follow up. Read our <span style={{color:'var(--accent-ink)',textDecoration:'underline'}}>privacy policy</span>.
              </label>
            </Box>

            <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:18}}>
              <Btn variant="ghost">Clear form</Btn>
              <Btn variant="accent" size="lg">Send message →</Btn>
            </div>
          </div>

          {/* Side info */}
          <div style={{display:'flex',flexDirection:'column',gap:18}}>
            <Box style={{padding:18,background:'var(--bg)'}}>
              <div className="wf-eyebrow" style={{marginBottom:10}}>Office</div>
              <p className="wf-serif" style={{margin:0,fontSize:14,lineHeight:1.55,color:'var(--ink-2)'}}>
                Lorestack Technologies Pvt. Ltd.<br/>
                Indiranagar, 3rd Cross<br/>
                Bengaluru, KA 560038<br/>
                India
              </p>
            </Box>
            <Box style={{padding:18,background:'var(--bg)'}}>
              <div className="wf-eyebrow" style={{marginBottom:10}}>Follow along</div>
              <div style={{display:'flex',flexDirection:'column',gap:8,fontSize:13,color:'var(--ink-2)'}}>
                {[['Twitter / X','@lorestack'],['LinkedIn','/company/lorestack'],['GitHub','/lorestack'],['RSS','/feed.xml']].map(([k,v]) => (
                  <div key={k} style={{display:'flex',justifyContent:'space-between',paddingBottom:6,borderBottom:'1px dashed var(--line-soft)'}}>
                    <span>{k}</span>
                    <span className="wf-mono wf-muted">{v}</span>
                  </div>
                ))}
              </div>
            </Box>
            <Box variant="soft" style={{padding:18,background:'var(--bg)'}}>
              <div className="wf-eyebrow" style={{marginBottom:10}}>Help center</div>
              <p className="wf-muted2" style={{margin:0,fontSize:13,lineHeight:1.5}}>
                Most writer questions are answered in the <span style={{color:'var(--accent-ink)',textDecoration:'underline'}}>help center</span> — searchable, with examples.
              </p>
              <Btn size="sm" style={{marginTop:10}}>Browse help →</Btn>
            </Box>
          </div>
        </div>
      </section>

      {/* Footer-y FAQ teaser */}
      <section style={{padding:'40px 56px'}}>
        <div style={{maxWidth:1080,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 2fr',gap:48,alignItems:'start'}}>
          <div>
            <span className="wf-eyebrow">Quick answers</span>
            <h2 className="wf-h2" style={{marginTop:6,fontSize:24}}>Before you write to us…</h2>
            <p className="wf-muted2" style={{margin:'6px 0 0',fontSize:13,lineHeight:1.5}}>A few things people ask all the time. Worth a 30-second look.</p>
          </div>
          <div style={{display:'flex',flexDirection:'column'}}>
            {[
              ['Is Lorestack free to use?','Yes — for individual writers, forever. Companies pay only when they need advanced analytics or custom domains.'],
              ['Who owns the blogs I publish?','You do. We never claim ownership. You can export everything as Markdown anytime.'],
              ['Can I delete my account?','Yes, from Settings → Danger zone. Your published posts can stay live (anonymized) or be removed entirely — your choice.'],
              ['Do you accept guest posts on the Lorestack blog?','Occasionally. Pitch press@lorestack.com with the angle.'],
            ].map(([q,a],i) => (
              <details key={q} style={{borderTop: i ? '1px solid var(--line-soft)' : 'none',padding:'14px 0'}}>
                <summary style={{font:'600 14px var(--serif)',cursor:'pointer',listStyle:'none',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  {q}
                  <span className="wf-mono" style={{color:'var(--ink-3)',fontSize:14}}>+</span>
                </summary>
                <p className="wf-serif wf-muted2" style={{margin:'8px 0 0',fontSize:14,lineHeight:1.55}}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
    <Annot n={1} x={30} y={140} w={210}>Four routing tiles route to specialist emails so general inbox stays clean.</Annot>
    <Annot n={2} x={30} y={620} align="right" w={210}>Form persists draft to localStorage in case of accidental navigation away.</Annot>
  </Frame>
);

// ──────────────────────────────────────────────────────────────────────────
// 29 · Privacy policy
// ──────────────────────────────────────────────────────────────────────────
const PrivacyPolicy = () => (
  <Frame label="29 · Privacy policy" sub="long-form · TOC sidebar · plain language">
    <LegalDoc kind="Privacy" title="Privacy policy" lastUpdated="May 14, 2026" sections={[
      { heading: 'What we collect', body: [
        { type:'p', text:"When you create a Lorestack account, we ask for your name, email address, and a password (or, if you sign in with Google, the basic profile information Google passes us). We use this to identify you, to keep your account safe, and to send the occasional account-related email." },
        { type:'p', text:"When you write a blog or create a company, we store the content you've created, plus settings you choose (tags, scheduled publish times, cover images). When you read a blog, we record an anonymous page view so the author can see how their post is doing." },
        { type:'h3', text:'We do not collect' },
        { type:'list', items:[
          "Your contacts, location, or device identifiers",
          "Behavioural tracking across other websites",
          "Any payment information directly — billing is handled by our payments processor",
        ]},
      ]},
      { heading: 'How we use your data', body: [
        { type:'p', text:"We use the information we collect to operate the platform — show you your dashboard, deliver your blogs to readers, generate SEO meta tags, send invite emails, that sort of thing." },
        { type:'p', text:"We use aggregated, de-identified data to spot bugs, plan features, and understand what content writers are finding useful. We do not sell, rent, or share your personal information with third parties for advertising." },
        { type:'note', text:"Reader analytics shown to authors (read counts, referrer breakdowns, geography) are aggregated. Authors never see who specifically read their blog." },
      ]},
      { heading: 'Cookies & tracking', body: [
        { type:'p', text:"We use a small number of cookies — a session cookie to keep you logged in, a preference cookie for your theme/language, and a first-party analytics cookie that records anonymized page views (we use a privacy-respecting analytics provider, not Google Analytics)." },
        { type:'p', text:"We do not use third-party advertising trackers, retargeting pixels, or fingerprinting. You can clear cookies at any time from your browser; you'll just need to log in again." },
      ]},
      { heading: 'Data sharing', body: [
        { type:'p', text:"We share data with a small number of vendors who help us run the service — for example, the company that sends our transactional emails, our cloud hosting provider, and our payments processor. Each one is bound by data-processing agreements that limit them to acting on our instructions." },
        { type:'p', text:"We don't share your data with anyone else, except as required by law or to protect the rights and safety of Lorestack and our users." },
      ]},
      { heading: 'Your rights', body: [
        { type:'p', text:"You have the right to access, correct, export, and delete the data we hold about you. Most of this is one-click from Settings → My profile or Settings → Account. For anything more involved (full data export, deletion of historical analytics records, or any GDPR / CCPA request), email privacy@lorestack.com and we'll handle it within 30 days." },
        { type:'h3', text:'EU / UK residents' },
        { type:'p', text:"You can lodge a complaint with your local data-protection authority. We are based in India; our EU representative is listed in the footer of every email." },
      ]},
      { heading: 'Data retention', body: [
        { type:'p', text:"We keep your account data for as long as your account is active. Drafts you've deleted are removed from our systems within 30 days. Archived blogs are kept until you choose to permanently delete them." },
        { type:'p', text:"When you delete your account, we anonymise your published blogs (your name replaced with 'a former Lorestack writer') unless you specifically ask us to remove them entirely." },
      ]},
      { heading: 'Children', body: [
        { type:'p', text:"Lorestack isn't intended for children under 13. We don't knowingly collect personal information from anyone under 13. If you believe we have, please write to legal@lorestack.com and we will remove it." },
      ]},
      { heading: 'Changes to this policy', body: [
        { type:'p', text:"If we change this policy in any material way, we'll let you know by email and post the changes here at least 30 days before they take effect. The 'last updated' date at the top reflects the most recent revision." },
      ]},
    ]} />
    </Frame>
);

// ──────────────────────────────────────────────────────────────────────────
// 30 · Terms of service
// ──────────────────────────────────────────────────────────────────────────
const TermsOfService = () => (
  <Frame label="30 · Terms of service" sub="long-form · same shell as privacy">
    <LegalDoc kind="Legal" title="Terms of service" lastUpdated="May 14, 2026" sections={[
      { heading: 'Accepting these terms', body: [
        { type:'p', text:"By creating a Lorestack account or using the platform, you agree to these terms. If you're using Lorestack on behalf of a company, you confirm you have the authority to bind that company to these terms." },
        { type:'p', text:"If you don't agree, you shouldn't use the platform. If you stop agreeing later, you can delete your account from Settings → Danger zone at any time." },
      ]},
      { heading: 'Your account', body: [
        { type:'p', text:"You're responsible for the activity on your account, for keeping your password safe, and for the content you publish. You must be at least 13 years old to sign up." },
        { type:'p', text:"You may not share your account credentials with anyone else, and you may not have more than one personal account. Companies have their own accounts (via the Company feature) — that's not the same thing as a duplicate personal account." },
      ]},
      { heading: 'Your content', body: [
        { type:'p', text:"You retain ownership of everything you publish on Lorestack. By publishing, you grant us a non-exclusive, worldwide licence to host, display, and serve your content as part of operating the platform (including generating preview cards, OG images, and the like). That licence ends when you delete the content." },
        { type:'p', text:"You're responsible for making sure you have the right to publish what you publish. Don't publish content you don't own, content that infringes someone else's rights, or content that's illegal where you or your readers are." },
        { type:'note', text:"You can export your full content library as Markdown at any time from Settings → Account → Export data. No vendor lock-in." },
      ]},
      { heading: 'Acceptable use', body: [
        { type:'p', text:"Don't use Lorestack to harass, threaten, defame, or doxx other people. Don't post spam, malware, or sexually exploitative content. Don't use the platform to circumvent law-enforcement requests or evade sanctions." },
        { type:'p', text:"If we believe you're violating these rules, we may remove the content and, in serious cases, suspend or terminate your account. We try to give people the benefit of the doubt and a chance to fix things first." },
      ]},
      { heading: 'Companies & team roles', body: [
        { type:'p', text:"When you create a company on Lorestack, you become its Owner. Owners can invite authors, edit the company profile, and archive any blog published under the company brand. Owners are responsible for everything published under their company." },
        { type:'p', text:"If you accept an invite to join a company as an Author, you can publish under that company brand but you can't change the company's settings or remove other authors." },
      ]},
      { heading: 'Fees & billing', body: [
        { type:'p', text:"The core platform is free for individual writers. Companies may choose paid plans for advanced features — pricing is shown on the company billing page before you upgrade. Subscriptions renew automatically until cancelled." },
        { type:'p', text:"Refunds are handled on a case-by-case basis. Email billing@lorestack.com within 14 days of a charge if something's wrong." },
      ]},
      { heading: 'Termination', body: [
        { type:'p', text:"You can stop using Lorestack at any time, with or without reason, by deleting your account. We can stop providing the service to you, with or without reason, but we'll give you 30 days' notice unless we're terminating for a violation of these terms or a legal requirement." },
        { type:'p', text:"On termination, your content is removed from public view within 7 days and from our systems within 30. You can export it before then." },
      ]},
      { heading: 'Disclaimers & liability', body: [
        { type:'p', text:"Lorestack is provided as-is. We work hard to keep the service running, the data safe, and the writing tools sharp — but no software is perfect, and we can't guarantee uptime, error-free operation, or that your post will go viral." },
        { type:'p', text:"To the maximum extent allowed by law, our total liability to you in any 12-month period is limited to the greater of (a) the amount you paid us in that period, or (b) ₹5,000 INR / ~$60 USD." },
      ]},
      { heading: 'Governing law & disputes', body: [
        { type:'p', text:"These terms are governed by the laws of India. Disputes should first be raised in writing to legal@lorestack.com; if we can't resolve it, the courts of Bengaluru, Karnataka have exclusive jurisdiction." },
      ]},
      { heading: 'Changes to these terms', body: [
        { type:'p', text:"If we make material changes to these terms, we'll email you and post the changes here at least 30 days before they take effect. Continued use after the changes go live means you accept them." },
      ]},
    ]} />
  </Frame>
);

Object.assign(window, { ContactUs, PrivacyPolicy, TermsOfService });
