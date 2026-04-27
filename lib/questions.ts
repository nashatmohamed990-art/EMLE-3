// ═══════════════════════════════════════════════════════════════
//  EMLE QBank — Question Bank Data
//  18 high-yield clinical vignettes (sample set)
// ═══════════════════════════════════════════════════════════════

import type { Question } from "@/types";

export const QUESTION_BANK: Question[] = [

  // ─── INTERNAL MEDICINE ──────────────────────────────────────

  {
    id: "IM-001",
    subject: "Internal Medicine",
    system: "Pulmonology",
    topic: "Pulmonary Embolism",
    difficulty: "Medium",
    stem: `A 55-year-old man presents to the emergency department with sudden-onset dyspnea and right-sided pleuritic chest pain. He returned from a 14-hour flight 3 days ago. On examination: BP 118/76 mmHg, HR 112 bpm, RR 22/min, SpO₂ 91% on room air. Chest auscultation reveals a pleural rub on the right. ECG shows sinus tachycardia. D-dimer is markedly elevated. Troponin is mildly positive. What is the most appropriate NEXT step in management?`,
    options: [
      { id: "A", text: "Start IV broad-spectrum antibiotics immediately" },
      { id: "B", text: "Administer unfractionated heparin and obtain CT pulmonary angiography (CTPA)" },
      { id: "C", text: "Perform immediate systemic thrombolysis with tPA" },
      { id: "D", text: "Obtain bedside echocardiography and observe" },
      { id: "E", text: "Start oral aspirin and supplemental oxygen only" },
    ],
    correctId: "B",
    explanationTitle: "Pulmonary Embolism — Hemodynamically Stable",
    explanation: `This patient presents with a classic picture of acute pulmonary embolism (PE): sudden dyspnea, pleuritic chest pain, recent prolonged immobility (long flight), tachycardia, hypoxia, and elevated D-dimer. The mild troponin elevation suggests right ventricular strain (submassive PE).\n\n**Why B is correct:** In a hemodynamically STABLE patient with suspected PE, the management is to anticoagulate immediately with unfractionated heparin (UFH) or LMWH to prevent clot propagation, and then confirm the diagnosis with CT Pulmonary Angiography (CTPA) — the gold standard for diagnosing PE.\n\n**Why not C (thrombolysis)?** Systemic thrombolysis (tPA) is reserved for MASSIVE PE, defined by persistent hemodynamic instability (SBP <90 mmHg despite resuscitation). This patient is normotensive.\n\n**Why not A?** Antibiotics treat bacterial pneumonia, not PE. Although PE can present with fever, the clinical picture here strongly points to PE, not infection.\n\n**Key Pearl:** Wells Score helps pre-test probability. Elevated D-dimer is sensitive but not specific — it rules OUT PE if low probability. CTPA confirms the diagnosis.`,
    keyPoint: "Stable PE → Anticoagulate (heparin) + confirm with CTPA. Thrombolysis only for hemodynamically unstable massive PE.",
    tags: ["PE", "DVT", "anticoagulation", "CTPA", "Wells score"],
  },

  {
    id: "IM-002",
    subject: "Internal Medicine",
    system: "Cardiology",
    topic: "Acute STEMI",
    difficulty: "Medium",
    stem: `A 62-year-old hypertensive diabetic man presents with crushing central chest pain radiating to the left arm for 45 minutes. He is diaphoretic and anxious. BP 145/90 mmHg, HR 88 bpm, SpO₂ 97%. ECG shows 3 mm ST elevation in leads II, III, and aVF with reciprocal ST depression in I and aVL. Troponin is pending. The hospital has a cath lab available 24/7. What is the most appropriate management?`,
    options: [
      { id: "A", text: "Administer IV thrombolytics (streptokinase) immediately" },
      { id: "B", text: "Start IV heparin infusion, aspirin, and clopidogrel, then URGENT primary PCI within 90 minutes" },
      { id: "C", text: "Order urgent echocardiography to assess wall motion before any intervention" },
      { id: "D", text: "Administer aspirin and nitroglycerin, then admit to CCU for monitoring" },
      { id: "E", text: "Repeat ECG in 30 minutes to confirm persistent changes before acting" },
    ],
    correctId: "B",
    explanationTitle: "Inferior STEMI — Primary PCI",
    explanation: `The ECG shows inferior STEMI (ST elevation in II, III, aVF) with reciprocal changes in lateral leads. This is a true occlusion of the Right Coronary Artery (RCA) until proven otherwise.\n\n**Why B is correct:** When a PCI-capable hospital is available, PRIMARY PCI is the gold standard reperfusion strategy with a door-to-balloon time goal of <90 minutes. Dual antiplatelet therapy (aspirin + P2Y12 inhibitor like clopidogrel or ticagrelor) plus anticoagulation (heparin) is started immediately.\n\n**Why not A (thrombolytics)?** Thrombolytics are the alternative ONLY when primary PCI is NOT available within 120 minutes. If a cath lab is available within 90 min, thrombolytics are inferior.\n\n**Why not C?** Echo is NOT required before reperfusion in STEMI — it wastes critical time.\n\n**Key Pearl:** In inferior STEMI, always check right-sided leads (V3R, V4R) to rule out RIGHT VENTRICULAR infarction. If RVI is present, AVOID nitrates (cause severe hypotension) and give IV fluids instead.`,
    keyPoint: "Inferior STEMI + PCI-capable hospital → Primary PCI <90 min. In inferior STEMI, always check right-sided leads to exclude RVI before giving nitrates.",
    tags: ["STEMI", "PCI", "inferior MI", "RCA", "dual antiplatelet"],
  },

  {
    id: "IM-003",
    subject: "Internal Medicine",
    system: "Endocrinology",
    topic: "Diabetic Ketoacidosis",
    difficulty: "Hard",
    stem: `A 19-year-old known type 1 diabetic female is brought to the ED with 2-day history of vomiting, abdominal pain, and confusion. She has not taken her insulin for 3 days. On exam: BP 88/60 mmHg, HR 126 bpm, RR 30/min (Kussmaul breathing), temp 37.4°C. She is dehydrated. Blood glucose: 480 mg/dL. ABG: pH 7.08, HCO₃ 8 mEq/L, PaCO₂ 20 mmHg. Serum K⁺: 5.8 mEq/L (before treatment). What is the MOST critical consideration when initiating insulin therapy?`,
    options: [
      { id: "A", text: "Withhold insulin until glucose drops below 400 mg/dL with fluids alone" },
      { id: "B", text: "Start insulin immediately via IV bolus to rapidly correct hyperglycemia" },
      { id: "C", text: "Replace potassium FIRST if K⁺ < 3.5 mEq/L, then start insulin; begin K⁺ replacement alongside insulin if K⁺ is 3.5–5.5" },
      { id: "D", text: "Administer sodium bicarbonate IV to correct acidosis before starting insulin" },
      { id: "E", text: "Do not give fluids until insulin is started to avoid cerebral edema" },
    ],
    correctId: "C",
    explanationTitle: "DKA Management — Potassium Pitfall",
    explanation: `This is severe DKA (pH <7.1, glucose >400, HCO₃ <10, Kussmaul breathing, altered consciousness). The initial K⁺ appears HIGH due to acidosis driving K⁺ out of cells.\n\n**Why C is correct:** This is the most critical DKA pitfall. Insulin will drive K⁺ BACK into cells, rapidly dropping serum K⁺. This can cause fatal hypokalemic cardiac arrhythmias.\n\n**DKA Potassium Protocol:**\n- K⁺ < 3.5 mEq/L → Replace K⁺ FIRST, DELAY insulin\n- K⁺ 3.5–5.5 mEq/L → Start insulin AND concurrent K⁺ replacement\n- K⁺ > 5.5 mEq/L → Start insulin, hold K⁺ replacement, monitor\n\n**Why not A?** Insulin is the definitive treatment — fluids alone do not resolve ketoacidosis.\n**Why not B?** IV insulin BOLUS is not given in DKA. Start with normal saline fluids first, then continuous insulin infusion at 0.1 units/kg/hr.\n**Why not D?** Bicarb is controversial and not routinely indicated. It can worsen intracellular acidosis and is only considered if pH < 6.9.\n\n**The DKA treatment order:** Fluids → Potassium check → Insulin infusion → Electrolyte monitoring every 2 hours.`,
    keyPoint: "In DKA, ALWAYS check K⁺ before starting insulin. If K⁺ <3.5, replace potassium FIRST — insulin will drive K⁺ intracellularly and cause fatal arrhythmia.",
    tags: ["DKA", "diabetes", "insulin", "hypokalemia", "ketoacidosis"],
  },

  {
    id: "IM-004",
    subject: "Internal Medicine",
    system: "Nephrology",
    topic: "Nephrotic Syndrome",
    difficulty: "Medium",
    stem: `A 6-year-old boy presents with puffy eyes and swollen legs for 2 weeks. His parents note frothy urine. On exam: periorbital edema, ascites, pitting pedal edema. BP 100/65 mmHg (normal). Urinalysis: 4+ proteinuria, no hematuria, no casts. Serum albumin: 1.8 g/dL. Serum cholesterol: 380 mg/dL. Creatinine: 0.6 mg/dL. What is the most likely diagnosis and the FIRST-LINE treatment?`,
    options: [
      { id: "A", text: "IgA nephropathy — start ACE inhibitor" },
      { id: "B", text: "Nephrotic syndrome due to Minimal Change Disease — start oral prednisolone" },
      { id: "C", text: "Post-streptococcal glomerulonephritis — start penicillin" },
      { id: "D", text: "Focal Segmental Glomerulosclerosis — start cyclosporine" },
      { id: "E", text: "Membranous nephropathy — start rituximab" },
    ],
    correctId: "B",
    explanationTitle: "Pediatric Nephrotic Syndrome — Minimal Change Disease",
    explanation: `This child presents with the classic triad of nephrotic syndrome: heavy proteinuria (>3.5 g/day), hypoalbuminemia, and edema — plus hyperlipidemia (the body synthesizes more lipoproteins to compensate for protein loss).\n\n**Why B is correct:** In children aged 1–8 years, the most common cause of nephrotic syndrome is Minimal Change Disease (MCD), also called Nil Disease. Notably, there is NO hematuria, normal BP, and normal creatinine — consistent with pure nephrotic (not nephritic) syndrome.\n\nMCD is exquisitely responsive to steroids. First-line = oral prednisolone (4 weeks full dose, then taper). Most children achieve complete remission within 2–4 weeks.\n\n**Why not C (Post-strep GN)?** That presents as NEPHRITIC syndrome: hematuria, RBC casts, hypertension, elevated creatinine. This child has NONE of those.\n\n**Nephrotic vs Nephritic memory aid:**\n- **NephrOTIC** = pROTein (massive proteinuria, edema, low albumin, hyperlipidemia)\n- **NephrITIC** = hematuRIa (blood in urine, hypertension, oliguria, casts)\n\n**Key Pearl:** Renal biopsy is NOT needed in a child with typical nephrotic syndrome — empirical steroids are first-line. Biopsy if steroid-resistant, atypical age, or hypertension.`,
    keyPoint: "Pediatric nephrotic syndrome = Minimal Change Disease until proven otherwise → First-line is oral prednisolone. Renal biopsy not required initially.",
    tags: ["nephrotic syndrome", "minimal change", "proteinuria", "edema", "steroids"],
  },

  {
    id: "IM-005",
    subject: "Internal Medicine",
    system: "Pulmonology",
    topic: "Community-Acquired Pneumonia",
    difficulty: "Easy",
    stem: `A 45-year-old previously healthy man presents with 4-day history of productive cough with rust-colored sputum, fever (39.2°C), and right-sided pleuritic chest pain. On exam: RR 20/min, SpO₂ 96%, dullness to percussion and bronchial breathing at the right lower zone. CXR shows right lower lobe consolidation. WBC 14,000/μL. What is the MOST LIKELY causative organism?`,
    options: [
      { id: "A", text: "Mycoplasma pneumoniae" },
      { id: "B", text: "Klebsiella pneumoniae" },
      { id: "C", text: "Streptococcus pneumoniae" },
      { id: "D", text: "Legionella pneumophila" },
      { id: "E", text: "Staphylococcus aureus" },
    ],
    correctId: "C",
    explanationTitle: "Community-Acquired Pneumonia — Typical Organism",
    explanation: `The classic presentation of lobar pneumonia: acute onset, high fever, RUST-COLORED (rusty) sputum, pleuritic chest pain, lobar consolidation on CXR, leukocytosis — this is the textbook picture of Streptococcus pneumoniae (pneumococcal pneumonia).\n\n**Organism clues in pneumonia:**\n- **S. pneumoniae** → Most common CAP, rusty sputum, lobar consolidation, elderly/post-splenectomy\n- **Mycoplasma** → Atypical (walking) pneumonia, young adults, dry cough, patchy infiltrates, preceded by sore throat + headache\n- **Legionella** → Middle-aged/elderly, air conditioners, water, hyponatremia, diarrhea, CNS symptoms\n- **Klebsiella** → Alcoholics, aspiration, currant-jelly sputum, upper lobe (cavitates)\n- **Staph aureus** → Post-influenza, IV drug users, hospital-acquired, cavitating lesions\n\n**Treatment for CAP in healthy adult:** Amoxicillin OR Amoxicillin/Clavulanate. Add a macrolide for atypical coverage if needed.\n\n**Hospitalization criteria:** CURB-65 score ≥2 → consider hospital admission.`,
    keyPoint: "Rusty sputum + lobar consolidation = S. pneumoniae until proven otherwise (most common CAP pathogen).",
    tags: ["pneumonia", "CAP", "S. pneumoniae", "lobar consolidation", "CURB-65"],
  },

  // ─── GENERAL SURGERY ────────────────────────────────────────

  {
    id: "SUR-001",
    subject: "General Surgery",
    system: "Gastrointestinal",
    topic: "Acute Appendicitis",
    difficulty: "Easy",
    stem: `A 17-year-old male presents with 24-hour history of periumbilical pain that has migrated to the right iliac fossa. He has nausea and low-grade fever (37.8°C). On examination: McBurney's point tenderness, positive Rovsing's sign (pain in RIF when LIF is palpated), involuntary guarding. WBC: 14,500/μL with left shift. His Alvarado score is 8. What is the MOST appropriate management?`,
    options: [
      { id: "A", text: "IV antibiotics alone (amoxicillin/clavulanate) for 5 days, then reassess" },
      { id: "B", text: "Urgent CT scan of the abdomen and pelvis before any intervention" },
      { id: "C", text: "Laparoscopic appendectomy" },
      { id: "D", text: "Ultrasound abdomen and pelvis, then await results before treating" },
      { id: "E", text: "Diagnostic laparotomy under general anaesthesia" },
    ],
    correctId: "C",
    explanationTitle: "Acute Appendicitis — Surgical Management",
    explanation: `This patient has a classic, high-probability acute appendicitis (Alvarado score 7–10 = highly likely appendicitis). The Alvarado score uses: Migration of pain (2pts) + Anorexia (1pt) + Nausea/vomiting (1pt) + RIF tenderness (2pts) + Rovsing sign (1pt) + Fever (1pt) + Leukocytosis (2pts).\n\n**Why C is correct:** An Alvarado score ≥7, combined with classic clinical signs, warrants DIRECT surgical management without further imaging delay. Laparoscopic appendectomy is the standard of care — less pain, shorter recovery, lower wound infection rate vs open surgery.\n\n**Why not B?** CT is useful in ATYPICAL presentations (obese patients, elderly, reproductive-age women where ovarian pathology must be excluded). With a score of 8 and classic findings, CT adds radiation exposure and delay without changing management.\n\n**Why not A (antibiotics alone)?** While antibiotics are studied as an alternative for uncomplicated appendicitis in adults, surgical management is still the gold standard, especially in a young male with high score.\n\n**Complications:** Perforation risk increases >24h. Perforated appendicitis → peritonitis, abscess. Risk highest in children and elderly (who often present atypically).`,
    keyPoint: "Alvarado ≥7 + classic signs → proceed to laparoscopic appendectomy without CT delay. CT reserved for atypical presentations.",
    tags: ["appendicitis", "Alvarado", "McBurney", "Rovsing", "laparoscopy"],
  },

  {
    id: "SUR-002",
    subject: "General Surgery",
    system: "Gastrointestinal",
    topic: "Small Bowel Obstruction",
    difficulty: "Medium",
    stem: `A 68-year-old woman with a history of three previous abdominal surgeries presents with colicky central abdominal pain, vomiting (bilious), and inability to pass flatus for 18 hours. Abdomen is distended with high-pitched bowel sounds. AXR shows multiple dilated small bowel loops with air-fluid levels and a "ladder pattern." Rectal examination is normal. WBC is mildly elevated. What is the MOST COMMON cause of this presentation in adults?`,
    options: [
      { id: "A", text: "Incarcerated inguinal hernia" },
      { id: "B", text: "Colorectal carcinoma" },
      { id: "C", text: "Adhesions from previous surgeries" },
      { id: "D", text: "Crohn's disease stricture" },
      { id: "E", text: "Intussusception" },
    ],
    correctId: "C",
    explanationTitle: "Small Bowel Obstruction — Adhesions",
    explanation: `The presentation is classic mechanical small bowel obstruction (SBO): colicky pain, bilious vomiting, distension, high-pitched bowel sounds, no flatus — and the AXR showing dilated small bowel loops with air-fluid levels.\n\n**Why C is correct:** Adhesions from previous abdominal surgery are the MOST COMMON cause of SBO in adults, accounting for 60–75% of all cases. This patient has had THREE prior surgeries — making adhesions overwhelmingly likely.\n\n**Causes of SBO by frequency (adult):**\n1. **Adhesions** (60–75%) ← most common overall\n2. **Hernias** (15–20%) ← most common in patients with NO prior surgery\n3. **Malignancy** (5–10%)\n4. **Crohn's disease** (<5%)\n\n**Initial management of SBO:**\n- NPO, IV fluids, NG tube (decompression)\n- Serial AXR or CT abdomen to monitor\n- If closed-loop obstruction, strangulation, or failure to resolve in 24–48h → SURGERY\n\n**Red flags requiring urgent surgery:** Peritonitis, fever, leukocytosis (strangulation), complete obstruction.`,
    keyPoint: "SBO = Adhesions most commonly (especially post-surgical). Always rule out strangulation (peritonitis, fever, lactic acidosis) → requires emergency surgery.",
    tags: ["small bowel obstruction", "adhesions", "ileus", "air-fluid levels", "NG tube"],
  },

  {
    id: "SUR-003",
    subject: "General Surgery",
    system: "Vascular",
    topic: "Abdominal Aortic Aneurysm",
    difficulty: "Hard",
    stem: `A 72-year-old male heavy smoker is brought in by ambulance with sudden severe tearing abdominal pain radiating to the back, associated with syncope. BP 80/50 mmHg, HR 124 bpm, he is pale and diaphoretic. Abdomen is tender with a pulsatile mass palpable above the umbilicus. Ultrasound shows an aortic aneurysm 8 cm in diameter. What is the IMMEDIATE next step?`,
    options: [
      { id: "A", text: "CT angiography of the abdomen and pelvis to characterize the aneurysm" },
      { id: "B", text: "Two large-bore IV lines, O-negative blood transfusion, urgent surgical consult for emergency repair" },
      { id: "C", text: "IV labetalol to reduce aortic wall stress" },
      { id: "D", text: "Admit to ICU for aggressive fluid resuscitation until pressure stabilizes" },
      { id: "E", text: "MRI aorta for definitive pre-operative planning" },
    ],
    correctId: "B",
    explanationTitle: "Ruptured AAA — Surgical Emergency",
    explanation: `This is a RUPTURED ABDOMINAL AORTIC ANEURYSM (rAAA) — a surgical emergency with mortality >80% if untreated. Classic triad: (1) Sudden severe abdominal/back pain, (2) Pulsatile abdominal mass, (3) Hemodynamic shock.\n\n**Why B is correct:** There is NO TIME for CT in a patient with haemodynamic collapse and a clear diagnosis on bedside ultrasound. The only life-saving intervention is immediate surgical repair (open or EVAR - endovascular).\n\nManagement: Obtain IV access, type & crossmatch, O-negative blood (do not wait for crossmatch), keep SBP ~80–90 mmHg (permissive hypotension to prevent further rupture), and rush to the OR.\n\n**Why not A (CT)?** CT is appropriate for STABLE patients with SUSPECTED AAA or elective planning. In haemodynamic collapse, it is a death sentence.\n\n**AAA Screening:** Ultrasound screening recommended for all males age 65+ who have ever smoked.\n\n**Elective repair indications:** Diameter >5.5 cm in men, >5.0 cm in women, or rapid expansion >0.5 cm in 6 months or >1 cm/year.`,
    keyPoint: "Ruptured AAA = Classic triad + shock → Immediate surgical repair. No time for CT in unstable patients.",
    tags: ["AAA", "aortic aneurysm", "vascular emergency", "EVAR", "rupture"],
  },

  // ─── PEDIATRICS ─────────────────────────────────────────────

  {
    id: "PED-001",
    subject: "Pediatrics",
    system: "Neurology",
    topic: "Febrile Seizure",
    difficulty: "Easy",
    stem: `A 2-year-old boy is brought to the ED by his parents. They witnessed him have a generalized tonic-clonic seizure lasting 2 minutes at home while he had a temperature of 39°C. He has no seizure history. The seizure stopped spontaneously. He is now alert and responsive, with a post-ictal period over. Physical examination is normal including fontanelle, neck (no meningism), and neurological exam. Temperature 38.8°C. What is the MOST appropriate management?`,
    options: [
      { id: "A", text: "Urgent CT scan of the brain" },
      { id: "B", text: "Lumbar puncture to rule out meningitis" },
      { id: "C", text: "Start prophylactic phenobarbitone to prevent recurrence" },
      { id: "D", text: "Reassure the parents, treat the fever, and educate on febrile seizure management" },
      { id: "E", text: "EEG immediately to determine if this is epilepsy" },
    ],
    correctId: "D",
    explanationTitle: "Simple Febrile Seizure — Reassurance & Education",
    explanation: `This is a SIMPLE FEBRILE SEIZURE: age 6 months–5 years, fever present, generalized (not focal), <15 minutes, occurred ONCE in 24 hours, fully recovered. Normal neurological exam with no signs of meningitis.\n\n**Why D is correct:** Simple febrile seizures are BENIGN. They do NOT cause brain damage, do NOT predict epilepsy (only 2–4% develop epilepsy), and require NO investigation or anticonvulsant treatment.\n\nManagement: Treat the underlying cause of fever (antipyretics, identify source of infection), educate parents on management during a seizure (lay on side, nothing in mouth, time the seizure), and reassurance.\n\n**When to do LP:** Do lumbar puncture if signs of meningitis/encephalitis: bulging fontanelle, neck stiffness, petechiae, prolonged post-ictal state, meningism.\n\n**When to investigate further:**\n- COMPLEX febrile seizure: focal, >15 min, >1 in 24h, post-ictal neurological deficit → warrants EEG ± neuroimaging\n- Age <6 months or >5 years\n- Incomplete recovery\n\n**Recurrence:** ~30–40% of children will have another febrile seizure. Risk factors: age <18 months, family history, low-grade fever at onset of seizure.`,
    keyPoint: "Simple febrile seizure = BENIGN → No LP, No CT, No anticonvulsants. Reassure parents and treat the fever. Complex febrile seizures require investigation.",
    tags: ["febrile seizure", "pediatrics", "convulsion", "epilepsy", "fever"],
  },

  {
    id: "PED-002",
    subject: "Pediatrics",
    system: "Gastrointestinal",
    topic: "Intussusception",
    difficulty: "Medium",
    stem: `A 9-month-old infant is brought with episodic, severe colicky crying episodes for the past 12 hours. During crying episodes, the child draws up the knees. Between episodes, the child appears lethargic and pale. The mother noticed blood and mucus in the stool ("red currant jelly" stool). Abdomen is distended. A sausage-shaped mass is palpable in the right upper quadrant. What is the BEST initial treatment?`,
    options: [
      { id: "A", text: "Emergency laparotomy" },
      { id: "B", text: "IV antibiotics and bowel rest" },
      { id: "C", text: "Oral rehydration therapy and observation" },
      { id: "D", text: "Pneumatic or hydrostatic (air or water-soluble contrast) enema reduction" },
      { id: "E", text: "NG tube decompression and surgical consultation only" },
    ],
    correctId: "D",
    explanationTitle: "Intussusception — Enema Reduction",
    explanation: `Classic presentation of INTUSSUSCEPTION — the most common abdominal emergency in infants aged 3 months to 3 years: episodic colicky pain (child cries, draws knees up, then appears well between episodes), lethargy, "redcurrant jelly" stool (blood + mucus from mucosal ischemia), palpable sausage-shaped abdominal mass.\n\n**Why D is correct:** For a STABLE child with no signs of peritonitis or perforation, the treatment of choice is NON-SURGICAL REDUCTION via enema (pneumatic/air enema or hydrostatic/contrast enema). This is both diagnostic and therapeutic, with success rates of 80–90%.\n\n**Why not A (surgery)?** Surgical reduction is reserved for: failed enema reduction, signs of peritonitis/perforation, prolonged illness, or pathological lead point (Meckel's diverticulum, polyp, lymphoma).\n\n**The most common intussusception:** Ileocolic (terminal ileum into colon). Pathological lead points are found in older children and adults.\n\n**Ultrasound finding:** "Doughnut" or "target" sign — bowel within bowel.`,
    keyPoint: "Intussusception in infants = redcurrant jelly stool + sausage mass → Enema reduction (pneumatic/hydrostatic) is FIRST-LINE if no peritonitis. Surgery for failures or perforation.",
    tags: ["intussusception", "redcurrant jelly", "pediatric surgery", "enema reduction", "bowel obstruction"],
  },

  {
    id: "PED-003",
    subject: "Pediatrics",
    system: "Cardiology/Vasculitis",
    topic: "Kawasaki Disease",
    difficulty: "Hard",
    stem: `A 3-year-old boy has had fever for 7 days unresponsive to antibiotics. On examination: conjunctival injection (both eyes, non-purulent), cracked erythematous lips with strawberry tongue, diffuse macular rash on the trunk, cervical lymphadenopathy (1.5 cm), and erythema/edema of the hands and feet. WBC: 18,000/μL, CRP elevated, ESR 90 mm/hr. Echo shows mild coronary artery dilation. What is the MOST appropriate treatment?`,
    options: [
      { id: "A", text: "IV methylprednisolone alone" },
      { id: "B", text: "IV Immunoglobulin (IVIG) 2 g/kg + high-dose aspirin, followed by low-dose aspirin" },
      { id: "C", text: "Broad-spectrum IV antibiotics (ceftriaxone + vancomycin)" },
      { id: "D", text: "Oral prednisolone 2 mg/kg/day for 4 weeks" },
      { id: "E", text: "Supportive care only with NSAIDs; fever usually resolves spontaneously" },
    ],
    correctId: "B",
    explanationTitle: "Kawasaki Disease — IVIG + Aspirin",
    explanation: `KAWASAKI DISEASE (mucocutaneous lymph node syndrome) — a systemic vasculitis of UNKNOWN CAUSE, predominantly affecting children <5 years.\n\n**Diagnosis:** Fever ≥5 days PLUS ≥4 of 5 criteria:\n1. **C**onjunctival injection (non-purulent)\n2. **R**ash (polymorphous)\n3. **A**denopathy (cervical, unilateral, ≥1.5 cm)\n4. **S**trawberry tongue/lip cracking\n5. **H**ands/feet: erythema, edema (late desquamation)\n→ Mnemonic: **CRASH**\n\n**Why B is correct:** Single-dose IVIG 2 g/kg (over 10–12 hours) + HIGH-dose aspirin (30–50 mg/kg/day in divided doses during febrile phase) is the standard treatment. Once fever resolves, switch to LOW-dose aspirin (3–5 mg/kg/day) for anti-platelet effect, continued for 6–8 weeks (or longer if coronary aneurysms).\n\n**Most feared complication:** CORONARY ARTERY ANEURYSMS (in 25% if untreated, <5% if treated with IVIG). Can lead to thrombosis, MI, sudden death.\n\n**Note:** Aspirin is generally CONTRAINDICATED in children (Reye syndrome risk), but in Kawasaki disease it is SPECIFICALLY INDICATED.`,
    keyPoint: "Kawasaki Disease = CRASH criteria + fever ≥5 days → IVIG 2g/kg + high-dose aspirin. Most feared complication: coronary artery aneurysms.",
    tags: ["Kawasaki", "vasculitis", "IVIG", "coronary aneurysm", "pediatric fever"],
  },

  // ─── OB/GYN ──────────────────────────────────────────────────

  {
    id: "OBG-001",
    subject: "Obstetrics & Gynecology",
    system: "Early Pregnancy",
    topic: "Ectopic Pregnancy",
    difficulty: "Medium",
    stem: `A 26-year-old woman presents to the ED with sudden-onset severe right lower quadrant pain and vaginal spotting. Her last menstrual period was 7 weeks ago. She has a history of a previous episode of pelvic inflammatory disease. Urine pregnancy test: POSITIVE. On exam: BP 90/60 mmHg, HR 118 bpm, she appears in distress. Abdomen is rigid with guarding and rebound tenderness. Vaginal exam: cervical excitation tenderness (positive chandelier sign). What is the MOST appropriate IMMEDIATE action?`,
    options: [
      { id: "A", text: "Transvaginal ultrasound to locate the gestational sac" },
      { id: "B", text: "Serum β-hCG and repeat in 48 hours to check for doubling" },
      { id: "C", text: "Methotrexate IM injection for medical management of ectopic" },
      { id: "D", text: "Emergency surgical exploration (laparoscopy/laparotomy)" },
      { id: "E", text: "IV fluid resuscitation, blood transfusion, and observation" },
    ],
    correctId: "D",
    explanationTitle: "Ruptured Ectopic Pregnancy — Surgical Emergency",
    explanation: `This patient has a RUPTURED ECTOPIC PREGNANCY with haemodynamic instability — a life-threatening surgical emergency. Positive pregnancy test + hemodynamic shock + peritonitis (rigid abdomen, guarding, chandelier sign) = ruptured ectopic until proven otherwise.\n\n**Why D is correct:** Haemodynamic INSTABILITY means NO TIME for ultrasound confirmation. Go directly to emergency surgery. Simultaneous resuscitation with IV fluids + blood products while rushing to the OR.\n\n**Why not A (US)?** TVS is appropriate for STABLE patients with suspected (unruptured) ectopic to confirm location. With BP 90/60 and peritonitis, delay is fatal.\n\n**Why not C (methotrexate)?** MTX is for UNRUPTURED, STABLE ectopics: β-hCG <5,000, small tube, no cardiac activity, no rupture.\n\n**Risk factors for ectopic:** Previous PID, previous ectopic, previous tubal surgery, IUD use, assisted reproduction.\n\n**Key Pearl:** In any woman of reproductive age with abdominal pain → check urine pregnancy test FIRST. "Never call a woman's pregnancy test negative until you have the result."`,
    keyPoint: "Ruptured ectopic + hemodynamic instability = Surgical emergency (no time for imaging). Stable ectopic = TVS to confirm → medical (MTX) or surgical management.",
    tags: ["ectopic pregnancy", "PID", "chandelier sign", "ruptured ectopic", "methotrexate"],
  },

  {
    id: "OBG-002",
    subject: "Obstetrics & Gynecology",
    system: "Obstetrics",
    topic: "Pre-eclampsia",
    difficulty: "Medium",
    stem: `A 32-year-old primigravida at 34 weeks gestation presents with headache, visual disturbances (blurred vision), and epigastric pain. BP: 158/104 mmHg on two readings 4 hours apart. Urinalysis: 3+ proteinuria. Serum creatinine 1.0 mg/dL, platelets 88,000/μL, ALT 120 U/L (elevated), LDH elevated. What is the CORRECT diagnosis and definitive treatment?`,
    options: [
      { id: "A", text: "Gestational hypertension — antihypertensives and close monitoring" },
      { id: "B", text: "Pre-eclampsia without severe features — expectant management until 37 weeks" },
      { id: "C", text: "HELLP syndrome — delivery is the definitive treatment; give IV magnesium sulfate" },
      { id: "D", text: "Chronic hypertension — increase antihypertensive dose" },
      { id: "E", text: "ITP (immune thrombocytopenic purpura) — IV steroids and platelet transfusion" },
    ],
    correctId: "C",
    explanationTitle: "HELLP Syndrome — Delivery is the Cure",
    explanation: `This patient has HELLP SYNDROME — a severe variant of pre-eclampsia:\n- **H**emolysis (elevated LDH)\n- **E**levated **L**iver enzymes (ALT elevated, epigastric pain → hepatic involvement)\n- **L**ow **P**latelets (thrombocytopenia <100,000)\n\nWith BP ≥160/110, symptoms (headache, visual changes, epigastric pain), AND HELLP criteria — this is severe pre-eclampsia/HELLP.\n\n**Why C is correct:** DELIVERY IS THE ONLY DEFINITIVE TREATMENT for HELLP syndrome. At 34 weeks, with severe disease, delivery is indicated. Give:\n1. **IV Magnesium Sulfate** → prevent eclamptic seizures\n2. **Antihypertensives** (IV labetalol or hydralazine) → control severe hypertension\n3. **Delivery** (most often by induction or C-section)\n\n**Why not B?** Expectant management may be considered only in pre-eclampsia WITHOUT severe features AND <34 weeks in a strictly monitored setting. This patient has HELLP — not amenable to expectant management.\n\n**Seizure prophylaxis:** Magnesium sulfate is the drug of choice (NOT phenytoin or diazepam) for pre-eclampsia/eclampsia seizure prevention.`,
    keyPoint: "HELLP = Hemolysis + Elevated Liver enzymes + Low Platelets → Delivery is definitive. IV Magnesium Sulfate for seizure prophylaxis.",
    tags: ["HELLP", "pre-eclampsia", "eclampsia", "magnesium sulfate", "pregnancy"],
  },

  // ─── EMERGENCY MEDICINE ──────────────────────────────────────

  {
    id: "EM-001",
    subject: "Emergency Medicine",
    system: "Respiratory",
    topic: "Tension Pneumothorax",
    difficulty: "Medium",
    stem: `A 25-year-old male motorcyclist involved in a high-speed collision is brought to the resuscitation bay. He is intubated and ventilated. BP 75/50 mmHg, HR 138 bpm, SpO₂ 80% despite 100% O₂. There is no breath sounds on the left. The trachea is deviated to the RIGHT. The left jugular veins are engorged. What is the MOST appropriate IMMEDIATE intervention?`,
    options: [
      { id: "A", text: "Urgent portable CXR to confirm the diagnosis before proceeding" },
      { id: "B", text: "Needle decompression of the left chest (2nd intercostal space, midclavicular line)" },
      { id: "C", text: "Endotracheal tube repositioning — likely right mainstem intubation" },
      { id: "D", text: "IV adrenaline (epinephrine) 1 mg push for suspected obstructive shock" },
      { id: "E", text: "Immediate pericardiocentesis for suspected cardiac tamponade" },
    ],
    correctId: "B",
    explanationTitle: "Tension Pneumothorax — Immediate Needle Decompression",
    explanation: `TENSION PNEUMOTHORAX — a life-threatening emergency that kills in minutes if not treated immediately.\n\n**Classic triad:**\n1. Absent breath sounds on affected side (LEFT)\n2. Tracheal deviation AWAY from affected side (to RIGHT)\n3. JVD (jugular vein distension) — impaired venous return\n4. Haemodynamic instability (shock)\n\n**Why B is correct:** This is a CLINICAL DIAGNOSIS. Do NOT wait for CXR. Immediate treatment is:\n**STEP 1:** Large-bore needle (14G) → 2nd ICS, midclavicular line → converts tension pneumo to simple pneumo\n**STEP 2:** Definitive treatment → Chest drain (tube thoracostomy) 4th/5th ICS, anterior axillary line\n\n**Why not A (CXR)?** Tension pneumothorax kills in minutes. CXR wastes critical time — this is a clinical diagnosis that requires immediate action.\n\n**Tension Pneumo vs Cardiac Tamponade (Beck's Triad):**\n- Tamponade: JVD + hypotension + MUFFLED heart sounds (not absent breath sounds)\n- Tension PTX: JVD + hypotension + ABSENT breath sounds + tracheal deviation\n\n**On CXR (if time allows):** Absent lung markings, collapsed lung, mediastinal shift, flattened hemidiaphragm.`,
    keyPoint: "Tension pneumothorax = CLINICAL diagnosis → Immediate needle decompression (2nd ICS MCL). Do NOT wait for CXR. Follow with definitive chest drain.",
    tags: ["tension pneumothorax", "needle decompression", "trauma", "tracheal deviation", "JVD"],
  },

  // ─── PSYCHIATRY ──────────────────────────────────────────────

  {
    id: "PSY-001",
    subject: "Psychiatry",
    system: "Psychosis",
    topic: "Schizophrenia",
    difficulty: "Medium",
    stem: `A 21-year-old male student is brought by his family. Over the past 8 months, he has been increasingly withdrawn, stopped attending university, and has been talking to himself. His family reports he believes his thoughts are being broadcast to others (thought broadcasting), and that people on TV are sending him special messages. He has a flat affect, poverty of speech, and reduced personal hygiene. There is no substance use, no medical illness. What is the MOST LIKELY diagnosis and first-line pharmacological treatment?`,
    options: [
      { id: "A", text: "Bipolar disorder Type I — start lithium" },
      { id: "B", text: "Major depressive disorder with psychotic features — start sertraline" },
      { id: "C", text: "Schizophrenia — start an atypical antipsychotic (e.g., risperidone or olanzapine)" },
      { id: "D", text: "Brief psychotic disorder — no treatment needed, resolves spontaneously" },
      { id: "E", text: "Delusional disorder — start clozapine as first-line" },
    ],
    correctId: "C",
    explanationTitle: "Schizophrenia — Atypical Antipsychotics",
    explanation: `This patient meets DSM-5 criteria for SCHIZOPHRENIA: symptoms >6 months, two or more characteristic symptoms (positive and negative), significant functional decline.\n\n**Positive symptoms:** Thought broadcasting (delusions), ideas of reference (TV messages = delusions/hallucinations), disorganized behavior\n**Negative symptoms:** Flat affect, alogia (poverty of speech), avolition (withdrawal, stops going to university), poor hygiene\n\n**DSM-5 criteria:** ≥2 of: hallucinations, delusions, disorganized speech, disorganized/catatonic behavior, negative symptoms — for ≥6 months + significant functional impairment.\n\n**Why C is correct:** First-line pharmacotherapy for schizophrenia is ATYPICAL (second-generation) antipsychotics: risperidone, olanzapine, quetiapine, aripiprazole. They have better tolerability vs typical antipsychotics (fewer extrapyramidal side effects).\n\n**Why not E (clozapine)?** Clozapine is reserved for TREATMENT-RESISTANT schizophrenia (failed ≥2 adequate antipsychotic trials) due to risk of agranulocytosis requiring weekly CBC monitoring.\n\n**Typical vs Atypical antipsychotics:** Typicals (haloperidol, chlorpromazine) → more EPS (rigidity, tremor, akathisia, tardive dyskinesia). Atypicals → more metabolic side effects (weight gain, glucose intolerance).`,
    keyPoint: "Schizophrenia (>6 months, positive + negative symptoms) → Atypical antipsychotics (risperidone/olanzapine) first-line. Clozapine reserved for treatment-resistant cases.",
    tags: ["schizophrenia", "antipsychotic", "psychosis", "clozapine", "negative symptoms"],
  },

  // ─── PUBLIC HEALTH & BIOSTATISTICS ──────────────────────────

  {
    id: "PH-001",
    subject: "Public Health & Biostatistics",
    system: "Epidemiology",
    topic: "Sensitivity and Specificity",
    difficulty: "Hard",
    stem: `A new rapid test for tuberculosis is evaluated in a study of 500 patients (250 confirmed TB by culture, 250 known non-TB). Results: True Positive (TP) = 225, False Negative (FN) = 25, True Negative (TN) = 220, False Positive (FP) = 30. Which of the following BEST describes the test's sensitivity and specificity, and which clinical scenario BEST justifies using a highly SENSITIVE test?`,
    options: [
      { id: "A", text: "Sensitivity 90%, Specificity 88%; best used to CONFIRM disease in high-pretest-probability patients" },
      { id: "B", text: "Sensitivity 88%, Specificity 90%; best used to RULE OUT disease in screening (low false negatives)" },
      { id: "C", text: "Sensitivity 90%, Specificity 88%; best used to RULE OUT disease — a negative result reliably excludes TB" },
      { id: "D", text: "Sensitivity 88%, Specificity 90%; best used to CONFIRM disease — a positive result reliably diagnoses TB" },
      { id: "E", text: "Sensitivity 90%, Specificity 88%; best used to RULE IN disease in screening programs" },
    ],
    correctId: "C",
    explanationTitle: "Sensitivity, Specificity & Clinical Application",
    explanation: `**Calculating from the data:**\n- Sensitivity = TP / (TP + FN) = 225 / (225+25) = 225/250 = **90%**\n- Specificity = TN / (TN + FP) = 220 / (220+30) = 220/250 = **88%**\n\n**Why C is correct:**\n- Sensitivity 90%, Specificity 88% → C is mathematically correct\n- A HIGHLY SENSITIVE test has few FALSE NEGATIVES → excellent for RULING OUT disease\n- Mnemonic: **SnNOut** = High **S**e**n**sitivity → Negative result rules OUT\n\n**When to use a sensitive test:**\n- Screening programs (you don't want to miss cases)\n- When missing a diagnosis is dangerous (HIV screening, cancer screening)\n- A negative result on a sensitive test = RELIABLE EXCLUSION\n\n**When to use a specific test:**\n- Confirming a diagnosis (you don't want false positives)\n- When treatment has significant side effects\n- Mnemonic: **SpPIn** = High **Sp**ecificity → Positive result rules IN\n\n**PPV and NPV:**\n- PPV = TP / (TP+FP) = 225/255 = 88.2%\n- NPV = TN / (TN+FN) = 220/245 = 89.8%\n- PPV and NPV are PREVALENCE-DEPENDENT; sensitivity and specificity are not.`,
    keyPoint: "Sensitivity = TP/(TP+FN). Specificity = TN/(TN+FP). SnNOut: High Sensitivity → Negative rules OUT. SpPIn: High Specificity → Positive rules IN.",
    tags: ["sensitivity", "specificity", "PPV", "NPV", "biostatistics", "SnNOut", "SpPIn"],
  },

  {
    id: "PH-002",
    subject: "Public Health & Biostatistics",
    system: "Preventive Medicine",
    topic: "Vaccination Schedule",
    difficulty: "Easy",
    stem: `A 2-month-old infant is brought to the well-baby clinic for routine immunization. The mother is anxious and asks which vaccines her baby should receive today according to the Egyptian national vaccination schedule. The baby is healthy with no contraindications. Which combination is CORRECT for the 2-month visit?`,
    options: [
      { id: "A", text: "BCG + Hepatitis B (birth dose only, already given)" },
      { id: "B", text: "DTP (Pentavalent) + IPV + PCV + Rotavirus" },
      { id: "C", text: "MMR + Varicella + Hepatitis A" },
      { id: "D", text: "DTP booster + Meningococcal + Typhoid" },
      { id: "E", text: "Influenza + Pneumococcal + Hepatitis B booster" },
    ],
    correctId: "B",
    explanationTitle: "Egyptian Vaccination Schedule — 2-Month Vaccines",
    explanation: `At 2 months of age in Egypt's national immunization program, the infant should receive:\n\n1. **Pentavalent (DTP + HepB + Hib)** — protects against diphtheria, tetanus, pertussis, hepatitis B, and Haemophilus influenzae type b\n2. **IPV (Inactivated Polio Vaccine)** — injectable polio vaccine\n3. **PCV (Pneumococcal Conjugate Vaccine)** — protects against S. pneumoniae\n4. **Rotavirus oral vaccine** — protects against rotavirus gastroenteritis\n\n**Egyptian Schedule Summary:**\n- **Birth:** BCG, Hepatitis B (birth dose), OPV-0\n- **2 months:** Pentavalent, IPV, PCV, Rotavirus\n- **4 months:** Pentavalent, IPV, PCV, Rotavirus\n- **6 months:** Pentavalent, IPV, PCV, Rotavirus\n- **9 months:** MMR, OPV\n- **12 months:** PCV booster\n- **18 months:** Pentavalent booster, MMR2, OPV booster\n\n**Why not C (MMR)?** MMR is given at 9 months and 18 months — NOT at 2 months (immune system not mature enough, maternal antibodies interfere).\n\n**Contraindications to live vaccines (BCG, MMR, Rotavirus):** Severe immunodeficiency.`,
    keyPoint: "At 2 months: Pentavalent (DTP+HepB+Hib) + IPV + PCV + Rotavirus. BCG given at birth. MMR given at 9 months.",
    tags: ["vaccination", "immunization", "Egypt", "EPI", "pediatric schedule"],
  },

  {
    id: "IM-006",
    subject: "Internal Medicine",
    system: "Gastroenterology",
    topic: "Upper GI Bleeding",
    difficulty: "Medium",
    stem: `A 58-year-old male with a known history of alcoholic liver cirrhosis presents with hematemesis of approximately 500 mL of bright red blood. He is drowsy. BP 80/50 mmHg, HR 130 bpm, SpO₂ 94%. On exam: jaundice, ascites, spider angiomata, and dilated periumbilical veins (caput medusae). What is the MOST appropriate IMMEDIATE management combination?`,
    options: [
      { id: "A", text: "Urgent endoscopy first to identify and treat the bleeding source" },
      { id: "B", text: "IV octreotide infusion only to reduce portal pressure" },
      { id: "C", text: "IV fluid resuscitation + IV ceftriaxone (antibiotic prophylaxis) + IV octreotide, then urgent endoscopy (band ligation) within 12 hours" },
      { id: "D", text: "Oral propranolol and TIPS procedure immediately" },
      { id: "E", text: "Fresh frozen plasma (FFP) alone to correct coagulopathy" },
    ],
    correctId: "C",
    explanationTitle: "Variceal GI Bleeding — Resuscitate + Octreotide + Antibiotics + Endoscopy",
    explanation: `This cirrhotic patient with hematemesis almost certainly has BLEEDING OESOPHAGEAL VARICES — a portal hypertension emergency with 30–50% mortality per episode.\n\n**Why C is correct (the 4-pronged approach):**\n\n1. **RESUSCITATION:** IV fluids (crystalloid), blood transfusion targeting Hb 7–8 g/dL (avoid over-transfusion which raises portal pressure). Protect airway (GCS may be impaired).\n\n2. **OCTREOTIDE (somatostatin analogue):** IV bolus then infusion → reduces portal pressure, buys time for endoscopy. Start BEFORE endoscopy.\n\n3. **ANTIBIOTICS (ceftriaxone IV):** Cirrhotic patients have high risk of bacterial infection/sepsis with GI bleed. Prophylactic antibiotics reduce mortality — given BEFORE endoscopy.\n\n4. **URGENT ENDOSCOPY within 12 hours:** Oesophageal variceal band ligation (EVL) is the gold standard endoscopic treatment.\n\n**Why not A?** Endoscopy first WITHOUT resuscitation and hemostatic vasoactive drugs is dangerous and less effective.\n\n**Secondary prophylaxis:** After variceal bleed is controlled → start non-selective beta-blocker (propranolol/carvedilol) + repeat band ligation sessions to prevent re-bleeding.`,
    keyPoint: "Variceal bleed = Resuscitate + IV Octreotide + IV Antibiotics (ceftriaxone) + Endoscopy (EVL) within 12 hours. All 4 components matter.",
    tags: ["variceal bleeding", "cirrhosis", "octreotide", "band ligation", "portal hypertension"],
  },
];

