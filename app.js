const APP_VERSION='0.4.0-dev';
const CONTENT_VERSION='math-core-loop-2026-08-31';
const EVENT_SCHEMA_VERSION='1.2';
const KEY='KLH_PUBLIC_WEB_DEV_V04_TESTER';
const LEGACY_KEY='KLH_PUBLIC_WEB_DEV_V03_TESTER';

const SKILLS=[
  {
    id:'division', title:'การหารด้วยตัวหาร 2 หลัก',
    lesson:'ประมาณคำตอบก่อน แล้วใช้การคูณกลับตรวจ เช่น 3,600 ÷ 24 = 150 เพราะ 24 × 150 = 3,600',
    visual:'24 × 150 = 3,600 ⇄ 3,600 ÷ 24 = 150',
    url:'https://proj14.ipst.ac.th/p4/p4-math-book1/math-p4b1-031/',
    diagnostic:{id:'DEV_MATH_DIV_DIAG_001',p:'1,440 ÷ 24 = ?',c:['50','60','70','80'],a:1,wrong:{0:['calculation','คำนวณคลาดเคลื่อน','ลองคูณคำตอบกลับด้วย 24'],2:['estimation','ประเมินขนาดคำตอบสูงไป','24 × 60 = 1,440 พอดี'],3:['estimation','ประเมินขนาดคำตอบสูงไป','ลองเทียบ 24 × 80 กับ 1,440']}},
    fresh:[
      {id:'DEV_MATH_DIV_001',p:'2,880 ÷ 24 = ?',c:['100','110','120','140'],a:2},
      {id:'DEV_MATH_DIV_002',p:'4,320 ÷ 27 = ?',c:['120','140','160','180'],a:2},
      {id:'DEV_MATH_DIV_003',p:'5,250 ÷ 25 = ?',c:['180','200','210','225'],a:2}
    ],
    rescue:{id:'DEV_MATH_DIV_RESCUE_001',p:'3,360 ÷ 24 = ?',c:['120','130','140','150'],a:2,hints:['เริ่มจากประมาณ 3,360 ÷ 24 ว่าควรอยู่แถว 100 กว่า','ลองคูณกลับ: 24 × 140 = 3,360']}
  },
  {
    id:'fraction', title:'เศษส่วนของเศษส่วน',
    lesson:'คำว่า “ของ” ให้คิดเป็นการคูณ เช่น 1/4 ของ 3/5 = 1/4 × 3/5',
    visual:'1/4 ของ 3/5 = 3/20',
    url:'https://proj14.ipst.ac.th/p5/p5-math-book1/math-p5b1-014/',
    diagnostic:{id:'DEV_MATH_FRAC_DIAG_001',p:'2/3 ของ 3/4 เท่ากับเท่าไร?',c:['1/4','1/3','1/2','2/3'],a:2,wrong:{0:['procedure','คูณเศษส่วนไม่ครบ','คำว่า “ของ” ให้คูณ 2/3 × 3/4'],1:['concept','อาจสับสนการคูณกับการหาร','คูณเศษกับเศษ และส่วนกับส่วน'],3:['concept','อาจเลือกค่าที่ดูคุ้นโดยไม่คำนวณ','เขียน 2/3 × 3/4 ก่อนตัดทอน']}},
    fresh:[
      {id:'DEV_MATH_FRAC_001',p:'มีน้ำ 4/5 ถัง ใช้ไป 1/2 ของน้ำที่มี เหลือเท่าไร?',c:['1/5','2/5','3/5','4/5'],a:1},
      {id:'DEV_MATH_FRAC_002',p:'มีเค้ก 3/4 ก้อน กินไป 1/3 ของที่มี กินไปเท่าไร?',c:['1/4','1/3','1/2','2/3'],a:0},
      {id:'DEV_MATH_FRAC_003',p:'มีน้ำ 5/6 ถัง ใช้ไป 2/5 ของที่มี เหลือเท่าไร?',c:['1/3','1/2','3/5','2/3'],a:1}
    ],
    rescue:{id:'DEV_MATH_FRAC_RESCUE_001',p:'มีน้ำ 3/4 ถัง ใช้ไป 2/3 ของน้ำที่มี ใช้ไปเท่าไร?',c:['1/3','1/2','2/3','3/4'],a:1,hints:['คำว่า “2/3 ของ 3/4” แปลเป็น 2/3 × 3/4','2/3 × 3/4 = 6/12 แล้วตัดทอน']}
  },
  {
    id:'decimal', title:'หารทศนิยมด้วยทศนิยม',
    lesson:'ทำตัวหารให้เป็นจำนวนเต็ม โดยเลื่อนจุดทศนิยมของทั้งตัวตั้งและตัวหารเท่ากัน',
    visual:'2.4 ÷ 0.15 → 240 ÷ 15 = 16',
    url:'https://proj14.ipst.ac.th/p6/p6-math-book1/math-p6b1-029/',
    diagnostic:{id:'DEV_MATH_DEC_DIAG_001',p:'2.4 ÷ 0.3 = ?',c:['0.8','8','80','800'],a:1,wrong:{0:['place_value','ตำแหน่งทศนิยมคลาดเคลื่อน','เลื่อนจุดของทั้ง 2.4 และ 0.3 หนึ่งตำแหน่ง'],2:['place_value','คำตอบมากเกินไป 10 เท่า','24 ÷ 3 = 8 ไม่ใช่ 80'],3:['place_value','คำตอบมากเกินไป 100 เท่า','ทำตัวหารเป็นจำนวนเต็มก่อน']}},
    fresh:[
      {id:'DEV_MATH_DEC_001',p:'1.8 ÷ 0.2 = ?',c:['6','7','8','9'],a:3},
      {id:'DEV_MATH_DEC_002',p:'3.6 ÷ 0.12 = ?',c:['20','25','30','36'],a:2},
      {id:'DEV_MATH_DEC_003',p:'4.95 ÷ 0.15 = ?',c:['30','32','33','35'],a:2}
    ],
    rescue:{id:'DEV_MATH_DEC_RESCUE_001',p:'6.4 ÷ 0.16 = ?',c:['4','20','40','400'],a:2,hints:['เลื่อนจุด 2 ตำแหน่งทั้งคู่: 640 ÷ 16','16 × 40 = 640']}
  }
];

