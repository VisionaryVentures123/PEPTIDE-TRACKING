import React, { useState, useEffect, useRef, useCallback } from 'react';

/*
 * Peptide Research Tracker
 *
 * This React application is structured around a top navigation bar with five
 * primary sections: Dashboard, Peptides, Calculator, Research Log, Inventory
 * and Settings. It persists user data (favourites, logs, inventory) to
 * localStorage and supports basic offline usage via a service worker.
 *
 * DISCLAIMER: This application is intended solely for personal educational
 * research tracking. It does not provide medical advice or dosing
 * recommendations. All calculator outputs are simple mathematical
 * conversions based on user input.
 */

// Define peptide categories for filtering
const CATEGORIES = {
  healing: 'Healing / Tissue Repair',
  gh: 'Growth Hormone Secretagogue',
  cognitive: 'Cognitive / Neuro',
  metabolic: 'Metabolic',
  skin: 'Skin / Cosmetic',
  immune: 'Immune',
  sexual: 'Sexual Health',
  longevity: 'Longevity',
  mitochondrial: 'Mitochondrial',
  hormonal: 'Hormonal / Reproductive',
  experimental: 'Experimental / High‑risk',
  other: 'Other'
};

// Seed data for a handful of peptides. Additional entries can be added or
// imported later. Each peptide has fields used throughout the app.
const PEPTIDES_DATA = [
  {
    id: 'bpc157',
    name: 'BPC‑157',
    aliases: ['Body Protective Compound‑157'],
    category: 'healing',
    description:
      'BPC‑157 is a synthetic pentadecapeptide derived from human gastric juice. It has been investigated in preclinical models for its potential to promote tissue repair and modulate inflammation.',
    researchFocus: [
      'Tendon and ligament healing',
      'Muscle regeneration',
      'Gut mucosa protection'
    ],
    mechanism:
      'Proposed mechanisms include promoting angiogenesis via VEGF pathways, modulating nitric oxide synthase activity, and shifting macrophage populations toward a reparative phenotype.',
    status:
      'Investigational: studied primarily in animal models; not approved for human use. Considered a prohibited substance in many athletic competitions.',
    halfLife:
      'Short (<30 min) based on limited pharmacokinetic data; however, tissue‑level effects may persist beyond the peptide’s presencehttps://pmc.ncbi.nlm.nih.gov/articles/PMC12446177/#:~:text=%28TNF,40%2C%2026%20%2C%20%2055.',
    storage:
      'Lyophilised powder is relatively stable when kept cool and dry; reconstituted solution should be refrigerated and used within several weekshttps://adonyxbio.com/understanding-bpc-157-and-why-shelf-life-matters/#:~:text=Shelf%20Life%20of%20Lyophilized%20%28Freeze,157.',
    handling:
      'Avoid repeated freeze–thaw cycles. Use sterile technique when reconstituting.',
    safety:
      'Human data are extremely limited. Effects and safety have not been established. Not approved for medical use.',
    disclaimer:
      'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in studies/trials',
      summary:
        'Most published data on BPC‑157 involve animal models using doses around 10 mcg/kg–20 mcg/kg. Human clinical dosing has not been established.',
      context: 'animal study',
      route: '',
      frequency: '',
      duration: '',
      sourceType: 'review article',
      caution:
        'This is historical study information only and is not a recommendation. Do not use this app for medical dosing decisions.'
    },
    relatedPeptides: ['tb500'],
    tags: ['healing', 'angiogenesis'],
    cautionLevel: 'Medium',
    references: [
      {
        id: 'bpc-review',
        title: 'Regeneration or Risk? A Narrative Review of BPC‑157 for Musculoskeletal Healing',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12446177/',
        note:
          'Narrative review describing mechanisms and concerns; notes half‑life <30 min and persistent tissue effectshttps://pmc.ncbi.nlm.nih.gov/articles/PMC12446177/#:~:text=%28TNF,40%2C%2026%20%2C%20%2055.'
      }
    ]
  },
  {
    id: 'tb500',
    name: 'TB‑500 (Thymosin Beta‑4)',
    aliases: ['Thymosin Beta‑4'],
    category: 'healing',
    description:
      'TB‑500 is the synthetic analogue of the naturally occurring thymosin beta‑4 peptide. It has been explored in animal models for its role in wound healing and angiogenesis.',
    researchFocus: [
      'Wound and injury repair',
      'Angiogenesis and tissue regeneration'
    ],
    mechanism:
      'It is thought to promote cell migration, differentiation and angiogenesis through interaction with actin and extracellular matrix proteins.',
    status:
      'Investigational: studied in preclinical models; not approved for therapeutic use.',
    halfLife:
      'Approximately 2 hours in circulation (estimates vary based on formulation); research indicates rapid clearance but sustained downstream effects.',
    storage:
      'Store lyophilised powder at low temperature; reconstituted solution should be kept refrigerated and used promptly.',
    handling:
      'Sensitive to degradation by proteases and light; minimise handling time.',
    safety:
      'Limited human data. Not approved for medical use; banned in many sports organisations.',
    disclaimer:
      'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in studies/trials',
      summary:
        'Preclinical studies often used doses of 2–10 mg per week in animal models. No well‑established human dosing data.',
      context: 'animal study',
      route: '',
      frequency: '',
      duration: '',
      sourceType: 'preclinical study',
      caution:
        'This is historical study information only and is not a recommendation. Do not use this app for medical dosing decisions.'
    },
    relatedPeptides: ['bpc157'],
    tags: ['healing', 'angiogenesis'],
    cautionLevel: 'Medium',
    references: []
  },
  {
    id: 'cjc1295',
    name: 'CJC‑1295',
    aliases: ['DAC:GRF (1‑29)'],
    category: 'gh',
    description:
      'CJC‑1295 is a synthetic analog of growth hormone‑releasing hormone designed to increase GH secretion. It is often combined with drug affinity complexes (DAC) to prolong its half‑life.',
    researchFocus: [
      'Stimulation of growth hormone release',
      'Potential metabolic and anabolic effects'
    ],
    mechanism:
      'Acts as a growth hormone secretagogue by binding to GHRH receptors. The DAC modification allows reversible binding to albumin, prolonging circulation.',
    status:
      'Investigational: evaluated in early phase trials for GH deficiency; not approved for general use.',
    halfLife:
      'With DAC: approximately 6–8 days; without DAC: <30 minutes, according to early pharmacokinetic studies.',
    storage:
      'Lyophilised powder stable when refrigerated. Reconstituted solution should be used within a few weeks.',
    handling:
      'Protect from light and contamination.',
    safety:
      'Potential side effects include flushing, injection site reactions and water retention. Not approved for medical use.',
    disclaimer:
      'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in studies/trials',
      summary:
        'Early human trials of CJC‑1295 with DAC administered 30–60 mcg/kg subcutaneously once or twice weekly; without DAC, 10–50 mcg/kg IV produced transient GH pulses.',
      context: 'human clinical trial',
      route: 'subcutaneous / intravenous',
      frequency: '',
      duration: '',
      sourceType: 'clinical trial',
      caution:
        'This is historical study information only and is not a recommendation. Do not use this app for medical dosing decisions.'
    },
    relatedPeptides: ['sermorelin'],
    tags: ['GH secretagogue'],
    cautionLevel: 'Medium',
    references: []
  },
  // Added new peptide: Ipamorelin
  {
    id: 'ipamorelin',
    name: 'Ipamorelin',
    aliases: [],
    category: 'gh',
    description:
      'Ipamorelin is a synthetic pentapeptide growth hormone secretagogue that stimulates GH release via ghrelin receptor agonism.',
    researchFocus: ['Growth hormone stimulation', 'Metabolic regulation'],
    mechanism:
      'Binds to the growth hormone secretagogue receptor (GHS‑R1a), prompting pulsatile release of GH with minimal effect on ACTH or cortisol.',
    status:
      'Investigational: studied in phase I pharmacokinetic studies; not approved for human use.',
    halfLife:
      'Short (~2 hours) terminal half‑life after IV infusion reported in human PK/PD studieshttps://link.springer.com/article/10.1023/A:1018955126402#:~:text=minutes,and%20growth%20hormone%20were%20measured.',
    storage:
      'Store lyophilised powder at 2–8 °C; reconstituted solution should be refrigerated and used within days.',
    handling:
      'Protect from light; use sterile technique during reconstitution.',
    safety:
      'Limited clinical data; adverse effects may include headache and flushing. Not approved for medical use.',
    disclaimer:
      'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in studies/trials',
      summary:
        'In a phase I study, ipamorelin was administered intravenously at infusion rates of 4.21–140 nmol/kg over 15 min, resulting in transient GH pulses and a terminal half‑life of ~2 hhttps://link.springer.com/article/10.1023/A:1018955126402#:~:text=minutes,and%20growth%20hormone%20were%20measured.',
      context: 'human clinical trial',
      route: 'intravenous infusion',
      frequency: 'single infusion',
      duration: '15 minutes',
      sourceType: 'clinical trial',
      caution:
        'This is historical study information only and is not a recommendation. Do not use this app for medical dosing decisions.'
    },
    relatedPeptides: ['cjc1295', 'sermorelin'],
    tags: ['GH secretagogue'],
    cautionLevel: 'Medium',
    references: []
  },
  // Added new peptide: Sermorelin
  {
    id: 'sermorelin',
    name: 'Sermorelin',
    aliases: ['GHRH (1‑29)'],
    category: 'gh',
    description:
      'Sermorelin is a synthetic analog of growth hormone–releasing hormone (GHRH) consisting of the first 29 amino acids of endogenous GHRH.',
    researchFocus: ['GH deficiency therapy', 'Anti‑aging research'],
    mechanism:
      'Stimulates pituitary GH release by binding to GHRH receptors, increasing GH and subsequently IGF‑1 levels.',
    status:
      'Approved historically for diagnostic use and GH deficiency therapy but withdrawn; considered investigational.',
    halfLife:
      'Short (~10–20 minutes) due to rapid proteolysis; longer with modified forms.',
    storage:
      'Refrigerate lyophilised vials; use reconstituted solution within days.',
    handling:
      'Use sterile technique; avoid repetitive freeze‑thaw cycles.',
    safety:
      'Side effects may include flushing, headache and nausea. Not approved for new clinical use.',
    disclaimer:
      'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in studies/trials',
      summary:
        'FDA‑approved labeling for growth hormone deficiency historically used 0.5–1 mg/day subcutaneously in children; some adult research used 100–200 mcg IV boluses for diagnostic testing. This is historical label and study information only and is not a recommendation.',
      context: 'FDA label / clinical trial',
      route: 'subcutaneous / intravenous',
      frequency: 'daily or diagnostic single dose',
      duration: '',
      sourceType: 'FDA label / clinical trial',
      caution:
        'This is historical study/label information only and is not a recommendation. Do not use this app for medical dosing decisions.'
    },
    relatedPeptides: ['cjc1295', 'ipamorelin'],
    tags: ['GH secretagogue'],
    cautionLevel: 'Medium',
    references: []
  },
  // Added new peptide: Tesamorelin
  {
    id: 'tesamorelin',
    name: 'Tesamorelin',
    aliases: ['Egrifta'],
    category: 'gh',
    description:
      'Tesamorelin is a stabilized GHRH analog approved for treatment of HIV‑associated lipodystrophy, designed to increase growth hormone secretion and reduce visceral adiposity.',
    researchFocus: ['HIV‑associated lipodystrophy', 'Visceral fat reduction'],
    mechanism:
      'Binds to GHRH receptors with enhanced stability, stimulating endogenous GH release and lipolysis.',
    status:
      'FDA‑approved for treatment of HIV‑associated lipodystrophy. Investigational for other metabolic indications.',
    halfLife:
      'Approximately 60–90 minutes after subcutaneous injection; extended activity due to stabilized structure.',
    storage:
      'Keep lyophilised vials refrigerated; use reconstituted solution promptly.',
    handling:
      'Reconstituted solution should be inspected for particulates and discoloration before use.',
    safety:
      'Common adverse effects include injection site reactions and peripheral edema. Only indicated for HIV lipodystrophy under medical supervision.',
    disclaimer:
      'For educational research tracking only. Not approved for unsupervised human use.',
    trialDoseSummary: {
      label: 'Doses used in studies/trials',
      summary:
        'The FDA‑approved label for tesamorelin recommends 2 mg subcutaneous injection once daily for HIV‑associated lipodystrophy. Clinical studies evaluating metabolic benefits have used similar dosing. This is historical label information only and is not a recommendation.',
      context: 'FDA label',
      route: 'subcutaneous',
      frequency: 'once daily',
      duration: '',
      sourceType: 'FDA label',
      caution:
        'This is historical label information only and is not a recommendation. Do not use this app for medical dosing decisions.'
    },
    relatedPeptides: ['sermorelin'],
    tags: ['GH secretagogue', 'metabolic'],
    cautionLevel: 'Medium',
    references: []
  },
  // Added new peptide: Epitalon
  {
    id: 'epitalon',
    name: 'Epitalon',
    aliases: ['Epithalon', 'Ala‑Glu‑Asp‑Gly'],
    category: 'longevity',
    description:
      'Epitalon is a synthetic tetrapeptide purported to regulate telomerase activity and influence aging processes. Claims are largely based on animal and Russian research.',
    researchFocus: ['Telomerase activation', 'Longevity research'],
    mechanism:
      'Proposed to increase telomerase activity and antioxidant defenses, but mechanisms remain speculative.',
    status:
      'Experimental: not approved for any medical use; evidence is limited.',
    halfLife:
      'Not well established; available data suggest rapid clearance.',
    storage:
      'Lyophilised vials should be refrigerated; reconstituted solution used quickly.',
    handling:
      'Use sterile technique; protect from light.',
    safety:
      'Human safety data are scarce; potential risks unknown.',
    disclaimer:
      'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in studies/trials',
      summary:
        'Limited human studies reported 10 mg injection courses over 10–20 days and oral dosing of 1–2 mg daily. Evidence remains anecdotal and is not validated. This is historical study information only and is not a recommendation.',
      context: 'investigational / anecdotal',
      route: 'intramuscular / oral',
      frequency: '',
      duration: '',
      sourceType: 'small study / anecdotal',
      caution:
        'This is historical study information only and is not a recommendation. Do not use this app for medical dosing decisions.'
    },
    relatedPeptides: [],
    tags: ['longevity'],
    cautionLevel: 'High',
    references: []
  }
  
];

