"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

// userPct = simulated % of real users who chose each option (sums to 100)
const QS = [
  { s:"Internal Medicine",sc:"#EF4444",t:"Pulmonology",
    stem:"A 55-year-old man presents with sudden dyspnea and right pleuritic chest pain after a long flight. SpO₂ 91%, HR 112 bpm, BP 98/68. D-dimer is markedly elevated. CXR is normal.",
    q:"What is the BEST immediate management?",
    opts:["Start IV antibiotics","Heparin IV + CT Pulmonary Angiography","Immediate thrombolysis with tPA","Bedside echo and observe","Oral aspirin only"],
    correct:1, userPct:[4,68,17,8,3],
    exp:"DVT + sudden dyspnea + long flight + elevated D-dimer = classic PE. Hemodynamically borderline stable → start anticoagulation (Heparin) immediately, confirm with CTPA (Gold Standard). Thrombolysis is only for massive PE with hemodynamic collapse.",
    hy:"Thrombolysis ONLY for massive PE (BP < 90). DOAC is alternative to Heparin in stable patients."},

  { s:"General Surgery",sc:"#3B82F6",t:"Acute Abdomen",
    stem:"A 7-year-old girl presents with periumbilical pain migrating to the right lower quadrant over 8 hours. She has anorexia and fever 38.2°C. McBurney point tenderness and rebound tenderness are present. WBC 15,000.",
    q:"What is the MOST appropriate management?",
    opts:["CT abdomen with contrast","Ultrasound and observation","Antibiotics and discharge","Laparoscopic Appendectomy","24-hour observation"],
    correct:3, userPct:[11,9,5,71,4],
    exp:"Classic acute appendicitis: pain migration + McBurney tenderness + rebound + leukocytosis. In children with a clear clinical picture, CT is not needed (radiation risk). Go directly to laparoscopic appendectomy. Ultrasound is first imaging if diagnosis is uncertain.",
    hy:"Ultrasound first in children (no radiation). CT if US inconclusive. Perforation risk rises after 36–72h."},

  { s:"Pediatrics",sc:"#10B981",t:"Neonatology",
    stem:"A 3-day-old neonate presents with jaundice that appeared in the first 24 hours. Total bilirubin 18 mg/dL (indirect 16). Mother is blood group O+, baby is A+. Direct Coombs test is positive.",
    q:"What is the MOST appropriate immediate management?",
    opts:["Phototherapy alone","Exchange transfusion","Recheck in 6 hours","Give Rhogam to mother","Oral phenobarbital"],
    correct:1, userPct:[22,61,7,6,4],
    exp:"ABO incompatibility with pathological jaundice (< 24h onset). Positive Coombs confirms hemolysis. Bilirubin 18 mg/dL at 72h with ongoing hemolysis places this in the high-risk zone on the Bhutani nomogram → Exchange transfusion is indicated (with intensive phototherapy).",
    hy:"Jaundice in first 24h = always pathological. Coombs+ = hemolytic. Bhutani nomogram guides phototherapy vs exchange transfusion."},

  { s:"OB/GYN",sc:"#A855F7",t:"Obstetric Emergencies",
    stem:"A woman at 32 weeks gestation presents with sudden painless vaginal bleeding. Ultrasound shows the placenta completely covering the internal os. BP 110/70, HR 95 bpm, fetal heart rate is normal.",
    q:"What is the CORRECT management?",
    opts:["Perform vaginal examination","Immediate hospitalization + bed rest, NO vaginal exam","IV Oxytocin","Amniotomy","External cephalic version"],
    correct:1, userPct:[3,74,8,9,6],
    exp:"Complete placenta previa: painless bleeding + placenta over OS. NEVER do vaginal exam (risk of catastrophic hemorrhage). Admit immediately, bed rest, prepare blood products, aim to delay delivery for lung maturation at 32 weeks. C-section is mandatory delivery route.",
    hy:"Placenta previa rule: NEVER vaginal exam. Delivery always by C-section. Aim for 36–37 weeks if stable."},

  { s:"Emergency Medicine",sc:"#F59E0B",t:"Resuscitation",
    stem:"A 70-year-old man arrives unconscious. ECG shows Ventricular Fibrillation (VF). There is no pulse, no blood pressure.",
    q:"What is the FIRST and MOST important intervention?",
    opts:["Epinephrine 1mg IV","Amiodarone 300mg IV","Unsynchronized Defibrillation 200J immediately","Lidocaine IV","CPR alone for 2 minutes"],
    correct:2, userPct:[12,8,67,4,9],
    exp:"VF = shockable rhythm = cardiac arrest. Per ACLS: defibrillate IMMEDIATELY without delay. Every minute without defibrillation reduces survival by 10%. Epinephrine comes AFTER the first shock. CPR restarts immediately after each shock for 2 minutes before reassessment.",
    hy:"Shockable: VF + pulseless VT → Defibrillate first. Non-shockable: PEA + Asystole → CPR + Epinephrine."},

  { s:"Internal Medicine",sc:"#EF4444",t:"Cardiology",
    stem:"A 65-year-old woman with hypertension and diabetes presents with dyspnea on exertion and bilateral ankle edema for 3 months. Echocardiography shows EF of 35% with dilated LV.",
    q:"What is the FIRST-LINE treatment combination for this condition?",
    opts:["Furosemide alone","ACEi + Beta-blocker + MRA + Diuretic","Calcium channel blocker only","Digoxin monotherapy","Aspirin and observation"],
    correct:1, userPct:[13,58,7,10,12],
    exp:"HFrEF (EF < 40%): Gold standard = ACEi/ARB + Beta-blocker + MRA + Loop diuretic. SGLT2 inhibitors (Dapagliflozin) are now added per latest 2024 guidelines. CCBs are CONTRAINDICATED in HFrEF.",
    hy:"HFrEF quadruple therapy: ACEi/ARNI + BB + MRA + SGLT2i. Diuretics for symptom relief only. CCB avoided."},

  { s:"Pediatrics",sc:"#10B981",t:"Respiratory",
    stem:"An 18-month-old presents with barky cough and hoarse voice that worsened last night. Had mild URI 2 days ago. Temperature 37.8°C. No drooling. Mild inspiratory stridor at rest.",
    q:"What is the MOST appropriate initial treatment?",
    opts:["IV antibiotics","Nebulized epinephrine + Dexamethasone IM","Emergency intubation","Chest X-ray only","Oral amoxicillin"],
    correct:1, userPct:[5,72,4,11,8],
    exp:"Classic croup (laryngotracheobronchitis): barky cough + hoarse voice + stridor after URI. Caused by Parainfluenza virus. Mild-moderate croup: single dose Dexamethasone (0.6 mg/kg) + nebulized racemic epinephrine for stridor at rest. No antibiotics needed.",
    hy:"Croup vs Epiglottitis: Croup = barky cough, no drooling, gradual onset. Epiglottitis = toxic, drooling, tripod, DO NOT examine throat."},

  { s:"General Surgery",sc:"#3B82F6",t:"Trauma",
    stem:"A 35-year-old male involved in a car accident. BP 80/50, HR 130, altered consciousness. Abdomen is rigid. FAST exam shows free fluid in the abdomen.",
    q:"What is the MOST appropriate next step?",
    opts:["CT abdomen with contrast","Immediate IV fluids and observation","Emergency Laparotomy (Damage Control Surgery)","Diagnostic peritoneal lavage","Chest X-ray first"],
    correct:2, userPct:[8,6,74,9,3],
    exp:"Hemorrhagic Shock Class IV + positive FAST = hemodynamically unstable internal bleeding. This patient cannot go to CT (too unstable). Immediate Damage Control Surgery: stop bleeding + control contamination → ICU → re-look in 24–48h.",
    hy:"FAST+ stable → CT scan. FAST+ unstable → OR immediately. 'Damage Control': fastest surgery to save life, not repair everything."},

  { s:"OB/GYN",sc:"#A855F7",t:"Oncology",
    stem:"A 55-year-old post-menopausal woman presents with vaginal bleeding. Ultrasound shows endometrial thickness of 14mm. She has no other significant history.",
    q:"What is the MOST important next diagnostic step?",
    opts:["Repeat ultrasound in 3 months","Hysteroscopy + Directed Biopsy","Pap smear only","Diagnostic laparoscopy","CA-125 alone"],
    correct:1, userPct:[9,71,5,8,7],
    exp:"Postmenopausal bleeding + endometrial thickness > 4mm = must rule out endometrial cancer. Gold standard: Hysteroscopy + Directed Biopsy (superior to blind sampling for focal lesions). Endometrial cancer is most common gynecologic malignancy in developed countries.",
    hy:"Postmenopausal bleeding: < 4mm endometrial thickness = reassuring. > 4mm = biopsy mandatory. Risk factors: obesity, PCOS, Tamoxifen, unopposed estrogen."},

  { s:"Internal Medicine",sc:"#EF4444",t:"Endocrinology",
    stem:"A 45-year-old woman presents with fatigue, weight gain, cold intolerance for 6 months. Puffy face, slow speech, coarse hair. TSH = 12 mIU/L, Free T4 is low.",
    q:"What is the MOST appropriate treatment?",
    opts:["Methimazole","Levothyroxine (T4 replacement)","Radioactive iodine","Propylthiouracil","No treatment, monitor only"],
    correct:1, userPct:[4,86,3,4,3],
    exp:"Primary hypothyroidism: high TSH + low Free T4 + classic symptoms (fatigue, weight gain, cold intolerance, myxedema features). Treatment: Levothyroxine (T4) daily on empty stomach. Monitor TSH every 6–8 weeks until stable, then annually.",
    hy:"TSH inversely tracks thyroid function. High TSH = hypothyroidism (pituitary working harder). Target TSH on treatment = 0.5–2.5 mIU/L."},

  { s:"Emergency Medicine",sc:"#F59E0B",t:"Toxicology",
    stem:"A 25-year-old presents 4 hours after intentional Paracetamol overdose. Semi-conscious, BP 100/70. Paracetamol blood level markedly elevated. LFTs normal so far.",
    q:"What is the MOST appropriate management?",
    opts:["Activated charcoal only","N-Acetylcysteine (NAC) IV immediately","Haemodialysis","Vitamin K IV","Observation only"],
    correct:1, userPct:[7,76,5,8,4],
    exp:"Paracetamol overdose → toxic metabolite NAPQI → hepatotoxicity (peaks at 72–96h). Even with normal LFTs, if blood level is above treatment line on Rumack-Matthew nomogram → give NAC immediately. NAC within 8–10h = near-complete hepatoprotection.",
    hy:"NAC mechanism: replenishes glutathione that neutralizes NAPQI. Give NAC regardless of LFTs if level is high. Window = within 24h, but best within 8h."},

  { s:"Pediatrics",sc:"#10B981",t:"Hematology",
    stem:"An 8-year-old presents with pallor, fatigue, and splenomegaly since infancy. Hb 7.5, MCV 65. Blood film: hypochromic microcytic cells. HbA₂ is elevated. Both parents are carriers.",
    q:"What is the DEFINITIVE treatment for this condition?",
    opts:["Iron supplements","Regular transfusions + Chelation + Bone Marrow Transplant","Hydroxyurea alone","G-CSF injections","Splenectomy alone"],
    correct:1, userPct:[6,65,14,4,11],
    exp:"Beta-Thalassemia Major: elevated HbA₂ + microcytic + carrier parents + splenomegaly = confirmed. Treatment: Regular transfusions (every 3–4 weeks) + Desferrioxamine chelation + Bone Marrow Transplantation (curative). Iron supplements are CONTRAINDICATED (iron overload).",
    hy:"Thal Minor: asymptomatic, no treatment. Major: transfusions + chelation. Iron overload → cardiac failure. BMT = only cure. Never give iron to Thal Major."},

  { s:"General Surgery",sc:"#3B82F6",t:"GI",
    stem:"A 50-year-old man with epigastric pain after meals and melena for 1 week. Daily Ibuprofen use for 1 year. Endoscopy: 2cm gastric ulcer, CLO test positive.",
    q:"What is the MOST appropriate treatment?",
    opts:["Stop NSAIDs only","Triple therapy (PPI + Amoxicillin + Clarithromycin) + Stop NSAIDs","PPI alone for 8 weeks","Surgical resection immediately","Antacids only"],
    correct:1, userPct:[5,73,14,4,4],
    exp:"H. pylori positive peptic ulcer (CLO test +) + NSAID use. Treatment: (1) Stop NSAIDs. (2) H. pylori eradication: Triple therapy = PPI + Amoxicillin + Clarithromycin for 14 days. (3) Continue PPI for 4–8 weeks for ulcer healing. Confirm eradication with urea breath test 4 weeks after completing antibiotics.",
    hy:"CLO test = rapid urease test for H. pylori. Eradication reduces recurrence from 80% to < 5%. Best confirmation: Urea breath test (4 weeks post-treatment, off PPI)."},

  { s:"OB/GYN",sc:"#A855F7",t:"Ectopic Pregnancy",
    stem:"A 28-year-old woman with acute pelvic pain and 7-week amenorrhea. HCG positive. Cervical Motion Tenderness positive. Ultrasound: no intrauterine pregnancy. Hb = 9 g/dL.",
    q:"What is the MOST appropriate management?",
    opts:["Methotrexate IM","Emergency surgery (Laparoscopy/Laparotomy)","Repeat ultrasound in 48h","IV fluids and observation","Oral progesterone"],
    correct:1, userPct:[14,69,8,6,3],
    exp:"Ruptured ectopic pregnancy: amenorrhea + HCG+ + no IUP on US + CMT + anemia (Hb 9) = internal bleeding. This is a surgical emergency. Laparoscopy preferred if stable, Laparotomy if very unstable. Methotrexate is ONLY for unruptured, hemodynamically stable ectopics.",
    hy:"Methotrexate criteria: hemodynamically stable + unruptured + β-hCG < 5000 + no fetal heartbeat + no contraindications. Ruptured = always surgical."},

  { s:"Internal Medicine",sc:"#EF4444",t:"Nephrology",
    stem:"A 45-year-old with Type 2 Diabetes for 10 years. Creatinine 2.1 mg/dL, eGFR 38 mL/min, BP 150/95, urine protein 3+.",
    q:"What is the MOST appropriate management?",
    opts:["Metformin + continue current treatment","ACEi/ARB + strict BP control + refer nephrology","Increase insulin dose only","Dialysis immediately","Diuretics alone"],
    correct:1, userPct:[8,72,5,7,8],
    exp:"Diabetic nephropathy with CKD Stage 3b (eGFR 38) + proteinuria + hypertension. ACEi or ARB = first-line: reduces proteinuria AND slows CKD progression. Target BP < 130/80. STOP Metformin when eGFR < 30. Add SGLT2i (Empagliflozin) if tolerated for additional renoprotection.",
    hy:"ACEi/ARB: reduce intraglomerular pressure → decrease proteinuria. Stop Metformin: eGFR < 30 (lactic acidosis risk). SGLT2i renoprotective regardless of glucose control."},
];