function blank(){return{profile:null,done:{},results:{},skillState:{},events:[]}}
function loadState(){
  try{
    const now=JSON.parse(localStorage.getItem(KEY)||'null');
    if(now)return normalize(now);
    const old=JSON.parse(localStorage.getItem(LEGACY_KEY)||'null');
    if(old){const m=normalize(old);localStorage.setItem(KEY,JSON.stringify(m));return m}
  }catch(e){}
  return blank();
}
function normalize(s){return{profile:s.profile||null,done:s.done||{},results:s.results||{},skillState:s.skillState||{},events:Array.isArray(s.events)?s.events:[]}}
let state=loadState();
let active=null,phase='idle',idx=0,answers=[],conf=[],itemStartAt=0,diagnosticEvidence=null,wrongEvidence=[],rescueHintLevel=0;

function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function log(type,extra={}){state.events.push({ts:new Date().toISOString(),type,appVersion:APP_VERSION,contentVersion:CONTENT_VERSION,eventSchemaVersion:EVENT_SCHEMA_VERSION,scenario:state.profile?.scenario||null,tester:state.profile?.tester||null,...extra});save()}
function hideAll(){['setup','home','learn','telemetry'].forEach(x=>document.getElementById(x).classList.add('hidden'))}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function nowIso(){return new Date().toISOString()}
function retentionSchedule(){const base=Date.now(),days=[1,3,7,21];return days.map(d=>({day:d,dueAt:new Date(base+d*86400000).toISOString(),status:'PENDING'}))}

function enterApp(){state.profile={tester:document.getElementById('tester').value.trim()||'DEV Tester',scenario:document.getElementById('scenario').value};log('session_start');renderHome()}
function renderHome(){
  hideAll();document.getElementById('home').classList.remove('hidden');
  document.getElementById('hello').textContent='DEV Tester: '+state.profile.tester;
  document.getElementById('scenarioText').textContent='Scenario: '+state.profile.scenario+' • Product QA telemetry เท่านั้น';
  document.getElementById('completedKpi').textContent=Object.keys(state.done).length;
  document.getElementById('eventKpi').textContent=state.events.length;
  document.getElementById('modeKpi').textContent='Diagnose → Rescue';
  document.getElementById('versionNote').textContent='App '+APP_VERSION+' • Content '+CONTENT_VERSION+' • Event schema '+EVENT_SCHEMA_VERSION;
  document.getElementById('queue').innerHTML=SKILLS.map(s=>{
    const r=state.results[s.id],ss=state.skillState[s.id];
    const detail=r?`Fresh ${r.freshScore}%${r.rescueScore==null?'':' • Rescue '+r.rescueScore+'%'} • confidence ${r.avgConfidence}`:'ยังไม่ทดสอบ';
    const status=ss?`<div class="state">Skill state: <strong>${esc(ss.status)}</strong></div>`:'';
    return `<div class="module"><strong>${esc(s.title)}</strong><div class="progress"><div style="width:${state.done[s.id]?'100':'0'}%"></div></div><div class="muted small">${detail}</div>${status}<div class="actions"><button class="btn primary" onclick="start('${s.id}')">${state.done[s.id]?'ทดสอบซ้ำ':'เริ่ม Module'}</button></div></div>`
  }).join('');
}

