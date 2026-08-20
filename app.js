var defaults={
  accent:'#edff57',brand:'RE:FRAME',backgroundImage:'',backgroundOpacity:'0.22',backgroundCrop:{zoom:100,x:50,y:50},heroImage:'',heroCrop:{zoom:100,x:50,y:50},posterImage:'',posterCrop:{zoom:100,x:50,y:50},topLine:'ha ha ha, hu hu hu — after the credits',
  title:'애프터 이미지',engTitle:'EVERYTHING EVERYWHERE ALL AT ONCE',year:'2026',genre:'드라마 · 성장',
  director:'감독 이도윤',synopsis:'끝난 줄 알았던 장면은 마음속에서 다시 시작된다. 서로 다른 기억을 품은 사람들이 한 편의 영화를 보고 각자의 언어로 남긴 기록.',
  tags:'#영화리뷰 #시네마 #기록',question:'이 영화를 고른 이유는?',answer:'한 장면을 함께 보았지만 우리가 기억하는 순간은 모두 다르다. 영화가 끝난 뒤에도 오래 남은 감정과 질문을 기록해 보세요.',
  reviewers:[
    {id:1,name:'타카미네 미도리',role:'첫 번째 관객',rating:'★ 4.7',body:'그러니까… 처음에는 별일 없는 이야기라고 생각했어요. 그런데 크레딧이 올라간 뒤에도 어떤 표정이 계속 떠오르더라고요.\n말로 설명하기 어려운 순간을 오래 바라보게 만드는 영화였습니다.',avatar:''},
    {id:2,name:'미즈모토 스미레',role:'두 번째 관객',rating:'★ 4.5',body:'같은 장면을 보고도 전혀 다른 이야기를 나눌 수 있다는 게 좋았어요. 인물의 선택보다 그 사이의 침묵이 더 오래 기억에 남습니다.\n다시 본다면 처음과는 다른 영화를 만나게 될 것 같아요.',avatar:''}
  ]
};
var state;
try{state=Object.assign({},defaults,JSON.parse(localStorage.getItem('reframe-sheet-v2')||'{}'))}catch(error){state=JSON.parse(JSON.stringify(defaults))}
if(!Array.isArray(state.reviewers))state.reviewers=JSON.parse(JSON.stringify(defaults.reviewers));
['backgroundCrop','heroCrop','posterCrop'].forEach(function(key){state[key]=Object.assign({zoom:100,x:50,y:50},state[key]||{})});

var ids=['accent','brand','topLine','title','engTitle','year','genre','director','synopsis','tags','question','answer'];
var inputIds={accent:'accentInput',brand:'brandInput',topLine:'topLineInput',title:'titleInput',engTitle:'engTitleInput',year:'yearInput',genre:'genreInput',director:'directorInput',synopsis:'synopsisInput',tags:'tagsInput',question:'questionInput',answer:'answerInput'};
var viewIds={topLine:'topLineView',title:'titleView',engTitle:'engTitleView',year:'yearView',genre:'genreView',director:'directorView',synopsis:'synopsisView',tags:'tagsView',question:'questionView',answer:'answerView'};
var sheet=document.getElementById('captureSheet'),frame=document.querySelector('.sheet-frame');

function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function save(){try{localStorage.setItem('reframe-sheet-v2',JSON.stringify(state))}catch(error){}}
function imageFile(input,done){var file=input.files&&input.files[0];if(!file)return;var reader=new FileReader();reader.onload=function(){done(String(reader.result))};reader.readAsDataURL(file)}
function fitFrame(){requestAnimationFrame(function(){var rect=sheet.getBoundingClientRect();frame.style.height=Math.ceil(rect.height)+'px'})}
function cropOf(owner){return Object.assign({zoom:100,x:50,y:50},owner.crop||{})}
function applyImageCrop(image,crop){if(!image)return;image.style.objectPosition=crop.x+'% '+crop.y+'%';image.style.transform='scale('+(Number(crop.zoom)/100)+')';image.style.transformOrigin=crop.x+'% '+crop.y+'%'}

