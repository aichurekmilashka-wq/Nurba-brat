"""HTML counterpart of the React GlassFolder, sharing its CSS and artwork painter."""
from html import escape
from pathlib import Path
import json

SERVICE_FILES=json.loads((Path(__file__).resolve().parent.parent/'content/service-folder-files.json').read_text())

BACK='M0 56A22 22 0 0 1 22 34L146 34C170 34 172 0 198 0L318 0A22 22 0 0 1 340 22L340 250A22 22 0 0 1 318 272L22 272A22 22 0 0 1 0 250Z'
FRONT='M0 22A22 22 0 0 1 22 0L118 0C144 0 146 32 172 32L318 32A22 22 0 0 1 340 54L340 176A22 22 0 0 1 318 198L22 198A22 22 0 0 1 0 176Z'
PRESETS=['glacier','aurora','dusk','ember','verdant','glacier','aurora']
def render_service_folders(items,t,url,prefix,locale):
 e=lambda value:escape(str(value),quote=True)
 out='<div class="folder-grid'+(' folder-grid--seven' if len(items)==7 else '')+'">'
 for i,item in enumerate(items):
  uid=f'{prefix}-{i}';title=e(item['title']);art=PRESETS[i%len(PRESETS)];tone='dark' if i in [3,4] else 'light';meta=e('3 '+t['folderItems'])
  files=[(file['name'][locale],item['path']) for file in SERVICE_FILES[item['path']]]
  out+=f'<article class="service-folder-card"><div class="folder-visual"><div class="gf-root service-folder" data-tone="{tone}" data-place="bottom-left" data-entered data-art="{art}" data-seed="{i*7+3}" data-appear-delay="{min(i*80,320)}" data-open-label="{e(t["folderOpen"])} {title}, {meta}" data-close-label="{e(t["folderClose"])} {title}, {meta}" style="width:340px;height:326px"><div class="gf-stage" style="transform:translateY(54px) scale(1)"><div class="gf-tilt"><div class="gf-shadow" aria-hidden="true"></div>'
  out+=f'<div class="gf-back" style="clip-path:path(\'{BACK}\')" aria-hidden="true"><canvas class="gf-art" style="width:364px;height:296px" aria-hidden="true"></canvas><div class="gf-back-sheen"></div></div><svg class="gf-rim gf-back-rim" viewBox="0 0 340 272" aria-hidden="true"><path d="{BACK}"/></svg>'
  out+=f'<div class="gf-front" style="clip-path:path(\'{FRONT}\')"><div class="gf-tint" aria-hidden="true"></div><div class="gf-spec" aria-hidden="true"></div><svg class="gf-rim gf-front-rim" viewBox="0 0 340 198" aria-hidden="true"><defs><linearGradient id="{uid}-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".35" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity=".12"/></linearGradient></defs><path d="{FRONT}" stroke="url(#{uid}-rim)"/></svg><button type="button" class="gf-hit" aria-expanded="false" aria-controls="{uid}-files" aria-label="{e(t["folderOpen"])} {title}, {meta}"></button><div class="gf-label"><span class="gf-title">{title}</span><span class="gf-meta">{meta}</span></div></div>'
  out+=f'<div class="gf-files" id="{uid}-files" role="list" aria-label="{title}: {e(t["folderContents"])}" inert>'
  for j,(name,path) in enumerate(files):
   slot=j-1;depth=2-j
   out+=f'<div role="listitem" class="gf-sheet-slot"><a class="gf-sheet" href="{e(url(path))}" style="--gf-slot:{slot};--gf-depth:{depth};--gf-jx:{j-1}px;--gf-jr:{(j-1)*.7}deg;z-index:{j+1}"><span class="gf-lines" aria-hidden="true">'+''.join(f'<i style="width:{w}%"></i>' for w in [86,92,64,88,42])+f'</span><span class="gf-sheet-head"><span class="gf-sheet-name">{e(name)}</span></span></a></div>'
  out+=f'</div></div></div></div></div><div class="service-folder-copy"><h3><a class="service-title-link" href="{e(url(item["path"]))}">{title}</a></h3><p>{e(item["text"])}</p></div></article>'
 return out+'</div>'

