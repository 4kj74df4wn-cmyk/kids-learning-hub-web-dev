// Kids Learning Hub — Curriculum Readiness Layer v0.9
// P0 architecture: current curriculum first, future content as preview/bridge, never as weakness.

const CURRICULUM_LAYER_VERSION='0.9.0-dev';

const CURRICULUM_META={
  division:{sourceGrade:4,sourceTerm:1,domain:'Math',defaultRole:'REVIEW',note:'อ้างอิงแหล่งบทเรียนระดับ ป.4 ที่ใช้ใน DEV'},
  fraction:{sourceGrade:5,sourceTerm:1,domain:'Math',defaultRole:'CURRENT',note:'อ้างอิงแหล่งบทเรียนระดับ ป.5 ที่ใช้ใน DEV'},
  decimal:{sourceGrade:6,sourceTerm:1,domain:'Math',defaultRole:'FUTURE',note:'อ้างอิงแหล่งบทเรียนระดับ ป.6 ที่ใช้ใน DEV'}
};

const GOAL_LABELS={
  school:'เรียนให้ทันโรงเรียน',
  foundation:'ปูพื้นฐานให้แน่น',
  advance:'เรียนล่วงหน้าเล็กน้อย',
  target:'เตรียมสอบโรงเรียนเป้าหมาย',
  intensive:'เร่งเข้มข้น'
};

function ensureCurriculumProfile(){
  if(!state.profile) state.profile={tester:'DEV Tester',scenario:'General Adaptive Learning'};
  if(!state.profile.exposureOverrides) state.profile.exposureOverrides={};
  if(!Array.isArray(state.profile.archivedExposure)) state.profile.archivedExposure=[];
  if(!state.profile.grade) state.profile.grade=5;
  if(!state.profile.term) state.profile.term=1;
  if(!state.profile.goalMode) state.profile.goalMode='target';
  if(!state.profile.targetName) state.profile.targetName='PCSHS M.1';
}

function currentContext(){
  ensureCurriculumProfile();
  return {grade:Number(state.profile.grade||5),term:Number(state.profile.term||1),goalMode:state.profile.goalMode||'target',targetName:state.profile.targetName||'',exposureOverrides:state.profile.exposureOverrides||{}};
}

function curriculumStatus(skill){
  const ctx=currentContext();
  const meta=CURRICULUM_META[skill.id]||{sourceGrade:ctx.grade,sourceTerm:ctx.term};
  const override=ctx.exposureOverrides[skill.id];
  if(override==='NOT_YET_TAUGHT') return {code:'NOT_YET_TAUGHT',label:'ยังไม่เคยเรียน • ไม่นับเป็นจุดอ่อน',scoreable:false,meta};
  if(override==='LEARNED') return {code:meta.sourceGrade<ctx.grade?'REVIEW':'CURRENT',label:meta.sourceGrade<ctx.grade?'เคยเรียนแล้ว • ทบทวน':'เคยเรียนแล้ว • เช็กความเข้าใจ',scoreable:true,meta};
  if(meta.sourceGrade<ctx.grade) return {code:'REVIEW',label:'เคยเรียนแล้ว • ทบทวน',scoreable:true,meta};
  if(meta.sourceGrade===ctx.grade){if((meta.sourceTerm||1)<=ctx.term) return {code:'CURRENT',label:'อยู่ในระดับที่กำลังเรียน',scoreable:true,meta};return {code:'PREVIEW',label:'บทข้างหน้า • เรียนล่วงหน้าได้',scoreable:false,meta};}
  if(meta.sourceGrade===ctx.grade+1){if(['target','intensive','advance'].includes(ctx.goalMode)) return {code:'BRIDGE',label:'ปูทางสู่เป้าหมาย • สอนก่อนวัด',scoreable:false,meta};return {code:'PREVIEW',label:'ยังไม่ถึงบทนี้ • เรียนล่วงหน้าได้',scoreable:false,meta};}
  return {code:'STRETCH',label:'เนื้อหาอนาคต • ยังไม่ใช้วัดจุดอ่อน',scoreable:false,meta};
}

function archiveSkillEvidence(skillId,reason){ensureCurriculumProfile();const has=state.results?.[skillId]||state.skillState?.[skillId]||state.done?.[skillId];if(!has)return false;state.profile.archivedExposure.push({at:nowIso(),skill:skillId,reason,result:state.results?.[skillId]||null,skillState:state.skillState?.[skillId]||null,done:state.done?.[skillId]||false,label:'ARCHIVED_DEV_EXPOSURE_NOT_MASTERY'});if(state.results)delete state.results[skillId];if(state.skillState)delete state.skillState[skillId];if(state.done)delete state.done[skillId];return true}
function reclassifyNonScoreableEvidence(){ensureCurriculumProfile();let changed=false;SKILLS.forEach(skill=>{const st=curriculumStatus(skill);if(!st.scoreable)changed=archiveSkillEvidence(skill.id,'curriculum_status='+st.code)||changed});if(changed){log('curriculum_evidence_archived',{layer:CURRICULUM_LAYER_VERSION});save()}}

