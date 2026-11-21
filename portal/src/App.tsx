import { useMemo, useState, type FormEvent } from 'react'
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight, Bell,
  Building2, CalendarDays, Check, ChevronDown,
  ChevronRight, ClipboardCheck, Clock3, FileCheck2, FileText, Filter, HardHat,
  LayoutDashboard, LifeBuoy, ListChecks, Menu, Plus, Search, Settings2,
  Shield, ShieldAlert, ShieldCheck, Siren, Users, X, Zap,
} from 'lucide-react'

type Section = 'Overview' | 'Incidents' | 'Inspections' | 'Risk assessments' | 'Documents' | 'Training' | 'People' | 'Sites' | 'Reports' | 'Administration'
type Incident = { id: string; title: string; site: string; date: string; severity: 'High' | 'Medium' | 'Low'; status: 'Open' | 'Investigating' | 'Resolved' }

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

const initialIncidents: Incident[] = [
  { id: 'INC-0248', title: 'Unsecured materials near access route', site: 'Vanderbijlpark Works', date: 'Today, 09:42', severity: 'Medium', status: 'Investigating' },
  { id: 'INC-0247', title: 'PPE non-compliance observed', site: 'Riverside Project', date: 'Yesterday, 14:16', severity: 'Low', status: 'Open' },
  { id: 'INC-0246', title: 'Minor equipment damage reported', site: 'Vanderbijlpark Works', date: '18 Nov 2026', severity: 'Low', status: 'Resolved' },
]

const tasks = [
  { title: 'Weekly site safety inspection', meta: 'Vanderbijlpark Works · Due today', tag: 'Inspection', tone: 'amber' },
  { title: 'Review working-at-heights assessment', meta: 'Riverside Project · Due tomorrow', tag: 'Risk review', tone: 'blue' },
  { title: 'Renew contractor induction records', meta: 'People & compliance · 24 Nov', tag: 'Training', tone: 'violet' },
]

