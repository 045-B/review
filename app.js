var examples={
  brand:'999+',featuredLabel:'FEATURED FILM',featuredNumber:'01',title:'아무도 아닌',engTitle:'Became no one',year:'2080',genre:'재난 · 생존 · 성장',director:'9 · 99',synopsis:'아무도 아닌 사람들의 이야기.',tags:'군부물 · 아포칼립스 · 재난',questionLabel:'QUESTION OF THE FILM',questionNumber:'Q1',question:'정의 내릴 수 없는',answer:'사람. 내 사람.\n그 두 글자 안에 소유가 있었고 신뢰가 있었고 분류 불가능한 것의 분류 포기가 있었다. 연인이 되기도 하고 동료가 되기도 하고 어떤 날에는 원수가 되기도 할 테지만 그 모든 것의 밑바닥에 깔린 것은 결국 이 사람은 나의 사람이라는 한 문장이므로.',reviewsLabel:'REVIEWS',
  reviewers:[
    {id:1,name:'9',role:'불러줘, 이름.',rating:'★ 5',body:'I figured if I was gonna become no one anyway, might as well carry the one name that meant something.\n어차피 아무도 아닌 사람이 될 거면, 의미 있는 이름 하나쯤은 들고 가도 되지 않을까 싶었어.',avatar:'',crop:{zoom:100,x:50,y:50}},
    {id:2,name:'99',role:'붙여줘, 이름.',rating:'★ 5',body:'Found each other pretty well. Two nobodies.\n잘 만났네. 아무도 아닌 사람끼리.',avatar:'',crop:{zoom:100,x:50,y:50}}
  ]
};
var defaults={
  accent:'#a8a8a8',brand:'',backgroundColor:'#050505',reviewBlockColor:'#181818',font:'pretendard',heroImage:'',heroCrop:{zoom:100,x:50,y:50},posterImage:'',posterCrop:{zoom:100,x:50,y:50},
  featuredLabel:'',featuredNumber:'',title:'',engTitle:'',year:'',genre:'',director:'',synopsis:'',tags:'',questionLabel:'',questionNumber:'',question:'',answer:'',reviewsLabel:'',
  reviewers:[
    {id:1,name:'',role:'',rating:'',body:'',avatar:'',crop:{zoom:100,x:50,y:50}},
    {id:2,name:'',role:'',rating:'',body:'',avatar:'',crop:{zoom:100,x:50,y:50}}
  ]
};
var state;
var exportingBlankValues=false;
try{state=Object.assign(JSON.parse(JSON.stringify(defaults)),JSON.parse(localStorage.getItem('reframe-sheet-v2')||'{}'))}catch(error){state=JSON.parse(JSON.stringify(defaults))}
if(state.accent==='#edff57')state.accent='#a8a8a8';
if(!Array.isArray(state.reviewers))state.reviewers=JSON.parse(JSON.stringify(defaults.reviewers));
['heroCrop','posterCrop'].forEach(function(key){state[key]=Object.assign({zoom:100,x:50,y:50},state[key]||{})});

var ids=['accent','backgroundColor','reviewBlockColor','font','brand','featuredLabel','featuredNumber','title','engTitle','year','genre','director','synopsis','tags','questionLabel','questionNumber','question','answer','reviewsLabel'];
var inputIds={accent:'accentInput',backgroundColor:'backgroundColorInput',reviewBlockColor:'reviewBlockColorInput',font:'fontInput',brand:'brandInput',featuredLabel:'featuredLabelInput',featuredNumber:'featuredNumberInput',title:'titleInput',engTitle:'engTitleInput',year:'yearInput',genre:'genreInput',director:'directorInput',synopsis:'synopsisInput',tags:'tagsInput',questionLabel:'questionLabelInput',questionNumber:'questionNumberInput',question:'questionInput',answer:'answerInput',reviewsLabel:'reviewsLabelInput'};
var viewIds={featuredLabel:'featuredLabelView',featuredNumber:'featuredNumberView',title:'titleView',engTitle:'engTitleView',year:'yearView',genre:'genreView',director:'directorView',synopsis:'synopsisView',tags:'tagsView',questionLabel:'questionLabelView',questionNumber:'questionNumberView',question:'questionView',answer:'answerView'};
var sheet=document.getElementById('captureSheet'),frame=document.querySelector('.sheet-frame');
var fontFamilies={pretendard:'Pretendard, sans-serif',noto:'"Noto Sans KR", sans-serif',ridi:'RIDIBatang-subset, RIDIBatang, serif',galmuri:'Galmuri11, sans-serif'};