function start(id){
  active=SKILLS.find(s=>s.id===id);phase='diagnostic';idx=0;answers=[];conf=[];diagnosticEvidence=null;wrongEvidence=[];rescueHintLevel=0;
  log('module_start',{skill:id});hideAll();document.getElementById('learn').classList.remove('hidden');beginItem();
}
function beginItem(){itemStartAt=Date.now();renderCurrentItem()}
function currentQuestion(){if(phase==='diagnostic')return active.diagnostic;if(phase==='fresh')return active.fresh[idx];if(phase==='rescue')return active.rescue;return null}
function phaseLabel(){return phase==='diagnostic'?'Diagnostic Check':phase==='fresh'?`Fresh Transfer ${idx+1} / ${active.fresh.length}`:'Rescue Check'}
function renderCurrentItem(){
  const q=currentQuestion();
  const sel=answers[idx],cv=conf[idx];
  const hintBlock=phase==='rescue'&&rescueHintLevel>0?`<div class="hint"><strong>Hint ${rescueHintLevel}</strong><br>${esc(q.hints[rescueHintLevel-1])}</div>`:'';
  const hintButtons=phase==='rescue'?`<div class="actions">${rescueHintLevel<1?'<button class="btn light" onclick="showHint(1)">ขอ Hint 1</button>':''}${rescueHintLevel<2?'<button class="btn light" onclick="showHint(2)">ขอ Hint 2</button>':''}</div>`:'';
  document.getElementById('pane').innerHTML=`<div class="muted">${phaseLabel()}</div><div><span class="badge">${q.id}</span><span class="badge">${active.id}</span></div><h2>${esc(q.p)}</h2><div class="choices">${q.c.map((x,i)=>`<button class="choice ${sel===i?'sel':''}" onclick="pick(${i})">${String.fromCharCode(65+i)}. ${esc(x)}</button>`).join('')}</div><div class="conf"><button class="c ${cv===1?'on':''}" onclick="setc(1)">1 เดา</button><button class="c ${cv===2?'on':''}" onclick="setc(2)">2 ค่อนข้างมั่นใจ</button><button class="c ${cv===3?'on':''}" onclick="setc(3)">3 มั่นใจมาก</button></div>${hintBlock}${hintButtons}<div class="actions"><button class="btn primary" onclick="submitCurrent()">${phase==='fresh'&&idx<active.fresh.length-1?'ข้อต่อไป →':'ส่งคำตอบ'}</button><button class="btn light" onclick="renderHome()">ออกจาก Module</button></div>`;
}
function pick(i){answers[idx]=i;renderCurrentItem()}
function setc(v){conf[idx]=v;renderCurrentItem()}
function showHint(level){rescueHintLevel=Math.max(rescueHintLevel,level);log('hint_open',{skill:active.id,questionId:active.rescue.id,phase:'rescue',hintLevel:level});renderCurrentItem()}