function injectSetupFields(){const setup=document.getElementById('setup');if(!setup||document.getElementById('curriculumSetup'))return;const actions=setup.querySelector('.actions');if(!actions)return;const box=document.createElement('div');box.id='curriculumSetup';box.innerHTML=`<div class="field"><label>ตอนนี้เรียนชั้นไหน</label><select id="learnerGrade"><option value="3">ป.3</option><option value="4">ป.4</option><option value="5" selected>ป.5</option><option value="6">ป.6</option></select></div><div class="field"><label>เทอม</label><select id="learnerTerm"><option value="1" selected>เทอม 1</option><option value="2">เทอม 2</option></select></div><div class="field"><label>อยากให้ระบบช่วยแบบไหน</label><select id="goalMode"><option value="school">เรียนให้ทันโรงเรียน</option><option value="foundation">ปูพื้นฐานให้แน่น</option><option value="advance">เรียนล่วงหน้าเล็กน้อย</option><option value="target" selected>เตรียมสอบโรงเรียนเป้าหมาย</option><option value="intensive">เร่งเข้มข้น</option></select></div><div class="field" id="targetField"><label>เป้าหมาย (ถ้ามี)</label><input id="targetName" maxlength="80" value="PCSHS M.1" placeholder="เช่น PCSHS M.1"></div><div class="notice" style="margin-top:13px"><strong>กติกาใหม่:</strong> เรื่องที่ยังไม่เคยเรียนจะถูกสอนในโหมด Preview/Bridge และ <strong>จะไม่ถูกนับเป็นจุดอ่อน</strong></div>`;setup.insertBefore(box,actions);const gm=box.querySelector('#goalMode'),tf=box.querySelector('#targetField');gm.addEventListener('change',()=>{tf.style.display=['target','intensive'].includes(gm.value)?'grid':'none'})}

const KLH_ENTER_APP_ORIGINAL=enterApp;
enterApp=function(){const ctx={grade:Number(document.getElementById('learnerGrade')?.value||5),term:Number(document.getElementById('learnerTerm')?.value||1),goalMode:document.getElementById('goalMode')?.value||'target',targetName:(document.getElementById('targetName')?.value||'').trim()};KLH_ENTER_APP_ORIGINAL();ensureCurriculumProfile();Object.assign(state.profile,ctx,{curriculumLayerVersion:CURRICULUM_LAYER_VERSION});reclassifyNonScoreableEvidence();log('learner_context_set',{grade:ctx.grade,term:ctx.term,goalMode:ctx.goalMode,targetName:ctx.targetName,curriculumLayer:CURRICULUM_LAYER_VERSION});save();renderHome()};
const KLH_PRIORITY_ORIGINAL=priorityScore;
priorityScore=function(skill){const st=curriculumStatus(skill),base=KLH_PRIORITY_ORIGINAL(skill);if(st.code==='REVIEW'||st.code==='CURRENT')return base+40;if(st.code==='BRIDGE')return Math.min(base,42);if(st.code==='PREVIEW')return Math.min(base,30);if(st.code==='NOT_YET_TAUGHT')return Math.min(base,28);return Math.min(base,15)};
function curriculumRecommendation(){return [...SKILLS].sort((a,b)=>priorityScore(b)-priorityScore(a))[0]}
function statusStyle(code){if(code==='CURRENT'||code==='REVIEW')return'background:#eaf9f3;color:#08724f';if(code==='BRIDGE')return'background:#eef3ff;color:#3155a4';if(code==='PREVIEW'||code==='NOT_YET_TAUGHT')return'background:#fff5e8;color:#8b5900';return'background:#f3f0ff;color:#624aa8'}

