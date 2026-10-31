/** Accessible shared interaction for the React and offline journey maps. */
export function mountProjectJourney(root) {
  if (!root) return () => {};
  const tabs=Array.from(root.querySelectorAll('[data-journey-step]'));
  const panels=Array.from(root.querySelectorAll('[data-journey-panel]'));
  const choose=(index,focus=false)=>{
    if(index<0||index>=tabs.length)return;
    tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
    panels.forEach((panel,i)=>{panel.hidden=i!==index;});
    root.dataset.journeyActive=String(index+1);
    if(focus)tabs[index].focus({preventScroll:true});
  };
  const click=event=>{
    const tab=event.target.closest('[data-journey-step]');
    if(tab&&root.contains(tab))choose(tabs.indexOf(tab));
  };
  const keydown=event=>{
    const tab=event.target.closest('[data-journey-step]');
    if(!tab||!root.contains(tab)||!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'].includes(event.key))return;
    event.preventDefault();
    const at=tabs.indexOf(tab);
    const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(at+(['ArrowRight','ArrowDown'].includes(event.key)?1:-1)+tabs.length)%tabs.length;
    choose(next,true);
  };
  root.addEventListener('click',click);root.addEventListener('keydown',keydown);
  choose(0);
  return()=>{root.removeEventListener('click',click);root.removeEventListener('keydown',keydown);};
}