function diagnose(q,selected,correct,confidence,responseTimeSec){
  if(correct){return confidence===1?{type:'low_confidence_correct',label:'ตอบถูกแต่ยังไม่มั่นใจ',reason:'ควรยืนยันด้วยข้อใหม่ ไม่ถือว่า mastery จากข้อเดียว',hint:null}:{type:'no_error_observed',label:'ยังไม่พบ error ในข้อนี้',reason:'เป็นหลักฐานหนึ่งจุดเท่านั้น',hint:null}}
  if(q.wrong&&q.wrong[selected]){const [type,reason,hint]=q.wrong[selected];return{type,label:type,reason,hint}}
  if(confidence===3)return{type:'misconception_risk',label:'เสี่ยง misconception',reason:'ตอบผิดพร้อมความมั่นใจสูง',hint:'ตรวจหลักการก่อนคำนวณซ้ำ'};
  if(responseTimeSec>=45)return{type:'strategy_or_processing_gap',label:'อาจติดที่ strategy/process',reason:'ตอบผิดและใช้เวลาค่อนข้างนาน',hint:'แบ่งโจทย์เป็นขั้นเล็กลง'};
  if(confidence===1)return{type:'knowledge_or_prerequisite_gap',label:'อาจมี knowledge/prerequisite gap',reason:'ตอบผิดพร้อม confidence ต่ำ',hint:'ทบทวนแนวคิดพื้นฐานก่อน'};
  return{type:'procedural_gap',label:'อาจมี procedural gap',reason:'ตอบผิด แต่หลักฐานยังไม่พอชี้เฉพาะจุด',hint:'ทำ worked example ทีละขั้น'};
}
function submitCurrent(){
  const q=currentQuestion(),selected=answers[idx],confidence=conf[idx];
  if(selected==null||confidence==null){alert('ตอบและเลือกความมั่นใจก่อน');return}
  const correct=selected===q.a,rt=Math.max(0,Math.round((Date.now()-itemStartAt)/1000));
  log('item_answer',{skill:active.id,phase,questionId:q.id,selected:String.fromCharCode(65+selected),correct,confidence,responseTimeSec:rt,hintLevel:phase==='rescue'?rescueHintLevel:0});
  const d=diagnose(q,selected,correct,confidence,rt);
  log('diagnosis_generated',{skill:active.id,phase,questionId:q.id,diagnosisType:d.type,reason:d.reason,evidenceStrength:'DEV_HEURISTIC'});
  if(phase==='diagnostic'){diagnosticEvidence={correct,confidence,responseTimeSec:rt,diagnosis:d};showLesson();return}
  if(phase==='fresh'){
    if(!correct)wrongEvidence.push({questionId:q.id,diagnosis:d,confidence,responseTimeSec:rt});
    if(idx<active.fresh.length-1){idx++;beginItem();return}
    finishFresh();return;
  }
  if(phase==='rescue'){finishRescue(correct,confidence,rt,d)}
}

