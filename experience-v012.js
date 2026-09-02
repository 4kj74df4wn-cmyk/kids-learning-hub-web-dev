// Kids Learning Hub — AI-first child experience shell v0.12
// Rebuilds onboarding + navigation around: School context → Subject → Learn / Practice / Exam.
(function(){
const V='0.12.0-dev';
const CTX_KEY='KLH_V012_CONTEXT';
const FALLBACK_SCHOOLS=['โรงเรียนอัสสัมชัญลำปาง','โรงเรียนบุญวาทย์วิทยาลัย','โรงเรียนลำปางกัลยาณี','โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย ลำปาง','โรงเรียนมหิดลวิทยานุสรณ์','โรงเรียนกำเนิดวิทย์','โรงเรียนเตรียมอุดมศึกษา','โรงเรียนสวนกุหลาบวิทยาลัย','โรงเรียนสตรีวิทยา','โรงเรียนสามเสนวิทยาลัย'];
const SCHOOL_PROFILES={
 'โรงเรียนอัสสัมชัญลำปาง':{network:'มูลนิธิคณะเซนต์คาเบรียลแห่งประเทศไทย',type:'โรงเรียนเอกชน',curriculum:'ใช้มาตรฐานการศึกษาไทยเป็นฐาน และมีรายวิชา/โปรแกรมเพิ่มเติมของโรงเรียน',verified:'network',note:'ลำดับบทเรียนรายชั้นยังต้องยืนยันจากแผนการสอน/ข้อมูลโรงเรียนก่อนใช้เป็น mastery map'},
 'โรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย ลำปาง':{network:'เครือโรงเรียนวิทยาศาสตร์จุฬาภรณราชวิทยาลัย',type:'โรงเรียนวิทยาศาสตร์ระดับภูมิภาค',curriculum:'หลักสูตรเน้นวิทยาศาสตร์ คณิตศาสตร์ และการวิจัย',verified:'network'}
};
const SUBJECTS={
 math:{name:'คณิตศาสตร์',icon:'🧮',tone:'violet',desc:'คิดเป็นขั้น • แก้โจทย์ • เตรียมสอบ'},
 science:{name:'วิทยาศาสตร์',icon:'🔬',tone:'mint',desc:'เข้าใจเหตุผล • ทดลอง • เชื่อมโยง'},
 english:{name:'ภาษาอังกฤษ',icon:'🌍',tone:'sky',desc:'อ่าน • ฟัง • พูด • ใช้จริง'},
 thai:{name:'ภาษาไทย',icon:'📚',tone:'sun',desc:'อ่านโจทย์ • จับใจความ • สื่อสาร'},
 chinese:{name:'ภาษาจีน',icon:'🀄',tone:'rose',desc:'พื้นฐานจีนสำหรับอนาคต'}
};
let schoolList=[];
let selectedSubject='math';
let currentMode='learn';

function $(id){return document.getElementById(id)}
function showOnly(id){['setup','home','subject','learn','telemetry'].forEach(x=>$(x)?.classList.toggle('hidden',x!==id));window.scrollTo({top:0,behavior:'smooth'});}
function readCtx(){try{return JSON.parse(localStorage.getItem(CTX_KEY)||'null')}catch(e){return null}}
function saveCtx(ctx){localStorage.setItem(CTX_KEY,JSON.stringify(ctx));}
function selectedSchool(selectId,otherId){const v=$(selectId)?.value||'';return v==='__OTHER__'?($(otherId)?.value||'').trim():v;}
function fillSelect(id,list,placeholder){const s=$(id);if(!s)return;s.innerHTML=`<option value="" selected disabled>${placeholder}</option>`+list.map(x=>`<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join('')+'<option value="__OTHER__">โรงเรียนอื่นๆ</option>';}
function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

async function loadSchools(){
 try{
   const t=await fetch('./school-target-autocomplete-v011.js?v=0.12.0').then(r=>r.text());
   const m=t.match(/const S=(\[[\s\S]*?\]);\nconst A=/);
   schoolList=m?JSON.parse(m[1]):FALLBACK_SCHOOLS;
 }catch(e){schoolList=FALLBACK_SCHOOLS;}
 fillSelect('currentSchool',schoolList,'เลือกโรงเรียนที่เรียนอยู่');
 fillSelect('targetSchool',schoolList,'เลือกโรงเรียนเป้าหมาย');
 restoreOnboarding();
}
function restoreOnboarding(){const c=readCtx();if(!c)return;['tester','learnerGrade','learnerTerm','goalMode','targetLevel'].forEach(id=>{if($(id)&&c[id]!=null)$(id).value=String(c[id])});setSchoolValue('currentSchool','currentSchoolOther',c.currentSchool);setSchoolValue('targetSchool','targetSchoolOther',c.targetSchool);syncConditionalFields();showSchoolProfile();}
function setSchoolValue(selectId,otherId,value){if(!value)return;const s=$(selectId);if([...s.options].some(o=>o.value===value))s.value=value;else{s.value='__OTHER__';$(otherId).value=value;$(otherId).classList.remove('hidden');}}
function syncConditionalFields(){
 const goal=$('goalMode')?.value||'';const target=['target','intensive'].includes(goal);
 $('targetBlock')?.classList.toggle('hidden',!target);
 ['currentSchool','targetSchool'].forEach(id=>{const other=$(id)?.value==='__OTHER__';$(id+'Other')?.classList.toggle('hidden',!other)});
}
function showSchoolProfile(){const school=selectedSchool('currentSchool','currentSchoolOther'),box=$('schoolProfile');if(!box)return;if(!school){box.innerHTML='';return;}const p=SCHOOL_PROFILES[school];if(p){box.innerHTML=`<div class="school-found"><span>✓</span><div><strong>รู้จักโรงเรียนนี้แล้ว</strong><div>${escapeHtml(p.network)} • ${escapeHtml(p.type)}</div><small>${escapeHtml(p.curriculum)}</small></div></div>`;}else{box.innerHTML=`<div class="school-pending"><span>🔎</span><div><strong>บันทึกโรงเรียนแล้ว</strong><div>ใน Product จริง AI Research จะตรวจสังกัด หลักสูตร และลำดับบทเรียนของโรงเรียนนี้ก่อนสร้างแผน</div></div></div>`;}}
function validateOnboarding(){const req=[['tester','ใส่ชื่อเล่น'],['currentSchool','เลือกโรงเรียนที่เรียนอยู่'],['learnerGrade','เลือกชั้นเรียน'],['learnerTerm','เลือกเทอม'],['goalMode','เลือกเป้าหมาย']];for(const [id,msg] of req){if(!$(id)?.value)return msg;}if($('currentSchool').value==='__OTHER__'&&!$('currentSchoolOther').value.trim())return'พิมพ์ชื่อโรงเรียนที่เรียนอยู่';if(['target','intensive'].includes($('goalMode').value)){if(!$('targetSchool').value)return'เลือกโรงเรียนเป้าหมาย';if($('targetSchool').value==='__OTHER__'&&!$('targetSchoolOther').value.trim())return'พิมพ์ชื่อโรงเรียนเป้าหมาย';if(!$('targetLevel').value)return'เลือกระดับที่จะสอบเข้า';}return'';}
window.enterHub=function(){const err=validateOnboarding();if(err){$('setupError').textContent=err;$('setupError').classList.remove('hidden');return;}$('setupError').classList.add('hidden');const ctx={tester:$('tester').value.trim(),currentSchool:selectedSchool('currentSchool','currentSchoolOther'),learnerGrade:Number($('learnerGrade').value),learnerTerm:Number($('learnerTerm').value),goalMode:$('goalMode').value,targetSchool:selectedSchool('targetSchool','targetSchoolOther'),targetLevel:$('targetLevel')?.value||'',version:V};saveCtx(ctx);if(typeof state!=='undefined'){state.profile={...(state.profile||{}),tester:ctx.tester,grade:ctx.learnerGrade,term:ctx.learnerTerm,goalMode:ctx.goalMode,currentSchool:ctx.currentSchool,targetName:ctx.targetSchool,targetLevel:ctx.targetLevel,experienceVersion:V};try{save();log('learner_context_v012',ctx)}catch(e){}}renderHome();}

function goalText(c){const m={school:'เรียนให้ทันโรงเรียน',foundation:'ปูพื้นฐานให้แน่น',advance:'เรียนล่วงหน้า',target:'เตรียมสอบโรงเรียนเป้าหมาย',intensive:'เร่งเข้มข้น'};return m[c.goalMode]||'';}
function recommendedSubjects(c){if(/จุฬาภรณ|PCSHS/i.test(c.targetSchool||''))return ['math','science','english','thai'];if(c.goalMode==='target'||c.goalMode==='intensive')return ['math','science','english','thai'];return ['math','thai','science','english','chinese'];}
function intensity(c){return c.goalMode==='intensive'?'เข้มข้น 30–40 นาที':c.goalMode==='target'?'ติวเป้าหมาย 20–30 นาที':c.goalMode==='advance'?'เรียนล่วงหน้า 20 นาที':'เรียนพอดี 15–20 นาที';}
window.renderHome=function(){const c=readCtx();if(!c){showOnly('setup');return;}showOnly('home');$('homeGreeting').textContent=`${c.tester} วันนี้อยากเริ่มวิชาไหน?`;$('homeContext').innerHTML=`<strong>ป.${c.learnerGrade} เทอม ${c.learnerTerm}</strong> • ${escapeHtml(c.currentSchool)}<br>${escapeHtml(goalText(c))}${c.targetSchool?` → <strong>${escapeHtml(c.targetSchool)} ${escapeHtml(c.targetLevel||'')}</strong>`:''}`;$('intensityChip').textContent=intensity(c);const list=recommendedSubjects(c);$('subjectGrid').innerHTML=list.map((id,i)=>{const s=SUBJECTS[id];const priority=i<2&&['target','intensive'].includes(c.goalMode);return `<button class="subject-card ${s.tone}" onclick="openSubject('${id}')"><span class="subject-icon">${s.icon}</span><span class="subject-copy"><strong>${s.name}</strong><small>${s.desc}</small>${priority?'<em>สำคัญต่อเป้าหมาย</em>':''}</span><span class="arrow">›</span></button>`}).join('');$('todayCoach').innerHTML=buildCoachRecommendation(c);}
function buildCoachRecommendation(c){if(/จุฬาภรณ|PCSHS/i.test(c.targetSchool||''))return `<div class="coach-hero"><div class="coach-avatar">✨</div><div><span>ครูแนะนำวันนี้</span><h2>เลือกคณิตศาสตร์หรือวิทยาศาสตร์ก่อน</h2><p>เราเน้นวิชาที่เกี่ยวกับเป้าหมาย แต่จะไม่เอาเรื่องที่ยังไม่ได้เรียนมาวัดว่าอ่อน</p></div></div>`;return `<div class="coach-hero"><div class="coach-avatar">✨</div><div><span>ครูแนะนำวันนี้</span><h2>เลือกวิชาที่อยากเริ่มได้เลย</h2><p>เรียนก่อน ฝึกทีหลัง หรืออยากลองข้อสอบก็เลือกได้เอง</p></div></div>`;}

window.openSubject=function(id){selectedSubject=id;const s=SUBJECTS[id];showOnly('subject');$('crumb').innerHTML=`<button onclick="renderHome()">หน้าหลัก</button><span>›</span><strong>${s.name}</strong>`;$('subjectHero').innerHTML=`<div class="big-icon">${s.icon}</div><div><span>เลือกวิธีเรียน</span><h1>${s.name}</h1><p>${s.desc}</p></div>`;$('modeGrid').innerHTML=[['learn','🤖','เรียนกับ AI','ให้ครูอธิบายทีละขั้น ถามได้ ขออีกวิธีได้'],['practice','🎯','ฝึกทำโจทย์','เลือกเรื่องที่เคยเรียนแล้ว แล้วฝึกให้คล่อง'],['exam','🏁','ลองข้อสอบ','ลอง Mini Test หรือข้อสอบตามเป้าหมาย เมื่อพร้อม']].map(([m,ic,t,d])=>`<button class="mode-card" onclick="openMode('${m}')"><span>${ic}</span><div><strong>${t}</strong><small>${d}</small></div><b>›</b></button>`).join('');}
window.openMode=function(mode){currentMode=mode;if(selectedSubject!=='math'){showComingSoon(mode);return;}showMathTopics(mode);}
function showComingSoon(mode){showOnly('learn');const s=SUBJECTS[selectedSubject];$('pane').innerHTML=`<button class="backlink" onclick="openSubject('${selectedSubject}')">← กลับ ${s.name}</button><div class="tutor-empty"><div class="big-icon">${s.icon}</div><h1>${mode==='learn'?'เรียนกับ AI':mode==='practice'?'ฝึกทำโจทย์':'ลองข้อสอบ'} — ${s.name}</h1><p>Navigation พร้อมแล้ว แต่คลังเนื้อหาวิชานี้ยังไม่ถูกเชื่อมใน DEV build นี้ จึงไม่สร้างบทเรียนหรือข้อสอบปลอมให้เด็ก</p><button class="btn primary" onclick="openSubject('${selectedSubject}')">เลือกแบบอื่น</button></div>`;}
function showMathTopics(mode){showOnly('learn');const title=mode==='learn'?'วันนี้อยากเรียนเรื่องไหน?':mode==='practice'?'เลือกเรื่องที่เคยเรียนแล้ว':'เลือกแบบทดสอบ';const intro=mode==='learn'?'ไม่ต้องรู้มาก่อน ครูจะสอนก่อน':mode==='practice'?'ถ้ายังไม่เคยเรียน เราจะพากลับไปเรียนก่อน':'ใช้เพื่อท้าทายตัวเอง คะแนนข้อที่เกินชั้นจะไม่ถูกตีความว่าเป็นจุดอ่อน';$('pane').innerHTML=`<button class="backlink" onclick="openSubject('math')">← กลับคณิตศาสตร์</button><div class="lesson-head"><span>${mode==='learn'?'🤖':mode==='practice'?'🎯':'🏁'}</span><div><h1>${title}</h1><p>${intro}</p></div></div><div class="topic-list">${SKILLS.map(s=>`<button class="topic-row" onclick="chooseMathTopic('${s.id}','${mode}')"><div><strong>${escapeHtml(s.title)}</strong><small>${topicSafetyLabel(s.id)}</small></div><span>›</span></button>`).join('')}</div>`;}
function topicSafetyLabel(id){const c=readCtx();if(id==='decimal'&&c?.learnerGrade<=5)return'เนื้อหาล่วงหน้า • เรียนได้ แต่ไม่ใช้วัดจุดอ่อน';return'ระบบจะถามก่อนว่าเคยเรียนแล้วหรือยัง';}
window.chooseMathTopic=function(id,mode){if(mode==='learn')return tutorLesson(id);if(mode==='practice')return askExposure(id,'practice');return askExposure(id,'exam');}
function askExposure(id,mode){const s=SKILLS.find(x=>x.id===id);showOnly('learn');$('pane').innerHTML=`<button class="backlink" onclick="showMathTopics('${mode}')">← กลับ</button><div class="decision-card"><div class="big-icon">🧭</div><h1>${escapeHtml(s.title)}</h1><p class="lead">เรื่องนี้เคยเรียนที่โรงเรียนแล้วหรือยัง?</p><div class="decision-actions"><button class="choice-big yes" onclick="startCorePractice('${id}','${mode}')">เคยเรียนแล้ว</button><button class="choice-big no" onclick="tutorLesson('${id}')">ยังไม่ได้เรียน</button></div><p class="muted">ถ้ายังไม่ได้เรียน เราจะสอนก่อน ไม่เอาคะแนนไปบอกว่าอ่อน</p></div>`;}
window.startCorePractice=function(id,mode){showOnly('learn');try{log('v012_mode_start',{subject:'math',skill:id,mode});}catch(e){};start(id);}
function altExplain(s){if(s.id==='division')return'คิดกลับด้าน: แทนที่จะถามว่า “หารได้เท่าไร” ลองถามว่า “24 คูณกี่ครั้งจึงได้จำนวนนี้”';if(s.id==='fraction')return'คำว่า “ของ” ในโจทย์เศษส่วน ให้แปลเป็นเครื่องหมายคูณก่อน แล้วค่อยตัดทอน';return'ทำให้ตัวหารไม่มีจุดทศนิยมก่อน โดยเลื่อนจุดของทั้งสองจำนวนเท่ากัน';}
window.tutorLesson=function(id,alt=false){const s=SKILLS.find(x=>x.id===id);showOnly('learn');$('pane').innerHTML=`<button class="backlink" onclick="showMathTopics('learn')">← เลือกเรื่องอื่น</button><div class="ai-stage"><div class="ai-avatar">🤖</div><div class="ai-bubble"><span>ครู AI</span><h1>${escapeHtml(s.title)}</h1><p>${escapeHtml(alt?altExplain(s):s.lesson)}</p><div class="visual">${escapeHtml(s.visual)}</div></div></div><div class="quick-actions"><button class="btn light" onclick="tutorLesson('${id}',true)">อธิบายอีกแบบ</button>${s.url?`<a class="btn light" href="${s.url}" target="_blank" rel="noopener">ดูตัวอย่างเพิ่ม ↗</a>`:''}<button class="btn primary" onclick="tryAfterLesson('${id}')">เข้าใจแล้ว ลอง 1 ข้อ</button></div>`;try{log('v012_tutor_lesson',{skill:id,alt})}catch(e){}}
window.tryAfterLesson=function(id){const s=SKILLS.find(x=>x.id===id),q=s.fresh[0];$('pane').innerHTML=`<button class="backlink" onclick="tutorLesson('${id}')">← กลับไปดูวิธีคิด</button><div class="lesson-head"><span>🌱</span><div><h1>ลองใช้วิธีที่เพิ่งเรียน</h1><p>ข้อนี้เป็นการลองหลังเรียน ไม่ใช้ตัดสินว่าเก่งหรืออ่อน</p></div></div><div class="qbox"><h2>${escapeHtml(q.p)}</h2><div class="choices">${q.c.map((c,i)=>`<button class="choice" onclick="answerTutorTry('${id}',${i})">${String.fromCharCode(65+i)}. ${escapeHtml(c)}</button>`).join('')}</div><div id="tutorFeedback"></div></div>`;}
window.answerTutorTry=function(id,choice){const s=SKILLS.find(x=>x.id===id),q=s.fresh[0],ok=choice===q.a;document.querySelectorAll('#pane .choice').forEach(b=>b.disabled=true);$('tutorFeedback').innerHTML=`<div class="feedback ${ok?'ok':'retry'}"><strong>${ok?'ถูกแล้ว 🎉':'ยังไม่ใช่ — ไม่เป็นไร'}</strong><p>${ok?'ใช้วิธีคิดได้ถูกต้อง ลองฝึกอีกได้เมื่ออยากท้าทายตัวเอง':'กลับไปดูอีกวิธีหนึ่ง แล้วค่อยลองใหม่'}</p></div><div class="actions">${ok?`<button class="btn primary" onclick="renderHome()">กลับไปเลือกวิชา</button><button class="btn light" onclick="askExposure('${id}','practice')">ฝึกต่อ</button>`:`<button class="btn primary" onclick="tutorLesson('${id}',true)">อธิบายอีกแบบ</button>`}</div>`;try{log('v012_tutor_try',{skill:id,correct:ok,scoreable:false})}catch(e){}}

function boot(){
 ['currentSchool','targetSchool'].forEach(id=>$(id)?.addEventListener('change',()=>{syncConditionalFields();if(id==='currentSchool')showSchoolProfile();}));
 $('goalMode')?.addEventListener('change',syncConditionalFields);
 $('currentSchoolOther')?.addEventListener('input',showSchoolProfile);
 loadSchools();
 window.renderHome=window.renderHome;
 const c=readCtx();if(c)renderHome();else showOnly('setup');
}
window.resetProfileV012=function(){localStorage.removeItem(CTX_KEY);location.reload();}
boot();
})();