RUNTIME=r'''
const roots=Array.from(document.querySelectorAll('.gf-root'));
const cache=new Map();
const queue=[];let pumping=false;
function pump(){
 if(pumping)return;pumping=true;
 const tick=()=>{
  const until=performance.now()+7;
  while(queue.length&&performance.now()<until){
   const head=queue[0];
   if(head.job.step(4)){
    queue.shift();const source=document.createElement('canvas');source.width=head.job.width;source.height=head.job.height;
    const context=source.getContext('2d');
    if(context){const image=context.createImageData(source.width,source.height);image.data.set(head.job.pixels);context.putImageData(image,0,0);}
    head.done(source);
   }
  }
  if(queue.length)requestAnimationFrame(tick);else pumping=false;
 };requestAnimationFrame(tick);
}
function paint(root){
 const canvas=root.querySelector('canvas.gf-art');if(!canvas)return;
 const preset=root.dataset.art,seed=Number(root.dataset.seed),quality=window.innerWidth<=760?.72:1,key=preset+':'+seed+':'+quality;
 if(!cache.has(key))cache.set(key,new Promise(done=>{queue.push({job:createArtJob(Math.round(364*quality),Math.round(296*quality),ART_PRESETS[preset],seed),done});pump();}));
 cache.get(key).then(source=>{canvas.width=source.width;canvas.height=source.height;const context=canvas.getContext('2d');if(context){context.drawImage(source,0,0);canvas.dataset.ready='true';}});
}
function setOpen(root,open,restoreFocus=false){
 root.toggleAttribute('data-open',open);
 const button=root.querySelector('.gf-hit');button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?root.dataset.closeLabel:root.dataset.openLabel);
 root.querySelector('.gf-files').toggleAttribute('inert',!open);
 if(restoreFocus)button.focus();
}
roots.forEach(root=>{
 const resize=()=>{const width=Math.max(1,Math.min(window.innerWidth<=760?260:340,root.parentElement.clientWidth));const k=width/340;root.style.width=width+'px';root.style.height=326*k+'px';root.querySelector('.gf-stage').style.transform='translateY('+(54*k)+'px) scale('+k+')';};
 resize();if(typeof ResizeObserver!=='undefined')new ResizeObserver(resize).observe(root.parentElement);else window.addEventListener('resize',resize);
 root.querySelector('.gf-hit').addEventListener('click',()=>setOpen(root,!root.hasAttribute('data-open')));
 root.addEventListener('keydown',event=>{if(event.key==='Escape'&&root.hasAttribute('data-open')){event.stopPropagation();setOpen(root,false,true);}});
 let raf=0,px=0,py=0;
 const write=()=>{raf=0;root.style.setProperty('--gf-px',px.toFixed(3));root.style.setProperty('--gf-py',py.toFixed(3));};
 root.addEventListener('pointermove',event=>{if(event.pointerType==='touch')return;const rect=root.getBoundingClientRect();if(!rect.width||!rect.height)return;px=((event.clientX-rect.left)/rect.width)*2-1;py=((event.clientY-rect.top)/rect.height)*2-1;if(!raf)raf=requestAnimationFrame(write);});
 root.addEventListener('pointerleave',()=>{px=0;py=0;if(!raf)raf=requestAnimationFrame(write);});
});
document.addEventListener('pointerdown',event=>roots.forEach(root=>{if(root.hasAttribute('data-open')&&!root.contains(event.target))setOpen(root,false);}));
if(typeof IntersectionObserver!=='undefined'){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;observer.unobserve(entry.target);paint(entry.target);}),{rootMargin:'180px'});
 roots.forEach(root=>observer.observe(root));
}else roots.forEach(paint);
'''

def runtime(root:Path):
 source=(root/'lib/folder-art.js').read_text().replace('export ','')
 return '\n;(function(){\n'+source+'\n'+RUNTIME+'\n})();\n'
