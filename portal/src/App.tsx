import { useState } from 'react'
import {
  Activity, ArrowRight, Bell, Building2, Check, ChevronDown, ChevronRight,
  ClipboardCheck, FileText, HardHat, LayoutDashboard, LifeBuoy, ListChecks,
  Menu, Search, Settings2, ShieldAlert, ShieldCheck, Siren, Users, X,
} from 'lucide-react'

type Section = 'Overview' | 'Incidents' | 'Inspections' | 'Risk assessments' | 'Documents' | 'Training' | 'People' | 'Sites' | 'Reports' | 'Administration'

const navigation: { label: Section; icon: typeof LayoutDashboard; group: string }[] = [
  { label: 'Overview', icon: LayoutDashboard, group: 'WORKSPACE' },
  { label: 'Incidents', icon: Siren, group: 'SAFETY MANAGEMENT' },
  { label: 'Inspections', icon: ClipboardCheck, group: 'SAFETY MANAGEMENT' },
  { label: 'Risk assessments', icon: ShieldAlert, group: 'SAFETY MANAGEMENT' },
  { label: 'Documents', icon: FileText, group: 'SAFETY MANAGEMENT' },
  { label: 'Training', icon: HardHat, group: 'PEOPLE & SITES' },
  { label: 'People', icon: Users, group: 'PEOPLE & SITES' },
  { label: 'Sites', icon: Building2, group: 'PEOPLE & SITES' },
  { label: 'Reports', icon: Activity, group: 'INSIGHTS' },
  { label: 'Administration', icon: Settings2, group: 'INSIGHTS' },
]

