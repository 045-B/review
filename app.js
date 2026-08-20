var defaults={
  accent:'#edff57',brand:'RE:FRAME',backgroundImage:'',backgroundOpacity:'0.22',heroImage:'',posterImage:'',topLine:'ha ha ha, hu hu hu — after the credits',
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

var ids=['accent','brand','topLine','title','engTitle','year','genre','director','synopsis','tags','question','answer'];
var inputIds={accent:'accentInput',brand:'brandInput',topLine:'topLineInput',title:'titleInput',engTitle:'engTitleInput',year:'yearInput',genre:'genreInput',director:'directorInput',synopsis:'synopsisInput',tags:'tagsInput',question:'questionInput',answer:'answerInput'};
var viewIds={topLine:'topLineView',title:'titleView',engTitle:'engTitleView',year:'yearView',genre:'genreView',director:'directorView',synopsis:'synopsisView',tags:'tagsView',question:'questionView',answer:'answerView'};
var sheet=document.getElementById('captureSheet'),frame=document.querySelector('.sheet-frame');

function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function save(){try{localStorage.setItem('reframe-sheet-v2',JSON.stringify(state))}catch(error){}}
function imageFile(input,done){var file=input.files&&input.files[0];if(!file)return;var reader=new FileReader();reader.onload=function(){done(String(reader.result))};reader.readAsDataURL(file)}
function fitFrame(){requestAnimationFrame(function(){var rect=sheet.getBoundingClientRect();frame.style.height=Math.ceil(rect.height)+'px'})}

function renderReviewPreview(){
  document.getElementById('reviewsView').innerHTML=state.reviewers.map(function(r,index){
    var avatar=r.avatar?'<img src="'+r.avatar+'" alt="">':'<span>0'+(index+1)+'</span>';
    return '<article class="review-block"><div class="avatar-view">'+avatar+'</div><div class="review-bubble"><header class="review-head"><h4>'+esc(r.name)+'</h4><span>'+esc(r.role)+'</span><strong>'+esc(r.rating)+'</strong></header><p>'+esc(r.body)+'</p></div></article>';
  }).join('');
  document.getElementById('reviewCountView').textContent=String(state.reviewers.length).padStart(2,'0')+' REVIEWS';
  fitFrame();
}
function renderReviews(){
  var editors=document.getElementById('reviewerEditors');
  editors.innerHTML=state.reviewers.map(function(r,index){
    return '<section class="reviewer-editor" data-editor="'+r.id+'"><header><strong>REVIEWER '+String(index+1).padStart(2,'0')+'</strong><button data-remove="'+r.id+'">삭제</button></header><div class="avatar-row"><label>이름<input data-review="'+r.id+'" data-key="name" value="'+esc(r.name)+'"></label><label>평점<input data-review="'+r.id+'" data-key="rating" value="'+esc(r.rating)+'"></label></div><label>역할 / 한 줄 정보<input data-review="'+r.id+'" data-key="role" value="'+esc(r.role)+'"></label><label>리뷰 이미지 (가로형 권장)<input type="file" accept="image/*" data-avatar="'+r.id+'"></label><label>리뷰 본문<textarea data-review="'+r.id+'" data-key="body">'+esc(r.body)+'</textarea></label></section>';
  }).join('');
  renderReviewPreview();
  editors.querySelectorAll('[data-review]').forEach(function(field){field.oninput=function(){var r=state.reviewers.find(function(x){return x.id===Number(field.dataset.review)});r[field.dataset.key]=field.value;save();renderReviewPreview()}});
  editors.querySelectorAll('[data-avatar]').forEach(function(field){field.onchange=function(){var r=state.reviewers.find(function(x){return x.id===Number(field.dataset.avatar)});imageFile(field,function(value){r.avatar=value;save();renderReviews()})}});
  editors.querySelectorAll('[data-remove]').forEach(function(button){button.onclick=function(){if(state.reviewers.length===1)return alert('리뷰어는 한 명 이상 필요합니다.');state.reviewers=state.reviewers.filter(function(x){return x.id!==Number(button.dataset.remove)});save();renderReviews()}});
}

function render(){
  sheet.style.setProperty('--accent',state.accent);
  document.querySelectorAll('[data-brand]').forEach(function(element){element.textContent=state.brand||'RE:FRAME'});
  var background=document.getElementById('sheetBackground');
  background.style.backgroundImage=state.backgroundImage?'url("'+state.backgroundImage+'")':'';
  background.style.opacity=state.backgroundImage?state.backgroundOpacity:'0';
  document.getElementById('sheetHero').style.backgroundImage=state.heroImage?'url("'+state.heroImage+'")':'';
  var poster=document.getElementById('posterView');
  poster.innerHTML=state.posterImage?'<img src="'+state.posterImage+'" alt="영화 포스터">':'<span>POSTER<br>IMAGE</span>';
  Object.keys(viewIds).forEach(function(key){document.getElementById(viewIds[key]).textContent=state[key]});
  renderReviews();
}

ids.forEach(function(key){
  var input=document.getElementById(inputIds[key]);
  input.value=state[key];
  input.oninput=function(){state[key]=input.value;save();render()};
});
document.getElementById('heroUpload').onchange=function(){imageFile(this,function(value){state.heroImage=value;save();render()})};
document.getElementById('posterUpload').onchange=function(){imageFile(this,function(value){state.posterImage=value;save();render()})};
document.getElementById('backgroundUpload').onchange=function(){imageFile(this,function(value){state.backgroundImage=value;save();render()})};
var backgroundOpacityInput=document.getElementById('backgroundOpacityInput');
backgroundOpacityInput.value=state.backgroundOpacity;
backgroundOpacityInput.oninput=function(){state.backgroundOpacity=this.value;save();render()};
document.getElementById('removeBackground').onclick=function(){state.backgroundImage='';document.getElementById('backgroundUpload').value='';save();render()};
document.getElementById('addReviewer').onclick=function(){
  var number=state.reviewers.length+1;
  state.reviewers.push({id:Date.now(),name:'리뷰어 '+number,role:number+'번째 관객',rating:'★ 4.0',body:'영화를 보고 떠오른 감상과 오래 남은 장면을 자유롭게 적어주세요.',avatar:''});
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