export default function QBankPage() {
  const [idx,     setIdx]     = useState(0);
  const [sel,     setSel]     = useState<number|null>(null);
  const [checked, setChecked] = useState(false);
  const [mode,    setMode]    = useState<"setup"|"exam">("setup");
  const [tutor,   setTutor]   = useState(false);
  const [secs,    setSecs]    = useState(10800);
  const [score,   setScore]   = useState(0);
  const [answers, setAnswers] = useState<Record<number,number>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [toast,   setToast]   = useState("");
  const [dark,    setDark]    = useState(false);

  useEffect(() => {
    try { const t = localStorage.getItem("emle_theme"); if (t==="dark") setDark(true); } catch {}
  }, []);

  useEffect(() => {
    if (mode !== "exam") return;
    const id = setInterval(() => setSecs(s => Math.max(0,s-1)), 1000);
    return () => clearInterval(id);
  }, [mode]);

  function showToast(msg: string) { setToast(msg); setTimeout(()=>setToast(""),2500); }
  function fmt(s: number) { const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),ss=s%60; return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(ss).padStart(2,"0")}`; }
  function toggleTheme() { const n=!dark; setDark(n); try{localStorage.setItem("emle_theme",n?"dark":"light");}catch{} }

  function confirmAnswer() {
    if (sel === null) { showToast("Please select an answer first!"); return; }
    const correct = sel === QS[idx].correct;
    if (correct) setScore(s => s+1);
    setAnswers(a => ({...a, [idx]: sel}));
    setChecked(true);
    if (correct) showToast("✅ Correct! Excellent work!");
    else showToast(`❌ Wrong. Correct: ${QS[idx].opts[QS[idx].correct].replace(" ✓","")}`);
  }

  function next() {
    if (idx < QS.length-1) { setIdx(i=>i+1); setSel(null); setChecked(false); }
    else showToast("🏁 You've completed all questions!");
  }

  const bg = dark?"#0D1117":"#F0F4F8";
  const card = dark?"#161B22":"#FFFFFF";
  const txt = dark?"#E6EDF3":"#0D1B2A";
  const mid = dark?"#8B949E":"#3D5166";
  const muted = dark?"#484F58":"#7A8FA6";
  const border = dark?"#30363D":"#E3E9F2";
  const q = QS[idx];

  if (mode === "setup") return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:bg, color:txt, fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", padding:20 }}>
      <div style={{ background:card, border:`1px solid ${border}`, borderRadius:16, padding:32, maxWidth:520, width:"100%" }}>
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <Link href="/" style={{ display:"inline-flex", alignItems:"center", gap:9, fontWeight:800, fontSize:17, color:txt, textDecoration:"none" }}>
            <div style={{ width:34, height:34, background:"#0057FF", borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
            </div>
            EMLE <span style={{ color:"#0057FF" }}>QBank</span>
          </Link>
        </div>
        <h1 style={{ fontSize:22, fontWeight:800, marginBottom:6, textAlign:"center" }}>⚙️ Exam Setup</h1>
        <p style={{ fontSize:14, color:muted, textAlign:"center", marginBottom:24 }}>Configure your practice session</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
          {[{icon:"⏱",title:"Timed Mode",desc:"Real exam simulation"},{icon:"🎓",title:"Tutor Mode",desc:"Instant explanations"}].map((m,i)=>(
            <div key={i} onClick={()=>setTutor(i===1)} style={{ border:`2px solid ${tutor===(i===1)?"#0057FF":border}`, borderRadius:10, padding:14, cursor:"pointer", textAlign:"center", background: tutor===(i===1)?"rgba(0,87,255,0.07)":bg, transition:"all 0.2s" }}>
              <div style={{ fontSize:24, marginBottom:6 }}>{m.icon}</div>
              <div style={{ fontSize:13, fontWeight:800, marginBottom:2 }}>{m.title}</div>
              <div style={{ fontSize:11, color:muted }}>{m.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:12, background:"rgba(0,87,255,0.06)", borderRadius:10, marginBottom:20, border:"1px solid rgba(0,87,255,0.12)" }}>
          <input type="checkbox" id="wk" style={{ width:15, height:15, accentColor:"#0057FF", cursor:"pointer" }}/>
          <label htmlFor="wk" style={{ cursor:"pointer" }}>
            <div style={{ fontSize:13, fontWeight:700 }}>🎯 Target My Weak Areas</div>
            <div style={{ fontSize:11, color:muted }}>AI prioritizes your weakest topics</div>
          </label>
        </div>
        <button onClick={()=>setMode("exam")} style={{ width:"100%", padding:14, borderRadius:10, fontSize:16, fontWeight:800, background:"#0057FF", color:"#fff", border:"none", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", boxShadow:"0 6px 18px rgba(0,87,255,0.35)" }}>
          🚀 Start Exam Now
        </button>
        <div style={{ textAlign:"center", marginTop:12 }}>
          <Link href="/dashboard" style={{ fontSize:13, color:muted, textDecoration:"none" }}>← Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ height:"100vh", display:"flex", flexDirection:"column", background:bg, color:txt, fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", overflow:"hidden" }}>
      {/* TOP BAR */}
      <div style={{ height:54, background:card, borderBottom:`1px solid ${border}`, display:"flex", alignItems:"center", padding:"0 14px", gap:10, flexShrink:0 }}>
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:8, fontWeight:800, fontSize:15, color:txt, textDecoration:"none", flexShrink:0 }}>
          <div style={{ width:28, height:28, background:"#0057FF", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
          </div>
          EMLE <span style={{ color:"#0057FF" }}>QBank</span>
        </Link>
        <span style={{ padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:800, background:"rgba(0,87,255,0.1)", color:"#0057FF" }}>{tutor?"🎓 Tutor":"⏱ Timed"}</span>
        <div style={{ flex:1 }}/>
        <div style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 12px", background:bg, border:`1.5px solid ${border}`, borderRadius:8 }}>
          <span style={{ fontSize:13 }}>⏱</span>
          <span style={{ fontSize:15, fontWeight:800, fontFamily:"monospace", color: secs<300?"#EF4444": secs<600?"#F59E0B":txt }}>{fmt(secs)}</span>
        </div>
        <span style={{ fontSize:13, fontWeight:700, color:mid }}>{idx+1} / {QS.length}</span>
        <button onClick={toggleTheme} style={{ width:32,height:32,borderRadius:"50%",border:`1px solid ${border}`,background:card,cursor:"pointer",fontSize:13 }}>{dark?"☀️":"🌙"}</button>
        <button onClick={()=>setMode("setup")} style={{ padding:"5px 11px", borderRadius:8, fontSize:11, fontWeight:700, border:"1px solid rgba(239,68,68,0.3)", background:"none", color:"#EF4444", cursor:"pointer" }}>⏹ End</button>
      </div>

      {/* BODY */}
      <div style={{ flex:1, overflowY:"auto", display:"flex" }}>
        {/* QUESTION */}
        <div style={{ flex:1, overflowY:"auto" }}>
          <div style={{ maxWidth:780, margin:"0 auto", padding:"24px 20px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14, flexWrap:"wrap" }}>
              <span style={{ padding:"3px 9px", borderRadius:100, fontSize:11, fontWeight:700, background:`${q.sc}18`, color:q.sc }}>{q.s}</span>
              <span style={{ padding:"3px 8px", borderRadius:100, fontSize:11, fontWeight:700, background:"rgba(139,92,246,0.1)", color:"#7C3AED" }}>{q.t}</span>
              <span style={{ padding:"3px 8px", borderRadius:100, fontSize:11, fontWeight:700, background:"rgba(0,0,0,0.05)", color:muted }}>EMLE-Level</span>
            </div>
            <div style={{ fontSize:15, lineHeight:1.85, padding:"16px 18px", background: dark?"rgba(255,255,255,0.04)":bg, borderRadius:10, borderRight:`3px solid #0057FF`, marginBottom:14 }}>
              <div style={{ fontSize:10, fontWeight:800, color:"#0057FF", textTransform:"uppercase", letterSpacing:1.2, marginBottom:8 }}>📋 Clinical Vignette</div>
              {q.stem}
            </div>
            <div style={{ fontSize:14, fontWeight:700, padding:"12px 14px", background:"rgba(0,87,255,0.05)", borderRadius:10, border:"1px solid rgba(0,87,255,0.12)", marginBottom:18 }}>
              ❓ {q.q}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
              {q.opts.map((opt,i) => {
                const isCorrect = i === q.correct;
                const isSelected = sel === i;
                const isUserWrong = checked && isSelected && !isCorrect;
                let bg2 = card, bc = border, col = mid;
                if (checked && isCorrect)   { bg2="rgba(16,185,129,0.07)"; bc="#10B981"; col="#10B981"; }
                if (isUserWrong)            { bg2="rgba(239,68,68,0.06)";  bc="#EF4444"; col="#EF4444"; }
                if (!checked && isSelected) { bg2="rgba(0,87,255,0.06)"; bc="#0057FF"; }
                return (
                  <div key={i} onClick={()=>{ if (!checked) setSel(i); }}
                    style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"13px 14px", borderRadius:10, border:`2px solid ${bc}`, background:bg2, cursor: checked?"default":"pointer", transition:"all 0.18s" }}
                    onMouseEnter={e=>{ if(!checked)(e.currentTarget as HTMLElement).style.borderColor="#0057FF"; }}
                    onMouseLeave={e=>{ if(!checked)(e.currentTarget as HTMLElement).style.borderColor=bc; }}>
                    <div style={{ width:28, height:28, borderRadius:"50%", border:`2px solid ${bc}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, flexShrink:0, background: (checked&&isCorrect)||(checked&&isUserWrong)||(!checked&&isSelected) ? bc : bg, color: (checked&&isCorrect)||isUserWrong||(!checked&&isSelected) ? "#fff" : muted }}>
                      {"ABCDE"[i]}
                    </div>
                    <div style={{ fontSize:13.5, lineHeight:1.65, paddingTop:3, color:col, flex:1 }}>{opt.replace(" ✓","")}</div>
                    {checked && isCorrect && <span style={{ marginLeft:"auto", fontSize:16 }}>✅</span>}
                    {isUserWrong && <span style={{ marginLeft:"auto", fontSize:16 }}>❌</span>}
                  </div>
                );
              })}
            </div>
            {(checked || tutor) && checked && (
              <div style={{ background: dark?"#161B22":bg, border:`1px solid ${border}`, borderRadius:10, overflow:"hidden", marginBottom:8 }}>
                <div style={{ background:"rgba(0,87,255,0.07)", padding:"13px 17px", borderBottom:`1px solid ${border}`, display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:16 }}>💡</span>
                  <span style={{ fontSize:13, fontWeight:800, color:"#0057FF" }}>Detailed Explanation – EMLE AI Coach</span>
                </div>
                <div style={{ padding:18 }}>
                  <p style={{ fontSize:14, color:mid, lineHeight:1.85, marginBottom:16 }}>{q.exp}</p>

                  {/* HIGH-YIELD BOX */}
                  {q.hy && (
                    <div style={{ padding:"12px 14px", borderRadius:9, background:"rgba(245,158,11,0.07)", border:"1px solid rgba(245,158,11,0.2)", marginBottom:16 }}>
                      <div style={{ fontSize:10, fontWeight:800, color:"#F59E0B", textTransform:"uppercase" as const, letterSpacing:1, marginBottom:6 }}>⭐ High-Yield Point</div>
                      <p style={{ fontSize:13, color:mid, lineHeight:1.8 }}>{q.hy}</p>
                    </div>
                  )}

                  {/* USER PERCENTAGE – UWorld style */}
                  <div style={{ borderTop:`1px solid ${border}`, paddingTop:14 }}>
                    <div style={{ fontSize:11, fontWeight:800, color:muted, textTransform:"uppercase" as const, letterSpacing:1, marginBottom:10 }}>
                      📊 How Others Answered (12,483 users)
                    </div>
                    {q.opts.map((opt, i) => {
                      const pct = q.userPct[i];
                      const isCorrect = i === q.correct;
                      const isUserSel = sel === i;
                      const barCol = isCorrect ? "#10B981" : isUserSel ? "#EF4444" : border;
                      const textCol2 = isCorrect ? "#10B981" : isUserSel ? "#EF4444" : muted;
                      return (
                        <div key={i} style={{ marginBottom:8 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, fontWeight:700, color:textCol2, marginBottom:3 }}>
                            <span>{["A","B","C","D","E"][i]}. {opt.replace(" ✓","")}{isCorrect?" ✓":""}</span>
                            <span>{pct}%</span>
                          </div>
                          <div style={{ height:6, background:border, borderRadius:100, overflow:"hidden" }}>
                            <div style={{ height:"100%", background: isCorrect?"#10B981": isUserSel?"#EF4444":"rgba(0,87,255,0.2)", borderRadius:100, width:`${pct}%`, transition:"width 0.8s ease" }}/>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={{ width:240, borderLeft:`1px solid ${border}`, background:card, overflowY:"auto", display:"flex", flexDirection:"column" }}>
          <div style={{ padding:14, borderBottom:`1px solid ${border}`, position:"sticky", top:0, background:card, zIndex:5 }}>
            <div style={{ fontSize:13, fontWeight:800, marginBottom:2 }}>📋 Navigator</div>
            <div style={{ fontSize:11, color:muted, marginBottom:8 }}>Click to jump to question</div>
            <div style={{ height:3, background:border, borderRadius:100, overflow:"hidden" }}>
              <div style={{ height:"100%", background:"#0057FF", borderRadius:100, width:`${(Object.keys(answers).length/QS.length)*100}%`, transition:"width 0.5s" }}/>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:4, fontSize:10, color:muted, fontWeight:700 }}>
              <span>{Object.keys(answers).length} answered</span>
              <span>{QS.length} total</span>
            </div>
          </div>
          <div style={{ padding:10, display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:4 }}>
            {QS.map((_,i) => {
              const isAns = answers[i] !== undefined;
              const isRight = isAns && answers[i] === QS[i].correct;
              let bg2 = bg, bc = border, col = muted;
              if (i === idx) { bg2="#0057FF"; bc="#0057FF"; col="#fff"; }
              else if (isAns && isRight)  { bg2="rgba(16,185,129,0.1)"; bc="rgba(16,185,129,0.4)"; col="#10B981"; }
              else if (isAns && !isRight) { bg2="rgba(239,68,68,0.07)"; bc="rgba(239,68,68,0.3)"; col="#EF4444"; }
              const isFlagged = flagged.has(i);
              return (
                <button key={i} onClick={()=>{ setIdx(i); setSel(answers[i]??null); setChecked(answers[i]!==undefined); }}
                  style={{ aspectRatio:"1", borderRadius:6, border:`1.5px solid ${bc}`, background:bg2, cursor:"pointer", fontSize:11, fontWeight:700, color:col, transition:"all 0.18s", position:"relative" as const }}>
                  {i+1}
                  {isFlagged && <span style={{ position:"absolute", top:-3, right:-3, fontSize:7 }}>🚩</span>}
                </button>
              );
            })}
          </div>
          <div style={{ padding:"10px 14px", borderTop:`1px solid ${border}`, marginTop:"auto" }}>
            {[["current","#0057FF"],["correct","rgba(16,185,129,0.4)"],["wrong","rgba(239,68,68,0.3)"],["unanswered",border],["flagged 🚩","rgba(245,158,11,0.4)"]].map(([l,c])=>(
              <div key={l} style={{ display:"flex", alignItems:"center", gap:7, fontSize:11, color:muted, marginBottom:5 }}>
                <div style={{ width:11, height:11, borderRadius:2, background:c }}/>
                {l.charAt(0).toUpperCase()+l.slice(1)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div style={{ background:card, borderTop:`1px solid ${border}`, padding:"10px 16px", display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
        <button onClick={()=>{ setFlagged(f => { const n=new Set(f); if(n.has(idx)) n.delete(idx); else n.add(idx); return n; }); showToast(flagged.has(idx)?"🚩 Unflagged":"🚩 Flagged for review!"); }} style={{ width:34,height:34,borderRadius:8,border:`1.5px solid ${flagged.has(idx)?"#F59E0B":border}`,background:flagged.has(idx)?"rgba(245,158,11,0.1)":card,cursor:"pointer",fontSize:13 }}>🚩</button>
        <button onClick={()=>showToast("Notes coming soon! 📝")} style={{ width:34,height:34,borderRadius:8,border:`1.5px solid ${border}`,background:card,cursor:"pointer",fontSize:13 }}>📝</button>
        <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          <button onClick={()=>{ if(idx>0){setIdx(i=>i-1);setSel(answers[idx-1]??null);setChecked(answers[idx-1]!==undefined);}}} disabled={idx===0}
            style={{ padding:"9px 18px", borderRadius:9, border:`1.5px solid ${border}`, background:card, color:mid, fontSize:13, fontWeight:700, cursor: idx===0?"not-allowed":"pointer", opacity: idx===0?0.4:1, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
            ← Prev
          </button>
          {!checked ? (
            <button onClick={confirmAnswer} style={{ padding:"9px 20px", borderRadius:9, background:"#0057FF", color:"#fff", border:"none", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", boxShadow:"0 4px 12px rgba(0,87,255,0.3)" }}>
              ✓ Confirm Answer
            </button>
          ) : (
            <button onClick={next} style={{ padding:"9px 20px", borderRadius:9, background: idx===QS.length-1?"#10B981":"#0057FF", color:"#fff", border:"none", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
              {idx === QS.length-1 ? "🏁 Finish" : "Next →"}
            </button>
          )}
        </div>
        <div style={{ fontSize:13, fontWeight:700, color:"#10B981" }}>Score: {score}/{Object.keys(answers).length||"-"}</div>
      </div>

      {toast && (
        <div style={{ position:"fixed", bottom:70, right:20, zIndex:9999, background:"#0A1628", color:"#fff", padding:"11px 16px", borderRadius:10, fontSize:13, fontWeight:600, boxShadow:"0 6px 20px rgba(0,0,0,0.3)", borderLeft:"3px solid #0057FF", maxWidth:260 }}>
          {toast}
        </div>
      )}
    </div>
  );
}