// Definition of top navigation tabs
const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'peptides', label: 'Peptides', icon: '🧬' },
  { id: 'calculator', label: 'Calculator', icon: '📐' },
  { id: 'log', label: 'Research Log', icon: '📒' },
  { id: 'inventory', label: 'Inventory', icon: '📦' },
  { id: 'settings', label: 'Settings', icon: '⚙️' }
];

// Utility to determine if a target element should prevent swipe (e.g., inputs)
const isInteractiveTarget = el => {
  if (!el) return false;
  return !!el.closest(
    'input, textarea, select, button, [contenteditable="true"], [data-no-swipe="true"], .no-swipe'
  );
};

// Top navigation bar component. Displays horizontally scrollable tabs and the
// number of favorite peptides as a badge.
function TopNav({ tab, setTab, favourites }) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(22, 22, 22, 0.95)',
        borderBottom: '1px solid #333',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        paddingTop: 'env(safe-area-inset-top)'
      }}
    >
      <div
        style={{
          maxWidth: 430,
          margin: '0 auto',
          padding: '10px 12px'
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none'
          }}
        >
          {TABS.map(t => {
            const active = t.id === tab;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  flex: '0 0 auto',
                  minHeight: 42,
                  padding: '8px 12px',
                  borderRadius: 999,
                  border: active ? '2px solid #3fa9f5' : '1px solid #444',
                  background: active ? '#3fa9f5' : '#1a1a1a',
                  color: active ? '#fff' : '#ccc',
                  fontSize: 13,
                  fontWeight: active ? 700 : 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  position: 'relative'
                }}
              >
                <span style={{ fontSize: 15 }}>{t.icon}</span>
                <span>{t.label}</span>
                {/* Show badge only on Peptides tab for favourites */}
                {t.id === 'peptides' && favourites.length > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: '#d90429',
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #161616'
                    }}
                  >
                    {favourites.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Dashboard screen: summarises favourite peptides, recent logs and inventory alerts
function DashboardScreen({ favourites, peptides, logs, inventory, setTab, setSelectedPeptide }) {
  const favouritePeptides = peptides.filter(p => favourites.includes(p.id));
  const recentLogs = logs.slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const lowInventory = inventory.filter(item => {
    // Show items with less than 10% remaining or expiring within 14 days
    const now = new Date();
    const expDate = item.expirationDate ? new Date(item.expirationDate) : null;
    const isExpiring = expDate && (expDate - now) / (1000 * 60 * 60 * 24) <= 14;
    return (item.remainingMg !== undefined && item.remainingMg <= item.vialAmountMg * 0.1) || isExpiring;
  });

  // Counts for dashboard stat cards
  const totalPeptides = peptides.length;
  const totalFavourites = favourites.length;
  const totalLogs = logs.length;
  const totalInventory = inventory.length;

  return (
    <div style={{ padding: '16px 16px 24px' }}>
      {/* Premium header */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 22 }}>Peptide Research Tracker</h2>
        <p style={{ margin: '4px 0 0', fontSize: 12, color: '#888' }}>
          Your personal peptide reference and research hub
        </p>
      </div>
      {/* Stat cards */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 24
        }}
      >
        <div
          className="card"
          style={{ flex: '1 1 45%', minWidth: 140, textAlign: 'center' }}
        >
          <div style={{ fontSize: 28, fontWeight: 700 }}>{totalPeptides}</div>
          <div style={{ fontSize: 12, color: '#888' }}>Peptides</div>
        </div>
        <div
          className="card"
          style={{ flex: '1 1 45%', minWidth: 140, textAlign: 'center' }}
        >
          <div style={{ fontSize: 28, fontWeight: 700 }}>{totalFavourites}</div>
          <div style={{ fontSize: 12, color: '#888' }}>Favourites</div>
        </div>
        <div
          className="card"
          style={{ flex: '1 1 45%', minWidth: 140, textAlign: 'center' }}
        >
          <div style={{ fontSize: 28, fontWeight: 700 }}>{totalLogs}</div>
          <div style={{ fontSize: 12, color: '#888' }}>Log Entries</div>
        </div>
        <div
          className="card"
          style={{ flex: '1 1 45%', minWidth: 140, textAlign: 'center' }}
        >
          <div style={{ fontSize: 28, fontWeight: 700 }}>{totalInventory}</div>
          <div style={{ fontSize: 12, color: '#888' }}>Inventory Items</div>
        </div>
      </div>
      {/* Quick actions */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 24
        }}
      >
        <button
          onClick={() => setTab('calculator')}
          className="card"
          style={{
            flex: '1 1 45%',
            minWidth: 140,
            padding: '12px',
            background: '#3fa9f5',
            border: 'none',
            borderRadius: 12,
            color: '#161616',
            fontWeight: 600
          }}
        >
          Open Calculator
        </button>
        <button
          onClick={() => setTab('log')}
          className="card"
          style={{
            flex: '1 1 45%',
            minWidth: 140,
            padding: '12px',
            background: '#3fa9f5',
            border: 'none',
            borderRadius: 12,
            color: '#161616',
            fontWeight: 600
          }}
        >
          Add Log
        </button>
        <button
          onClick={() => setTab('inventory')}
          className="card"
          style={{
            flex: '1 1 45%',
            minWidth: 140,
            padding: '12px',
            background: '#3fa9f5',
            border: 'none',
            borderRadius: 12,
            color: '#161616',
            fontWeight: 600
          }}
        >
          Add Inventory
        </button>
        <button
          onClick={() => setTab('peptides')}
          className="card"
          style={{
            flex: '1 1 45%',
            minWidth: 140,
            padding: '12px',
            background: '#3fa9f5',
            border: 'none',
            borderRadius: 12,
            color: '#161616',
            fontWeight: 600
          }}
        >
          Browse Peptides
        </button>
      </div>
      {/* Favourite peptides section */}
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, margin: '12px 0' }}>Favourite Peptides</h3>
        {favouritePeptides.length === 0 && <p style={{ color: '#888' }}>No favourites yet.</p>}
        {favouritePeptides.map(peptide => (
          <div
            key={peptide.id}
            className="card"
            style={{ cursor: 'pointer', marginBottom: 8 }}
            onClick={() => {
              setSelectedPeptide(peptide);
              setTab('peptides');
            }}
          >
            <strong>{peptide.name}</strong>
            <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>{CATEGORIES[peptide.category]}</div>
          </div>
        ))}
      </section>
      {/* Recent logs section */}
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, margin: '12px 0' }}>Recent Research Logs</h3>
        {recentLogs.length === 0 && <p style={{ color: '#888' }}>No recent entries.</p>}
        {recentLogs.map(log => (
          <div key={log.id} className="card" style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{log.peptideName}</div>
            <div style={{ fontSize: 12, color: '#aaa' }}>{log.date}</div>
            {log.amount && (
              <div style={{ fontSize: 12, color: '#ccc', marginTop: 4 }}>Research amount: {log.amount}</div>
            )}
            {log.notes && (
              <div style={{ fontSize: 12, color: '#ccc', marginTop: 4 }}>
                {log.notes.length > 60 ? log.notes.slice(0, 57) + '…' : log.notes}
              </div>
            )}
          </div>
        ))}
      </section>
      {/* Inventory alerts */}
      <section>
        <h3 style={{ fontSize: 16, margin: '12px 0' }}>Inventory Alerts</h3>
        {lowInventory.length === 0 && <p style={{ color: '#888' }}>No alerts.</p>}
        {lowInventory.map(item => (
          <div key={item.id} className="card" style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
            {item.remainingMg !== undefined && (
              <div style={{ fontSize: 12, color: '#ccc', marginTop: 4 }}>Remaining: {item.remainingMg} mg</div>
            )}
            {item.expirationDate && (
              <div style={{ fontSize: 12, color: '#ccc', marginTop: 4 }}>Expires: {item.expirationDate}</div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

// Peptides screen: search and filter peptides, show list and details
function PeptidesScreen({ peptides, favourites, setFavourites, selectedPeptide, setSelectedPeptide, setTab }) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showDetails, setShowDetails] = useState(false);

  const filteredPeptides = peptides.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.aliases.some(a => a.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavourite = peptideId => {
    setFavourites(prev => {
      if (prev.includes(peptideId)) {
        return prev.filter(id => id !== peptideId);
      }
      return [...prev, peptideId];
    });
  };

  return (
    <div className="scroll-container" style={{ padding: '16px 16px 24px' }}>
      <h2 style={{ margin: '0 0 12px', fontSize: 20 }}>Peptides</h2>
      {/* Search and filter controls */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="search"
          placeholder="Search peptides…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="all">All</option>
          {Object.keys(CATEGORIES).map(key => (
            <option key={key} value={key}>
              {CATEGORIES[key]}
            </option>
          ))}
        </select>
      </div>

      {/* Category chips for quick filtering */}
      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: 6,
          paddingBottom: 8,
          marginBottom: 16
        }}
      >
        <button
          onClick={() => setFilterCategory('all')}
          style={{
            flex: '0 0 auto',
            padding: '6px 12px',
            borderRadius: 999,
            border: '1px solid #444',
            background: filterCategory === 'all' ? '#3fa9f5' : '#1a1a1a',
            color: filterCategory === 'all' ? '#fff' : '#ccc',
            fontSize: 12,
            fontWeight: 600
          }}
        >
          All
        </button>
        {Object.keys(CATEGORIES).map(key => (
          <button
            key={key}
            onClick={() => setFilterCategory(key)}
            style={{
              flex: '0 0 auto',
              padding: '6px 12px',
              borderRadius: 999,
              border: '1px solid #444',
              background: filterCategory === key ? '#3fa9f5' : '#1a1a1a',
              color: filterCategory === key ? '#fff' : '#ccc',
              fontSize: 12,
              fontWeight: 600
            }}
          >
            {CATEGORIES[key]}
          </button>
        ))}
      </div>

      {/* List of peptides */}
      {filteredPeptides.length === 0 && <p style={{ color: '#888' }}>No peptides found.</p>}
      {filteredPeptides.map(peptide => (
        <div
          key={peptide.id}
          className="card"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setSelectedPeptide(peptide);
            setShowDetails(true);
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{peptide.name}</strong>
              <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>{CATEGORIES[peptide.category]}</div>
            </div>
            <button
              onClick={e => {
                e.stopPropagation();
                toggleFavourite(peptide.id);
              }}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: 20,
                color: favourites.includes(peptide.id) ? '#f5c518' : '#555'
              }}
              title={favourites.includes(peptide.id) ? 'Remove from favourites' : 'Add to favourites'}
            >
              {favourites.includes(peptide.id) ? '★' : '☆'}
            </button>
          </div>
          <div style={{ fontSize: 12, color: '#ccc', marginTop: 6 }}>
            {peptide.description.length > 80
              ? peptide.description.slice(0, 77) + '…'
              : peptide.description}
          </div>
          {/* Tags and caution level */}
          <div
            style={{
              marginTop: 6,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
              alignItems: 'center'
            }}
          >
            {/* Caution indicator */}
            {peptide.cautionLevel && (
              <span
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background:
                    peptide.cautionLevel === 'High'
                      ? '#d90429'
                      : peptide.cautionLevel === 'Medium'
                      ? '#f5c518'
                      : '#4caf50'
                }}
                title={`Caution level: ${peptide.cautionLevel}`}
              />
            )}
            {peptide.tags &&
              peptide.tags.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: 10,
                    color: '#aaa',
                    background: '#222',
                    padding: '2px 6px',
                    borderRadius: 4
                  }}
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>
      ))}

      {/* Detail modal */}
      {showDetails && selectedPeptide && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: 480,
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setShowDetails(false)}
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: 'transparent',
                border: 'none',
                color: '#aaa',
                fontSize: 24,
                lineHeight: 1
              }}
              aria-label="Close details"
            >
              ×
            </button>
            {/* Name with caution indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ marginTop: 0 }}>{selectedPeptide.name}</h3>
              {selectedPeptide.cautionLevel && (
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background:
                      selectedPeptide.cautionLevel === 'High'
                        ? '#d90429'
                        : selectedPeptide.cautionLevel === 'Medium'
                        ? '#f5c518'
                        : '#4caf50'
                  }}
                  title={`Caution level: ${selectedPeptide.cautionLevel}`}
                ></span>
              )}
            </div>
            {/* Tags */}
            {selectedPeptide.tags && selectedPeptide.tags.length > 0 && (
              <div style={{ marginTop: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {selectedPeptide.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: 10,
                      color: '#aaa',
                      background: '#222',
                      padding: '2px 6px',
                      borderRadius: 4
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {selectedPeptide.aliases.length > 0 && (
              <p style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                Also known as: {selectedPeptide.aliases.join(', ')}
              </p>
            )}
            <p style={{ fontSize: 14, color: '#ccc' }}>{selectedPeptide.description}</p>
            <h4 style={{ margin: '12px 0 4px', fontSize: 14 }}>Common research focus</h4>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {selectedPeptide.researchFocus.map((item, i) => (
                <li key={i} style={{ fontSize: 13, color: '#ccc' }}>
                  {item}
                </li>
              ))}
            </ul>
            <h4 style={{ margin: '12px 0 4px', fontSize: 14 }}>Mechanism / Pathway</h4>
            <p style={{ fontSize: 13, color: '#ccc' }}>{selectedPeptide.mechanism}</p>
            <h4 style={{ margin: '12px 0 4px', fontSize: 14 }}>Research status</h4>
            <p style={{ fontSize: 13, color: '#ccc' }}>{selectedPeptide.status}</p>
            {selectedPeptide.halfLife && (
              <>
                <h4 style={{ margin: '12px 0 4px', fontSize: 14 }}>Half‑life</h4>
                <p style={{ fontSize: 13, color: '#ccc' }}>{selectedPeptide.halfLife}</p>
              </>
            )}
            {selectedPeptide.storage && (
              <>
                <h4 style={{ margin: '12px 0 4px', fontSize: 14 }}>Storage notes</h4>
                <p style={{ fontSize: 13, color: '#ccc' }}>{selectedPeptide.storage}</p>
              </>
            )}
            {selectedPeptide.handling && (
              <>
                <h4 style={{ margin: '12px 0 4px', fontSize: 14 }}>Handling notes</h4>
                <p style={{ fontSize: 13, color: '#ccc' }}>{selectedPeptide.handling}</p>
              </>
            )}
            {selectedPeptide.safety && (
              <>
                <h4 style={{ margin: '12px 0 4px', fontSize: 14 }}>Safety notes</h4>
                <p style={{ fontSize: 13, color: '#ccc' }}>{selectedPeptide.safety}</p>
              </>
            )}
            {/* Trial dose summary section */}
            {selectedPeptide.trialDoseSummary && (
              <>
                <h4
                  style={{
                    margin: '12px 0 4px',
                    fontSize: 14,
                    color: '#f5c518'
                  }}
                >
                  {selectedPeptide.trialDoseSummary.label || 'Doses Used in Studies / Labels'}
                </h4>
                <p style={{ fontSize: 12, color: '#f5c518' }}>
                  {selectedPeptide.trialDoseSummary.summary}
                </p>
                {selectedPeptide.trialDoseSummary.context && (
                  <p style={{ fontSize: 11, color: '#aaa' }}>
                    Context: {selectedPeptide.trialDoseSummary.context}
                    {selectedPeptide.trialDoseSummary.route &&
                      ` | Route: ${selectedPeptide.trialDoseSummary.route}`}
                    {selectedPeptide.trialDoseSummary.frequency &&
                      ` | Frequency: ${selectedPeptide.trialDoseSummary.frequency}`}
                    {selectedPeptide.trialDoseSummary.duration &&
                      ` | Duration: ${selectedPeptide.trialDoseSummary.duration}`}
                  </p>
                )}
                <p style={{ fontSize: 11, color: '#f5c518' }}>
                  {selectedPeptide.trialDoseSummary.caution}
                </p>
              </>
            )}
            {/* Related peptides section */}
            {selectedPeptide.relatedPeptides && selectedPeptide.relatedPeptides.length > 0 && (
              <>
                <h4 style={{ margin: '12px 0 4px', fontSize: 14 }}>Related peptides</h4>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {selectedPeptide.relatedPeptides.map((relId, idx) => {
                    const rel = peptides.find(p => p.id === relId);
                    const name = rel ? rel.name : relId;
                    return (
                      <li key={idx} style={{ fontSize: 13, color: '#ccc' }}>
                        {name}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
            {/* Disclaimer */}
            <p
              style={{
                fontSize: 12,
                color: '#f5c518',
                marginTop: 12,
                borderTop: '1px solid #333',
                paddingTop: 8
              }}
            >
              {selectedPeptide.disclaimer}
            </p>
            {/* Actions */}
            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={() => toggleFavourite(selectedPeptide.id)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  background: favourites.includes(selectedPeptide.id) ? '#f5c518' : '#3fa9f5',
                  color: '#161616',
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: 600
                }}
              >
                {favourites.includes(selectedPeptide.id) ? 'Remove Favourite' : 'Add to Favourites'}
              </button>
              <button
                onClick={() => {
                  // prefill log form with peptide name
                  setTab('log');
                  setShowDetails(false);
                }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  background: '#3fa9f5',
                  border: 'none',
                  borderRadius: 6,
                  color: '#161616',
                  fontWeight: 600
                }}
              >
                Add Log Entry
              </button>
              <button
                onClick={() => {
                  setTab('inventory');
                  setShowDetails(false);
                }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  background: '#3fa9f5',
                  border: 'none',
                  borderRadius: 6,
                  color: '#161616',
                  fontWeight: 600
                }}
              >
                Add to Inventory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Calculator screen: calculates concentration and volume based on user input
function CalculatorScreen() {
  const [vialAmountMg, setVialAmountMg] = useState('');
  const [waterMl, setWaterMl] = useState('');
  const [desiredAmount, setDesiredAmount] = useState('');
  const [desiredUnit, setDesiredUnit] = useState('mcg');
  const [syringeUnitsPerMl, setSyringeUnitsPerMl] = useState('100');

  const parseNumber = val => {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
  };

  const mgPerMl = parseNumber(vialAmountMg) && parseNumber(waterMl)
    ? parseNumber(vialAmountMg) / parseNumber(waterMl)
    : 0;
  const mcgPerMl = mgPerMl * 1000;
  const desiredMg = parseNumber(desiredAmount) * (desiredUnit === 'mcg' ? 0.001 : 1);
  const volumeNeededMl = mgPerMl > 0 ? desiredMg / mgPerMl : 0;
  const unitsPerMl = parseNumber(syringeUnitsPerMl) || 100;
  const unitsNeeded = volumeNeededMl * unitsPerMl;
  const mcgPerUnit = unitsPerMl > 0 ? mcgPerMl / unitsPerMl : 0;
  const mcgPerSmallVol = mcgPerMl * 0.01;

  return (
    <div className="scroll-container" style={{ padding: '16px 16px 24px' }}>
      <h2 style={{ margin: '0 0 12px', fontSize: 20 }}>Reconstitution Calculator</h2>
      <p style={{ fontSize: 12, color: '#ccc', marginBottom: 16 }}>
        Enter the peptide amount (mg) and diluent volume (mL) to calculate concentration. This calculator
        performs simple conversions only and does not constitute dosing advice.
      </p>
      <div className="card">
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13 }}>Peptide amount in vial (mg)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={vialAmountMg}
            onChange={e => setVialAmountMg(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13 }}>Bacteriostatic water added (mL)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={waterMl}
            onChange={e => setWaterMl(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13 }}>Desired research amount</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="number"
              min="0"
              step="0.01"
              value={desiredAmount}
              onChange={e => setDesiredAmount(e.target.value)}
            />
            <select value={desiredUnit} onChange={e => setDesiredUnit(e.target.value)}>
              <option value="mcg">mcg</option>
              <option value="mg">mg</option>
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 13 }}>Syringe scale (units per mL)</label>
          <input
            type="number"
            min="1"
            step="1"
            value={syringeUnitsPerMl}
            onChange={e => setSyringeUnitsPerMl(e.target.value)}
          />
        </div>
      </div>
      {/* Output section */}
      <div className="card" style={{ marginTop: 16 }}>
        <h4 style={{ margin: 0, fontSize: 16 }}>Results</h4>
        <ul style={{ fontSize: 13, lineHeight: 1.6, listStyle: 'none', padding: 0, marginTop: 8 }}>
          <li>Concentration: {mgPerMl.toFixed(3)} mg/mL ({mcgPerMl.toFixed(1)} mcg/mL)</li>
          <li>mcg per 0.01 mL: {mcgPerSmallVol.toFixed(1)} mcg</li>
          <li>mcg per unit (U‑100): {mcgPerUnit.toFixed(1)} mcg</li>
          <li>Volume needed for desired amount: {volumeNeededMl.toFixed(3)} mL</li>
          <li>Units needed: {unitsNeeded.toFixed(1)} units</li>
        </ul>
      </div>
      <p style={{ fontSize: 12, color: '#f5c518', marginTop: 12 }}>
        Disclaimer: This calculator only performs concentration and volume calculations. It does not
        recommend dosing, frequency or medical treatment.
      </p>
    </div>
  );
}

// Log screen: list and add research logs
function LogScreen({ logs, setLogs }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    peptideName: '',
    amount: '',
    notes: ''
  });

  // Save new log
  const saveLog = () => {
    if (!formData.peptideName) {
      alert('Please enter a peptide name.');
      return;
    }
    const newEntry = {
      id: Date.now().toString(),
      date: formData.date || new Date().toISOString().split('T')[0],
      peptideName: formData.peptideName,
      amount: formData.amount,
      notes: formData.notes
    };
    setLogs(prev => [...prev, newEntry]);
    setFormData({ date: '', peptideName: '', amount: '', notes: '' });
    setShowForm(false);
  };

  const deleteLog = id => {
    if (!confirm('Delete this log entry?')) return;
    setLogs(prev => prev.filter(entry => entry.id !== id));
  };

  return (
    <div className="scroll-container" style={{ padding: '16px 16px 24px' }}>
      <h2 style={{ margin: '0 0 12px', fontSize: 20 }}>Research Log</h2>
      <button
        onClick={() => setShowForm(true)}
        style={{ marginBottom: 12, padding: '8px 12px', background: '#3fa9f5', color: '#161616', border: 'none', borderRadius: 6 }}
      >
        Add Log Entry
      </button>
      {showForm && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 13 }}>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 13 }}>Peptide name</label>
            <input
              type="text"
              value={formData.peptideName}
              onChange={e => setFormData({ ...formData, peptideName: e.target.value })}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 13 }}>Research amount (optional)</label>
            <input
              type="text"
              value={formData.amount}
              onChange={e => setFormData({ ...formData, amount: e.target.value })}
              placeholder="e.g. 500 mcg"
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 13 }}>Notes (optional)</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={saveLog}
              style={{ flex: 1, padding: '8px 12px', background: '#3fa9f5', border: 'none', borderRadius: 6, color: '#161616', fontWeight: 600 }}
            >
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{ flex: 1, padding: '8px 12px', background: '#444', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 600 }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {logs.length === 0 && <p style={{ color: '#888' }}>No log entries yet.</p>}
      {logs
        .slice()
        .sort((a, b) => b.date.localeCompare(a.date))
        .map(entry => (
          <div key={entry.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{entry.peptideName}</div>
                <div style={{ fontSize: 12, color: '#aaa' }}>{entry.date}</div>
                {entry.amount && (
                  <div style={{ fontSize: 12, color: '#ccc' }}>Amount: {entry.amount}</div>
                )}
                {entry.notes && (
                  <div style={{ fontSize: 12, color: '#ccc', marginTop: 4 }}>
                    {entry.notes.length > 80 ? entry.notes.slice(0, 77) + '…' : entry.notes}
                  </div>
                )}
              </div>
              <button
                onClick={() => deleteLog(entry.id)}
                style={{ background: 'transparent', border: 'none', color: '#d90429', fontSize: 18 }}
                title="Delete entry"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

// Inventory screen: list and add inventory items
function InventoryScreen({ inventory, setInventory }) {
  const [showForm, setShowForm] = useState(false);
  const [itemData, setItemData] = useState({
    name: '',
    vialAmountMg: '',
    bacWaterMl: '',
    dateReceived: '',
    reconstituted: false,
    dateReconstituted: '',
    expirationDate: '',
    remainingMg: '',
    storageLocation: '',
    notes: ''
  });

  const saveItem = () => {
    if (!itemData.name) {
      alert('Please enter a peptide name.');
      return;
    }
    const newItem = {
      id: Date.now().toString(),
      ...itemData
    };
    setInventory(prev => [...prev, newItem]);
    setItemData({
      name: '',
      vialAmountMg: '',
      bacWaterMl: '',
      dateReceived: '',
      reconstituted: false,
      dateReconstituted: '',
      expirationDate: '',
      remainingMg: '',
      storageLocation: '',
      notes: ''
    });
    setShowForm(false);
  };

  const deleteItem = id => {
    if (!confirm('Delete this inventory item?')) return;
    setInventory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="scroll-container" style={{ padding: '16px 16px 24px' }}>
      <h2 style={{ margin: '0 0 12px', fontSize: 20 }}>Inventory</h2>
      <button
        onClick={() => setShowForm(true)}
        style={{ marginBottom: 12, padding: '8px 12px', background: '#3fa9f5', color: '#161616', border: 'none', borderRadius: 6 }}
      >
        Add Inventory Item
      </button>
      {showForm && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 13 }}>Peptide name</label>
            <input
              type="text"
              value={itemData.name}
              onChange={e => setItemData({ ...itemData, name: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13 }}>Vial amount (mg)</label>
              <input
                type="number"
                value={itemData.vialAmountMg}
                onChange={e => setItemData({ ...itemData, vialAmountMg: e.target.value })}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13 }}>Diluent added (mL)</label>
              <input
                type="number"
                value={itemData.bacWaterMl}
                onChange={e => setItemData({ ...itemData, bacWaterMl: e.target.value })}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13 }}>Date received</label>
              <input
                type="date"
                value={itemData.dateReceived}
                onChange={e => setItemData({ ...itemData, dateReceived: e.target.value })}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 13 }}>Expiration date</label>
              <input
                type="date"
                value={itemData.expirationDate}
                onChange={e => setItemData({ ...itemData, expirationDate: e.target.value })}
              />
            </div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 13 }}>Remaining amount (mg)</label>
            <input
              type="number"
              value={itemData.remainingMg}
              onChange={e => setItemData({ ...itemData, remainingMg: e.target.value })}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 13 }}>Storage location (optional)</label>
            <input
              type="text"
              value={itemData.storageLocation}
              onChange={e => setItemData({ ...itemData, storageLocation: e.target.value })}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 13 }}>Notes (optional)</label>
            <textarea
              value={itemData.notes}
              onChange={e => setItemData({ ...itemData, notes: e.target.value })}
              rows={3}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={saveItem}
              style={{ flex: 1, padding: '8px 12px', background: '#3fa9f5', border: 'none', borderRadius: 6, color: '#161616', fontWeight: 600 }}
            >
              Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{ flex: 1, padding: '8px 12px', background: '#444', border: 'none', borderRadius: 6, color: '#fff', fontWeight: 600 }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {inventory.length === 0 && <p style={{ color: '#888' }}>No inventory items yet.</p>}
      {inventory.map(item => (
        <div key={item.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</div>
              {item.vialAmountMg && (
                <div style={{ fontSize: 12, color: '#ccc' }}>
                  Vial: {item.vialAmountMg} mg
                </div>
              )}
              {item.bacWaterMl && (
                <div style={{ fontSize: 12, color: '#ccc' }}>
                  Diluent: {item.bacWaterMl} mL
                </div>
              )}
              {item.remainingMg && (
                <div style={{ fontSize: 12, color: '#ccc' }}>
                  Remaining: {item.remainingMg} mg
                </div>
              )}
              {item.expirationDate && (
                <div style={{ fontSize: 12, color: '#ccc' }}>
                  Expires: {item.expirationDate}
                </div>
              )}
            </div>
            <button
              onClick={() => deleteItem(item.id)}
              style={{ background: 'transparent', border: 'none', color: '#d90429', fontSize: 18 }}
              title="Delete item"
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Settings screen: export/import data and show disclaimer
function SettingsScreen({ logs, inventory, favourites, setLogs, setInventory, setFavourites }) {
  const [exportData, setExportData] = useState('');
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState(null);

  const handleExport = () => {
    const data = JSON.stringify({ logs, inventory, favourites });
    setExportData(data);
  };
  const handleImport = () => {
    try {
      const data = JSON.parse(importText);
      if (data.logs) setLogs(data.logs);
      if (data.inventory) setInventory(data.inventory);
      if (data.favourites) setFavourites(data.favourites);
      setImportError(null);
      alert('Data imported successfully!');
    } catch (err) {
      console.error(err);
      setImportError('Invalid JSON. Please check your input.');
    }
  };

  return (
    <div className="scroll-container" style={{ padding: '16px 16px 24px' }}>
      <h2 style={{ margin: '0 0 12px', fontSize: 20 }}>Settings</h2>
      <section style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, margin: '12px 0' }}>Backup & Restore</h3>
        <button
          onClick={handleExport}
          style={{ padding: '8px 12px', background: '#3fa9f5', border: 'none', borderRadius: 6, color: '#161616', fontWeight: 600 }}
        >
          Export Data
        </button>
        {exportData && (
          <>
            <p style={{ fontSize: 12, color: '#aaa', marginTop: 8 }}>Copy the text below to backup your data:</p>
            <textarea value={exportData} readOnly rows={4} style={{ width: '100%', marginTop: 4 }} />
          </>
        )}
        <div style={{ marginTop: 16 }}>
          <label style={{ fontSize: 13 }}>Import Data (paste backup JSON)</label>
          <textarea
            value={importText}
            onChange={e => setImportText(e.target.value)}
            rows={4}
            style={{ width: '100%' }}
          />
          {importError && <p style={{ color: '#d90429', fontSize: 12 }}>{importError}</p>}
          <button
            onClick={handleImport}
            style={{ marginTop: 8, padding: '8px 12px', background: '#3fa9f5', border: 'none', borderRadius: 6, color: '#161616', fontWeight: 600 }}
          >
            Import Data
          </button>
        </div>
      </section>
      <section>
        <h3 style={{ fontSize: 16, margin: '12px 0' }}>Disclaimer</h3>
        <p style={{ fontSize: 12, color: '#f5c518' }}>
          This application is for educational research tracking only. It does not provide medical advice, diagnosis,
          treatment or dosing recommendations. Consult a licensed medical professional for health decisions.
        </p>
      </section>
    </div>
  );
}

export default function App() {
  // Global state management
  const [tab, setTab] = useState('dashboard');
  const [peptides] = useState(PEPTIDES_DATA);
  const [favourites, setFavourites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('peptideFavourites')) || [];
    } catch {
      return [];
    }
  });
  const [logs, setLogs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('peptideLogs')) || [];
    } catch {
      return [];
    }
  });
  const [inventory, setInventory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('peptideInventory')) || [];
    } catch {
      return [];
    }
  });
  const [selectedPeptide, setSelectedPeptide] = useState(null);

  // Persist state to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem('peptideFavourites', JSON.stringify(favourites));
    } catch {
      /* ignore */
    }
  }, [favourites]);
  useEffect(() => {
    try {
      localStorage.setItem('peptideLogs', JSON.stringify(logs));
    } catch {
      /* ignore */
    }
  }, [logs]);
  useEffect(() => {
    try {
      localStorage.setItem('peptideInventory', JSON.stringify(inventory));
    } catch {
      /* ignore */
    }
  }, [inventory]);

  // Swipe handling for tab navigation
  const touchStartRef = useRef({ x: 0, y: 0, active: false });

  const goToTab = useCallback(
    direction => {
      const index = TABS.findIndex(t => t.id === tab);
      if (index === -1) return;
      let nextIndex = index;
      if (direction === 'left') nextIndex = Math.min(index + 1, TABS.length - 1);
      else if (direction === 'right') nextIndex = Math.max(index - 1, 0);
      if (nextIndex !== index) {
        setTab(TABS[nextIndex].id);
      }
    },
    [tab]
  );

  const handleTouchStart = useCallback(e => {
    if (e.touches.length !== 1) return;
    if (isInteractiveTarget(e.target)) return;
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, active: true };
  }, []);

  const handleTouchEnd = useCallback(
    e => {
      if (!touchStartRef.current.active) return;
      if (isInteractiveTarget(e.target)) return;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      touchStartRef.current.active = false;
      const minSwipe = 50;
      const maxVertical = 45;
      if (Math.abs(dx) < minSwipe || Math.abs(dy) > maxVertical) return;
      if (dx < 0) goToTab('left');
      else goToTab('right');
    },
    [goToTab]
  );

  // Determine which screen to render
  const renderScreen = () => {
    switch (tab) {
      case 'dashboard':
        return (
          <DashboardScreen
            favourites={favourites}
            peptides={peptides}
            logs={logs}
            inventory={inventory}
            setTab={setTab}
            setSelectedPeptide={setSelectedPeptide}
          />
        );
      case 'peptides':
        return (
          <PeptidesScreen
            peptides={peptides}
            favourites={favourites}
            setFavourites={setFavourites}
            selectedPeptide={selectedPeptide}
            setSelectedPeptide={setSelectedPeptide}
            setTab={setTab}
          />
        );
      case 'calculator':
        return <CalculatorScreen />;
      case 'log':
        return <LogScreen logs={logs} setLogs={setLogs} />;
      case 'inventory':
        return <InventoryScreen inventory={inventory} setInventory={setInventory} />;
      case 'settings':
        return (
          <SettingsScreen
            logs={logs}
            inventory={inventory}
            favourites={favourites}
            setLogs={setLogs}
            setInventory={setInventory}
            setFavourites={setFavourites}
          />
        );
      default:
        return <DashboardScreen favourites={favourites} peptides={peptides} logs={logs} inventory={inventory} setTab={setTab} setSelectedPeptide={setSelectedPeptide} />;
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#0d0d0d',
        color: '#f5f5f5',
        maxWidth: 430,
        margin: '0 auto',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Top navigation */}
      <TopNav tab={tab} setTab={setTab} favourites={favourites} />

      {/* Main content area with swipe detection */}
      <div
        className="scroll-container"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ flex: 1, overflowY: 'auto' }}
      >
        {renderScreen()}
      </div>
    </div>
  );