function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function previewText(value,example){var text=String(value==null?'':value);return text.trim()?text:(exportingBlankValues?'':String(example||''))}
function save(){try{localStorage.setItem('reframe-sheet-v2',JSON.stringify(state))}catch(error){}}
function imageFile(input,done){var file=input.files&&input.files[0];if(!file)return;var reader=new FileReader();reader.onload=function(){done(String(reader.result))};reader.readAsDataURL(file)}
function fitFrame(){requestAnimationFrame(function(){var rect=sheet.getBoundingClientRect();frame.style.height=Math.ceil(rect.height)+'px'})}
function cropOf(owner){return Object.assign({zoom:100,x:50,y:50},owner.crop||{})}
function cropTransform(crop){var scale=Math.max(1,Number(crop.zoom||100)/100),x=Number(crop.x),y=Number(crop.y);if(!Number.isFinite(x))x=50;if(!Number.isFinite(y))y=50;var moveX=(50-x)*(scale-1),moveY=(50-y)*(scale-1);return 'translate3d('+moveX+'%,'+moveY+'%,0) scale('+scale+')'}
function applyImageCrop(image,crop){if(!image)return;if(image.classList.contains('crop-image-layer'))image.style.backgroundPosition=crop.x+'% '+crop.y+'%';else image.style.objectPosition=crop.x+'% '+crop.y+'%';image.style.transform=cropTransform(crop);image.style.transformOrigin='50% 50%'}

function renderReviewPreview(){
  document.getElementById('reviewsView').innerHTML=state.reviewers.map(function(r,index){
    var sample=examples.reviewers[index]||{name:'리뷰어 이름',rating:'★ 5',role:'역할 / 한 줄 정보',body:'영화를 보고 떠오른 감상을 입력하세요.'};
    var avatar=r.avatar?'<div class="crop-image-layer" aria-hidden="true"></div>':'<span>0'+(index+1)+'</span>';
    return '<article class="review-block"><div class="avatar-view" data-review-image="'+r.id+'">'+avatar+'</div><div class="review-bubble"><header class="review-head"><h4>'+esc(previewText(r.name,sample.name))+'</h4><span>'+esc(previewText(r.role,sample.role))+'</span><strong>'+esc(previewText(r.rating,sample.rating))+'</strong></header><p>'+esc(previewText(r.body,sample.body))+'</p></div></article>';
  }).join('');
  state.reviewers.forEach(function(r){var layer=document.querySelector('[data-review-image="'+r.id+'"] .crop-image-layer');if(layer){layer.style.backgroundImage='url("'+r.avatar+'")';applyImageCrop(layer,cropOf(r))}});
  setupDirectEditors();
  fitFrame();
}
function renderReviews(){
  var editors=document.getElementById('reviewerEditors');
  editors.innerHTML=state.reviewers.map(function(r,index){
    var sample=examples.reviewers[index]||{name:'리뷰어 이름',rating:'★ 5',role:'역할 / 한 줄 정보',body:'영화를 보고 떠오른 감상을 입력하세요.'};
    return '<section class="reviewer-editor" data-editor="'+r.id+'"><header><strong>REVIEWER '+String(index+1).padStart(2,'0')+'</strong><button data-remove="'+r.id+'">삭제</button></header><div class="avatar-row"><label>이름<textarea class="text-line" rows="1" data-review="'+r.id+'" data-key="name" placeholder="'+esc(sample.name)+'">'+esc(r.name)+'</textarea></label><label>평점<textarea class="text-line" rows="1" data-review="'+r.id+'" data-key="rating" placeholder="'+esc(sample.rating)+'">'+esc(r.rating)+'</textarea></label></div><label>역할 / 한 줄 정보<textarea class="text-line" rows="1" data-review="'+r.id+'" data-key="role" placeholder="'+esc(sample.role)+'">'+esc(r.role)+'</textarea></label><label>리뷰 이미지 (가로형 권장)<input type="file" accept="image/*" data-avatar="'+r.id+'"></label><label>리뷰 본문<textarea data-review="'+r.id+'" data-key="body" placeholder="'+esc(sample.body)+'">'+esc(r.body)+'</textarea></label></section>';
  }).join('');
  renderReviewPreview();
  editors.querySelectorAll('[data-review]').forEach(function(field){fitTextLine(field);field.oninput=function(){fitTextLine(field);var r=state.reviewers.find(function(x){return x.id===Number(field.dataset.review)});r[field.dataset.key]=field.value;save();renderReviewPreview()}});
  editors.querySelectorAll('[data-avatar]').forEach(function(field){field.onchange=function(){var r=state.reviewers.find(function(x){return x.id===Number(field.dataset.avatar)});imageFile(field,function(value){r.avatar=value;save();renderReviews();selectDirectImage('review',r.id)})}});
  editors.querySelectorAll('[data-remove]').forEach(function(button){button.onclick=function(){if(state.reviewers.length===1)return alert('리뷰어는 한 명 이상 필요합니다.');state.reviewers=state.reviewers.filter(function(x){return x.id!==Number(button.dataset.remove)});save();renderReviews()}});
}