function renderReviewPreview(){
  document.getElementById('reviewsView').innerHTML=state.reviewers.map(function(r,index){
    var avatar=r.avatar?'<img src="'+r.avatar+'" alt="">':'<span>0'+(index+1)+'</span>';
    return '<article class="review-block"><div class="avatar-view" data-review-image="'+r.id+'">'+avatar+'</div><div class="review-bubble"><header class="review-head"><h4>'+esc(r.name)+'</h4><span>'+esc(r.role)+'</span><strong>'+esc(r.rating)+'</strong></header><p>'+esc(r.body)+'</p></div></article>';
  }).join('');
  state.reviewers.forEach(function(r){applyImageCrop(document.querySelector('[data-review-image="'+r.id+'"] img'),cropOf(r))});
  document.getElementById('reviewCountView').textContent=String(state.reviewers.length).padStart(2,'0')+' REVIEWS';
  fitFrame();
}
function renderReviews(){
  var editors=document.getElementById('reviewerEditors');
  editors.innerHTML=state.reviewers.map(function(r,index){
    return '<section class="reviewer-editor" data-editor="'+r.id+'"><header><strong>REVIEWER '+String(index+1).padStart(2,'0')+'</strong><button data-remove="'+r.id+'">삭제</button></header><div class="avatar-row"><label>이름<input data-review="'+r.id+'" data-key="name" value="'+esc(r.name)+'"></label><label>평점<input data-review="'+r.id+'" data-key="rating" value="'+esc(r.rating)+'"></label></div><label>역할 / 한 줄 정보<input data-review="'+r.id+'" data-key="role" value="'+esc(r.role)+'"></label><label>리뷰 이미지 (가로형 권장)<input type="file" accept="image/*" data-avatar="'+r.id+'"></label><button class="image-edit-trigger" type="button" data-edit-review-image="'+r.id+'">리뷰 이미지 편집창 열기</button><label>리뷰 본문<textarea data-review="'+r.id+'" data-key="body">'+esc(r.body)+'</textarea></label></section>';
  }).join('');
  renderReviewPreview();
  editors.querySelectorAll('[data-review]').forEach(function(field){field.oninput=function(){var r=state.reviewers.find(function(x){return x.id===Number(field.dataset.review)});r[field.dataset.key]=field.value;save();renderReviewPreview()}});
  editors.querySelectorAll('[data-avatar]').forEach(function(field){field.onchange=function(){var r=state.reviewers.find(function(x){return x.id===Number(field.dataset.avatar)});imageFile(field,function(value){r.avatar=value;save();renderReviews();openImageEditor('review',r.id)})}});
  editors.querySelectorAll('[data-edit-review-image]').forEach(function(button){button.onclick=function(){openImageEditor('review',Number(button.dataset.editReviewImage))}});
  editors.querySelectorAll('[data-remove]').forEach(function(button){button.onclick=function(){if(state.reviewers.length===1)return alert('리뷰어는 한 명 이상 필요합니다.');state.reviewers=state.reviewers.filter(function(x){return x.id!==Number(button.dataset.remove)});save();renderReviews()}});
}

function render(){
  sheet.style.setProperty('--accent',state.accent);
  document.querySelectorAll('[data-brand]').forEach(function(element){element.textContent=state.brand||'RE:FRAME'});
  var background=document.getElementById('sheetBackground');
  background.style.backgroundImage=state.backgroundImage?'url("'+state.backgroundImage+'")':'';
  background.style.opacity=state.backgroundImage?state.backgroundOpacity:'0';
  background.style.backgroundPosition=state.backgroundCrop.x+'% '+state.backgroundCrop.y+'%';
  background.style.transform='scale('+(Number(state.backgroundCrop.zoom)/100)+')';
  background.style.transformOrigin=state.backgroundCrop.x+'% '+state.backgroundCrop.y+'%';
  var heroLayer=document.getElementById('heroImageLayer');
  heroLayer.style.backgroundImage=state.heroImage?'url("'+state.heroImage+'")':'';
  heroLayer.style.backgroundPosition=state.heroCrop.x+'% '+state.heroCrop.y+'%';
  heroLayer.style.transform='scale('+(Number(state.heroCrop.zoom)/100)+')';
  heroLayer.style.transformOrigin=state.heroCrop.x+'% '+state.heroCrop.y+'%';
  var poster=document.getElementById('posterView');
  poster.innerHTML=state.posterImage?'<img src="'+state.posterImage+'" alt="영화 포스터">':'<span>POSTER<br>IMAGE</span>';
  applyImageCrop(poster.querySelector('img'),state.posterCrop);
  Object.keys(viewIds).forEach(function(key){document.getElementById(viewIds[key]).textContent=state[key]});
  renderReviews();
}

ids.forEach(function(key){
  var input=document.getElementById(inputIds[key]);
  input.value=state[key];
  input.oninput=function(){state[key]=input.value;save();render()};
});
document.getElementById('heroUpload').onchange=function(){imageFile(this,function(value){state.heroImage=value;save();render();openImageEditor('hero')})};
document.getElementById('posterUpload').onchange=function(){imageFile(this,function(value){state.posterImage=value;save();render();openImageEditor('poster')})};
document.getElementById('backgroundUpload').onchange=function(){imageFile(this,function(value){state.backgroundImage=value;save();render();openImageEditor('background')})};
var backgroundOpacityInput=document.getElementById('backgroundOpacityInput');
backgroundOpacityInput.value=state.backgroundOpacity;
backgroundOpacityInput.oninput=function(){state.backgroundOpacity=this.value;save();render()};
document.getElementById('removeBackground').onclick=function(){state.backgroundImage='';document.getElementById('backgroundUpload').value='';save();render()};