function App() {
  const [active, setActive] = useState<Section>('Overview')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showIncident, setShowIncident] = useState(false)
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState('')
  const [incidents, setIncidents] = useState(initialIncidents)
  const [form, setForm] = useState({ title: '', site: 'Vanderbijlpark Works', severity: 'Medium' as Incident['severity'], details: '' })

  const filteredIncidents = useMemo(() => incidents.filter((item) =>
    (item.title + item.site + item.id).toLowerCase().includes(query.toLowerCase())
  ), [incidents, query])

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3200)
  }

  const submitIncident = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.title.trim()) return
    const newIncident: Incident = {
      id: 'INC-' + String(249 + incidents.length - initialIncidents.length).padStart(4, '0'),
      title: form.title.trim(),
      site: form.site,
      date: 'Just now',
      severity: form.severity,
      status: 'Open',
    }
    setIncidents((current) => [newIncident, ...current])
    setShowIncident(false)
    setForm({ title: '', site: 'Vanderbijlpark Works', severity: 'Medium', details: '' })
    setActive('Incidents')
    notify('Demo incident added to this session')
  }

  const groups = [...new Set(navigation.map((item) => item.group))]

  return (
    <div className="app-shell">
      {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-symbol"><ShieldCheck size={22} strokeWidth={2.2} /></div>
          <div><strong>ELVITI WORKS</strong><span>OPERATIONS PORTAL</span></div>
          <button className="sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>
        <button className="workspace-switcher" onClick={() => notify('Organisation switcher will be connected to user access settings.')}>
          <span className="workspace-avatar">EW</span>
          <span className="workspace-copy"><strong>Elviti Works</strong><small>Organisation workspace</small></span>
          <ChevronDown size={15} />
        </button>
        <nav className="side-navigation" aria-label="Portal navigation">
          {groups.map((group) => (
            <div className="nav-group" key={group}>
              <p className="nav-label">{group}</p>
              {navigation.filter((item) => item.group === group).map(({ label, icon: Icon }) => (
                <button key={label} className={`nav-item ${active === label ? 'nav-item-active' : ''}`} onClick={() => { setActive(label); setMobileOpen(false) }}>
                  <Icon size={17} strokeWidth={1.8} /><span>{label}</span>
                  {label === 'Incidents' && <i className="nav-count">{incidents.filter((item) => item.status !== 'Resolved').length}</i>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card"><div className="help-icon"><LifeBuoy size={17} /></div><strong>Need a hand?</strong><p>Find guidance on using your safety workspace.</p><button onClick={() => notify('Help centre connection will be added in a later release.')}>Visit help centre <ArrowRight size={13} /></button></div>
          <div className="profile-row"><div className="profile-avatar">EW</div><div className="profile-copy"><strong>Workspace admin</strong><span>Administrator · Demo</span></div><button aria-label="Profile options" onClick={() => notify('Profile and account settings are not connected yet.')}><ChevronDown size={16} /></button></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left"><button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="breadcrumb">Workspace <ChevronRight size={14} /> <strong>{active}</strong></div></div>
          <div className="topbar-actions">
            <div className="search-box"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search this workspace" aria-label="Search this workspace" /><kbd>⌘ K</kbd></div>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => notify('You are all caught up in this demo workspace.')}><Bell size={18} /><i /></button>
            <div className="topbar-divider" />
            <div className="top-user"><div className="profile-avatar">EW</div><ChevronDown size={14} /></div>
          </div>
        </header>

        <div className="page-content">
          <div className="demo-banner"><span className="demo-dot" /> DEMO WORKSPACE <span>·</span> Sample information only — no real safety records are stored.</div>
          {active === 'Overview' ? (
            <>
              <section className="welcome-row">
                <div><p className="eyebrow">SATURDAY, 21 NOVEMBER 2026</p><h1>Good afternoon, team <span>✳</span></h1><p className="welcome-subtitle">Here’s what’s happening across your safety operations.</p></div>
                <div className="welcome-actions"><button className="button-secondary" onClick={() => notify('Report export will be available when reporting is connected.')}><FileCheck2 size={16} /> Export report</button><button className="button-primary" onClick={() => setShowIncident(true)}><Plus size={17} /> Report an incident</button></div>
              </section>

              <section className="metric-grid" aria-label="Safety performance summary">
                <Metric label="Open incidents" value={String(incidents.filter((item) => item.status !== 'Resolved').length).padStart(2, '0')} change="2 need attention" icon={Siren} trend="warning" />
                <Metric label="Inspections completed" value="24" change="+12% this month" icon={ClipboardCheck} trend="positive" />
                <Metric label="Training compliance" value="92%" change="4 records expiring" icon={HardHat} trend="neutral" />
                <Metric label="Active sites" value="03" change="All sites reporting" icon={Building2} trend="positive" />
              </section>

              <section className="dashboard-grid">
                <div className="panel performance-panel">
                  <div className="panel-heading"><div><p className="eyebrow">SAFETY PERFORMANCE</p><h2>Incident overview</h2><p className="panel-subtitle">Reported incidents across your sites</p></div><button className="select-button" onClick={() => notify('Date range selector will be connected to reporting.')}>Last 30 days <ChevronDown size={14} /></button></div>
                  <div className="chart-summary"><div><strong>08</strong><span>Total reports</span></div><div className="chart-legend"><span><i className="legend-dot yellow" /> Open</span><span><i className="legend-dot slate" /> Resolved</span></div></div>
                  <div className="chart" role="img" aria-label="Illustrative bar chart showing incident reports over six weeks"><div className="chart-y"><span>6</span><span>4</span><span>2</span><span>0</span></div><div className="chart-plot"><div className="chart-gridlines"><i /><i /><i /><i /></div>{[['W1',2,1],['W2',3,1],['W3',2,2],['W4',4,1],['W5',2,2],['W6',3,1]].map(([week, open, resolved]) => <div className="chart-column" key={week}><div className="bar-stack"><i className="bar-open" style={{ height: Number(open) * 17 }} /><i className="bar-resolved" style={{ height: Number(resolved) * 17 }} /></div><span>{week}</span></div>)}</div></div>
                  <div className="chart-footnote"><span><span className="status-dot status-yellow" /> 3 open</span><span><span className="status-dot status-green" /> 5 resolved</span><a href="#" onClick={(e) => { e.preventDefault(); setActive('Reports') }}>View analytics <ArrowRight size={13} /></a></div>
                </div>

                <div className="panel actions-panel">
                  <div className="panel-heading"><div><p className="eyebrow">STAY AHEAD</p><h2>Priority actions</h2><p className="panel-subtitle">Items that need your attention</p></div><span className="priority-count">03</span></div>
                  <div className="priority-list">
                    <Priority icon={AlertTriangle} tone="amber" title="Review open incidents" detail="2 incidents awaiting review" onClick={() => setActive('Incidents')} />
                    <Priority icon={CalendarDays} tone="blue" title="Complete site inspection" detail="Vanderbijlpark Works · Today" onClick={() => setActive('Inspections')} />
                    <Priority icon={FileText} tone="violet" title="Documents expiring soon" detail="4 records need renewal" onClick={() => setActive('Documents')} />
                  </div>
                  <button className="text-button" onClick={() => setActive('Reports')}>See all actions <ArrowRight size={14} /></button>
                </div>
              </section>

              <section className="lower-grid">
                <div className="panel incident-panel">
                  <div className="panel-heading"><div><p className="eyebrow">LATEST ACTIVITY</p><h2>Recent incidents</h2><p className="panel-subtitle">A live view of reported safety events</p></div><button className="view-all" onClick={() => setActive('Incidents')}>View all <ArrowRight size={14} /></button></div>
                  <IncidentTable incidents={incidents.slice(0, 4)} />
                </div>
                <div className="panel tasks-panel">
                  <div className="panel-heading"><div><p className="eyebrow">YOUR WORK QUEUE</p><h2>Upcoming tasks</h2><p className="panel-subtitle">Keep your safety programme moving</p></div><button className="icon-button small" onClick={() => setActive('Inspections')} aria-label="View tasks"><ArrowUpRight size={16} /></button></div>
                  <div className="task-list">{tasks.map((task) => <div className="task-item" key={task.title}><span className={`task-check task-${task.tone}`}><Check size={14} /></span><div className="task-copy"><strong>{task.title}</strong><span>{task.meta}</span></div><span className={`task-tag tag-${task.tone}`}>{task.tag}</span></div>)}</div>
                </div>
              </section>
              <footer className="page-footer"><span>Elviti Works Operations Portal <span>·</span> Version 0.1.0</span><span>Built for safer work, every day.</span></footer>
            </>
          ) : active === 'Incidents' ? (
            <section className="module-page">
              <div className="module-heading"><div><p className="eyebrow">SAFETY MANAGEMENT</p><h1>Incidents & observations</h1><p className="welcome-subtitle">Capture events, investigate causes and track corrective actions.</p></div><button className="button-primary" onClick={() => setShowIncident(true)}><Plus size={17} /> Report an incident</button></div>
              <div className="metric-grid compact-metrics"><Metric label="Total reports" value={String(incidents.length).padStart(2, '0')} change="All recorded this session" icon={Activity} trend="neutral" /><Metric label="Open" value={String(incidents.filter((i) => i.status === 'Open').length).padStart(2, '0')} change="Awaiting action" icon={AlertTriangle} trend="warning" /><Metric label="Investigating" value={String(incidents.filter((i) => i.status === 'Investigating').length).padStart(2, '0')} change="In progress" icon={Search} trend="neutral" /><Metric label="Resolved" value={String(incidents.filter((i) => i.status === 'Resolved').length).padStart(2, '0')} change="Closed in this session" icon={Check} trend="positive" /></div>
              <div className="panel full-panel"><div className="panel-heading"><div><p className="eyebrow">INCIDENT REGISTER</p><h2>All incidents</h2><p className="panel-subtitle">Search and review reported events</p></div><button className="select-button" onClick={() => notify('Filters will be connected to the incident register.') }><Filter size={14} /> Filters</button></div><IncidentTable incidents={filteredIncidents} expanded /></div>
            </section>
          ) : (
            <ModulePlaceholder section={active} onAction={() => notify(`${active} workflows are part of the next implementation phase.`)} />
          )}
        </div>
      </main>

      {showIncident && <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowIncident(false) }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="incident-title"><div className="modal-heading"><div><p className="eyebrow">SAFETY MANAGEMENT</p><h2 id="incident-title">Report an incident</h2><p>Capture an event or observation for follow-up.</p></div><button className="icon-button" onClick={() => setShowIncident(false)} aria-label="Close"><X size={19} /></button></div><form onSubmit={submitIncident}><label>What happened?<input autoFocus required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Give this report a short title" /></label><div className="form-row"><label>Site<select value={form.site} onChange={(e) => setForm({ ...form, site: e.target.value })}><option>Vanderbijlpark Works</option><option>Riverside Project</option><option>Client Site — To be confirmed</option></select></label><label>Severity<select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value as Incident['severity'] })}><option>Low</option><option>Medium</option><option>High</option></select></label></div><label>Details<textarea rows={4} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} placeholder="Add relevant details (optional)" /></label><div className="form-note"><Shield size={15} /> Demo only. This report is not saved to a secure database.</div><div className="modal-actions"><button type="button" className="button-secondary" onClick={() => setShowIncident(false)}>Cancel</button><button type="submit" className="button-primary"><Plus size={16} /> Add demo report</button></div></form></section></div>}
      {toast && <div className="toast"><Check size={16} />{toast}</div>}
    </div>
  )
}

function Metric({ label, value, change, icon: Icon, trend }: { label: string; value: string; change: string; icon: typeof Activity; trend: 'positive' | 'warning' | 'neutral' }) {
  return <article className="metric-card"><div className="metric-top"><span>{label}</span><i className={`metric-icon metric-${trend}`}><Icon size={17} /></i></div><div className="metric-value">{value}</div><div className={`metric-change change-${trend}`}>{trend === 'positive' ? <ArrowUpRight size={14} /> : trend === 'warning' ? <ArrowDownRight size={14} /> : <Clock3 size={13} />}{change}</div></article>
}

function Priority({ icon: Icon, tone, title, detail, onClick }: { icon: typeof Activity; tone: string; title: string; detail: string; onClick: () => void }) {
  return <button className="priority-item" onClick={onClick}><span className={`priority-icon priority-${tone}`}><Icon size={17} /></span><span className="priority-copy"><strong>{title}</strong><small>{detail}</small></span><ChevronRight size={16} /></button>
}

function IncidentTable({ incidents, expanded = false }: { incidents: Incident[]; expanded?: boolean }) {
  return <div className="table-wrap"><table className="incident-table"><thead><tr><th>REPORT</th><th>LOCATION</th><th>DATE REPORTED</th><th>SEVERITY</th><th>STATUS</th>{expanded && <th> </th>}</tr></thead><tbody>{incidents.length ? incidents.map((incident) => <tr key={incident.id}><td><strong>{incident.title}</strong><small>{incident.id}</small></td><td>{incident.site}</td><td>{incident.date}</td><td><span className={`severity severity-${incident.severity.toLowerCase()}`}><i />{incident.severity}</span></td><td><span className={`state state-${incident.status.toLowerCase()}`}>{incident.status}</span></td>{expanded && <td><button className="row-action" aria-label={`Open ${incident.id}`}><ArrowUpRight size={16} /></button></td>}</tr>) : <tr><td colSpan={expanded ? 6 : 5} className="empty-state">No matching incident reports.</td></tr>}</tbody></table></div>
}

function ModulePlaceholder({ section, onAction }: { section: Section; onAction: () => void }) {
  const details: Record<Exclude<Section, 'Overview' | 'Incidents'>, { eyebrow: string; description: string; icon: typeof Activity; cards: string[] }> = {
    'Inspections': { eyebrow: 'SAFETY MANAGEMENT', description: 'Plan site checks, complete digital checklists and follow up on findings.', icon: ClipboardCheck, cards: ['Inspection schedules', 'Completed inspections', 'Outstanding findings'] },
    'Risk assessments': { eyebrow: 'SAFETY MANAGEMENT', description: 'Identify hazards, evaluate risks and keep control measures visible.', icon: ShieldAlert, cards: ['Risk register', 'Assessments awaiting review', 'Control measures'] },
    'Documents': { eyebrow: 'SAFETY MANAGEMENT', description: 'Keep safety files, policies, certificates and controlled documents organised.', icon: FileText, cards: ['Safety file library', 'Expiring documents', 'Document approvals'] },
    'Training': { eyebrow: 'PEOPLE & SITES', description: 'Track inductions, competencies, training records and renewal dates.', icon: HardHat, cards: ['Training matrix', 'Upcoming renewals', 'Induction records'] },
    'People': { eyebrow: 'PEOPLE & SITES', description: 'Manage employee, contractor and visitor safety information.', icon: Users, cards: ['Employee directory', 'Contractor register', 'Access and induction status'] },
    'Sites': { eyebrow: 'PEOPLE & SITES', description: 'Coordinate safety operations across projects, client locations and workplaces.', icon: Building2, cards: ['Active sites', 'Site contacts', 'Site-specific requirements'] },
    'Reports': { eyebrow: 'INSIGHTS', description: 'Turn safety activity into clear reporting for supervisors and management.', icon: Activity, cards: ['Incident trends', 'Inspection performance', 'Compliance overview'] },
    'Administration': { eyebrow: 'INSIGHTS', description: 'Configure organisation settings, user access and operational controls.', icon: Settings2, cards: ['Users and permissions', 'Organisation settings', 'Audit history'] },
  }
  const item = details[section as Exclude<Section, 'Overview' | 'Incidents'>]
  const Icon = item.icon
  return <section className="module-page"><div className="module-heading"><div><p className="eyebrow">{item.eyebrow}</p><h1>{section}</h1><p className="welcome-subtitle">{item.description}</p></div><button className="button-primary" onClick={onAction}><Plus size={17} /> Create new</button></div><div className="module-intro panel"><div className="module-illustration"><Icon size={30} /></div><div><span className="coming-soon">FOUNDATION IN PROGRESS</span><h2>A clearer way to manage {section.toLowerCase()}.</h2><p>This workspace is mapped out in the portal structure. The next phase will connect real records, permissions and workflows.</p></div></div><div className="module-card-grid">{item.cards.map((card, index) => <article className="module-card" key={card}><span className="module-card-icon"><ListChecks size={18} /></span><span className="module-card-number">0{index + 1}</span><h3>{card}</h3><p>Structured records and clear ownership for your team.</p><button onClick={onAction}>Explore module <ArrowRight size={14} /></button></article>)}</div><div className="module-footnote"><Zap size={15} /> Modules will be released in stages, starting with safety records and reporting.</div></section>
}

export default App