function showLesson(){
  phase='teach';
  const d=diagnosticEvidence.diagnosis;
  document.getElementById('pane').innerHTML=`<h1>${esc(active.title)}</h1><div class="diagnosis"><div class="muted">Diagnostic hypothesis</div><strong>${esc(d.label)}</strong><div class="small">${esc(d.reason)}</div>${d.hint?`<div class="small"><b>Teaching focus:</b> ${esc(d.hint)}</div>`:''}</div><div class="lesson"><h3>Micro Lesson</h3><p>${esc(active.lesson)}</p><div class="visual">${esc(active.visual)}</div><a class="resource" target="_blank" rel="noopener" href="${active.url}" onclick="log('resource_open',{skill:active.id,url:active.url,phase:'teach'})">↗ ดูบทเรียน สสวท.</a><div class="actions"><button class="btn primary" onclick="beginFresh()">เริ่ม Fresh Transfer</button><button class="btn light" onclick="renderHome()">กลับ</button></div></div>`;
}
function beginFresh(){phase='fresh';idx=0;answers=[];conf=[];wrongEvidence=[];log('fresh_start',{skill:active.id});beginItem()}
function finishFresh(){
  let correct=0;active.fresh.forEach((q,i)=>{if(answers[i]===q.a)correct++});
  const freshScore=Math.round(correct/active.fresh.length*100);const avg=(conf.reduce((a,b)=>a+b,0)/conf.length).toFixed(2);
  log('fresh_complete',{skill:active.id,freshScore,avgConfidence:avg,wrongCount:wrongEvidence.length});
  if(wrongEvidence.length===0){completeModule({freshScore,avgConfidence:avg,rescueScore:null,rescueUsed:false});return}
  const lead=wrongEvidence.find(x=>x.confidence===3)||wrongEvidence[0];
  document.getElementById('pane').innerHTML=`<h1>Fresh Transfer Complete</h1><div class="feedback"><strong>Fresh accuracy: ${freshScore}%</strong><br>Average confidence: ${avg}</div><div class="diagnosis"><div class="muted">Rescue target — DEV hypothesis</div><strong>${esc(lead.diagnosis.label)}</strong><div class="small">${esc(lead.diagnosis.reason)}</div><div class="small">Fresh score ถูกล็อกแล้ว และจะไม่ถูกเพิ่มจาก Rescue</div></div><div class="actions"><button class="btn primary" onclick="beginRescue()">เข้า Rescue</button></div>`;
  state._pending={freshScore,avgConfidence:avg};save();
}
function beginRescue(){phase='rescue';idx=0;answers=[];conf=[];rescueHintLevel=0;log('rescue_start',{skill:active.id,wrongFreshItems:wrongEvidence.map(x=>x.questionId)});beginItem()}
function finishRescue(correct,confidence,rt,diagnosis){
  const pending=state._pending||{freshScore:0,avgConfidence:String(confidence)};
  const rescueScore=correct?100:0;
  log('rescue_complete',{skill:active.id,rescueScore,confidence,responseTimeSec:rt,hintsUsed:rescueHintLevel,diagnosisType:diagnosis.type});
  delete state._pending;completeModule({freshScore:pending.freshScore,avgConfidence:pending.avgConfidence,rescueScore,rescueUsed:true,hintsUsed:rescueHintLevel});
}
function completeModule({freshScore,avgConfidence,rescueScore,rescueUsed,hintsUsed=0}){
  const status=freshScore===100?'TENTATIVE_MASTERY_DEV':(rescueUsed&&rescueScore===100?'NEEDS_FRESH_RETEST_AFTER_SUPPORT':'NEEDS_FOUNDATION_REPAIR');
  const schedule=retentionSchedule();
  state.done[active.id]=true;
  state.results[active.id]={freshScore,rescueScore,avgConfidence,at:nowIso(),label:'DEV session evidence'};
  state.skillState[active.id]={status,freshAccuracy:freshScore,rescueAccuracy:rescueScore,diagnosticCorrect:diagnosticEvidence?.correct??null,avgConfidence:Number(avgConfidence),supportUsed:rescueUsed,hintsUsed,lastEvidenceAt:nowIso(),retentionDue:schedule};
  log('skill_state_update',{skill:active.id,status,freshAccuracy:freshScore,rescueAccuracy:rescueScore,supportUsed:rescueUsed});
  log('retention_scheduled',{skill:active.id,schedule});save();
  document.getElementById('pane').innerHTML=`<h1>DEV Module Complete</h1><div class="feedback"><strong>Fresh accuracy: ${freshScore}%</strong><br>Rescue: ${rescueScore==null?'not needed':rescueScore+'%'}<br>Average confidence: ${avgConfidence}</div><div class="diagnosis"><div class="muted">Skill State v1</div><strong>${status}</strong><div class="small">Retention checks scheduled: 1 / 3 / 7 / 21 days</div><div class="small">นี่เป็น Product QA state ไม่ใช่ child mastery claim</div></div><div class="actions"><button class="btn primary" onclick="renderHome()">กลับ Learning Queue</button></div>`;
}

function showTelemetry(){hideAll();document.getElementById('telemetry').classList.remove('hidden');document.getElementById('telemetryBox').textContent=JSON.stringify({skillState:state.skillState,events:state.events},null,2)}
function copySummary(){const lines=['KIDS LEARNING HUB — ADULT DEV TESTER',state.profile.tester+' • '+state.profile.scenario,'App '+APP_VERSION,''];SKILLS.forEach(s=>{const r=state.results[s.id],ss=state.skillState[s.id];lines.push(s.title+': '+(r?`Fresh ${r.freshScore}% | Rescue ${r.rescueScore==null?'n/a':r.rescueScore+'%'} | ${ss?.status||'no state'}`:'pending'))});lines.push('Events: '+state.events.length);const text=lines.join('\n');navigator.clipboard?.writeText(text).then(()=>alert('คัดลอกผลแล้ว')).catch(()=>prompt('คัดลอกข้อความนี้',text))}
function downloadJSON(){const blob=new Blob([JSON.stringify({meta:{mode:'ADULT_DEV_TEST',appVersion:APP_VERSION,contentVersion:CONTENT_VERSION,eventSchemaVersion:EVENT_SCHEMA_VERSION,exportedAt:nowIso()},profile:state.profile,results:state.results,skillState:state.skillState,events:state.events},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='klh_dev_tester_session_v04.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function resetApp(){if(confirm('ล้างข้อมูล DEV tester v0.4 ใน browser เครื่องนี้?')){localStorage.removeItem(KEY);localStorage.removeItem(LEGACY_KEY);location.reload()}}
if(state.profile)renderHome();