var imageEditorModal=document.getElementById('imageEditorModal');
var imageEditorViewport=document.getElementById('imageEditorViewport');
var imageEditorPreview=document.getElementById('imageEditorPreview');
var imageZoomInput=document.getElementById('imageZoomInput');
var imageXInput=document.getElementById('imageXInput');
var imageYInput=document.getElementById('imageYInput');
var editingImage=null,pendingCrop=null;
function imageEditorData(type,id){
  if(type==='review'){
    var reviewer=state.reviewers.find(function(r){return r.id===Number(id)});
    return reviewer?{src:reviewer.avatar,crop:cropOf(reviewer),owner:reviewer,title:'리뷰 이미지 편집'}:null;
  }
  var titles={background:'시트 배경 편집',hero:'상단 메인 이미지 편집',poster:'영화 포스터 편집'};
  return {src:state[type+'Image'],crop:state[type+'Crop'],owner:state,cropKey:type+'Crop',title:titles[type]};
}
function updateEditorPreview(){
  if(!pendingCrop)return;
  applyImageCrop(imageEditorPreview,pendingCrop);
  document.getElementById('imageZoomValue').textContent=pendingCrop.zoom+'%';
}
function openImageEditor(type,id){
  var data=imageEditorData(type,id);
  if(!data||!data.src)return alert('먼저 이미지를 선택해주세요.');
  editingImage={type:type,id:id};pendingCrop=Object.assign({},data.crop);
  document.getElementById('imageEditorTitle').textContent=data.title;
  imageEditorViewport.className='image-editor-viewport is-'+type;
  imageEditorPreview.src=data.src;
  imageZoomInput.value=pendingCrop.zoom;imageXInput.value=pendingCrop.x;imageYInput.value=pendingCrop.y;
  updateEditorPreview();imageEditorModal.hidden=false;document.body.classList.add('modal-open');imageZoomInput.focus();
}
function closeImageEditor(){imageEditorModal.hidden=true;document.body.classList.remove('modal-open');editingImage=null;pendingCrop=null}
[imageZoomInput,imageXInput,imageYInput].forEach(function(input){input.oninput=function(){if(!pendingCrop)return;pendingCrop.zoom=Number(imageZoomInput.value);pendingCrop.x=Number(imageXInput.value);pendingCrop.y=Number(imageYInput.value);updateEditorPreview()}});
document.querySelectorAll('[data-image-editor]').forEach(function(button){button.onclick=function(){openImageEditor(button.dataset.imageEditor)}});
document.getElementById('imageEditorApply').onclick=function(){
  if(!editingImage||!pendingCrop)return closeImageEditor();
  if(editingImage.type==='review'){
    var reviewer=state.reviewers.find(function(r){return r.id===Number(editingImage.id)});if(reviewer)reviewer.crop=Object.assign({},pendingCrop);
  }else state[editingImage.type+'Crop']=Object.assign({},pendingCrop);
  save();closeImageEditor();render();
};
document.getElementById('imageEditorCancel').onclick=closeImageEditor;
document.getElementById('imageEditorClose').onclick=closeImageEditor;
imageEditorModal.onclick=function(event){if(event.target===imageEditorModal)closeImageEditor()};
document.addEventListener('keydown',function(event){if(event.key==='Escape'&&!imageEditorModal.hidden)closeImageEditor()});

document.getElementById('addReviewer').onclick=function(){
  var number=state.reviewers.length+1;
  state.reviewers.push({id:Date.now(),name:'리뷰어 '+number,role:number+'번째 관객',rating:'★ 4.0',body:'영화를 보고 떠오른 감상과 오래 남은 장면을 자유롭게 적어주세요.',avatar:'',crop:{zoom:100,x:50,y:50}});
  save();renderReviews();
};
document.getElementById('resetAll').onclick=function(){
  if(!confirm('입력한 내용을 모두 초기화할까요?'))return;
  state=JSON.parse(JSON.stringify(defaults));save();
  ids.forEach(function(key){document.getElementById(inputIds[key]).value=state[key]});
  backgroundOpacityInput.value=state.backgroundOpacity;
  document.getElementById('backgroundUpload').value='';
  render();
};
document.getElementById('savePng').onclick=async function(){
  if(!window.html2canvas)return alert('저장 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
  var button=this;button.disabled=true;button.textContent='저장 중…';document.body.classList.add('saving');
  try{
    if(document.fonts&&document.fonts.ready)await document.fonts.ready;
    await new Promise(function(resolve){requestAnimationFrame(function(){requestAnimationFrame(resolve)})});
    var canvas=await window.html2canvas(sheet,{scale:2,backgroundColor:'#0a0a0a',useCORS:true,logging:false});
    var link=document.createElement('a');link.download='reframe-'+(state.title||'movie-review')+'.png';link.href=canvas.toDataURL('image/png');link.click();
  }catch(error){alert('PNG를 만들지 못했습니다. 이미지 용량을 줄여 다시 시도해주세요.')}
  finally{document.body.classList.remove('saving');button.disabled=false;button.textContent='PNG 저장';fitFrame()}
};
window.addEventListener('resize',fitFrame);
render();