function annotateCurriculumHome(){const home=document.getElementById('home');if(!home||home.classList.contains('hidden'))return;const ctx=currentContext();let contextCard=document.getElementById('curriculumContextCard');if(!contextCard){contextCard=document.createElement('div');contextCard.id='curriculumContextCard';contextCard.className='card';const first=home.querySelector('.card');if(first&&first.nextSibling)home.insertBefore(contextCard,first.nextSibling);else home.prepend(contextCard)}contextCard.innerHTML=`<div class="lab">เส้นทางของรอบนี้</div><h2>ป.${ctx.grade} เทอม ${ctx.term} • ${GOAL_LABELS[ctx.goalMode]||ctx.goalMode}</h2><p class="muted">${ctx.targetName?`เป้าหมาย: <strong>${esc(ctx.targetName)}</strong> • `:''}ระบบจะเริ่มจากเรื่องที่ควรรู้แล้วก่อน ส่วนเรื่องอนาคตจะสอนก่อนและไม่เอาคะแนนไปตีความว่าเป็นจุดอ่อน</p>`;const rec=curriculumRecommendation(),rst=curriculumStatus(rec),ap=document.getElementById('adaptivePanel');if(ap)ap.innerHTML=`<div class="card"><div class="lab">แนะนำให้ทำต่อ</div><h2>${esc(rec.title)}</h2><p class="muted">${rst.scoreable?'เรื่องนี้เหมาะสำหรับเช็กความเข้าใจจากสิ่งที่เรียนมาแล้ว':'เรื่องนี้อยู่ข้างหน้าระดับปัจจุบัน เราจะสอนก่อน แล้วค่อยให้ลองแบบไม่เอาไปนับเป็นจุดอ่อน'}</p><span class="tag" style="${statusStyle(rst.code)}">${rst.label}</span></div>`;[...document.querySelectorAll('#queue .module')].forEach(mod=>{const title=mod.querySelector('strong')?.textContent?.trim(),skill=SKILLS.find(s=>s.title===title);if(!skill)return;const st=curriculumStatus(skill);let badge=mod.querySelector('.curriculum-badge');if(!badge){badge=document.createElement('div');badge.className='curriculum-badge';mod.insertBefore(badge,mod.firstChild)}badge.innerHTML=`<span class="tag" style="${statusStyle(st.code)}">${st.label}</span>`;const btn=mod.querySelector('.actions .btn.primary');if(btn&&!st.scoreable){btn.setAttribute('onclick',`startPreview('${skill.id}')`);btn.textContent=st.code==='BRIDGE'?'ปูพื้นฐานเรื่องนี้ก่อน':'เรียนเรื่องนี้ก่อน'}let exposure=mod.querySelector('.exposure-control');if(!exposure){exposure=document.createElement('div');exposure.className='exposure-control small muted';exposure.style.marginTop='9px';mod.appendChild(exposure)}if(st.code==='CURRENT'||st.code==='REVIEW')exposure.innerHTML=`ถ้ายังไม่เคยเรียนเรื่องนี้ <button class="btn light" style="padding:5px 8px;margin-left:5px" onclick="markNotTaught('${skill.id}')">บอกระบบ</button>`;else exposure.innerHTML=`ถ้าเคยเรียนเรื่องนี้แล้ว <button class="btn light" style="padding:5px 8px;margin-left:5px" onclick="markLearned('${skill.id}')">บอกระบบ</button>`})}

const KLH_RENDER_HOME_ORIGINAL=renderHome;
renderHome=function(){reclassifyNonScoreableEvidence();KLH_RENDER_HOME_ORIGINAL();annotateCurriculumHome()};
function markNotTaught(skillId){ensureCurriculumProfile();state.profile.exposureOverrides[skillId]='NOT_YET_TAUGHT';archiveSkillEvidence(skillId,'manual_not_yet_taught');log('exposure_override',{skill:skillId,value:'NOT_YET_TAUGHT'});save();renderHome()}
function markLearned(skillId){ensureCurriculumProfile();state.profile.exposureOverrides[skillId]='LEARNED';log('exposure_override',{skill:skillId,value:'LEARNED'});save();renderHome()}
const KLH_START_ORIGINAL=start;
start=function(id){const skill=SKILLS.find(s=>s.id===id),st=curriculumStatus(skill);if(!st.scoreable)return startPreview(id);return KLH_START_ORIGINAL(id)};