function hexToRgb(value){var hex=String(value||'').replace('#','');if(hex.length===3)hex=hex.split('').map(function(x){return x+x}).join('');var number=parseInt(hex,16);if(!Number.isFinite(number))return '168,168,168';return ((number>>16)&255)+','+((number>>8)&255)+','+(number&255)}

function render(){
  sheet.style.setProperty('--accent',state.accent);
  sheet.style.setProperty('--background-rgb',hexToRgb(state.backgroundColor));
  sheet.style.setProperty('--review-block-color',state.reviewBlockColor);
  sheet.style.setProperty('--sheet-font',fontFamilies[state.font]||fontFamilies.pretendard);
  sheet.style.backgroundColor=state.backgroundColor;
  document.querySelectorAll('[data-brand]').forEach(function(element){element.textContent=previewText(state.brand,examples.brand)});
  var heroLayer=document.getElementById('heroImageLayer');
  heroLayer.style.backgroundImage=state.heroImage?'url("'+state.heroImage+'")':'';
  heroLayer.style.backgroundPosition=state.heroCrop.x+'% '+state.heroCrop.y+'%';
  heroLayer.style.transform=cropTransform(state.heroCrop);
  heroLayer.style.transformOrigin='50% 50%';
  var poster=document.getElementById('posterView');
  poster.innerHTML=state.posterImage?'<div class="crop-image-layer" role="img" aria-label="영화 포스터"></div>':'<span>POSTER<br>IMAGE</span>';
  var posterLayer=poster.querySelector('.crop-image-layer');if(posterLayer){posterLayer.style.backgroundImage='url("'+state.posterImage+'")';applyImageCrop(posterLayer,state.posterCrop)}
  Object.keys(viewIds).forEach(function(key){document.getElementById(viewIds[key]).textContent=previewText(state[key],examples[key])});
  document.getElementById('reviewsView').dataset.title=previewText(state.reviewsLabel,examples.reviewsLabel);
  renderReviews();
}

ids.forEach(function(key){
  var input=document.getElementById(inputIds[key]);
  if(examples[key]&&key!=='font')input.placeholder=examples[key];
  input.value=state[key];
  fitTextLine(input);
  input.oninput=function(){fitTextLine(input);state[key]=input.value;save();render()};
});
function fitTextLine(field){if(!field||!field.classList.contains('text-line'))return;field.style.height='auto';field.style.height=Math.max(38,field.scrollHeight)+'px'}
document.addEventListener('keydown',function(event){
  if(event.key!=='Enter'||!event.shiftKey||event.target.tagName!=='TEXTAREA')return;
  event.preventDefault();
  var field=event.target,start=field.selectionStart,end=field.selectionEnd;
  field.setRangeText('\n',start,end,'end');
  field.dispatchEvent(new Event('input',{bubbles:true}));
});
document.getElementById('heroUpload').onchange=function(){imageFile(this,function(value){state.heroImage=value;save();render();selectDirectImage('hero')})};
document.getElementById('posterUpload').onchange=function(){imageFile(this,function(value){state.posterImage=value;save();render();selectDirectImage('poster')})};

