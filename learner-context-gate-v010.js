// Kids Learning Hub — Learner Context Gate v0.10
// P0: Do not start learning until grade/term/goal are explicitly confirmed.
(function(){
  const GATE_VERSION='0.10.0-dev';
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
    if(['target','intensive'].includes(goal)&&!target) return showError('ใส่เป้าหมายที่ต้องการเตรียม เช่น PCSHS M.1');
    clearError();
    originalEnter();
    if(window.state&&state.profile){
      state.profile.learnerContextConfirmed=true;
      state.profile.learnerContextGateVersion=GATE_VERSION;
      if(typeof save==='function') save();
      if(typeof log==='function') log('learner_context_confirmed',{grade:Number(grade),term:Number(term),goalMode:goal,targetName:target,gateVersion:GATE_VERSION});
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
    // Force a conscious choice once after this architecture change.
    if(el('learnerGrade')) el('learnerGrade').value='';
    if(el('learnerTerm')) el('learnerTerm').value='';
    if(el('goalMode')) el('goalMode').value='';
    if(el('targetName')) el('targetName').value='';
  }

  forceContextSetupWhenNeeded();
})();