let previewState={skillId:null,index:0,attempts:{}};
function startPreview(id){const skill=SKILLS.find(s=>s.id===id);if(!skill)return;const st=curriculumStatus(skill);previewState={skillId:id,index:0,attempts:{}};active=skill;phase='curriculum_preview';log('preview_start',{skill:id,curriculumStatus:st.code,scoreable:false,sourceGrade:st.meta.sourceGrade});hideAll();document.getElementById('learn').classList.remove('hidden');const p=document.getElementById('pane');p.innerHTML=`<span class="tag" style="${statusStyle(st.code)}">${st.label}</span><h1 style="margin-top:10px">เรื่องนี้ยังใหม่ — เรียนก่อน ไม่ต้องสอบ</h1><p class="muted">การทำไม่ได้ตอนนี้ไม่ได้แปลว่าอ่อน เพราะเรื่องนี้ยังอยู่นอกสิ่งที่เราควรใช้วัดความเข้าใจของระดับปัจจุบัน</p><div class="lesson"><h3>${esc(skill.title)}</h3><p>${esc(skill.lesson)}</p><div class="visual">${esc(skill.visual)}</div>${skill.url?`<a class="resource" href="${skill.url}" target="_blank" rel="noopener" onclick="log('preview_resource_open',{skill:'${skill.id}'})">ดูตัวอย่างจากแหล่งเรียนรู้ ↗</a>`:''}</div><div class="actions"><button class="btn primary" onclick="previewPractice('${id}',0)">เข้าใจแล้ว — ลองข้อแรกแบบไม่เก็บคะแนน</button><button class="btn light" onclick="renderHome()">ไว้เรียนทีหลัง</button></div>${devDetails(`Curriculum=${st.code} • sourceGrade=P${st.meta.sourceGrade} • scoreable=false • layer=${CURRICULUM_LAYER_VERSION}`)}`}
function previewQuestions(skill){return[skill.diagnostic,skill.fresh[0]].filter(Boolean)}
function previewPractice(id,index){const skill=SKILLS.find(s=>s.id===id),qs=previewQuestions(skill),q=qs[index];if(!q)return previewFinish(id);previewState.skillId=id;previewState.index=index;document.getElementById('pane').innerHTML=`<div class="small muted">ลองหลังเรียน ${index+1} / ${qs.length} • ไม่เอาคะแนนนี้ไปนับเป็นจุดอ่อน</div><h2 style="margin-top:8px">${esc(q.p)}</h2><div class="choices">${q.c.map((c,i)=>`<button class="choice" onclick="previewAnswer('${id}',${index},${i},this)">${String.fromCharCode(65+i)}. ${esc(c)}</button>`).join('')}</div><div id="previewFeedback"></div><div class="actions"><button class="btn light" onclick="startPreview('${id}')">กลับดูวิธีคิด</button></div>`}
function previewAnswer(id,index,choice,button){const skill=SKILLS.find(s=>s.id===id),qs=previewQuestions(skill),q=qs[index],ok=choice===q.a;document.querySelectorAll('#pane .choice').forEach(b=>b.disabled=true);previewState.attempts[index]={choice,ok};log('preview_practice_item',{skill:id,item:q.id,correct:ok,curriculumStatus:curriculumStatus(skill).code,scoreable:false});const fb=document.getElementById('previewFeedback');fb.innerHTML=`<div class="feedback">${ok?'<strong>ถูกต้อง 🎯</strong> ดีเลย ลองใช้วิธีคิดนี้กับข้อใหม่':'<strong>ยังไม่ใช่</strong> ไม่เป็นไร เรื่องนี้ยังใหม่ ลองกลับไปดูวิธีคิดอีกครั้งได้'}</div><div class="actions">${ok&&index<qs.length-1?`<button class="btn primary" onclick="previewPractice('${id}',${index+1})">ลองอีกข้อ</button>`:ok?`<button class="btn primary" onclick="previewFinish('${id}')">จบรอบเรียนล่วงหน้า</button>`:`<button class="btn primary" onclick="startPreview('${id}')">ดูวิธีคิดอีกครั้ง</button>`}</div>`}
function previewFinish(id){const skill=SKILLS.find(s=>s.id===id),st=curriculumStatus(skill),p=document.getElementById('pane');log('preview_complete',{skill:id,curriculumStatus:st.code,scoreable:false,attempts:previewState.attempts});p.innerHTML=`<h1>วันนี้ได้รู้จักเรื่องใหม่แล้ว 🌱</h1><p>รอบนี้เป็นการเรียนล่วงหน้า จึง <strong>ไม่เอาคะแนนไปนับเป็นจุดอ่อนหรือ Mastery</strong> ของระดับปัจจุบัน</p><div class="next"><strong>ต่อไป:</strong> ระบบจะกลับมาหาเรื่องนี้อีกเมื่อถึงลำดับที่เหมาะ หรือเมื่อเส้นทางสู่เป้าหมายต้องใช้มัน</div><div class="actions"><button class="btn primary" onclick="renderHome()">เลือกเรื่องต่อไป</button></div>`}
function bootCurriculumLayer(){injectSetupFields();if(state.profile){ensureCurriculumProfile();reclassifyNonScoreableEvidence();save()}}
bootCurriculumLayer();