function App() {
  const [active, setActive] = useState<Section>('Overview')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')

  const notify = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3200)
  }

  const groups = [...new Set(navigation.map((item) => item.group))]

  return (
    <div className="app-shell">
      {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <aside className={'sidebar ' + (mobileOpen ? 'sidebar-open' : '')}>
        <div className="brand-lockup">
          <img className="brand-logo" src="https://raw.githubusercontent.com/NateJ4y/Elviti/feature/health-safety-portal/Elviti%20Works%20Logo.png" alt="Elviti Works" />
          <div className="brand-divider" aria-hidden="true" />
          <div className="brand-product"><strong>HEALTH & SAFETY</strong><span>OPERATIONS PORTAL</span></div>
          <button className="sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>
        <div className="workspace-switcher workspace-static">
          <span className="workspace-avatar">EW</span>
          <span className="workspace-copy"><strong>Elviti Works</strong><small>Organisation workspace</small></span>
        </div>
        <nav className="side-navigation" aria-label="Portal navigation">
          {groups.map((group) => (
            <div className="nav-group" key={group}>
              <p className="nav-label">{group}</p>
              {navigation.filter((item) => item.group === group).map(({ label, icon: Icon }) => (
                <button key={label} className={'nav-item ' + (active === label ? 'nav-item-active' : '')} onClick={() => { setActive(label); setMobileOpen(false) }}>
                  <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><LifeBuoy size={17} /></div><strong>Need a hand?</strong><p>Guidance and support for your safety workspace.</p><button onClick={() => notify('Help resources will be available in a later release.')}>Help & support <ArrowRight size={13} /></button></div>
          <div className="profile-row"><div className="profile-avatar"><Users size={14} /></div><div className="profile-copy"><strong>Account access</strong><span>Sign-in not configured</span></div></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left"><button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="breadcrumb">Workspace <ChevronRight size={14} /> <strong>{active}</strong></div></div>
          <div className="topbar-actions">
            <div className="search-box"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search this workspace" aria-label="Search this workspace" /><kbd>⌘ K</kbd></div>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => notify('Notifications will be available when the portal backend is connected.')}><Bell size={18} /></button>
            <div className="topbar-divider" />
            <div className="top-user"><div className="profile-avatar"><Users size={14} /></div><ChevronDown size={14} /></div>
          </div>
        </header>

        <div className="page-content">
          {active === 'Overview' ? (
            <>
              <section className="welcome-row">
                <div><p className="eyebrow">ELVITI WORKS · HEALTH & SAFETY</p><h1>Welcome to your workspace</h1><p className="welcome-subtitle">A clear view of health and safety operations across your organisation.</p></div>
                <div className="welcome-actions"><button className="button-secondary" onClick={() => notify('Reporting will be available once records are connected.')} disabled><FileText size={16} /> Export report</button><button className="button-primary" onClick={() => setActive('Incidents')}><Siren size={16} /> Open incident register</button></div>
              </section>

              <section className="metric-grid" aria-label="Safety performance summary">
                <Metric label="Open incidents" icon={Siren} />
                <Metric label="Inspections" icon={ClipboardCheck} />
                <Metric label="Training records" icon={HardHat} />
                <Metric label="Registered sites" icon={Building2} />
              </section>

              <section className="dashboard-grid">
                <div className="panel performance-panel">
                  <div className="panel-heading"><div><p className="eyebrow">SAFETY PERFORMANCE</p><h2>Performance overview</h2><p className="panel-subtitle">Metrics will appear when verified records are connected.</p></div></div>
                  <div className="empty-panel-state"><span className="empty-state-icon"><Activity size={22} /></span><strong>No performance data yet</strong><p>There are no safety records to report. Connect the secure workspace database to begin tracking performance.</p></div>
                </div>
                <div className="panel actions-panel">
                  <div className="panel-heading"><div><p className="eyebrow">WORKSPACE SETUP</p><h2>Getting started</h2><p className="panel-subtitle">Configuration required before use.</p></div></div>
                  <div className="setup-list">
                    <div><span className="setup-number">01</span><span><strong>Configure secure access</strong><small>Set up user sign-in and permissions.</small></span></div>
                    <div><span className="setup-number">02</span><span><strong>Register sites and projects</strong><small>Add approved operational locations.</small></span></div>
                    <div><span className="setup-number">03</span><span><strong>Connect safety records</strong><small>Enable registers and workflows.</small></span></div>
                  </div>
                </div>
              </section>

              <section className="lower-grid">
                <div className="panel incident-panel">
                  <div className="panel-heading"><div><p className="eyebrow">SAFETY MANAGEMENT</p><h2>Recent incidents</h2><p className="panel-subtitle">Reported incidents will appear here.</p></div><button className="view-all" onClick={() => setActive('Incidents')}>Open register <ArrowRight size={14} /></button></div>
                  <EmptyTable message="No incident records have been added." />
                </div>
                <div className="panel tasks-panel">
                  <div className="panel-heading"><div><p className="eyebrow">WORK QUEUE</p><h2>Assigned actions</h2><p className="panel-subtitle">Actions assigned to your account.</p></div></div>
                  <div className="empty-panel-state compact"><span className="empty-state-icon"><ListChecks size={21} /></span><strong>No assigned actions</strong><p>Assigned tasks will appear here when workflows are enabled.</p></div>
                </div>
              </section>
              <footer className="page-footer"><span>Elviti Works · Health & Safety Portal</span><span>Health & safety workspace</span></footer>
            </>
          ) : (
            <ModulePlaceholder section={active} onAction={() => notify('This module is not connected yet. No records have been created.')} />
          )}
        </div>
      </main>
      {notice && <div className="toast"><Check size={16} />{notice}</div>}
    </div>
  )
}

function Metric({ label, icon: Icon }: { label: string; icon: typeof Activity }) {
  return <article className="metric-card"><div className="metric-top"><span>{label}</span><i className="metric-icon metric-neutral"><Icon size={17} /></i></div><div className="metric-value">—</div><div className="metric-change change-neutral">Awaiting verified data</div></article>
}

function EmptyTable({ message }: { message: string }) {
  return <div className="table-wrap"><table className="incident-table"><thead><tr><th>REFERENCE</th><th>LOCATION</th><th>DATE REPORTED</th><th>SEVERITY</th><th>STATUS</th></tr></thead><tbody><tr><td colSpan={5} className="empty-state">{message}</td></tr></tbody></table></div>
}

function ModulePlaceholder({ section, onAction }: { section: Section; onAction: () => void }) {
  const details: Record<Exclude<Section, 'Overview'>, { eyebrow: string; description: string; icon: typeof Activity; cards: string[] }> = {
    'Incidents': { eyebrow: 'SAFETY MANAGEMENT', description: 'Record and manage incidents, near misses, hazards and observations.', icon: Siren, cards: ['Incident register', 'Investigations', 'Corrective actions'] },
    'Inspections': { eyebrow: 'SAFETY MANAGEMENT', description: 'Plan site checks, complete digital checklists and follow up on findings.', icon: ClipboardCheck, cards: ['Inspection templates', 'Inspection schedules', 'Inspection findings'] },
    'Risk assessments': { eyebrow: 'SAFETY MANAGEMENT', description: 'Identify hazards, evaluate risks and maintain control measures.', icon: ShieldAlert, cards: ['Risk register', 'Risk assessments', 'Control measures'] },
    'Documents': { eyebrow: 'SAFETY MANAGEMENT', description: 'Manage safety files, policies, certificates and controlled documents.', icon: FileText, cards: ['Safety documents', 'Document versions', 'Document approvals'] },
    'Training': { eyebrow: 'PEOPLE & SITES', description: 'Manage inductions, competencies and training requirements.', icon: HardHat, cards: ['Training matrix', 'Courses and inductions', 'Competency records'] },
    'People': { eyebrow: 'PEOPLE & SITES', description: 'Manage employee, contractor and visitor access and safety requirements.', icon: Users, cards: ['Employee records', 'Contractor records', 'Access assignments'] },
    'Sites': { eyebrow: 'PEOPLE & SITES', description: 'Manage approved projects, workplaces and site-specific requirements.', icon: Building2, cards: ['Site register', 'Project assignments', 'Site requirements'] },
    'Reports': { eyebrow: 'INSIGHTS', description: 'Review verified safety activity and management reporting.', icon: Activity, cards: ['Incident reporting', 'Inspection reporting', 'Compliance reporting'] },
    'Administration': { eyebrow: 'INSIGHTS', description: 'Configure organisation settings, access permissions and audit controls.', icon: Settings2, cards: ['User access', 'Organisation settings', 'Audit history'] },
  }
  const item = details[section as Exclude<Section, 'Overview'>]
  const Icon = item.icon
  return <section className="module-page"><div className="module-heading"><div><p className="eyebrow">{item.eyebrow}</p><h1>{section}</h1><p className="welcome-subtitle">{item.description}</p></div></div><div className="module-intro panel"><div className="module-illustration"><Icon size={30} /></div><div><span className="coming-soon">NOT YET CONFIGURED</span><h2>{section} workspace</h2><p>This module is awaiting secure data connections and access controls. No sample records are displayed.</p></div></div><div className="module-card-grid">{item.cards.map((card, index) => <article className="module-card" key={card}><span className="module-card-icon"><ListChecks size={18} /></span><span className="module-card-number">0{index + 1}</span><h3>{card}</h3><p>Workspace capability. Records will appear after secure setup.</p><button onClick={onAction}>View setup status <ArrowRight size={14} /></button></article>)}</div><div className="module-footnote"><ShieldCheck size={15} /> No operational data is stored in this portal yet.</div></section>
}

export default App