// ── Helper functions ──────────────────────────────────────────────────────

export function getQuestionById(id: string): Question | undefined {
  return QUESTION_BANK.find(q => q.id === id);
}

export function getQuestionsByIds(ids: string[]): Question[] {
  return ids.map(id => getQuestionById(id)).filter(Boolean) as Question[];
}

export function filterQuestions(params: {
  subjects?: string[];
  difficulties?: string[];
  excludeIds?: string[];
}): Question[] {
  return QUESTION_BANK.filter(q => {
    if (params.subjects?.length && !params.subjects.includes(q.subject)) return false;
    if (params.difficulties?.length && !params.difficulties.includes(q.difficulty)) return false;
    if (params.excludeIds?.includes(q.id)) return false;
    return true;
  });
}

export const ALL_SUBJECTS = [
  "Internal Medicine",
  "General Surgery",
  "Pediatrics",
  "Obstetrics & Gynecology",
  "Emergency Medicine",
  "Psychiatry",
  "Public Health & Biostatistics",
] as const;

export const ALL_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

export const SUBJECT_COLORS: Record<string, string> = {
  "Internal Medicine":              "#EF4444",
  "General Surgery":                "#3B82F6",
  "Pediatrics":                     "#10B981",
  "Obstetrics & Gynecology":        "#A855F7",
  "Emergency Medicine":             "#F59E0B",
  "Psychiatry":                     "#EC4899",
  "Public Health & Biostatistics":  "#64748B",
};

export const SUBJECT_ICONS: Record<string, string> = {
  "Internal Medicine":              "❤️",
  "General Surgery":                "🔬",
  "Pediatrics":                     "👶",
  "Obstetrics & Gynecology":        "🤰",
  "Emergency Medicine":             "🚑",
  "Psychiatry":                     "🧠",
  "Public Health & Biostatistics":  "📊",
};