var activeDirectImage=null;
function clamp(value,min,max){return Math.max(min,Math.min(max,value))}
function directImageData(type,id){
  if(type==='hero')return state.heroImage?{type:type,id:null,element:document.getElementById('heroImageLayer'),box:document.getElementById('sheetHero'),crop:state.heroCrop,label:'메인 이미지'}:null;
  if(type==='poster')return state.posterImage?{type:type,id:null,element:document.querySelector('#posterView .crop-image-layer'),box:document.getElementById('posterView'),crop:state.posterCrop,label:'포스터'}:null;
  var reviewer=state.reviewers.find(function(r){return r.id===Number(id)});
  var holder=document.querySelector('[data-review-image="'+id+'"]');
  return reviewer&&reviewer.avatar&&holder?{type:'review',id:Number(id),element:holder.querySelector('.crop-image-layer'),box:holder,crop:(reviewer.crop||(reviewer.crop=cropOf(reviewer))),label:'리뷰 이미지'}:null;
}
function paintDirectImage(data){
  if(!data||!data.element)return;
  if(data.type==='hero'){
    data.element.style.backgroundPosition=data.crop.x+'% '+data.crop.y+'%';
    data.element.style.transform=cropTransform(data.crop);
    data.element.style.transformOrigin='50% 50%';
  }else applyImageCrop(data.element,data.crop);
  document.getElementById('directEditStatus').textContent=data.label+' 선택됨 · '+data.crop.zoom+'% · 드래그 이동 · 휠 확대/축소 · 방향키 미세조정';
}
function selectDirectImage(type,id){
  document.querySelectorAll('.is-direct-active').forEach(function(element){element.classList.remove('is-direct-active')});
  var data=directImageData(type,id);if(!data)return;
  activeDirectImage={type:type,id:id};data.element.classList.add('is-direct-active');data.element.focus({preventScroll:true});paintDirectImage(data);
}
function clearDirectImageSelection(){
  activeDirectImage=null;
  document.querySelectorAll('.is-direct-active').forEach(function(element){element.classList.remove('is-direct-active')});
  document.getElementById('directEditStatus').textContent='이미지 클릭 · 드래그 이동 · 휠 확대/축소 · 방향키 미세조정';
}
function setupDirectElement(data){
  if(!data||!data.element)return;
  var element=data.element;element.classList.add('direct-edit-image');element.tabIndex=0;element.setAttribute('role','button');element.setAttribute('aria-label',data.label+' 위치와 크기 조정');
  element.onpointerdown=function(event){
    if(event.button!==0)return;event.preventDefault();selectDirectImage(data.type,data.id);data=directImageData(data.type,data.id);
    var startX=event.clientX,startY=event.clientY,startCrop={x:Number(data.crop.x),y:Number(data.crop.y)},rect=data.box.getBoundingClientRect();element.setPointerCapture&&element.setPointerCapture(event.pointerId);
    function move(moveEvent){data.crop.x=clamp(startCrop.x-(moveEvent.clientX-startX)/rect.width*100,0,100);data.crop.y=clamp(startCrop.y-(moveEvent.clientY-startY)/rect.height*100,0,100);paintDirectImage(data)}
    function stop(){window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',stop);window.removeEventListener('pointercancel',stop);save()}
    window.addEventListener('pointermove',move);window.addEventListener('pointerup',stop);window.addEventListener('pointercancel',stop);
  };
  element.onwheel=function(event){event.preventDefault();selectDirectImage(data.type,data.id);data=directImageData(data.type,data.id);data.crop.zoom=clamp(Number(data.crop.zoom)+(event.deltaY<0?5:-5),100,220);paintDirectImage(data);save()};
  element.onclick=function(){selectDirectImage(data.type,data.id)};
}
function setupDirectEditors(){
  setupDirectElement(directImageData('hero'));setupDirectElement(directImageData('poster'));
  state.reviewers.forEach(function(reviewer){setupDirectElement(directImageData('review',reviewer.id))});
}
document.addEventListener('pointerdown',function(event){
  if(event.target.closest&&event.target.closest('.direct-edit-image'))return;
  clearDirectImageSelection();
});
document.addEventListener('keydown',function(event){
  if(!activeDirectImage||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;
  if(event.target.closest&&event.target.closest('input,textarea,select,button,[contenteditable="true"]'))return;
  var data=directImageData(activeDirectImage.type,activeDirectImage.id);if(!data)return;event.preventDefault();var step=event.shiftKey?5:1;
  if(event.key==='ArrowLeft')data.crop.x=clamp(Number(data.crop.x)+step,0,100);
  if(event.key==='ArrowRight')data.crop.x=clamp(Number(data.crop.x)-step,0,100);
  if(event.key==='ArrowUp')data.crop.y=clamp(Number(data.crop.y)+step,0,100);
  if(event.key==='ArrowDown')data.crop.y=clamp(Number(data.crop.y)-step,0,100);
  paintDirectImage(data);save();
});

document.getElementById('addReviewer').onclick=function(){
  state.reviewers.push({id:Date.now(),name:'',role:'',rating:'',body:'',avatar:'',crop:{zoom:100,x:50,y:50}});
  save();renderReviews();
};
document.getElementById('resetAll').onclick=function(){
  if(!confirm('입력한 내용을 모두 초기화할까요?'))return;
  try{localStorage.removeItem('reframe-sheet-v2')}catch(error){}
  state=JSON.parse(JSON.stringify(defaults));activeDirectImage=null;
  ids.forEach(function(key){document.getElementById(inputIds[key]).value=state[key]});
  document.getElementById('heroUpload').value='';document.getElementById('posterUpload').value='';
  document.getElementById('directEditStatus').textContent='이미지 클릭 · 드래그 이동 · 휠 확대/축소 · 방향키 미세조정';
  render();
};
document.getElementById('savePng').onclick=async function(){
  if(!window.html2canvas)return alert('저장 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
  var button=this;button.disabled=true;button.textContent='저장 중…';document.body.classList.add('saving');
  try{
    exportingBlankValues=true;render();
    if(document.fonts&&document.fonts.ready)await document.fonts.ready;
    await new Promise(function(resolve){requestAnimationFrame(function(){requestAnimationFrame(resolve)})});
    var sheetArea=Math.max(1,sheet.scrollWidth*sheet.scrollHeight);
    var exportScale=Math.max(2,Math.min(4,Math.sqrt(40000000/sheetArea)));
    var canvas=await window.html2canvas(sheet,{scale:exportScale,backgroundColor:state.backgroundColor,useCORS:true,logging:false,imageTimeout:30000});
    var link=document.createElement('a');link.download='reframe-'+(state.title||'movie-review')+'.png';link.href=canvas.toDataURL('image/png');link.click();
  }catch(error){alert('PNG를 만들지 못했습니다. 이미지 용량을 줄여 다시 시도해주세요.')}
  finally{exportingBlankValues=false;render();document.body.classList.remove('saving');button.disabled=false;button.textContent='PNG 저장';fitFrame()}
};

var mobileEditorToggle=document.getElementById('mobileEditorToggle');
var mobileEditorClose=document.getElementById('mobileEditorClose');
var editorPanel=document.getElementById('editorPanel');
var editorBackdrop=document.getElementById('editorBackdrop');
var mobileEditorMedia=window.matchMedia('(max-width:760px)');
function setMobileEditor(open){
  document.body.classList.toggle('editor-open',open);
  editorPanel.classList.toggle('is-open',open);
  mobileEditorToggle.setAttribute('aria-expanded',String(open));
}
mobileEditorToggle.onclick=function(){setMobileEditor(!editorPanel.classList.contains('is-open'))};
mobileEditorClose.onclick=function(){setMobileEditor(false);mobileEditorToggle.focus({preventScroll:true})};
editorBackdrop.onclick=function(){setMobileEditor(false);mobileEditorToggle.focus({preventScroll:true})};
document.addEventListener('keydown',function(event){
  if(event.key==='Escape'&&editorPanel.classList.contains('is-open')){setMobileEditor(false);mobileEditorToggle.focus({preventScroll:true})}
});
function resetMobileEditor(event){if(!event.matches)setMobileEditor(false)}
if(mobileEditorMedia.addEventListener)mobileEditorMedia.addEventListener('change',resetMobileEditor);
else mobileEditorMedia.addListener(resetMobileEditor);
window.addEventListener('resize',fitFrame);
render();

