import React, { useState, useEffect, useRef, useCallback } from 'react';

// ─── CATEGORIES ───────────────────────────────────────────
const CATEGORIES = {
  healing:       'Healing / Tissue Repair',
  gh:            'Growth Hormone Secretagogue',
  cognitive:     'Cognitive / Neuro',
  metabolic:     'Metabolic',
  skin:          'Skin / Cosmetic',
  immune:        'Immune',
  sexual:        'Sexual Health',
  longevity:     'Longevity',
  mitochondrial: 'Mitochondrial',
  hormonal:      'Hormonal / Reproductive',
  experimental:  'Experimental / High-risk',
  other:         'Other',
};

// ─── PEPTIDES DATA (50 entries) ───────────────────────────
const PEPTIDES_DATA = [

  // ── HEALING ──────────────────────────────────────────────

  {
    id: 'bpc157',
    name: 'BPC-157',
    aliases: ['Body Protective Compound-157', 'PL 14736'],
    category: 'healing',
    description: 'A synthetic pentadecapeptide derived from a protective protein found in human gastric juice, studied extensively in animal models for its tissue-repair and anti-inflammatory properties.',
    researchFocus: ['Tendon and ligament repair', 'Muscle regeneration', 'Gut mucosal protection', 'Anti-inflammatory effects'],
    mechanism: 'Proposed to promote angiogenesis via VEGF pathways, modulate nitric oxide synthesis, and polarise macrophages toward a reparative phenotype.',
    status: 'Investigational; studied primarily in animal models. Not approved for human use. Prohibited in many sports organisations.',
    halfLife: 'Short (<30 min) in circulation; tissue-level effects may persist beyond systemic clearance.',
    storage: 'Lyophilised: stable refrigerated. Reconstituted: refrigerate and use within 2–4 weeks.',
    handling: 'Use sterile technique; avoid repeated freeze-thaw cycles.',
    safety: 'Extremely limited human data. Not approved for medical use.',
    disclaimer: 'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in animal studies',
      summary: 'Animal models typically used 10–20 mcg/kg. Human clinical dosing has not been established in validated trials.',
      context: 'animal study',
      route: 'subcutaneous / oral',
      frequency: 'daily',
      duration: 'varies',
      sourceType: 'preclinical study',
      caution: 'Historical study data only. Not a dosing recommendation. Do not use this app for medical dosing decisions.',
    },
    relatedPeptides: ['tb500', 'kpv'],
    tags: ['healing', 'angiogenesis', 'gut'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'tb500',
    name: 'TB-500',
    aliases: ['Thymosin Beta-4', 'Tβ4'],
    category: 'healing',
    description: 'The synthetic analogue of thymosin beta-4, a naturally occurring protein involved in cell migration, differentiation, and tissue repair, studied in animal wound-healing models.',
    researchFocus: ['Wound and injury repair', 'Angiogenesis', 'Muscle fibre regeneration'],
    mechanism: 'Sequesters actin monomers, promotes cell migration, and modulates extracellular matrix proteins to facilitate tissue remodelling.',
    status: 'Investigational; preclinical evidence only. Banned by WADA and most sports organisations.',
    halfLife: 'Approximately 2 hours in circulation; downstream tissue effects may persist longer.',
    storage: 'Lyophilised: refrigerate. Reconstituted: use within days to a few weeks refrigerated.',
    handling: 'Sensitive to protease degradation and light exposure; minimise handling time.',
    safety: 'Limited human data. Not approved for medical use.',
    disclaimer: 'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in animal studies',
      summary: 'Preclinical studies commonly administered 2–10 mg per week in animal models. Human dosing data are lacking.',
      context: 'animal study',
      route: 'subcutaneous / intramuscular',
      frequency: 'weekly',
      duration: 'varies',
      sourceType: 'preclinical study',
      caution: 'Historical study data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['bpc157'],
    tags: ['healing', 'angiogenesis', 'actin'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'mgf',
    name: 'MGF',
    aliases: ['Mechano Growth Factor', 'IGF-1Ec'],
    category: 'healing',
    description: 'A splice variant of IGF-1 generated locally in muscle tissue in response to mechanical load or damage, thought to activate muscle satellite cells to initiate repair.',
    researchFocus: ['Muscle satellite cell activation', 'Post-exercise muscle repair', 'Localised tissue regeneration'],
    mechanism: 'The unique E-domain of MGF promotes satellite cell proliferation and differentiates it from systemic IGF-1 signalling pathways.',
    status: 'Investigational; evidence is largely preclinical. Not approved for human use.',
    halfLife: 'Very short in native form (minutes); degraded rapidly by serum proteases.',
    storage: 'Lyophilised: refrigerate. Reconstituted: use promptly; highly susceptible to degradation.',
    handling: 'Keep cold; use immediately after reconstitution when possible.',
    safety: 'Limited human data. Potential for off-target anabolic effects. Not approved for medical use.',
    disclaimer: 'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in animal studies',
      summary: 'Animal studies used variable doses localised to injury sites. Human clinical dosing not established.',
      context: 'animal study',
      route: 'intramuscular (localised)',
      frequency: 'single or repeated',
      duration: 'varies',
      sourceType: 'preclinical study',
      caution: 'Historical study data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['pegmgf', 'igf1lr3'],
    tags: ['healing', 'muscle', 'satellite cells'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'pegmgf',
    name: 'PEG-MGF',
    aliases: ['Pegylated Mechano Growth Factor', 'PEGylated IGF-1Ec'],
    category: 'healing',
    description: 'A pegylated form of Mechano Growth Factor designed to extend its half-life by reducing protease degradation, allowing more sustained activity than native MGF.',
    researchFocus: ['Extended-action muscle repair', 'Satellite cell proliferation', 'Recovery from acute injury'],
    mechanism: 'PEGylation shields the peptide from enzymatic cleavage; the E-domain retains its activity at satellite cell receptors over a longer period.',
    status: 'Investigational; primarily animal data. Not approved for human use.',
    halfLife: 'Several days, depending on degree of PEGylation (compared to minutes for native MGF).',
    storage: 'Refrigerate lyophilised powder; reconstituted solution should be used within days.',
    handling: 'Protect from light; avoid repeated freeze-thaw cycles.',
    safety: 'Limited human data. PEG accumulation is a theoretical concern with prolonged use. Not approved for medical use.',
    disclaimer: 'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in animal studies',
      summary: 'Animal studies used doses of 200–400 mcg per injection site. Human clinical dosing not established.',
      context: 'animal study',
      route: 'intramuscular',
      frequency: 'weekly or bi-weekly',
      duration: 'varies',
      sourceType: 'preclinical study',
      caution: 'Historical study data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['mgf', 'igf1lr3'],
    tags: ['healing', 'muscle', 'pegylated'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'kpv',
    name: 'KPV',
    aliases: ['Lys-Pro-Val', 'Alpha-MSH C-terminal tripeptide'],
    category: 'healing',
    description: 'A tripeptide derived from the C-terminal end of alpha-melanocyte-stimulating hormone (α-MSH), studied for its anti-inflammatory and gut-protective properties.',
    researchFocus: ['Intestinal inflammation reduction', 'Skin wound healing', 'Systemic anti-inflammatory effects'],
    mechanism: 'Exerts anti-inflammatory activity independently of the full-length α-MSH, potentially through NF-κB inhibition and direct cellular interactions without requiring melanocortin receptors.',
    status: 'Investigational; primarily animal and in vitro evidence. Not approved for human use.',
    halfLife: 'Short; exact data limited. Oral and topical routes studied.',
    storage: 'Lyophilised: refrigerate. Reconstituted: refrigerate and use promptly.',
    handling: 'Use sterile technique for injectable preparations; topical formulations are more stable.',
    safety: 'Considered relatively benign based on animal data; human safety not established.',
    disclaimer: 'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in animal studies',
      summary: 'Animal studies used oral doses of approximately 100 mcg/kg for gut inflammation models. Human dosing not established.',
      context: 'animal study',
      route: 'oral / subcutaneous / topical',
      frequency: 'daily',
      duration: 'varies',
      sourceType: 'preclinical study',
      caution: 'Historical study data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['bpc157'],
    tags: ['healing', 'anti-inflammatory', 'gut'],
    cautionLevel: 'Low',
    references: [],
  },

  // ── GROWTH HORMONE SECRETAGOGUES ─────────────────────────

  {
    id: 'cjc1295',
    name: 'CJC-1295',
    aliases: ['DAC:GRF', 'Modified GRF (1-29)'],
    category: 'gh',
    description: 'A synthetic GHRH analog modified with a drug affinity complex (DAC) that allows reversible binding to albumin, dramatically extending its half-life compared to native GHRH.',
    researchFocus: ['Sustained GH release', 'GH deficiency research', 'IGF-1 elevation'],
    mechanism: 'Binds GHRH receptors on somatotrophs; the DAC modification confers albumin binding that protects the peptide from enzymatic degradation, prolonging activity.',
    status: 'Investigational; phase II trials conducted. Not approved for general use.',
    halfLife: '6–8 days with DAC; without DAC approximately 30 minutes.',
    storage: 'Lyophilised: refrigerate. Reconstituted: refrigerate, use within a few weeks.',
    handling: 'Protect from light; use sterile technique.',
    safety: 'Side effects include flushing, water retention and injection site reactions. Not approved for medical use.',
    disclaimer: 'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in clinical trials',
      summary: 'Early phase trials administered 30–60 mcg/kg subcutaneously once or twice weekly (with DAC). Without DAC, 10–50 mcg/kg IV produced transient GH pulses.',
      context: 'human clinical trial',
      route: 'subcutaneous / intravenous',
      frequency: 'once or twice weekly',
      duration: 'weeks',
      sourceType: 'clinical trial',
      caution: 'Historical clinical trial data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['ipamorelin', 'sermorelin', 'ghrp2'],
    tags: ['GH secretagogue', 'GHRH analog', 'DAC'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'ipamorelin',
    name: 'Ipamorelin',
    aliases: [],
    category: 'gh',
    description: 'A selective pentapeptide growth hormone secretagogue that stimulates GH release via ghrelin receptor agonism with minimal effect on cortisol or prolactin.',
    researchFocus: ['Pulsatile GH release', 'Metabolic regulation', 'GH deficiency research'],
    mechanism: 'Binds the GHS-R1a (ghrelin receptor), prompting GH release from somatotrophs with high selectivity and a clean side-effect profile compared to earlier GHRPs.',
    status: 'Investigational; phase I pharmacokinetic studies completed. Not approved for human use.',
    halfLife: 'Approximately 2 hours after IV infusion.',
    storage: 'Store lyophilised at 2–8 °C. Reconstituted: refrigerate, use within days.',
    handling: 'Protect from light; use sterile technique.',
    safety: 'Headache and flushing reported. Limited long-term human safety data. Not approved for medical use.',
    disclaimer: 'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in clinical trials',
      summary: 'Phase I trials used IV infusion at 4.21–140 nmol/kg over 15 minutes, producing transient GH pulses. Subcutaneous equivalents studied at lower doses.',
      context: 'human clinical trial',
      route: 'intravenous / subcutaneous',
      frequency: 'single infusion or multiple daily',
      duration: '15 min to weeks',
      sourceType: 'clinical trial',
      caution: 'Historical clinical trial data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['cjc1295', 'sermorelin', 'ghrp6'],
    tags: ['GH secretagogue', 'selective', 'ghrelin receptor'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'sermorelin',
    name: 'Sermorelin',
    aliases: ['GHRH (1-29)', 'GRF 1-29'],
    category: 'gh',
    description: 'A synthetic analog of growth hormone-releasing hormone consisting of the biologically active first 29 amino acids of endogenous GHRH.',
    researchFocus: ['GH deficiency evaluation', 'Pituitary GH reserve testing', 'Anti-aging research'],
    mechanism: 'Stimulates pituitary somatotrophs via GHRH receptor binding, increasing GH secretion and downstream IGF-1 production.',
    status: 'Previously FDA-approved for GH deficiency and diagnostic testing; withdrawn from market. Currently investigational.',
    halfLife: 'Approximately 10–20 minutes due to rapid proteolysis.',
    storage: 'Refrigerate lyophilised vials; use reconstituted solution within days.',
    handling: 'Use sterile technique; avoid repetitive freeze-thaw cycles.',
    safety: 'Side effects include flushing, headache and nausea. Previously approved; extensive safety profile known.',
    disclaimer: 'For educational research tracking only. Not currently approved for clinical use.',
    trialDoseSummary: {
      label: 'Doses used in FDA-approved labeling and clinical studies',
      summary: 'Approved dosing for GH deficiency in children was 0.5–1 mg/day SC. Adult diagnostic testing used 100–200 mcg IV boluses. Historical label information only.',
      context: 'FDA label / clinical trial',
      route: 'subcutaneous / intravenous',
      frequency: 'daily or single diagnostic dose',
      duration: 'chronic or single administration',
      sourceType: 'FDA label / clinical trial',
      caution: 'Historical label information only. Not a dosing recommendation.',
    },
    relatedPeptides: ['cjc1295', 'ipamorelin', 'tesamorelin'],
    tags: ['GH secretagogue', 'GHRH analog'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'tesamorelin',
    name: 'Tesamorelin',
    aliases: ['Egrifta', 'TH9507'],
    category: 'gh',
    description: 'A stabilised GHRH analog with a trans-3-hexenoic acid modification; FDA-approved for HIV-associated lipodystrophy to reduce excess visceral adipose tissue.',
    researchFocus: ['HIV-associated lipodystrophy', 'Visceral fat reduction', 'GH/IGF-1 axis modulation'],
    mechanism: 'Binds GHRH receptors with greater stability than native GHRH, stimulating endogenous pulsatile GH release and subsequent lipolysis in visceral fat depots.',
    status: 'FDA-approved for HIV lipodystrophy (Egrifta). Investigational for other metabolic indications.',
    halfLife: 'Approximately 30–40 minutes; enhanced stability over sermorelin.',
    storage: 'Refrigerate lyophilised vials; use reconstituted solution promptly.',
    handling: 'Inspect for particulates before use; use sterile technique.',
    safety: 'Injection site reactions, peripheral edema, arthralgia. Use only under medical supervision for approved indication.',
    disclaimer: 'For educational research tracking only. Use only as prescribed by a licensed physician.',
    trialDoseSummary: {
      label: 'FDA-approved dose',
      summary: 'FDA-approved labeling recommends 2 mg SC once daily for HIV-associated lipodystrophy. This is approved label information and applies only to the indicated condition.',
      context: 'FDA-approved label',
      route: 'subcutaneous',
      frequency: 'once daily',
      duration: 'ongoing, reassess periodically',
      sourceType: 'FDA label',
      caution: 'FDA-approved label information only. This applies solely to the indicated condition under medical supervision.',
    },
    relatedPeptides: ['sermorelin', 'cjc1295'],
    tags: ['GH secretagogue', 'FDA-approved', 'lipodystrophy'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'ghrp2',
    name: 'GHRP-2',
    aliases: ['Growth Hormone Releasing Peptide-2', 'Pralmorelin'],
    category: 'gh',
    description: 'A synthetic hexapeptide that acts on the ghrelin/GHS-R1a receptor to stimulate potent GH release; one of the most well-studied GH secretagogues.',
    researchFocus: ['Robust GH pulse generation', 'GH deficiency research', 'Appetite and metabolic effects'],
    mechanism: 'Agonises GHS-R1a receptors, amplifying hypothalamic GHRH release and directly stimulating pituitary GH secretion synergistically.',
    status: 'Investigational; well-studied in clinical pharmacology. Not approved for therapeutic use.',
    halfLife: 'Approximately 15–60 minutes.',
    storage: 'Lyophilised: refrigerate. Reconstituted: refrigerate and use within days.',
    handling: 'Use sterile technique; protect from light.',
    safety: 'May elevate cortisol and prolactin. Flushing and increased appetite reported. Not approved for medical use.',
    disclaimer: 'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in clinical studies',
      summary: 'Human pharmacokinetic studies administered 1–2 mcg/kg IV or SC, producing strong GH pulses. Higher doses used in some protocols.',
      context: 'human clinical study',
      route: 'intravenous / subcutaneous',
      frequency: 'single or multiple daily',
      duration: 'varies',
      sourceType: 'clinical pharmacology study',
      caution: 'Historical study data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['ghrp6', 'ipamorelin', 'hexarelin'],
    tags: ['GH secretagogue', 'ghrelin receptor', 'GHRP'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'ghrp6',
    name: 'GHRP-6',
    aliases: ['Growth Hormone Releasing Peptide-6', 'His-DTrp-Ala-Trp-DPhe-Lys-NH2'],
    category: 'gh',
    description: 'One of the earliest synthetic GH secretagogues developed, notable for producing strong appetite stimulation alongside GH release via ghrelin receptor agonism.',
    researchFocus: ['GH secretion stimulation', 'Appetite and cachexia research', 'GH pulse characterisation'],
    mechanism: 'Binds GHS-R1a in the hypothalamus and pituitary, strongly stimulating GH release and also activating central appetite pathways, making it a ghrelin mimetic.',
    status: 'Investigational; pharmacologically well-characterised but not approved for clinical use.',
    halfLife: 'Approximately 15–60 minutes.',
    storage: 'Lyophilised: refrigerate. Reconstituted: refrigerate and use within a week.',
    handling: 'Use sterile technique; avoid light exposure.',
    safety: 'Strong appetite stimulation and potential cortisol/prolactin elevation. Not approved for medical use.',
    disclaimer: 'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in clinical studies',
      summary: 'Doses of 1–2 mcg/kg SC or IV used in pharmacology studies to characterise GH pulsatility and appetite effects.',
      context: 'human clinical study',
      route: 'subcutaneous / intravenous',
      frequency: 'single or multiple daily',
      duration: 'varies',
      sourceType: 'clinical pharmacology study',
      caution: 'Historical study data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['ghrp2', 'ipamorelin', 'hexarelin'],
    tags: ['GH secretagogue', 'ghrelin receptor', 'appetite'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'hexarelin',
    name: 'Hexarelin',
    aliases: ['Examorelin', 'EP-23905'],
    category: 'gh',
    description: 'A potent synthetic hexapeptide GH secretagogue with the strongest GH-releasing activity among GHRPs, also studied for its cardioprotective properties independent of GH.',
    researchFocus: ['Maximal GH pulse induction', 'Cardiac protection research', 'GH deficiency assessment'],
    mechanism: 'Highly potent GHS-R1a agonist; also interacts with CD36 receptors in cardiac tissue, mediating GH-independent cardioprotective effects.',
    status: 'Investigational; studied in phase I/II trials. Not approved for therapeutic use.',
    halfLife: 'Approximately 30–70 minutes.',
    storage: 'Lyophilised: refrigerate. Reconstituted: refrigerate and use within days.',
    handling: 'Use sterile technique; protect from light and contamination.',
    safety: 'GH-related side effects expected; potential for elevated cortisol. Not approved for medical use.',
    disclaimer: 'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in clinical studies',
      summary: 'Phase I studies used 0.5–2 mcg/kg IV or SC to characterise GH secretion and cardiac effects.',
      context: 'human clinical study',
      route: 'intravenous / subcutaneous',
      frequency: 'single or multiple daily',
      duration: 'varies',
      sourceType: 'clinical study',
      caution: 'Historical study data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['ghrp2', 'ghrp6', 'ipamorelin'],
    tags: ['GH secretagogue', 'cardioprotective', 'GHRP'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'igf1lr3',
    name: 'IGF-1 LR3',
    aliases: ['Long R3 IGF-1', 'Insulin-like Growth Factor-1 Long Arg3'],
    category: 'gh',
    description: 'A synthetic, longer-acting analog of IGF-1 with an arginine substitution at position 3 and an extended N-terminal extension that reduces IGF-binding protein affinity, prolonging its activity.',
    researchFocus: ['Anabolic and tissue-growth research', 'Satellite cell activation', 'Metabolic signalling'],
    mechanism: 'Binds IGF-1 receptors with high affinity but with much lower binding to IGF-binding proteins (IGFBPs), resulting in substantially longer serum activity than native IGF-1.',
    status: 'Investigational; used in research settings. Not approved for human therapeutic use.',
    halfLife: '20–30 hours (due to reduced IGFBP binding), versus ~15 minutes for native IGF-1.',
    storage: 'Lyophilised: refrigerate. Reconstituted: refrigerate and use within days; avoid multiple freeze-thaw cycles.',
    handling: 'Very sensitive to degradation; reconstitute with bacteriostatic water and keep cold.',
    safety: 'Risk of hypoglycaemia, acromegaly-like effects, and tumour promotion with excessive or prolonged use. Not approved for medical use.',
    disclaimer: 'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in research studies',
      summary: 'Research models have used highly variable doses. No validated human clinical dosing exists.',
      context: 'animal and in vitro study',
      route: 'subcutaneous / intramuscular',
      frequency: 'varies',
      duration: 'varies',
      sourceType: 'preclinical study',
      caution: 'Historical research data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['mgf', 'pegmgf'],
    tags: ['IGF-1', 'anabolic', 'growth factor'],
    cautionLevel: 'High',
    references: [],
  },

  {
    id: 'macimorelin',
    name: 'Macimorelin',
    aliases: ['Macrilen', 'AEZS-130'],
    category: 'gh',
    description: 'An oral ghrelin receptor agonist and GH secretagogue approved by the FDA as a diagnostic agent for adult GH deficiency testing.',
    researchFocus: ['GH deficiency diagnosis', 'Oral GH stimulation testing', 'Pituitary function assessment'],
    mechanism: 'Orally bioavailable GHS-R1a agonist that stimulates pituitary GH release, enabling a standardised GH stimulation test without IV administration.',
    status: 'FDA-approved as a diagnostic agent (Macrilen) for adult GH deficiency. Not approved as a GH therapy.',
    halfLife: 'Approximately 4 hours.',
    storage: 'Store oral formulation at room temperature per manufacturer instructions.',
    handling: 'Administered as an oral solution under controlled diagnostic conditions.',
    safety: 'Generally well tolerated; may cause dizziness, nausea and altered taste. Use only as directed by physician for diagnostic purposes.',
    disclaimer: 'For educational research tracking only. Use only under physician supervision for approved diagnostic purposes.',
    trialDoseSummary: {
      label: 'FDA-approved diagnostic dose',
      summary: 'Approved dose is 0.5 mg/kg oral solution (max 40 mg), consumed as a single dose for GH stimulation testing. This is approved label information for the diagnostic indication only.',
      context: 'FDA-approved diagnostic use',
      route: 'oral',
      frequency: 'single diagnostic dose',
      duration: 'single administration',
      sourceType: 'FDA label',
      caution: 'Approved diagnostic label data only. Use only under physician direction.',
    },
    relatedPeptides: ['ipamorelin', 'ghrp2'],
    tags: ['GH secretagogue', 'FDA-approved', 'oral', 'diagnostic'],
    cautionLevel: 'Low',
    references: [],
  },

  // ── METABOLIC ─────────────────────────────────────────────

  {
    id: 'aod9604',
    name: 'AOD-9604',
    aliases: ['Anti-Obesity Drug 9604', 'hGH Frag 177-191'],
    category: 'metabolic',
    description: 'A modified fragment of the C-terminus of human growth hormone, originally developed to stimulate fat burning without the anabolic or insulin-desensitising effects of full HGH.',
    researchFocus: ['Lipolysis stimulation', 'Adipose tissue reduction', 'Metabolic research'],
    mechanism: 'Mimics the lipolytic region of hGH by activating beta-adrenergic receptors and stimulating fat breakdown without binding IGF-1 receptors.',
    status: 'Investigated in phase IIb/III clinical trials for obesity; regulatory approval was not obtained. Currently sold as a research chemical.',
    halfLife: 'Approximately 30 minutes.',
    storage: 'Lyophilised: refrigerate. Reconstituted: refrigerate and use within days.',
    handling: 'Use sterile technique.',
    safety: 'Reported to have a good safety profile in trials; however, therapeutic use is not approved.',
    disclaimer: 'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in clinical trials',
      summary: 'Phase II trials tested oral and intranasal doses of 1–10 mg daily for weight management. Human injectable dosing not established through approved trials.',
      context: 'human clinical trial',
      route: 'oral / intranasal / subcutaneous',
      frequency: 'daily',
      duration: 'weeks to months',
      sourceType: 'clinical trial',
      caution: 'Historical trial data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['frag176191'],
    tags: ['lipolysis', 'fat metabolism', 'HGH fragment'],
    cautionLevel: 'Low',
    references: [],
  },

  {
    id: 'frag176191',
    name: 'HGH Fragment 176-191',
    aliases: ['HGH Frag 176-191', 'Growth Hormone Peptide Fragment'],
    category: 'metabolic',
    description: 'A small peptide fragment derived from the C-terminal end of human growth hormone (amino acids 176–191), studied for its ability to stimulate fat metabolism selectively.',
    researchFocus: ['Fat metabolism', 'Lipolysis without anabolic effects', 'Obesity research'],
    mechanism: 'Binds to beta-adrenergic receptors and activates lipase enzymes to stimulate lipolysis in adipose tissue, without the growth-promoting or insulin-sensitising effects of full HGH.',
    status: 'Investigational; preclinical evidence is strong but human clinical data are limited. Not approved for human use.',
    halfLife: 'Approximately 30 minutes.',
    storage: 'Lyophilised: refrigerate. Reconstituted: refrigerate and use within days.',
    handling: 'Use sterile technique; protect from light.',
    safety: 'Relatively benign in animal studies; insufficient human safety data. Not approved for medical use.',
    disclaimer: 'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in animal studies',
      summary: 'Animal studies used 500 mcg/kg subcutaneously. Human clinical dosing not established in approved trials.',
      context: 'animal study',
      route: 'subcutaneous',
      frequency: 'daily',
      duration: 'varies',
      sourceType: 'preclinical study',
      caution: 'Historical study data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['aod9604'],
    tags: ['lipolysis', 'HGH fragment', 'fat burning'],
    cautionLevel: 'Low',
    references: [],
  },

  {
    id: 'semaglutide',
    name: 'Semaglutide',
    aliases: ['Ozempic', 'Wegovy', 'Rybelsus'],
    category: 'metabolic',
    description: 'An FDA-approved GLP-1 receptor agonist available by prescription for type 2 diabetes management (Ozempic/Rybelsus) and chronic weight management (Wegovy).',
    researchFocus: ['Type 2 diabetes glycaemic control', 'Chronic weight management', 'Cardiovascular risk reduction'],
    mechanism: 'Mimics endogenous GLP-1 to stimulate insulin secretion, suppress glucagon, slow gastric emptying, and reduce appetite centrally, resulting in significant weight loss and glucose control.',
    status: 'FDA-approved for T2D (Ozempic 2017; Rybelsus 2019) and obesity (Wegovy 2021). Prescription medication.',
    halfLife: 'Approximately 7 days, allowing once-weekly subcutaneous dosing.',
    storage: 'Refrigerate unopened pens; in-use pens may be stored at room temperature per label. Do not freeze.',
    handling: 'Administer SC per physician instruction; rotate injection sites.',
    safety: 'Common side effects: nausea, vomiting, diarrhoea, constipation. Risk of pancreatitis and thyroid C-cell tumours in animal studies. Prescription only.',
    disclaimer: 'For educational research tracking only. Prescription medication — use only under physician supervision.',
    trialDoseSummary: {
      label: 'FDA-approved dosing',
      summary: 'For T2D: 0.25 mg SC weekly escalating to 0.5–2 mg weekly. For obesity: 2.4 mg SC weekly after dose escalation. Label information only.',
      context: 'FDA-approved dosing',
      route: 'subcutaneous / oral (Rybelsus)',
      frequency: 'once weekly (SC) or once daily (oral)',
      duration: 'ongoing',
      sourceType: 'FDA label',
      caution: 'FDA-approved label information. Prescription medication; use only under physician supervision.',
    },
    relatedPeptides: ['tirzepatide', 'liraglutide', 'retatrutide'],
    tags: ['GLP-1', 'FDA-approved', 'diabetes', 'weight loss'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'tirzepatide',
    name: 'Tirzepatide',
    aliases: ['Mounjaro', 'Zepbound'],
    category: 'metabolic',
    description: 'An FDA-approved dual GIP and GLP-1 receptor agonist that produces substantial weight loss and glycaemic improvements, available by prescription as Mounjaro (T2D) and Zepbound (obesity).',
    researchFocus: ['Type 2 diabetes management', 'Obesity treatment', 'Cardiovascular risk reduction'],
    mechanism: 'Acts simultaneously on both GIP and GLP-1 receptors, producing synergistic reductions in appetite, gastric emptying and blood glucose, with greater efficacy than GLP-1 agonists alone.',
    status: 'FDA-approved for T2D (Mounjaro 2022) and obesity (Zepbound 2023). Prescription medication.',
    halfLife: 'Approximately 5 days, allowing once-weekly dosing.',
    storage: 'Refrigerate; in-use pens may be kept at room temperature per label. Do not freeze.',
    handling: 'Administer SC per physician instruction.',
    safety: 'GI side effects common; same class concerns as semaglutide. Prescription only; not for use without physician oversight.',
    disclaimer: 'For educational research tracking only. Prescription medication — use only under physician supervision.',
    trialDoseSummary: {
      label: 'FDA-approved dosing',
      summary: 'Starting dose 2.5 mg SC weekly, escalating to maintenance of 5–15 mg once weekly. Label information only.',
      context: 'FDA-approved dosing',
      route: 'subcutaneous',
      frequency: 'once weekly',
      duration: 'ongoing',
      sourceType: 'FDA label',
      caution: 'FDA-approved label information. Prescription medication; use only under physician supervision.',
    },
    relatedPeptides: ['semaglutide', 'liraglutide', 'retatrutide'],
    tags: ['GLP-1', 'GIP', 'FDA-approved', 'diabetes', 'weight loss'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'liraglutide',
    name: 'Liraglutide',
    aliases: ['Victoza', 'Saxenda'],
    category: 'metabolic',
    description: 'An FDA-approved GLP-1 receptor agonist available for type 2 diabetes (Victoza) and chronic weight management (Saxenda), given as a once-daily subcutaneous injection.',
    researchFocus: ['Type 2 diabetes glycaemic control', 'Obesity management', 'Cardiovascular outcomes'],
    mechanism: 'GLP-1 receptor agonism stimulates insulin release, suppresses glucagon, slows gastric emptying and reduces appetite with a fatty acid modification providing extended half-life.',
    status: 'FDA-approved for T2D (Victoza 2010) and obesity (Saxenda 2014). Prescription medication.',
    halfLife: 'Approximately 13 hours, enabling once-daily dosing.',
    storage: 'Refrigerate; in-use pens stored at room temperature per label for 30 days. Do not freeze.',
    handling: 'Rotate injection sites; inspect pen before use.',
    safety: 'Nausea, vomiting, risk of pancreatitis and thyroid C-cell tumours in animal models. Prescription only.',
    disclaimer: 'For educational research tracking only. Prescription medication — use only under physician supervision.',
    trialDoseSummary: {
      label: 'FDA-approved dosing',
      summary: 'For T2D (Victoza): 0.6 mg SC daily, titrating to 1.2–1.8 mg daily. For obesity (Saxenda): escalate to 3 mg SC daily. Label information only.',
      context: 'FDA-approved dosing',
      route: 'subcutaneous',
      frequency: 'once daily',
      duration: 'ongoing',
      sourceType: 'FDA label',
      caution: 'FDA-approved label information. Prescription medication; use only under physician supervision.',
    },
    relatedPeptides: ['semaglutide', 'tirzepatide'],
    tags: ['GLP-1', 'FDA-approved', 'diabetes', 'weight loss'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'retatrutide',
    name: 'Retatrutide',
    aliases: ['LY3437943'],
    category: 'metabolic',
    description: 'An investigational triple agonist targeting GLP-1, GIP and glucagon receptors simultaneously, showing remarkable weight-loss results in phase II trials.',
    researchFocus: ['Advanced obesity treatment', 'Metabolic syndrome research', 'Weight loss mechanisms'],
    mechanism: 'Triple receptor co-agonism combines appetite suppression (GLP-1, GIP), increased energy expenditure (glucagon), and improved insulin sensitivity for synergistic metabolic effects.',
    status: 'Phase III clinical trials underway as of 2024. Not yet FDA-approved.',
    halfLife: 'Approximately 6 days, supporting once-weekly dosing.',
    storage: 'Store per clinical trial protocols; refrigerated.',
    handling: 'SC administration per clinical protocol.',
    safety: 'Phase II data show GI side effects similar to GLP-1 agonists. Long-term safety not established. Not approved for use outside clinical trials.',
    disclaimer: 'For educational research tracking only. Not approved for human use outside of clinical trials.',
    trialDoseSummary: {
      label: 'Doses used in phase II trials',
      summary: 'Phase II trials escalated doses from 1 mg to up to 12 mg SC once weekly over several months, achieving up to 24% mean body weight reduction.',
      context: 'human phase II clinical trial',
      route: 'subcutaneous',
      frequency: 'once weekly',
      duration: '24–48 weeks',
      sourceType: 'clinical trial',
      caution: 'Phase II trial data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['semaglutide', 'tirzepatide', 'liraglutide'],
    tags: ['GLP-1', 'GIP', 'glucagon', 'triple agonist', 'investigational'],
    cautionLevel: 'High',
    references: [],
  },

  {
    id: 'cagrilintide',
    name: 'Cagrilintide',
    aliases: ['AM833'],
    category: 'metabolic',
    description: 'A long-acting amylin analog in clinical development, primarily investigated in combination with semaglutide (as CagriSema) for enhanced weight loss in obesity.',
    researchFocus: ['Amylin receptor-mediated satiety', 'Combination metabolic therapy', 'Obesity treatment'],
    mechanism: 'Amylin receptor agonism reduces food intake and slows gastric emptying; combined with GLP-1 agonism, it produces complementary and additive weight reduction.',
    status: 'Phase III clinical trials ongoing as of 2024. Not FDA-approved.',
    halfLife: 'Approximately 7 days, enabling once-weekly dosing.',
    storage: 'Refrigerate per clinical protocol.',
    handling: 'SC administration per clinical protocol.',
    safety: 'GI side effects anticipated; long-term safety profile not established. Not approved for use outside clinical trials.',
    disclaimer: 'For educational research tracking only. Not approved for human use outside of clinical trials.',
    trialDoseSummary: {
      label: 'Doses used in phase II trials',
      summary: 'Phase II studies tested doses up to 2.4 mg SC weekly alone and in combination with semaglutide 2.4 mg (CagriSema).',
      context: 'human phase II clinical trial',
      route: 'subcutaneous',
      frequency: 'once weekly',
      duration: '20–32 weeks',
      sourceType: 'clinical trial',
      caution: 'Phase II trial data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['semaglutide', 'tirzepatide'],
    tags: ['amylin', 'weight loss', 'combination therapy', 'investigational'],
    cautionLevel: 'High',
    references: [],
  },

  // ── COGNITIVE / NEURO ─────────────────────────────────────

  {
    id: 'selank',
    name: 'Selank',
    aliases: ['TP-7'],
    category: 'cognitive',
    description: 'A synthetic heptapeptide anxiolytic derived from the endogenous peptide tuftsin, developed in Russia and studied for anxiety relief, cognitive enhancement and neuroprotection.',
    researchFocus: ['Anxiety reduction', 'Cognitive performance', 'Memory and learning', 'Neuroprotection'],
    mechanism: 'Modulates GABAergic transmission, increases BDNF expression, and inhibits enkephalin-degrading enzymes, contributing to anxiolytic and nootropic effects.',
    status: 'Approved for clinical use in Russia for anxiety disorders. Investigational elsewhere.',
    halfLife: 'Approximately 1–3 minutes in plasma; intranasal administration extends activity to hours.',
    storage: 'Store refrigerated. Intranasal solutions stable for weeks refrigerated.',
    handling: 'Typically administered intranasally; use sterile technique for injectable forms.',
    safety: 'Reported to be well tolerated with low toxicity; extensive human use in Russia. Not approved in most Western countries.',
    disclaimer: 'For educational research tracking only. Not approved for human use in many jurisdictions.',
    trialDoseSummary: {
      label: 'Doses used in Russian clinical studies',
      summary: 'Russian studies used intranasal doses of 400–900 mcg daily (2–3 drops per nostril of 0.15% solution). Historical study information only.',
      context: 'human clinical study (Russia)',
      route: 'intranasal',
      frequency: 'daily',
      duration: '10–14 days',
      sourceType: 'clinical study',
      caution: 'Historical clinical study data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['semax'],
    tags: ['anxiolytic', 'nootropic', 'GABA', 'Russian research'],
    cautionLevel: 'Low',
    references: [],
  },

  {
    id: 'semax',
    name: 'Semax',
    aliases: ['ACTH (4-7) Pro-Gly-Pro', 'Heptapeptide Semax'],
    category: 'cognitive',
    description: 'A synthetic analog of an ACTH fragment with an added Pro-Gly-Pro extension for stability, used in Russia for stroke recovery, cognitive enhancement and neuroprotection.',
    researchFocus: ['Cognitive enhancement', 'Stroke and ischaemia recovery', 'Neuroprotection', 'BDNF upregulation'],
    mechanism: 'Upregulates BDNF and its receptor TrkB, modulates dopaminergic and serotonergic systems, and reduces neuroinflammatory responses after brain injury.',
    status: 'Registered and used clinically in Russia. Investigational in other countries.',
    halfLife: 'Very short plasma half-life (minutes); intranasal delivery achieves sustained CNS effects.',
    storage: 'Refrigerate solution; stable for weeks to months if stored correctly.',
    handling: 'Administered intranasally; use clean technique.',
    safety: 'Generally well tolerated in reported use. Not approved outside Russia.',
    disclaimer: 'For educational research tracking only. Not approved for human use in many jurisdictions.',
    trialDoseSummary: {
      label: 'Doses used in Russian clinical studies',
      summary: 'Russian clinical protocols used intranasal doses of 200–900 mcg daily. Some studies used IV or SC administration at similar total daily doses.',
      context: 'human clinical study (Russia)',
      route: 'intranasal / subcutaneous / intravenous',
      frequency: 'daily',
      duration: '5–14 days per course',
      sourceType: 'clinical study',
      caution: 'Historical clinical study data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['selank'],
    tags: ['nootropic', 'ACTH analog', 'BDNF', 'stroke recovery'],
    cautionLevel: 'Low',
    references: [],
  },

  {
    id: 'dihexa',
    name: 'Dihexa',
    aliases: ['PNB-0408', 'N-hexanoic-Tyr-Ile-(6) aminohexanoic amide'],
    category: 'cognitive',
    description: 'A small peptide derived from angiotensin IV, described as an extraordinarily potent cognitive enhancer in animal studies through hepatocyte growth factor (HGF) pathway modulation.',
    researchFocus: ['Cognitive enhancement', 'Synaptogenesis', 'Alzheimer\'s disease research', 'Memory formation'],
    mechanism: 'Potentiates HGF and its receptor c-Met, driving synaptogenesis, dendritic branching and new synapse formation — processes critical for learning and memory consolidation.',
    status: 'Experimental; animal studies only. No human clinical trials published. Not approved for human use.',
    halfLife: 'Not well established in humans.',
    storage: 'Lyophilised: refrigerate. Reconstituted: use promptly.',
    handling: 'Use sterile technique; limited human exposure data.',
    safety: 'Human safety data do not exist. Theoretical concerns include pro-tumourigenic effects via HGF/c-Met activation. Extreme caution warranted.',
    disclaimer: 'For educational research tracking only. Not approved for human use. Extremely limited safety data.',
    trialDoseSummary: {
      label: 'Doses used in animal studies',
      summary: 'Animal studies reported cognitive effects at doses estimated around 1 mg/kg. Human dosing has not been studied.',
      context: 'animal study',
      route: 'subcutaneous / oral',
      frequency: 'varies',
      duration: 'varies',
      sourceType: 'preclinical study',
      caution: 'Animal study data only. Not a dosing recommendation. Significant uncertainty about human safety.',
    },
    relatedPeptides: ['semax', 'selank'],
    tags: ['nootropic', 'HGF', 'synaptogenesis', 'experimental'],
    cautionLevel: 'High',
    references: [],
  },

  {
    id: 'dsip',
    name: 'DSIP',
    aliases: ['Delta Sleep Inducing Peptide'],
    category: 'cognitive',
    description: 'A naturally occurring neuropeptide isolated from rabbit brain tissue that was originally shown to induce delta sleep; studied for sleep modulation and stress response.',
    researchFocus: ['Sleep quality modulation', 'Stress hormone regulation', 'Narcolepsy research'],
    mechanism: 'Mechanism remains poorly understood; proposed to modulate hypothalamic-pituitary function, reduce stress hormone secretion, and promote slow-wave sleep.',
    status: 'Investigational; limited and conflicting evidence. Not approved for any medical use.',
    halfLife: 'Approximately 30 minutes in plasma.',
    storage: 'Lyophilised: refrigerate. Reconstituted: refrigerate and use promptly.',
    handling: 'Use sterile technique.',
    safety: 'Limited human data. Not approved for medical use.',
    disclaimer: 'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in early studies',
      summary: 'Early human studies administered 25–50 mcg IV. Replication of sleep effects has been inconsistent.',
      context: 'early human study',
      route: 'intravenous',
      frequency: 'single or repeated',
      duration: 'single night to days',
      sourceType: 'early clinical study',
      caution: 'Historical study data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['selank'],
    tags: ['sleep', 'neuropeptide', 'stress'],
    cautionLevel: 'Low',
    references: [],
  },

  {
    id: 'pinealon',
    name: 'Pinealon',
    aliases: ['Ala-Glu-Asp'],
    category: 'cognitive',
    description: 'A synthetic tripeptide derived from pineal gland extracts, studied in Russian research for neuroprotective and anti-aging effects on the central nervous system.',
    researchFocus: ['Neuroprotection', 'Circadian rhythm support', 'Longevity and brain aging'],
    mechanism: 'Proposed to penetrate the blood-brain barrier and modulate gene expression related to neuronal protection and antioxidant defences, but mechanisms are not fully elucidated.',
    status: 'Investigational; limited evidence from Russian studies. Not approved for medical use.',
    halfLife: 'Not well established.',
    storage: 'Lyophilised: refrigerate. Reconstituted: use promptly.',
    handling: 'Use sterile technique.',
    safety: 'Limited safety data outside Russian research literature. Not approved for medical use.',
    disclaimer: 'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in Russian studies',
      summary: 'Russian protocols reported using 5–10 mg per course, administered intranasally or by injection over 10 days. Historical study data only.',
      context: 'investigational / Russian study',
      route: 'intranasal / injection',
      frequency: 'daily per course',
      duration: '10-day courses',
      sourceType: 'small study / investigational',
      caution: 'Historical study data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['epitalon'],
    tags: ['neuroprotection', 'pineal', 'anti-aging', 'Russian research'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'cerebrolysin',
    name: 'Cerebrolysin',
    aliases: ['FPF 1070'],
    category: 'cognitive',
    description: 'A peptide-based mixture derived from purified pig brain proteins that acts as a neurotrophic agent, clinically used in some countries for stroke recovery, dementia and traumatic brain injury.',
    researchFocus: ['Stroke rehabilitation', 'Alzheimer\'s disease', 'Traumatic brain injury recovery', 'Neuroprotection'],
    mechanism: 'Contains low-molecular-weight neuropeptides that cross the blood-brain barrier and mimic neurotrophic factors (NGF, BDNF), supporting neuronal survival, plasticity and repair.',
    status: 'Approved and used clinically in Europe, Asia and Russia for neurological indications. Not approved by the FDA.',
    halfLife: 'Variable; mixture of multiple peptides with differing clearance rates.',
    storage: 'Vials: refrigerate. Stable at room temperature for limited periods per manufacturer guidance.',
    handling: 'Administer IV or IM per clinical protocol; observe for hypersensitivity reactions.',
    safety: 'Generally well tolerated; hypersensitivity reactions possible. Use under medical supervision in approved jurisdictions.',
    disclaimer: 'For educational research tracking only. Not FDA-approved; use only under physician supervision where approved.',
    trialDoseSummary: {
      label: 'Doses used in clinical trials and approved labeling',
      summary: 'Clinical studies for stroke and dementia used 10–50 mL IV daily for 10–21 days. Label doses vary by indication and country.',
      context: 'clinical trial / approved use in some countries',
      route: 'intravenous / intramuscular',
      frequency: 'daily per course',
      duration: '10–21 day courses',
      sourceType: 'clinical trial / label',
      caution: 'Clinical study and label data for approved jurisdictions only. Not a general dosing recommendation.',
    },
    relatedPeptides: ['semax', 'selank'],
    tags: ['neurotrophic', 'nootropic', 'stroke', 'dementia'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'p21',
    name: 'P21',
    aliases: ['CNTF fragment', 'Peptide 21'],
    category: 'cognitive',
    description: 'A synthetic peptide fragment derived from the CNTF (ciliary neurotrophic factor) binding domain, studied in animal models for its ability to promote neurogenesis and cognitive enhancement.',
    researchFocus: ['Neurogenesis', 'Cognitive enhancement', 'Neurodegenerative disease research'],
    mechanism: 'Activates CNTF receptor signalling to promote neural stem cell proliferation and differentiation, potentially enhancing hippocampal neurogenesis and memory formation.',
    status: 'Experimental; animal data only. No human clinical trials. Not approved for human use.',
    halfLife: 'Not established in humans.',
    storage: 'Lyophilised: refrigerate. Reconstituted: use promptly.',
    handling: 'Use sterile technique; highly experimental compound.',
    safety: 'Human safety completely unknown. Extreme caution warranted.',
    disclaimer: 'For educational research tracking only. Not approved for human use. No human safety data exist.',
    trialDoseSummary: {
      label: 'Doses used in animal studies',
      summary: 'Animal studies used approximately 100 mcg/kg. Human dosing has not been studied.',
      context: 'animal study',
      route: 'subcutaneous',
      frequency: 'daily',
      duration: 'varies',
      sourceType: 'preclinical study',
      caution: 'Animal study data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['dihexa', 'semax'],
    tags: ['neurogenesis', 'CNTF', 'nootropic', 'experimental'],
    cautionLevel: 'High',
    references: [],
  },

  {
    id: 'cortexin',
    name: 'Cortexin',
    aliases: [],
    category: 'cognitive',
    description: 'A polypeptide extract derived from bovine cerebral cortex, registered in Russia for use in neurological conditions including stroke, trauma and cognitive decline.',
    researchFocus: ['Neuroprotection after stroke', 'Cognitive rehabilitation', 'Neurological deficit recovery'],
    mechanism: 'Contains low-molecular-weight neuropeptides and amino acids proposed to modulate neurotransmitter balance, reduce neuroinflammation and support neuronal metabolism.',
    status: 'Registered in Russia, Ukraine and some post-Soviet states. Not approved by FDA or EMA.',
    halfLife: 'Variable; peptide mixture.',
    storage: 'Lyophilised: refrigerate.',
    handling: 'Reconstitute with sterile water; administer IM.',
    safety: 'Generally well tolerated per Russian clinical literature. Not validated by Western regulatory standards.',
    disclaimer: 'For educational research tracking only. Not FDA-approved; available only in select countries.',
    trialDoseSummary: {
      label: 'Doses used in Russian clinical studies',
      summary: 'Russian protocols typically use 10 mg IM daily for 10 days per course. Historical study data only.',
      context: 'Russian clinical use',
      route: 'intramuscular',
      frequency: 'once daily',
      duration: '10 days per course',
      sourceType: 'clinical study / label',
      caution: 'Historical study data only. Not a general dosing recommendation.',
    },
    relatedPeptides: ['cerebrolysin', 'semax'],
    tags: ['neuroprotection', 'nootropic', 'Russian research', 'polypeptide'],
    cautionLevel: 'Medium',
    references: [],
  },

  // ── SKIN / COSMETIC ───────────────────────────────────────

  {
    id: 'ghkcu',
    name: 'GHK-Cu',
    aliases: ['Copper Peptide', 'Glycyl-L-histidyl-L-lysine copper'],
    category: 'skin',
    description: 'A naturally occurring tripeptide-copper complex found in human blood and tissue that declines with age, studied extensively for its wound-healing, collagen-stimulating and skin-remodelling properties.',
    researchFocus: ['Skin collagen and elastin production', 'Wound healing acceleration', 'Anti-aging skin remodelling', 'Hair follicle stimulation'],
    mechanism: 'Activates wound-healing pathways, stimulates collagen and GAG synthesis, modulates TGF-β signalling, and acts as an antioxidant through its copper-chelating activity.',
    status: 'Widely used as a cosmetic ingredient; some formulations sold as research chemicals. Not approved as a drug.',
    halfLife: 'Short systemic half-life; topical application delivers localised sustained activity.',
    storage: 'Store solutions refrigerated; stable for months in appropriate formulation.',
    handling: 'Topical application; injectable forms require sterile technique.',
    safety: 'Well tolerated topically; systemic injectable safety less established.',
    disclaimer: 'For educational research tracking only. Not approved as a drug.',
    trialDoseSummary: {
      label: 'Concentrations used in cosmetic and research formulations',
      summary: 'Topical cosmetic formulations typically contain 0.1–5% GHK-Cu. Injectable research doses not standardised.',
      context: 'cosmetic / research use',
      route: 'topical / injectable',
      frequency: 'daily topical or periodic injectable',
      duration: 'varies',
      sourceType: 'cosmetic literature / research',
      caution: 'Cosmetic and research data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['snap8', 'palmitoyl4'],
    tags: ['collagen', 'skin', 'wound healing', 'anti-aging', 'copper'],
    cautionLevel: 'Low',
    references: [],
  },

  {
    id: 'melanotan2',
    name: 'Melanotan II',
    aliases: ['MT-2', 'Melanotan-2'],
    category: 'skin',
    description: 'A synthetic analog of alpha-melanocyte-stimulating hormone (α-MSH) that produces skin tanning, sexual arousal and appetite suppression; related to the approved peptide bremelanotide (PT-141).',
    researchFocus: ['UV-independent melanogenesis (tanning)', 'Sexual function research', 'Appetite suppression'],
    mechanism: 'Agonises multiple melanocortin receptors (MC1R, MC3R, MC4R, MC5R), driving melanin production, reducing appetite and stimulating sexual arousal pathways.',
    status: 'Not approved for any therapeutic use. Sold illicitly as a research chemical. Significant adverse effects reported.',
    halfLife: 'Approximately 1–2 hours.',
    storage: 'Lyophilised: refrigerate or freeze. Reconstituted: refrigerate and use within days.',
    handling: 'Use sterile technique; be aware of significant physiological responses.',
    safety: 'Significant side effects: nausea, facial flushing, spontaneous erections, darkening of moles/nevi (melanocytic activation is a concern). Potential melanoma risk theoretical. Not approved for human use.',
    disclaimer: 'For educational research tracking only. Not approved for human use. Significant safety concerns.',
    trialDoseSummary: {
      label: 'Doses used in early clinical studies',
      summary: 'Early dose-finding studies used 0.01–0.03 mg/kg SC. High frequency of side effects observed at higher doses.',
      context: 'early phase human study',
      route: 'subcutaneous',
      frequency: 'daily or every few days',
      duration: 'weeks',
      sourceType: 'early clinical study',
      caution: 'Historical study data only. Not a dosing recommendation. Significant safety risks.',
    },
    relatedPeptides: ['pt141'],
    tags: ['tanning', 'melanocortin', 'skin', 'sexual'],
    cautionLevel: 'High',
    references: [],
  },

  {
    id: 'snap8',
    name: 'Snap-8 (Argireline)',
    aliases: ['Acetyl Hexapeptide-8', 'Acetyl Hexapeptide-3', 'Argireline'],
    category: 'skin',
    description: 'A synthetic octapeptide (or hexapeptide in some formulations) that mimics the N-terminal end of SNAP-25, a substrate for botulinum toxin, designed to reduce facial expression lines topically.',
    researchFocus: ['Cosmetic wrinkle reduction', 'Muscle contraction modulation at skin level', 'Anti-aging topical formulations'],
    mechanism: 'Competes with SNAP-25 for the SNARE complex, inhibiting neuromuscular vesicle release at the dermal level, reducing repeated muscle micro-contractions that cause expression lines.',
    status: 'GRAS cosmetic ingredient; widely used in anti-aging skin care. Not a drug.',
    halfLife: 'Topical penetration and local activity; systemic absorption minimal.',
    storage: 'Stable in cosmetic formulations; store per product instructions.',
    handling: 'Topical application; no sterile technique required for cosmetic use.',
    safety: 'Well tolerated topically; considered safe for cosmetic use.',
    disclaimer: 'For educational research tracking only. Cosmetic ingredient, not a drug.',
    trialDoseSummary: {
      label: 'Concentrations used in cosmetic formulations',
      summary: 'Cosmetic studies used topical concentrations of 5–10% in formulations applied twice daily.',
      context: 'cosmetic study',
      route: 'topical',
      frequency: 'twice daily',
      duration: '28–84 days in studies',
      sourceType: 'cosmetic clinical study',
      caution: 'Cosmetic study data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['ghkcu', 'palmitoyl4'],
    tags: ['wrinkle', 'cosmetic', 'SNARE', 'anti-aging'],
    cautionLevel: 'Low',
    references: [],
  },

  {
    id: 'palmitoyl4',
    name: 'Palmitoyl Pentapeptide-4',
    aliases: ['Matrixyl', 'Palmitoyl-Lys-Thr-Thr-Lys-Ser'],
    category: 'skin',
    description: 'A palmitoyl-modified pentapeptide matrikine that stimulates collagen, elastin and hyaluronic acid synthesis in skin fibroblasts, widely used in anti-aging cosmetics.',
    researchFocus: ['Collagen I, III and IV stimulation', 'Elastin production', 'Wrinkle depth reduction'],
    mechanism: 'Acts as a matrikine signalling molecule mimicking collagen breakdown fragments, communicating to fibroblasts to increase extracellular matrix protein synthesis.',
    status: 'GRAS cosmetic ingredient; extensive use in skin care. Not a drug.',
    halfLife: 'Topical localised activity; palmitoyl modification aids skin penetration.',
    storage: 'Stable in cosmetic formulations at room temperature.',
    handling: 'Topical application; no special handling required.',
    safety: 'Excellent safety profile; well tolerated in cosmetic use.',
    disclaimer: 'For educational research tracking only. Cosmetic ingredient, not a drug.',
    trialDoseSummary: {
      label: 'Concentrations used in cosmetic studies',
      summary: 'Studies used topical concentrations of 3–8% applied twice daily for 4–12 weeks, showing measurable wrinkle reduction.',
      context: 'cosmetic clinical study',
      route: 'topical',
      frequency: 'twice daily',
      duration: '4–12 weeks',
      sourceType: 'cosmetic clinical study',
      caution: 'Cosmetic study data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['ghkcu', 'snap8'],
    tags: ['collagen', 'matrikine', 'cosmetic', 'anti-aging'],
    cautionLevel: 'Low',
    references: [],
  },

  // ── SEXUAL HEALTH ─────────────────────────────────────────

  {
    id: 'pt141',
    name: 'PT-141 (Bremelanotide)',
    aliases: ['Bremelanotide', 'Vyleesi'],
    category: 'sexual',
    description: 'A melanocortin receptor agonist originally developed from Melanotan II, FDA-approved as Vyleesi for hypoactive sexual desire disorder (HSDD) in premenopausal women.',
    researchFocus: ['Female sexual desire disorders', 'Male erectile dysfunction research', 'Central sexual arousal pathways'],
    mechanism: 'Agonises MC3R and MC4R in the central nervous system, activating pathways in the hypothalamus and limbic system that mediate sexual arousal independent of vascular effects.',
    status: 'FDA-approved (Vyleesi) for HSDD in premenopausal women. Use for other indications or populations is off-label/investigational.',
    halfLife: 'Approximately 2.7 hours.',
    storage: 'Refrigerate prefilled autoinjectors per label instructions.',
    handling: 'Administer SC 45 minutes before anticipated sexual activity, per prescribing instructions.',
    safety: 'Nausea, flushing, hyperpigmentation reported. Transient blood pressure increase. Prescription only.',
    disclaimer: 'For educational research tracking only. Prescription medication — use only under physician supervision for approved indication.',
    trialDoseSummary: {
      label: 'FDA-approved dose',
      summary: 'Approved dose is 1.75 mg SC via autoinjector 45 minutes before sexual activity, as needed (max one dose per 24 hours).',
      context: 'FDA-approved dosing',
      route: 'subcutaneous autoinjector',
      frequency: 'as needed (max once per 24 h)',
      duration: 'as needed',
      sourceType: 'FDA label',
      caution: 'FDA-approved label information. Prescription only; use under physician supervision.',
    },
    relatedPeptides: ['melanotan2', 'kisspeptin10'],
    tags: ['sexual health', 'melanocortin', 'FDA-approved', 'HSDD'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'kisspeptin10',
    name: 'Kisspeptin-10',
    aliases: ['Kp-10', 'Kisspeptin 112-121'],
    category: 'sexual',
    description: 'A biologically active decapeptide fragment of kisspeptin-54 that activates the KISS1R (GPR54) receptor, a critical regulator of gonadotropin release and reproductive axis function.',
    researchFocus: ['GnRH pulse regulation', 'Infertility and reproductive health research', 'Hypogonadotropic hypogonadism'],
    mechanism: 'Binds KISS1R in hypothalamic GnRH neurons, triggering pulsatile GnRH release and downstream LH and FSH secretion, making it a master regulator of reproductive hormone cascades.',
    status: 'Investigational; used extensively in reproductive endocrinology research. Not approved for therapeutic use.',
    halfLife: 'Approximately 30–40 minutes.',
    storage: 'Lyophilised: refrigerate. Reconstituted: refrigerate and use within days.',
    handling: 'Use sterile technique.',
    safety: 'Well tolerated in clinical studies; limited long-term human data. Not approved for therapeutic use.',
    disclaimer: 'For educational research tracking only. Not approved for therapeutic human use.',
    trialDoseSummary: {
      label: 'Doses used in clinical studies',
      summary: 'IV infusion studies used 1 nmol/kg boluses or continuous infusion at 1–3 nmol/kg/h. SC doses of 1–2 nmol/kg explored for reproductive studies.',
      context: 'human clinical study',
      route: 'intravenous / subcutaneous',
      frequency: 'single or pulsed',
      duration: 'hours to days',
      sourceType: 'clinical study',
      caution: 'Historical study data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['gonadorelin', 'alarelin'],
    tags: ['GnRH', 'reproductive', 'fertility', 'kisspeptin'],
    cautionLevel: 'Medium',
    references: [],
  },

  // ── IMMUNE ────────────────────────────────────────────────

  {
    id: 'thymosin_alpha1',
    name: 'Thymosin Alpha-1',
    aliases: ['TA-1', 'Zadaxin', 'Thymalfasin'],
    category: 'immune',
    description: 'A thymic peptide with broad immune-modulatory properties, approved in several countries as Zadaxin for viral hepatitis and as an adjunct in cancer and infectious disease treatment.',
    researchFocus: ['Immune reconstitution', 'Antiviral immunity', 'Vaccine response enhancement', 'Sepsis research'],
    mechanism: 'Enhances T-cell maturation, promotes Th1 immune responses, stimulates dendritic cell function, and upregulates toll-like receptor signalling for improved pathogen response.',
    status: 'Approved in several countries (China, Italy and others) for hepatitis B/C and as immune adjunct. Not FDA-approved.',
    halfLife: 'Approximately 2 hours.',
    storage: 'Lyophilised: refrigerate. Reconstituted: use within the day.',
    handling: 'Reconstitute with supplied diluent; administer SC.',
    safety: 'Well tolerated in clinical use; injection site reactions possible. Not FDA-approved.',
    disclaimer: 'For educational research tracking only. Not FDA-approved; use only where approved under physician supervision.',
    trialDoseSummary: {
      label: 'Doses used in approved and clinical use',
      summary: 'Approved protocols typically use 1.6 mg SC twice weekly for hepatitis. Clinical trials explored varied regimens.',
      context: 'clinical trial / approved use in some countries',
      route: 'subcutaneous',
      frequency: 'twice weekly or daily per protocol',
      duration: '6–12 months for hepatitis',
      sourceType: 'clinical trial / label',
      caution: 'Clinical study and label data only. Not a general dosing recommendation.',
    },
    relatedPeptides: ['ll37', 'thymalin', 'vip'],
    tags: ['immune', 'thymic', 'antiviral', 'T-cell'],
    cautionLevel: 'Low',
    references: [],
  },

  {
    id: 'll37',
    name: 'LL-37',
    aliases: ['Cathelicidin', 'Human Cathelicidin Antimicrobial Peptide', 'hCAP18'],
    category: 'immune',
    description: 'The only known human cathelicidin, an endogenous antimicrobial peptide secreted by epithelial cells and immune cells that provides a first line of defence against pathogens.',
    researchFocus: ['Antimicrobial activity', 'Wound healing', 'Innate immunity modulation', 'Anti-biofilm research'],
    mechanism: 'Disrupts bacterial membrane integrity through electrostatic interactions; also modulates inflammatory cytokines, promotes wound healing, and activates immune cell migration.',
    status: 'Endogenous peptide; experimental therapeutic applications under investigation. Not approved as a drug.',
    halfLife: 'Short in vivo (minutes); susceptible to protease degradation.',
    storage: 'Lyophilised: refrigerate. Reconstituted: use promptly; highly susceptible to degradation.',
    handling: 'Use sterile technique; keep cold and use immediately after reconstitution.',
    safety: 'Limited injectable human data. Topical applications under investigation. Not approved for systemic use.',
    disclaimer: 'For educational research tracking only. Not approved for therapeutic human use.',
    trialDoseSummary: {
      label: 'Doses used in research studies',
      summary: 'Topical wound studies applied formulations of 10–100 mcg/mL. Systemic dosing in humans not established.',
      context: 'research / early clinical study',
      route: 'topical / injectable (investigational)',
      frequency: 'varies',
      duration: 'varies',
      sourceType: 'research study',
      caution: 'Research data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['thymosin_alpha1', 'kpv'],
    tags: ['antimicrobial', 'innate immunity', 'cathelicidin', 'wound healing'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'thymalin',
    name: 'Thymalin',
    aliases: ['Thymus Peptide Complex', 'Thymopentin-related peptide'],
    category: 'immune',
    description: 'A polypeptide extract from bovine thymus gland used in Russian medicine for immune reconstitution and studied for longevity-promoting and anti-aging effects.',
    researchFocus: ['Immune system restoration', 'Anti-aging research', 'Cancer support therapy'],
    mechanism: 'Proposed to restore age-related thymic involution effects by providing thymic peptides that support T-lymphocyte maturation and regulatory immune function.',
    status: 'Registered in Russia for immune deficiency conditions. Not approved by FDA or EMA.',
    halfLife: 'Variable; peptide mixture.',
    storage: 'Lyophilised: refrigerate.',
    handling: 'Reconstitute with sterile saline; administer IM.',
    safety: 'Generally well tolerated per Russian literature. Not validated by Western standards.',
    disclaimer: 'For educational research tracking only. Not approved for human use in most countries.',
    trialDoseSummary: {
      label: 'Doses used in Russian clinical studies',
      summary: 'Russian protocols report 10 mg IM daily for 10 days per course, repeated 2–4 times yearly.',
      context: 'Russian clinical use',
      route: 'intramuscular',
      frequency: 'daily per course',
      duration: '10-day courses',
      sourceType: 'clinical study / label',
      caution: 'Russian clinical study data only. Not a general dosing recommendation.',
    },
    relatedPeptides: ['thymosin_alpha1', 'epitalon'],
    tags: ['immune', 'thymic', 'anti-aging', 'Russian research'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'vip',
    name: 'VIP',
    aliases: ['Vasoactive Intestinal Peptide', 'Vasoactive Intestinal Polypeptide'],
    category: 'immune',
    description: 'A naturally occurring neuropeptide with broad immunomodulatory, anti-inflammatory and vasodilatory properties found throughout the nervous system and gut.',
    researchFocus: ['Autoimmune disease modulation', 'Inflammatory bowel disease research', 'Pulmonary hypertension', 'Mast cell activation syndrome'],
    mechanism: 'Binds VPAC1/VPAC2 receptors, potently suppressing pro-inflammatory cytokine production, modulating T-regulatory cell activity, and relaxing smooth muscle.',
    status: 'Investigational; studied in multiple clinical trials. Not approved for most indications.',
    halfLife: 'Approximately 1–2 minutes IV due to rapid enzymatic degradation.',
    storage: 'Lyophilised: refrigerate or freeze. Reconstituted: use immediately.',
    handling: 'Extremely short half-life; requires IV infusion or aerosolisation for therapeutic delivery.',
    safety: 'Vasodilation and hypotension at higher doses. Limited therapeutic use approved.',
    disclaimer: 'For educational research tracking only. Not approved for general therapeutic use.',
    trialDoseSummary: {
      label: 'Doses used in clinical trials',
      summary: 'Inhaled VIP was studied at 100–400 mcg; IV infusion at 12–200 pmol/kg/min used in various trials.',
      context: 'human clinical trial',
      route: 'intravenous / inhaled',
      frequency: 'continuous infusion or inhaled doses',
      duration: 'acute or chronic',
      sourceType: 'clinical trial',
      caution: 'Historical clinical trial data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['thymosin_alpha1', 'kpv'],
    tags: ['neuropeptide', 'anti-inflammatory', 'immune', 'vasodilatory'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'ara290',
    name: 'ARA-290 (Cibinetide)',
    aliases: ['Cibinetide', 'Helix B Surface Peptide'],
    category: 'immune',
    description: 'A non-hematopoietic erythropoietin (EPO) analog peptide that activates the innate repair receptor to provide tissue protection and reduce neuroinflammation without the erythropoietic effects of EPO.',
    researchFocus: ['Neuropathic pain', 'Sarcoidosis small-fiber neuropathy', 'Tissue protection', 'Inflammatory reduction'],
    mechanism: 'Binds the beta common receptor/EPOR heterodimer complex (innate repair receptor) to activate cytoprotective pathways without triggering erythropoiesis or platelet aggregation.',
    status: 'Investigated in phase II clinical trials for sarcoidosis and neuropathic pain. Not approved.',
    halfLife: 'Short; specific values not established for all routes.',
    storage: 'Lyophilised: refrigerate. Reconstituted: use promptly.',
    handling: 'Use sterile technique.',
    safety: 'Phase II data show favourable safety profile. Not approved for therapeutic use.',
    disclaimer: 'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in clinical trials',
      summary: 'Phase II studies administered 4 mg SC daily for 28 days in sarcoidosis patients with small-fiber neuropathy.',
      context: 'human phase II clinical trial',
      route: 'subcutaneous',
      frequency: 'once daily',
      duration: '28 days',
      sourceType: 'clinical trial',
      caution: 'Phase II trial data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['thymosin_alpha1', 'vip'],
    tags: ['tissue protection', 'neuropathy', 'EPO analog', 'anti-inflammatory'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'larazotide',
    name: 'Larazotide',
    aliases: ['AT-1001', 'INN-202'],
    category: 'immune',
    description: 'A synthetic octapeptide that tightens intestinal tight junctions to reduce gut permeability, studied primarily as an adjunctive therapy for celiac disease and leaky gut.',
    researchFocus: ['Intestinal permeability reduction', 'Celiac disease adjunct therapy', 'Tight junction modulation'],
    mechanism: 'Competes with zonulin (the endogenous tight-junction regulator) at its receptor, preventing zonulin-mediated opening of intestinal tight junctions and reducing paracellular antigen passage.',
    status: 'Investigated in multiple phase IIb clinical trials for celiac disease. Phase III development underway. Not approved.',
    halfLife: 'Primarily local action in the gut; minimal systemic absorption from oral delivery.',
    storage: 'Stable in oral formulation at room temperature.',
    handling: 'Oral administration; no special handling required.',
    safety: 'Well tolerated in phase II trials with a safety profile similar to placebo. Not approved for use.',
    disclaimer: 'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in clinical trials',
      summary: 'Phase IIb celiac studies used oral doses of 0.5–2 mg three times daily with meals.',
      context: 'human phase IIb clinical trial',
      route: 'oral',
      frequency: 'three times daily with meals',
      duration: '12–24 weeks',
      sourceType: 'clinical trial',
      caution: 'Clinical trial data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['kpv', 'vip'],
    tags: ['gut permeability', 'celiac', 'tight junction', 'oral peptide'],
    cautionLevel: 'Low',
    references: [],
  },

  // ── HORMONAL / REPRODUCTIVE ───────────────────────────────

  {
    id: 'gonadorelin',
    name: 'Gonadorelin',
    aliases: ['GnRH', 'LHRH', 'Luteinizing Hormone-Releasing Hormone', 'Factrel'],
    category: 'hormonal',
    description: 'The synthetic form of endogenous gonadotropin-releasing hormone (GnRH) that stimulates pituitary release of LH and FSH, used diagnostically and for fertility.',
    researchFocus: ['Hypothalamic-pituitary-gonadal axis assessment', 'Fertility treatment', 'Testosterone restoration research'],
    mechanism: 'Binds GnRH receptors on pituitary gonadotrophs, stimulating LH and FSH release; pulsatile administration preserves gonadotrope sensitivity while continuous administration causes desensitisation.',
    status: 'Approved for diagnostic testing (Factrel) and investigational for fertility and testosterone restoration.',
    halfLife: 'Approximately 2–10 minutes; requires pulsatile delivery for therapeutic effect.',
    storage: 'Lyophilised vials: refrigerate. Reconstituted: use within the day.',
    handling: 'Pulsatile pump delivery required for therapeutic gonadal stimulation.',
    safety: 'Well tolerated; hypersensitivity reactions rare. Continuous use leads to gonadal suppression.',
    disclaimer: 'For educational research tracking only. Use only under physician supervision.',
    trialDoseSummary: {
      label: 'Doses used in clinical and approved use',
      summary: 'Diagnostic bolus: 100 mcg IV or SC. Pulsatile fertility therapy: 5–20 mcg per pulse every 90 minutes via infusion pump.',
      context: 'clinical use / approved diagnostic',
      route: 'intravenous / subcutaneous / pulsatile pump',
      frequency: 'single bolus or pulsatile every 90 min',
      duration: 'single dose to months',
      sourceType: 'clinical use / FDA label',
      caution: 'Clinical use data only. Not a dosing recommendation outside physician care.',
    },
    relatedPeptides: ['kisspeptin10', 'alarelin'],
    tags: ['GnRH', 'LH', 'FSH', 'fertility', 'reproductive'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'oxytocin',
    name: 'Oxytocin',
    aliases: ['Pitocin', 'Syntocinon'],
    category: 'hormonal',
    description: 'A naturally occurring neuropeptide hormone produced in the hypothalamus with essential roles in childbirth, lactation and social bonding, also studied extensively for psychiatric and social behaviour effects.',
    researchFocus: ['Social bonding and trust', 'Autism spectrum disorder research', 'Anxiety reduction', 'Post-partum haemorrhage prevention'],
    mechanism: 'Binds oxytocin receptors in uterus, mammary glands and brain regions (amygdala, hypothalamus), mediating uterine contractions, milk letdown and prosocial neurobiology.',
    status: 'FDA-approved for obstetric indications (Pitocin). Investigational for psychiatric and social indications via intranasal route.',
    halfLife: '1–6 minutes IV; approximately 1–2 hours intranasally.',
    storage: 'Refrigerate vials. Nasal sprays: room temperature per label.',
    handling: 'IV administration for obstetrics requires medical supervision. Intranasal self-administration studied in research.',
    safety: 'Well established safety for approved obstetric use. Intranasal research use generally well tolerated; effects on social cognition complex.',
    disclaimer: 'For educational research tracking only. Prescription medication for approved indications.',
    trialDoseSummary: {
      label: 'Doses used in approved and clinical use',
      summary: 'Obstetric IV: 10–40 units in saline infusion. Intranasal research: 24–40 IU per dose. Approved label data for obstetric use.',
      context: 'FDA-approved label (obstetric) / clinical research (intranasal)',
      route: 'intravenous / intranasal',
      frequency: 'varies by indication',
      duration: 'varies',
      sourceType: 'FDA label / clinical research',
      caution: 'Label and clinical research data only. Use under physician supervision for approved indications.',
    },
    relatedPeptides: ['kisspeptin10'],
    tags: ['social bonding', 'hormonal', 'FDA-approved', 'psychiatric research'],
    cautionLevel: 'Low',
    references: [],
  },

  {
    id: 'follistatin344',
    name: 'Follistatin 344',
    aliases: ['FST-344', 'FS-344'],
    category: 'hormonal',
    description: 'An isoform of follistatin, a glycoprotein that binds and neutralises myostatin and activin, studied for its potential to promote dramatic muscle growth by removing inhibitory signals on muscle tissue.',
    researchFocus: ['Myostatin inhibition', 'Muscle hypertrophy research', 'Muscular dystrophy gene therapy'],
    mechanism: 'Binds and sequesters myostatin (GDF-8) and activin A, preventing them from signalling through ActRIIB receptors and removing their inhibitory brake on muscle fibre growth.',
    status: 'Experimental; gene therapy trials ongoing for muscular dystrophy. Recombinant peptide use is investigational. Not approved for human use.',
    halfLife: 'Not well established for exogenous administration.',
    storage: 'Lyophilised: refrigerate or freeze. Reconstituted: use promptly.',
    handling: 'Use sterile technique; handling highly experimental compound.',
    safety: 'Systemic myostatin inhibition carries theoretical cardiovascular risks. No established human safety data for peptide form.',
    disclaimer: 'For educational research tracking only. Not approved for human use. Significant unknowns regarding safety.',
    trialDoseSummary: {
      label: 'Doses used in animal and early studies',
      summary: 'Animal studies used gene therapy vectors expressing follistatin. Recombinant protein dosing in humans not established.',
      context: 'animal study / gene therapy trial',
      route: 'gene therapy / injected protein (investigational)',
      frequency: 'varies',
      duration: 'varies',
      sourceType: 'preclinical / gene therapy study',
      caution: 'Experimental data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['igf1lr3'],
    tags: ['myostatin', 'muscle growth', 'follistatin', 'experimental'],
    cautionLevel: 'High',
    references: [],
  },

  {
    id: 'alarelin',
    name: 'Alarelin',
    aliases: ['D-Ala6-GnRH', 'Avorelin'],
    category: 'hormonal',
    description: 'A synthetic GnRH agonist with a D-alanine substitution at position 6, conferring greater potency and duration than native GnRH, used clinically in some countries for reproductive indications.',
    researchFocus: ['Controlled ovarian stimulation', 'Reproductive hormone suppression', 'Prostate cancer hormonal management'],
    mechanism: 'Sustained GnRH receptor stimulation causes receptor downregulation, leading to paradoxical suppression of LH, FSH and gonadal steroids after initial flare.',
    status: 'Approved in China and some other countries for fertility protocols. Investigational in others.',
    halfLife: 'Approximately 3 hours; depot formulations extend duration to weeks.',
    storage: 'Lyophilised: refrigerate. Depot formulations: per manufacturer guidance.',
    handling: 'SC or IM injection per clinical protocol.',
    safety: 'Menopausal-like symptoms, bone density loss with long-term use. Testosterone flare phenomenon with initial use in men. Use under medical supervision.',
    disclaimer: 'For educational research tracking only. Use only under physician supervision where approved.',
    trialDoseSummary: {
      label: 'Doses used in clinical and approved use',
      summary: 'Fertility protocols used 25–50 mcg SC daily. Depot formulations: 2–4 mg monthly for suppression indications.',
      context: 'approved clinical use (some countries)',
      route: 'subcutaneous / depot IM',
      frequency: 'daily or monthly',
      duration: 'weeks to months',
      sourceType: 'clinical use / label',
      caution: 'Clinical and label data only. Use under physician supervision.',
    },
    relatedPeptides: ['gonadorelin', 'kisspeptin10'],
    tags: ['GnRH agonist', 'fertility', 'hormonal suppression'],
    cautionLevel: 'Medium',
    references: [],
  },

  // ── LONGEVITY ─────────────────────────────────────────────

  {
    id: 'epitalon',
    name: 'Epitalon',
    aliases: ['Epithalon', 'Ala-Glu-Asp-Gly'],
    category: 'longevity',
    description: 'A synthetic tetrapeptide derived from the pineal gland extract epithalamin, studied in Russian research for alleged telomerase-activating and longevity-promoting properties.',
    researchFocus: ['Telomerase activation', 'Telomere length maintenance', 'Anti-aging biology'],
    mechanism: 'Proposed to increase telomerase activity in somatic cells, upregulate antioxidant defences and modulate melatonin production, though mechanisms are not fully validated.',
    status: 'Experimental; primarily Russian animal and limited human studies. Not approved by FDA or EMA.',
    halfLife: 'Not well established; rapid clearance presumed based on peptide size.',
    storage: 'Lyophilised: refrigerate. Reconstituted: use within days.',
    handling: 'Use sterile technique.',
    safety: 'Human safety data extremely limited. Not approved for medical use.',
    disclaimer: 'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in Russian studies',
      summary: 'Limited Russian studies reported 10 mg injection courses over 10–20 days; oral doses of 1–2 mg daily also explored. Historical study information only.',
      context: 'Russian investigational study',
      route: 'intramuscular / intravenous / oral',
      frequency: 'daily per course',
      duration: '10–20 day courses',
      sourceType: 'small study / investigational',
      caution: 'Historical study data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['pinealon', 'humanin'],
    tags: ['longevity', 'telomerase', 'anti-aging', 'Russian research'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'humanin',
    name: 'Humanin',
    aliases: ['HN', 'MTRNR2'],
    category: 'longevity',
    description: 'A 21-amino acid mitochondria-derived peptide encoded within the 16S ribosomal RNA of the mitochondrial genome, studied for cytoprotective, metabolic and longevity-related properties.',
    researchFocus: ['Cell death prevention (apoptosis inhibition)', 'Metabolic disease research', 'Alzheimer\'s disease protection', 'Longevity biomarker research'],
    mechanism: 'Binds FPRL1 and CNTFR/WSX-1/GP130 receptor complexes to activate cell survival pathways (JAK/STAT, PI3K/Akt), inhibit apoptosis and modulate insulin signalling.',
    status: 'Experimental; animal studies and early human biomarker research. Not approved for any therapeutic use.',
    halfLife: 'Short in circulation; specific human PK data limited.',
    storage: 'Lyophilised: refrigerate. Reconstituted: use promptly.',
    handling: 'Use sterile technique.',
    safety: 'Human safety data not established. Not approved for medical use.',
    disclaimer: 'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in animal studies',
      summary: 'Animal models used SC doses of 1–8 mg/kg in various neuroprotection paradigms. Human therapeutic dosing not established.',
      context: 'animal study',
      route: 'subcutaneous / intracerebroventricular (animal)',
      frequency: 'varies',
      duration: 'varies',
      sourceType: 'preclinical study',
      caution: 'Animal study data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['motsc', 'ss31'],
    tags: ['mitochondrial peptide', 'cytoprotective', 'longevity', 'Alzheimer\'s'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'carnosine',
    name: 'Carnosine',
    aliases: ['Beta-alanyl-L-histidine', 'L-Carnosine'],
    category: 'longevity',
    description: 'A naturally occurring dipeptide found at high concentrations in muscle and brain tissue with well-documented antioxidant, anti-glycation and pH-buffering properties.',
    researchFocus: ['Glycation inhibition (anti-AGE)', 'Antioxidant protection', 'Exercise performance and fatigue reduction', 'Cognitive aging research'],
    mechanism: 'Scavenges reactive oxygen species and reactive carbonyl species, inhibits protein glycation and cross-linking, and buffers hydrogen ions in muscle during high-intensity exercise.',
    status: 'Widely sold as a dietary supplement; not approved as a drug for specific indications.',
    halfLife: 'Short in blood (~1–10 min) due to carnosinase enzyme; muscle tissue concentrations more stable.',
    storage: 'Powder: room temperature, dry conditions. Oral supplements stable at room temperature.',
    handling: 'Oral supplementation; no sterile technique required.',
    safety: 'Excellent safety profile with extensive human use. Oral supplementation well tolerated.',
    disclaimer: 'For educational research tracking only. Dietary supplement, not a drug.',
    trialDoseSummary: {
      label: 'Doses used in clinical studies',
      summary: 'Human studies used oral doses of 500 mg–2 g daily for cognitive, metabolic and athletic endpoints.',
      context: 'human clinical study / supplement',
      route: 'oral',
      frequency: 'once or twice daily',
      duration: 'weeks to months',
      sourceType: 'clinical study / supplement literature',
      caution: 'Supplement study data only. Not a medical dosing recommendation.',
    },
    relatedPeptides: ['humanin'],
    tags: ['antioxidant', 'anti-glycation', 'dipeptide', 'longevity', 'supplement'],
    cautionLevel: 'Low',
    references: [],
  },

  // ── MITOCHONDRIAL ─────────────────────────────────────────

  {
    id: 'ss31',
    name: 'SS-31 (Elamipretide)',
    aliases: ['Elamipretide', 'MTP-131', 'Bendavia'],
    category: 'mitochondrial',
    description: 'A mitochondria-targeting tetrapeptide that selectively concentrates on the inner mitochondrial membrane to stabilise cardiolipin and improve oxidative phosphorylation, studied for heart failure and kidney disease.',
    researchFocus: ['Heart failure with preserved ejection fraction', 'Acute kidney injury', 'Mitochondrial dysfunction', 'Ischaemia-reperfusion injury'],
    mechanism: 'Penetrates multiple mitochondrial membranes due to alternating aromatic and basic residues; binds cardiolipin to stabilise the electron transport chain and reduce oxidative stress.',
    status: 'Phase II/III clinical trials ongoing for heart failure (HFpEF) and Barth syndrome. Not FDA-approved for general use.',
    halfLife: 'Short systemic half-life; rapidly concentrated in mitochondria.',
    storage: 'Lyophilised: refrigerate. Reconstituted: use promptly.',
    handling: 'IV or SC administration per clinical protocol.',
    safety: 'Phase II data show favourable safety profile. Not yet approved outside clinical trials.',
    disclaimer: 'For educational research tracking only. Not approved for general human use.',
    trialDoseSummary: {
      label: 'Doses used in clinical trials',
      summary: 'Phase II HFpEF trials used 0.05–0.25 mg/kg SC once daily or IV infusion for acute indications.',
      context: 'human phase II clinical trial',
      route: 'subcutaneous / intravenous',
      frequency: 'once daily (SC) or acute IV',
      duration: '4 weeks to months',
      sourceType: 'clinical trial',
      caution: 'Phase II trial data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['motsc', 'humanin'],
    tags: ['mitochondria', 'cardiolipin', 'heart failure', 'energy metabolism'],
    cautionLevel: 'Medium',
    references: [],
  },

  {
    id: 'motsc',
    name: 'MOTS-c',
    aliases: ['Mitochondrial ORF of the 12S rRNA type-c', 'Mitochondrial Open Reading Frame Peptide'],
    category: 'mitochondrial',
    description: 'A 16-amino acid peptide encoded within the mitochondrial genome that acts as a mitochondrial hormone, studied for its roles in metabolic regulation, insulin sensitivity and longevity.',
    researchFocus: ['Insulin sensitivity and glucose metabolism', 'Exercise-induced metabolic benefits', 'Obesity and metabolic syndrome research', 'Longevity and aging'],
    mechanism: 'Translocates to the nucleus under metabolic stress, activates AMPK, modulates the folate cycle and one-carbon metabolism, and interacts with TFAM to regulate mitochondrial gene expression.',
    status: 'Experimental; animal studies and early human biomarker research. No approved therapeutic use.',
    halfLife: 'Not well established for exogenous administration.',
    storage: 'Lyophilised: refrigerate. Reconstituted: use promptly.',
    handling: 'Use sterile technique.',
    safety: 'Human therapeutic safety data not established. Not approved for medical use.',
    disclaimer: 'For educational research tracking only. Not approved for human use.',
    trialDoseSummary: {
      label: 'Doses used in animal studies',
      summary: 'Mouse studies used SC doses of 15 mg/kg daily, showing metabolic benefits. Human therapeutic dosing not established.',
      context: 'animal study',
      route: 'subcutaneous (animal)',
      frequency: 'daily',
      duration: 'weeks',
      sourceType: 'preclinical study',
      caution: 'Animal study data only. Not a dosing recommendation.',
    },
    relatedPeptides: ['ss31', 'humanin'],
    tags: ['mitochondrial peptide', 'AMPK', 'insulin sensitivity', 'metabolism', 'longevity'],
    cautionLevel: 'Medium',
    references: [],
  },

];

// ─── TABS ─────────────────────────────────────────────────
const TABS = [
  { id: 'dashboard',  label: 'Dashboard',    icon: '🏠' },
  { id: 'peptides',   label: 'Peptides',     icon: '🧬' },
  { id: 'calculator', label: 'Calculator',   icon: '📐' },
  { id: 'log',        label: 'Research Log', icon: '📒' },
  { id: 'inventory',  label: 'Inventory',    icon: '📦' },
  { id: 'settings',   label: 'Settings',     icon: '⚙️' },
];

// ─── HELPERS ──────────────────────────────────────────────
const isInteractiveTarget = el => {
  if (!el) return false;
  return !!el.closest('input, textarea, select, button, [contenteditable="true"], [data-no-swipe="true"]');
};

// ─── TOP NAV ──────────────────────────────────────────────
function TopNav({ tab, setTab, favourites }) {
  return (
    <div style={{ position:'sticky', top:0, zIndex:100, background:'rgba(22,22,22,0.95)', borderBottom:'1px solid #333', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', paddingTop:'env(safe-area-inset-top)' }}>
      <div style={{ maxWidth:430, margin:'0 auto', padding:'10px 12px' }}>
        <div style={{ display:'flex', gap:8, overflowX:'auto', WebkitOverflowScrolling:'touch', scrollbarWidth:'none' }}>
          {TABS.map(t => {
            const active = t.id === tab;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ flex:'0 0 auto', minHeight:42, padding:'8px 12px', borderRadius:999, border: active ? '2px solid #3fa9f5' : '1px solid #444', background: active ? '#3fa9f5' : '#1a1a1a', color: active ? '#fff' : '#ccc', fontSize:13, fontWeight: active ? 700 : 600, display:'flex', alignItems:'center', gap:6, position:'relative', cursor:'pointer' }}>
                <span style={{ fontSize:15 }}>{t.icon}</span>
                <span>{t.label}</span>
                {t.id === 'peptides' && favourites.length > 0 && (
                  <span style={{ position:'absolute', top:-4, right:-4, width:18, height:18, borderRadius:'50%', background:'#d90429', color:'#fff', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #161616' }}>{favourites.length}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────
function DashboardScreen({ favourites, peptides, logs, inventory, setTab, setSelectedPeptide }) {
  const favouritePeptides = peptides.filter(p => favourites.includes(p.id));
  const recentLogs = logs.slice().sort((a,b) => b.date.localeCompare(a.date)).slice(0,5);
  const lowInventory = inventory.filter(item => {
    const now = new Date();
    const expDate = item.expirationDate ? new Date(item.expirationDate) : null;
    const isExpiring = expDate && (expDate - now) / (1000*60*60*24) <= 14;
    return (item.remainingMg !== undefined && item.remainingMg <= item.vialAmountMg * 0.1) || isExpiring;
  });
  const cardStyle = { background:'#1a1a1a', borderRadius:12, padding:14, marginBottom:8, border:'1px solid #333' };
  return (
    <div style={{ padding:'16px 16px 24px' }}>
      <div style={{ marginBottom:16 }}>
        <h2 style={{ margin:0, fontSize:22 }}>Peptide Research Tracker</h2>
        <p style={{ margin:'4px 0 0', fontSize:12, color:'#888' }}>50-peptide reference and research hub</p>
      </div>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
        {[['🧬', peptides.length, 'Peptides'],['⭐', favourites.length,'Favourites'],['📒', logs.length,'Log Entries'],['📦', inventory.length,'Inventory']].map(([ic,n,lb]) => (
          <div key={lb} style={{ ...cardStyle, flex:'1 1 45%', minWidth:120, textAlign:'center', marginBottom:0 }}>
            <div style={{ fontSize:20 }}>{ic}</div>
            <div style={{ fontSize:26, fontWeight:700, lineHeight:1.2 }}>{n}</div>
            <div style={{ fontSize:12, color:'#888' }}>{lb}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
        {[['Open Calculator','calculator'],['Add Log','log'],['Add Inventory','inventory'],['Browse Peptides','peptides']].map(([label,t]) => (
          <button key={t} onClick={() => setTab(t)} style={{ flex:'1 1 45%', minWidth:120, padding:12, background:'#3fa9f5', border:'none', borderRadius:12, color:'#161616', fontWeight:600, cursor:'pointer' }}>{label}</button>
        ))}
      </div>
      <section style={{ marginBottom:24 }}>
        <h3 style={{ fontSize:16, margin:'0 0 10px' }}>Favourite Peptides</h3>
        {favouritePeptides.length === 0 && <p style={{ color:'#888' }}>No favourites yet. Star peptides in the Peptides tab.</p>}
        {favouritePeptides.map(p => (
          <div key={p.id} style={{ ...cardStyle, cursor:'pointer' }} onClick={() => { setSelectedPeptide(p); setTab('peptides'); }}>
            <strong>{p.name}</strong>
            <div style={{ fontSize:12, color:'#999', marginTop:4 }}>{CATEGORIES[p.category]}</div>
          </div>
        ))}
      </section>
      <section style={{ marginBottom:24 }}>
        <h3 style={{ fontSize:16, margin:'0 0 10px' }}>Recent Research Logs</h3>
        {recentLogs.length === 0 && <p style={{ color:'#888' }}>No recent entries.</p>}
        {recentLogs.map(log => (
          <div key={log.id} style={cardStyle}>
            <div style={{ fontSize:14, fontWeight:600 }}>{log.peptideName}</div>
            <div style={{ fontSize:12, color:'#aaa' }}>{log.date}</div>
            {log.amount && <div style={{ fontSize:12, color:'#ccc', marginTop:4 }}>Amount: {log.amount}</div>}
            {log.notes && <div style={{ fontSize:12, color:'#ccc', marginTop:4 }}>{log.notes.length > 60 ? log.notes.slice(0,57)+'…' : log.notes}</div>}
          </div>
        ))}
      </section>
      <section>
        <h3 style={{ fontSize:16, margin:'0 0 10px' }}>Inventory Alerts</h3>
        {lowInventory.length === 0 && <p style={{ color:'#888' }}>No alerts.</p>}
        {lowInventory.map(item => (
          <div key={item.id} style={cardStyle}>
            <div style={{ fontSize:14, fontWeight:600 }}>{item.name}</div>
            {item.remainingMg !== undefined && <div style={{ fontSize:12, color:'#ccc', marginTop:4 }}>Remaining: {item.remainingMg} mg</div>}
            {item.expirationDate && <div style={{ fontSize:12, color:'#f5c518', marginTop:4 }}>Expires: {item.expirationDate}</div>}
          </div>
        ))}
      </section>
    </div>
  );
}

// ─── PEPTIDES ─────────────────────────────────────────────
function PeptidesScreen({ peptides, favourites, setFavourites, selectedPeptide, setSelectedPeptide, setTab }) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showDetails, setShowDetails] = useState(!!selectedPeptide);

  const toggleFavourite = id => setFavourites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  const filtered = peptides.filter(p => {
    const ms = p.name.toLowerCase().includes(search.toLowerCase()) || p.aliases.some(a => a.toLowerCase().includes(search.toLowerCase())) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const mc = filterCategory === 'all' || p.category === filterCategory;
    return ms && mc;
  });

  const chipStyle = active => ({ flex:'0 0 auto', padding:'6px 12px', borderRadius:999, border:'1px solid #444', background: active ? '#3fa9f5' : '#1a1a1a', color: active ? '#fff' : '#ccc', fontSize:12, fontWeight:600, cursor:'pointer' });
  const cardStyle = { background:'#1a1a1a', borderRadius:12, padding:14, marginBottom:10, border:'1px solid #333', cursor:'pointer' };
  const hlStyle = (level) => ({ display:'inline-block', width:8, height:8, borderRadius:'50%', background: level === 'High' ? '#d90429' : level === 'Medium' ? '#f5c518' : '#4caf50' });

  return (
    <div style={{ padding:'16px 16px 24px' }}>
      <h2 style={{ margin:'0 0 12px', fontSize:20 }}>Peptides ({filtered.length})</h2>
      <div style={{ display:'flex', gap:8, marginBottom:10 }}>
        <input type="search" placeholder="Search name, alias, tag…" value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex:1, padding:'8px 12px', borderRadius:8, border:'1px solid #444', background:'#1a1a1a', color:'#f5f5f5', fontSize:14, outline:'none' }}/>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          style={{ padding:'8px 10px', borderRadius:8, border:'1px solid #444', background:'#1a1a1a', color:'#f5f5f5', fontSize:13 }}>
          <option value="all">All Categories</option>
          {Object.keys(CATEGORIES).map(k => <option key={k} value={k}>{CATEGORIES[k]}</option>)}
        </select>
      </div>
      <div style={{ display:'flex', overflowX:'auto', gap:6, paddingBottom:8, marginBottom:14, scrollbarWidth:'none' }}>
        <button onClick={() => setFilterCategory('all')} style={chipStyle(filterCategory==='all')}>All</button>
        {Object.keys(CATEGORIES).map(k => <button key={k} onClick={() => setFilterCategory(k)} style={chipStyle(filterCategory===k)}>{CATEGORIES[k]}</button>)}
      </div>
      {filtered.length === 0 && <p style={{ color:'#888' }}>No peptides match your search.</p>}
      {filtered.map(peptide => (
        <div key={peptide.id} style={cardStyle} onClick={() => { setSelectedPeptide(peptide); setShowDetails(true); }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ flex:1, minWidth:0, marginRight:8 }}>
              <strong style={{ fontSize:15 }}>{peptide.name}</strong>
              <div style={{ fontSize:12, color:'#999', marginTop:2 }}>{CATEGORIES[peptide.category]}</div>
            </div>
            <button onClick={e => { e.stopPropagation(); toggleFavourite(peptide.id); }}
              style={{ border:'none', background:'transparent', fontSize:20, cursor:'pointer', color: favourites.includes(peptide.id) ? '#f5c518' : '#555', flexShrink:0 }}>
              {favourites.includes(peptide.id) ? '★' : '☆'}
            </button>
          </div>
          <div style={{ fontSize:12, color:'#ccc', marginTop:6 }}>
            {peptide.description.length > 90 ? peptide.description.slice(0,87)+'…' : peptide.description}
          </div>
          <div style={{ marginTop:6, display:'flex', flexWrap:'wrap', gap:4, alignItems:'center' }}>
            {peptide.cautionLevel && <span style={hlStyle(peptide.cautionLevel)} title={`Caution: ${peptide.cautionLevel}`}/>}
            {peptide.tags.map((tag,i) => (
              <span key={i} style={{ fontSize:10, color:'#aaa', background:'#222', padding:'2px 6px', borderRadius:4 }}>{tag}</span>
            ))}
          </div>
        </div>
      ))}

      {showDetails && selectedPeptide && (
        <div style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.85)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200 }}>
          <div style={{ background:'#1a1a1a', borderRadius:16, padding:20, maxWidth:480, width:'90%', maxHeight:'85vh', overflowY:'auto', position:'relative', border:'1px solid #333' }}>
            <button onClick={() => setShowDetails(false)} style={{ position:'absolute', top:8, right:8, background:'transparent', border:'none', color:'#aaa', fontSize:24, cursor:'pointer' }} aria-label="Close">×</button>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', paddingRight:24 }}>
              <h3 style={{ marginTop:0, marginBottom:4 }}>{selectedPeptide.name}</h3>
              {selectedPeptide.cautionLevel && <span style={{ width:10, height:10, borderRadius:'50%', display:'inline-block', background: selectedPeptide.cautionLevel==='High'?'#d90429':selectedPeptide.cautionLevel==='Medium'?'#f5c518':'#4caf50' }} title={`Caution: ${selectedPeptide.cautionLevel}`}/>}
            </div>
            {selectedPeptide.tags.length > 0 && <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:8 }}>{selectedPeptide.tags.map((t,i) => <span key={i} style={{ fontSize:10, color:'#aaa', background:'#222', padding:'2px 6px', borderRadius:4 }}>{t}</span>)}</div>}
            {selectedPeptide.aliases.length > 0 && <p style={{ fontSize:12, color:'#888', marginTop:4 }}>Also known as: {selectedPeptide.aliases.join(', ')}</p>}
            <p style={{ fontSize:14, color:'#ccc' }}>{selectedPeptide.description}</p>
            {[
              ['Common research focus', selectedPeptide.researchFocus, 'list'],
              ['Mechanism / Pathway', selectedPeptide.mechanism, 'text'],
              ['Research status', selectedPeptide.status, 'text'],
              ['Half-life', selectedPeptide.halfLife, 'text'],
              ['Storage notes', selectedPeptide.storage, 'text'],
              ['Handling notes', selectedPeptide.handling, 'text'],
              ['Safety notes', selectedPeptide.safety, 'text'],
            ].map(([title, content, type]) => content ? (
              <div key={title}>
                <h4 style={{ margin:'12px 0 4px', fontSize:14 }}>{title}</h4>
                {type === 'list'
                  ? <ul style={{ margin:0, paddingLeft:20 }}>{content.map((item,i) => <li key={i} style={{ fontSize:13, color:'#ccc' }}>{item}</li>)}</ul>
                  : <p style={{ fontSize:13, color:'#ccc', margin:0 }}>{content}</p>}
              </div>
            ) : null)}
            {selectedPeptide.trialDoseSummary && (
              <div style={{ marginTop:12, background:'#111', borderRadius:8, padding:10, border:'1px solid #444' }}>
                <h4 style={{ margin:'0 0 6px', fontSize:14, color:'#f5c518' }}>{selectedPeptide.trialDoseSummary.label}</h4>
                <p style={{ fontSize:12, color:'#f5c518', margin:'0 0 6px' }}>{selectedPeptide.trialDoseSummary.summary}</p>
                {selectedPeptide.trialDoseSummary.context && (
                  <p style={{ fontSize:11, color:'#aaa', margin:'0 0 6px' }}>
                    Context: {selectedPeptide.trialDoseSummary.context}
                    {selectedPeptide.trialDoseSummary.route && ` | Route: ${selectedPeptide.trialDoseSummary.route}`}
                    {selectedPeptide.trialDoseSummary.frequency && ` | Frequency: ${selectedPeptide.trialDoseSummary.frequency}`}
                    {selectedPeptide.trialDoseSummary.duration && ` | Duration: ${selectedPeptide.trialDoseSummary.duration}`}
                  </p>
                )}
                <p style={{ fontSize:11, color:'#f5c518', margin:0 }}>{selectedPeptide.trialDoseSummary.caution}</p>
              </div>
            )}
            {selectedPeptide.relatedPeptides && selectedPeptide.relatedPeptides.length > 0 && (
              <>
                <h4 style={{ margin:'12px 0 4px', fontSize:14 }}>Related peptides</h4>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {selectedPeptide.relatedPeptides.map((relId,i) => {
                    const rel = peptides.find(p => p.id === relId);
                    return <span key={i} style={{ fontSize:12, background:'#222', color:'#3fa9f5', padding:'3px 8px', borderRadius:6, border:'1px solid #333' }}>{rel ? rel.name : relId}</span>;
                  })}
                </div>
              </>
            )}
            <p style={{ fontSize:12, color:'#f5c518', marginTop:12, borderTop:'1px solid #333', paddingTop:8 }}>{selectedPeptide.disclaimer}</p>
            <div style={{ marginTop:14, display:'flex', gap:8, flexWrap:'wrap' }}>
              <button onClick={() => toggleFavourite(selectedPeptide.id)} style={{ flex:1, padding:'8px 12px', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', background: favourites.includes(selectedPeptide.id) ? '#f5c518' : '#3fa9f5', color:'#161616' }}>
                {favourites.includes(selectedPeptide.id) ? '★ Remove' : '☆ Favourite'}
              </button>
              <button onClick={() => { setTab('log'); setShowDetails(false); }} style={{ flex:1, padding:'8px 12px', background:'#3fa9f5', border:'none', borderRadius:8, color:'#161616', fontWeight:600, cursor:'pointer' }}>Add Log</button>
              <button onClick={() => { setTab('inventory'); setShowDetails(false); }} style={{ flex:1, padding:'8px 12px', background:'#3fa9f5', border:'none', borderRadius:8, color:'#161616', fontWeight:600, cursor:'pointer' }}>Add Inventory</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CALCULATOR ───────────────────────────────────────────
function CalculatorScreen() {
  const [vialMg, setVialMg]       = useState('');
  const [waterMl, setWaterMl]     = useState('');
  const [amount, setAmount]       = useState('');
  const [unit, setUnit]           = useState('mcg');
  const [syringeU, setSyringeU]   = useState('100');
  const n = v => { const x = parseFloat(v); return isNaN(x) ? 0 : x; };
  const mgPerMl      = n(vialMg) && n(waterMl) ? n(vialMg)/n(waterMl) : 0;
  const mcgPerMl     = mgPerMl * 1000;
  const desiredMg    = n(amount) * (unit==='mcg' ? 0.001 : 1);
  const volMl        = mgPerMl > 0 ? desiredMg/mgPerMl : 0;
  const uPerMl       = n(syringeU) || 100;
  const unitsNeeded  = volMl * uPerMl;
  const mcgPerUnit   = uPerMl > 0 ? mcgPerMl/uPerMl : 0;
  const inpStyle = { width:'100%', padding:'8px 12px', borderRadius:8, border:'1px solid #444', background:'#111', color:'#f5f5f5', fontSize:15, boxSizing:'border-box', outline:'none' };
  return (
    <div style={{ padding:'16px 16px 24px' }}>
      <h2 style={{ margin:'0 0 8px', fontSize:20 }}>Reconstitution Calculator</h2>
      <p style={{ fontSize:12, color:'#ccc', marginBottom:16 }}>Simple concentration converter. Does not constitute dosing advice.</p>
      <div style={{ background:'#1a1a1a', borderRadius:12, padding:16, border:'1px solid #333', marginBottom:16 }}>
        {[['Peptide amount in vial (mg)', vialMg, setVialMg],['Bacteriostatic water added (mL)', waterMl, setWaterMl]].map(([label,val,set]) => (
          <div key={label} style={{ marginBottom:12 }}>
            <label style={{ fontSize:13, display:'block', marginBottom:4 }}>{label}</label>
            <input type="number" min="0" step="0.01" value={val} onChange={e=>set(e.target.value)} style={inpStyle}/>
          </div>
        ))}
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:13, display:'block', marginBottom:4 }}>Desired research amount</label>
          <div style={{ display:'flex', gap:8 }}>
            <input type="number" min="0" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} style={{ ...inpStyle, flex:1 }}/>
            <select value={unit} onChange={e=>setUnit(e.target.value)} style={{ padding:'8px 10px', borderRadius:8, border:'1px solid #444', background:'#111', color:'#f5f5f5' }}>
              <option value="mcg">mcg</option><option value="mg">mg</option>
            </select>
          </div>
        </div>
        <div>
          <label style={{ fontSize:13, display:'block', marginBottom:4 }}>Syringe scale (units/mL)</label>
          <input type="number" min="1" step="1" value={syringeU} onChange={e=>setSyringeU(e.target.value)} style={inpStyle}/>
        </div>
      </div>
      <div style={{ background:'#1a1a1a', borderRadius:12, padding:16, border:'1px solid #333' }}>
        <h4 style={{ margin:'0 0 10px', fontSize:16 }}>Results</h4>
        <ul style={{ fontSize:13, lineHeight:1.9, listStyle:'none', padding:0, margin:0 }}>
          <li>Concentration: <strong>{mgPerMl.toFixed(3)} mg/mL</strong> ({mcgPerMl.toFixed(1)} mcg/mL)</li>
          <li>mcg per 0.01 mL: <strong>{(mcgPerMl*0.01).toFixed(1)} mcg</strong></li>
          <li>mcg per unit (U-100): <strong>{mcgPerUnit.toFixed(1)} mcg</strong></li>
          <li>Volume needed: <strong>{volMl.toFixed(3)} mL</strong></li>
          <li>Units needed: <strong>{unitsNeeded.toFixed(1)} units</strong></li>
        </ul>
      </div>
      <p style={{ fontSize:12, color:'#f5c518', marginTop:12 }}>Disclaimer: This tool performs concentration and volume conversions only. It does not recommend dosing, frequency or medical treatment.</p>
    </div>
  );
}

// ─── LOG ──────────────────────────────────────────────────
function LogScreen({ logs, setLogs }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date:'', peptideName:'', amount:'', notes:'' });
  const inpStyle = { width:'100%', padding:'8px 12px', borderRadius:8, border:'1px solid #444', background:'#111', color:'#f5f5f5', fontSize:14, boxSizing:'border-box', outline:'none' };
  const save = () => {
    if (!form.peptideName) { alert('Please enter a peptide name.'); return; }
    setLogs(prev => [...prev, { id:Date.now().toString(), date:form.date||new Date().toISOString().split('T')[0], peptideName:form.peptideName, amount:form.amount, notes:form.notes }]);
    setForm({ date:'', peptideName:'', amount:'', notes:'' }); setShowForm(false);
  };
  return (
    <div style={{ padding:'16px 16px 24px' }}>
      <h2 style={{ margin:'0 0 12px', fontSize:20 }}>Research Log</h2>
      <button onClick={() => setShowForm(true)} style={{ marginBottom:12, padding:'8px 14px', background:'#3fa9f5', color:'#161616', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer' }}>+ Add Log Entry</button>
      {showForm && (
        <div style={{ background:'#1a1a1a', borderRadius:12, padding:16, marginBottom:16, border:'1px solid #333' }}>
          {[['Date','date','date',undefined],['Peptide name','text','peptideName',undefined],['Research amount (optional)','text','amount','e.g. 500 mcg']].map(([label,type,key,ph]) => (
            <div key={key} style={{ marginBottom:10 }}>
              <label style={{ fontSize:13, display:'block', marginBottom:4 }}>{label}</label>
              <input type={type} value={form[key]} placeholder={ph} onChange={e=>setForm({...form,[key]:e.target.value})} style={inpStyle}/>
            </div>
          ))}
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:13, display:'block', marginBottom:4 }}>Notes (optional)</label>
            <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={3} style={{ ...inpStyle, resize:'vertical' }}/>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={save} style={{ flex:1, padding:'8px 12px', background:'#3fa9f5', border:'none', borderRadius:8, color:'#161616', fontWeight:600, cursor:'pointer' }}>Save</button>
            <button onClick={() => setShowForm(false)} style={{ flex:1, padding:'8px 12px', background:'#444', border:'none', borderRadius:8, color:'#fff', fontWeight:600, cursor:'pointer' }}>Cancel</button>
          </div>
        </div>
      )}
      {logs.length === 0 && <p style={{ color:'#888' }}>No log entries yet.</p>}
      {logs.slice().sort((a,b)=>b.date.localeCompare(a.date)).map(entry => (
        <div key={entry.id} style={{ background:'#1a1a1a', borderRadius:12, padding:14, marginBottom:8, border:'1px solid #333' }}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontWeight:600, fontSize:14 }}>{entry.peptideName}</div>
              <div style={{ fontSize:12, color:'#aaa' }}>{entry.date}</div>
              {entry.amount && <div style={{ fontSize:12, color:'#ccc' }}>Amount: {entry.amount}</div>}
              {entry.notes && <div style={{ fontSize:12, color:'#ccc', marginTop:4 }}>{entry.notes.length>80?entry.notes.slice(0,77)+'…':entry.notes}</div>}
            </div>
            <button onClick={() => { if(window.confirm('Delete this log entry?')) setLogs(prev=>prev.filter(e=>e.id!==entry.id)); }} style={{ background:'transparent', border:'none', color:'#d90429', fontSize:18, cursor:'pointer' }}>🗑️</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── INVENTORY ────────────────────────────────────────────
function InventoryScreen({ inventory, setInventory }) {
  const empty = { name:'', vialAmountMg:'', bacWaterMl:'', dateReceived:'', expirationDate:'', remainingMg:'', storageLocation:'', notes:'' };
  const [showForm, setShowForm] = useState(false);
  const [item, setItem] = useState(empty);
  const inpStyle = { width:'100%', padding:'8px 12px', borderRadius:8, border:'1px solid #444', background:'#111', color:'#f5f5f5', fontSize:14, boxSizing:'border-box', outline:'none' };
  const save = () => {
    if (!item.name) { alert('Please enter a peptide name.'); return; }
    setInventory(prev=>[...prev,{id:Date.now().toString(),...item}]); setItem(empty); setShowForm(false);
  };
  return (
    <div style={{ padding:'16px 16px 24px' }}>
      <h2 style={{ margin:'0 0 12px', fontSize:20 }}>Inventory</h2>
      <button onClick={()=>setShowForm(true)} style={{ marginBottom:12, padding:'8px 14px', background:'#3fa9f5', color:'#161616', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer' }}>+ Add Item</button>
      {showForm && (
        <div style={{ background:'#1a1a1a', borderRadius:12, padding:16, marginBottom:16, border:'1px solid #333' }}>
          {[['Peptide name','text','name'],['Storage location (optional)','text','storageLocation']].map(([label,type,key]) => (
            <div key={key} style={{ marginBottom:10 }}>
              <label style={{ fontSize:13, display:'block', marginBottom:4 }}>{label}</label>
              <input type={type} value={item[key]} onChange={e=>setItem({...item,[key]:e.target.value})} style={inpStyle}/>
            </div>
          ))}
          <div style={{ display:'flex', gap:8, marginBottom:10 }}>
            {[['Vial amount (mg)','vialAmountMg'],['Diluent added (mL)','bacWaterMl'],['Remaining (mg)','remainingMg']].map(([label,key]) => (
              <div key={key} style={{ flex:1 }}>
                <label style={{ fontSize:12, display:'block', marginBottom:4 }}>{label}</label>
                <input type="number" value={item[key]} onChange={e=>setItem({...item,[key]:e.target.value})} style={{ ...inpStyle, fontSize:13 }}/>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:8, marginBottom:10 }}>
            {[['Date received','dateReceived'],['Expiration date','expirationDate']].map(([label,key]) => (
              <div key={key} style={{ flex:1 }}>
                <label style={{ fontSize:12, display:'block', marginBottom:4 }}>{label}</label>
                <input type="date" value={item[key]} onChange={e=>setItem({...item,[key]:e.target.value})} style={{ ...inpStyle, fontSize:13 }}/>
              </div>
            ))}
          </div>
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:13, display:'block', marginBottom:4 }}>Notes (optional)</label>
            <textarea value={item.notes} onChange={e=>setItem({...item,notes:e.target.value})} rows={3} style={{ ...inpStyle, resize:'vertical' }}/>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={save} style={{ flex:1, padding:'8px 12px', background:'#3fa9f5', border:'none', borderRadius:8, color:'#161616', fontWeight:600, cursor:'pointer' }}>Save</button>
            <button onClick={()=>setShowForm(false)} style={{ flex:1, padding:'8px 12px', background:'#444', border:'none', borderRadius:8, color:'#fff', fontWeight:600, cursor:'pointer' }}>Cancel</button>
          </div>
        </div>
      )}
      {inventory.length===0 && <p style={{ color:'#888' }}>No inventory items yet.</p>}
      {inventory.map(inv => (
        <div key={inv.id} style={{ background:'#1a1a1a', borderRadius:12, padding:14, marginBottom:8, border:'1px solid #333' }}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontWeight:600, fontSize:14 }}>{inv.name}</div>
              {inv.vialAmountMg   && <div style={{ fontSize:12, color:'#ccc' }}>Vial: {inv.vialAmountMg} mg</div>}
              {inv.bacWaterMl     && <div style={{ fontSize:12, color:'#ccc' }}>Diluent: {inv.bacWaterMl} mL</div>}
              {inv.remainingMg    && <div style={{ fontSize:12, color:'#ccc' }}>Remaining: {inv.remainingMg} mg</div>}
              {inv.expirationDate && <div style={{ fontSize:12, color:'#f5c518' }}>Expires: {inv.expirationDate}</div>}
              {inv.storageLocation && <div style={{ fontSize:12, color:'#aaa' }}>Location: {inv.storageLocation}</div>}
            </div>
            <button onClick={()=>{ if(window.confirm('Delete this item?')) setInventory(prev=>prev.filter(i=>i.id!==inv.id)); }} style={{ background:'transparent', border:'none', color:'#d90429', fontSize:18, cursor:'pointer' }}>🗑️</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────
function SettingsScreen({ logs, inventory, favourites, setLogs, setInventory, setFavourites }) {
  const [exportData, setExportData] = useState('');
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState(null);
  const taStyle = { width:'100%', padding:'8px 12px', borderRadius:8, border:'1px solid #444', background:'#111', color:'#f5f5f5', fontSize:13, boxSizing:'border-box', resize:'vertical', outline:'none' };
  const handleImport = () => {
    try {
      const data = JSON.parse(importText);
      if (data.logs) setLogs(data.logs);
      if (data.inventory) setInventory(data.inventory);
      if (data.favourites) setFavourites(data.favourites);
      setImportError(null); alert('Data imported successfully!');
    } catch { setImportError('Invalid JSON. Please check your input.'); }
  };
  return (
    <div style={{ padding:'16px 16px 24px' }}>
      <h2 style={{ margin:'0 0 12px', fontSize:20 }}>Settings</h2>
      <section style={{ marginBottom:24 }}>
        <h3 style={{ fontSize:16, margin:'0 0 12px' }}>Backup &amp; Restore</h3>
        <button onClick={() => setExportData(JSON.stringify({logs,inventory,favourites},null,2))}
          style={{ padding:'8px 14px', background:'#3fa9f5', border:'none', borderRadius:8, color:'#161616', fontWeight:600, cursor:'pointer' }}>Export Data</button>
        {exportData && (
          <>
            <p style={{ fontSize:12, color:'#aaa', marginTop:8 }}>Copy this JSON to back up your data:</p>
            <textarea value={exportData} readOnly rows={5} style={taStyle}/>
          </>
        )}
        <div style={{ marginTop:16 }}>
          <label style={{ fontSize:13, display:'block', marginBottom:4 }}>Import Data (paste backup JSON)</label>
          <textarea value={importText} onChange={e=>setImportText(e.target.value)} rows={5} style={taStyle}/>
          {importError && <p style={{ color:'#d90429', fontSize:12, marginTop:4 }}>{importError}</p>}
          <button onClick={handleImport} style={{ marginTop:8, padding:'8px 14px', background:'#3fa9f5', border:'none', borderRadius:8, color:'#161616', fontWeight:600, cursor:'pointer' }}>Import Data</button>
        </div>
      </section>
      <section>
        <h3 style={{ fontSize:16, margin:'0 0 10px' }}>Disclaimer</h3>
        <p style={{ fontSize:12, color:'#f5c518' }}>This application is for educational research tracking only. It does not provide medical advice, diagnosis, treatment or dosing recommendations. Always consult a licensed medical professional for health decisions.</p>
        <p style={{ fontSize:12, color:'#888', marginTop:8 }}>Peptides listed include both approved and unapproved substances. Approved medications are noted. All other entries are for research reference only.</p>
      </section>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────
export default function App() {
  const [tab, setTab]                           = useState('dashboard');
  const [peptides]                              = useState(PEPTIDES_DATA);
  const [selectedPeptide, setSelectedPeptide]   = useState(null);
  const [favourites, setFavourites]             = useState(() => { try { return JSON.parse(localStorage.getItem('peptideFavourites'))||[]; } catch { return []; } });
  const [logs, setLogs]                         = useState(() => { try { return JSON.parse(localStorage.getItem('peptideLogs'))||[]; } catch { return []; } });
  const [inventory, setInventory]               = useState(() => { try { return JSON.parse(localStorage.getItem('peptideInventory'))||[]; } catch { return []; } });

  useEffect(() => { try { localStorage.setItem('peptideFavourites', JSON.stringify(favourites)); } catch {} }, [favourites]);
  useEffect(() => { try { localStorage.setItem('peptideLogs', JSON.stringify(logs)); } catch {} }, [logs]);
  useEffect(() => { try { localStorage.setItem('peptideInventory', JSON.stringify(inventory)); } catch {} }, [inventory]);

  const touchRef = useRef({ x:0, y:0, active:false });
  const goToTab  = useCallback(dir => {
    const idx = TABS.findIndex(t => t.id === tab);
    if (idx === -1) return;
    const next = dir==='left' ? Math.min(idx+1,TABS.length-1) : Math.max(idx-1,0);
    if (next !== idx) setTab(TABS[next].id);
  }, [tab]);
  const onTouchStart = useCallback(e => {
    if (e.touches.length!==1||isInteractiveTarget(e.target)) return;
    touchRef.current = { x:e.touches[0].clientX, y:e.touches[0].clientY, active:true };
  }, []);
  const onTouchEnd = useCallback(e => {
    if (!touchRef.current.active||isInteractiveTarget(e.target)) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    touchRef.current.active = false;
    if (Math.abs(dx)<50||Math.abs(dy)>45) return;
    goToTab(dx<0?'left':'right');
  }, [goToTab]);

  const renderScreen = () => {
    const shared = { peptides, favourites, setFavourites, selectedPeptide, setSelectedPeptide, setTab };
    switch (tab) {
      case 'dashboard':  return <DashboardScreen {...shared} logs={logs} inventory={inventory}/>;
      case 'peptides':   return <PeptidesScreen {...shared}/>;
      case 'calculator': return <CalculatorScreen/>;
      case 'log':        return <LogScreen logs={logs} setLogs={setLogs}/>;
      case 'inventory':  return <InventoryScreen inventory={inventory} setInventory={setInventory}/>;
      case 'settings':   return <SettingsScreen logs={logs} inventory={inventory} favourites={favourites} setLogs={setLogs} setInventory={setInventory} setFavourites={setFavourites}/>;
      default:           return <DashboardScreen {...shared} logs={logs} inventory={inventory}/>;
    }
  };

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', background:'#0d0d0d', color:'#f5f5f5', maxWidth:430, margin:'0 auto', overflow:'hidden', position:'relative' }}>
      <TopNav tab={tab} setTab={setTab} favourites={favourites}/>
      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch' }}>
        {renderScreen()}
      </div>
    </div>
  );
}
