// Kids Learning Hub — Learner Context Gate v0.11
// P0: Do not start learning until grade/term/goal are explicitly confirmed.
(function(){
  const GATE_VERSION='0.11.0-dev';
  const originalEnter=window.enterApp;
  if(typeof originalEnter!=='function'){
    console.error('KLH learner context gate: enterApp unavailable');
    return;
  }

  function el(id){return document.getElementById(id)}
  function showError(msg){
    let box=el('learnerContextError');
    if(!box){
      box=document.createElement('div');
      box.id='learnerContextError';
      box.className='notice';
      box.style.marginTop='12px';
      const actions=document.querySelector('#setup .actions');
      (actions?.parentNode||el('setup'))?.insertBefore(box,actions||null);
    }
    box.innerHTML='<strong>ก่อนเริ่มเรียน:</strong> '+msg;
    box.scrollIntoView({behavior:'smooth',block:'center'});
  }

  function clearError(){el('learnerContextError')?.remove()}

  window.enterApp=function(){
    const grade=el('learnerGrade')?.value||'';
    const term=el('learnerTerm')?.value||'';
    const goal=el('goalMode')?.value||'';
    const target=(el('targetName')?.value||'').trim();
    if(!grade) return showError('เลือกชั้นเรียนของเด็กก่อน');
    if(!term) return showError('เลือกเทอมที่กำลังเรียนก่อน');
    if(!goal) return showError('เลือกเป้าหมายการเรียนก่อน');
    if(['target','intensive'].includes(goal)&&!target) return showError('พิมพ์ชื่อโรงเรียนเป้าหมายก่อน');
    clearError();
    originalEnter();
    if(window.state&&state.profile){
      state.profile.learnerContextConfirmed=true;
      state.profile.learnerContextGateVersion=GATE_VERSION;
      state.profile.targetSchoolName=target||null;
      state.profile.targetSchoolKnown=el('targetName')?.dataset.schoolKnown==='1';
      state.profile.targetSchoolCanonical=el('targetName')?.dataset.schoolCanonical||null;
      if(typeof save==='function') save();
      if(typeof log==='function') log('learner_context_confirmed',{grade:Number(grade),term:Number(term),goalMode:goal,targetSchoolName:target,targetSchoolKnown:state.profile.targetSchoolKnown,gateVersion:GATE_VERSION});
    }
  };

  function forceContextSetupWhenNeeded(){
    const confirmed=!!(window.state&&state.profile&&state.profile.learnerContextConfirmed);
    if(confirmed) return;
    const setup=el('setup'),home=el('home'),learn=el('learn'),telemetry=el('telemetry');
    setup?.classList.remove('hidden');
    home?.classList.add('hidden');
    learn?.classList.add('hidden');
    telemetry?.classList.add('hidden');
    if(el('learnerGrade')) el('learnerGrade').value='';
    if(el('learnerTerm')) el('learnerTerm').value='';
    if(el('goalMode')) el('goalMode').value='';
    if(el('targetName')) el('targetName').value='';
  }

  forceContextSetupWhenNeeded();

  // Load school autocomplete after the context fields exist.
  if(!document.querySelector('script[data-klh-school-autocomplete]')){
    const s=document.createElement('script');
    s.src='./school-target-autocomplete-v011.js?v=0.11.0';
    s.async=false;
    s.dataset.klhSchoolAutocomplete='1';
    s.onerror=()=>console.error('KLH school autocomplete failed to load');
    document.body.appendChild(s);
  }
})();
