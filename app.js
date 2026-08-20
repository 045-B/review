var tones=['crimson','blue','amber','violet','green'];
var samples=[
  {id:1,title:'애프터 이미지',year:'2026',genre:'드라마',poster:'',reviews:[{id:11,name:'은하',rating:4.5,headline:'남겨진 장면의 온도',body:'말하지 않은 순간들이 오래 마음에 남았다.'}]},
  {id:2,title:'새벽의 편지',year:'2024',genre:'로맨스',poster:'',reviews:[{id:21,name:'여름',rating:4,headline:'새벽에 다시 보고 싶은 영화',body:'조용한 화면과 인물의 호흡이 좋았다.'},{id:22,name:'도윤',rating:3.5,headline:'느리지만 다정한 이야기',body:'후반부의 선택이 오래 생각난다.'}]},
  {id:3,title:'붉은 여름',year:'2025',genre:'스릴러',poster:'',reviews:[{id:31,name:'하진',rating:5,headline:'끝까지 놓지 않는 긴장감',body:'색과 소리만으로 분위기를 밀어붙인다.'},{id:32,name:'선우',rating:4,headline:'강렬한 미장센',body:'인물보다 공간이 먼저 기억나는 영화.'},{id:33,name:'민',rating:4.5,headline:'올해의 발견',body:'마지막 장면 때문에 처음부터 다시 보고 싶다.'}]},
  {id:4,title:'우리의 궤도',year:'2023',genre:'SF',poster:'',reviews:[]}
];
var saved={};
try{saved=JSON.parse(localStorage.getItem('reframe-library')||'{}')}catch(error){}
var movies=saved.movies||samples;
var heroImage=saved.heroImage||'';
var selected=null;
var heroArt=document.getElementById('heroArt');
var filmRow=document.getElementById('filmRow');
var filmCount=document.getElementById('filmCount');
var statFilms=document.getElementById('statFilms');
var statReviews=document.getElementById('statReviews');
var modalRoot=document.getElementById('modalRoot');

function esc(value){
  return String(value==null?'':value).replace(/[&<>"']/g,function(character){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character];
  });
}
function save(){
  try{localStorage.setItem('reframe-library',JSON.stringify({movies:movies,heroImage:heroImage}))}catch(error){}
}
function readImage(input,done){
  var file=input.files&&input.files[0];
  if(!file)return;
  var reader=new FileReader();
  reader.onload=function(){done(String(reader.result))};
  reader.readAsDataURL(file);
}
function posterMarkup(movie,index){
  if(movie.poster)return '<img src="'+movie.poster+'" alt="">';
  return '<b>'+String(index+1).padStart(2,'0')+'</b><span>'+esc(movie.title)+'</span>';
}
function render(){
  heroArt.style.backgroundImage=heroImage?'url("'+heroImage+'")':'';
  filmCount.textContent=movies.length+'편의 영화';
  statFilms.textContent=movies.length;
  statReviews.textContent=movies.reduce(function(total,movie){return total+movie.reviews.length},0);
  var cards=movies.map(function(movie,index){
    return '<button class="film-card" data-id="'+movie.id+'"><div class="poster '+tones[index%tones.length]+'">'+posterMarkup(movie,index)+'<em>'+movie.reviews.length+' REVIEWS</em></div><h3>'+esc(movie.title)+'</h3><p>'+esc(movie.year)+' · '+esc(movie.genre)+' · 리뷰어 '+movie.reviews.length+'명</p></button>';
  }).join('');
  filmRow.innerHTML=cards+'<button class="film-card add-card" id="addCard"><span>＋</span><b>새 영화 추가</b></button>';
  filmRow.querySelectorAll('[data-id]').forEach(function(button){
    button.onclick=function(){selected=Number(button.dataset.id);openMovie()};
  });
  document.getElementById('addCard').onclick=addNew;
}
function addNew(){
  var id=Date.now();
  movies.unshift({id:id,title:'새 영화',year:'2026',genre:'장르 미정',poster:'',reviews:[]});
  selected=id;
  save();
  render();
  openMovie();
}
function updateMovie(key,value){
  var movie=movies.find(function(item){return item.id===selected});
  if(!movie)return;
  movie[key]=value;
  save();
  render();
}
function reviewMarkup(review,index){
  return '<article class="review-card" data-review="'+review.id+'"><header><b>'+String(index+1).padStart(2,'0')+'</b><input data-key="name" value="'+esc(review.name)+'" aria-label="리뷰어 이름"><button data-delete>삭제</button></header><label>별점 <input data-key="rating" type="number" min="0" max="5" step=".5" value="'+review.rating+'"></label><input class="headline-input" data-key="headline" value="'+esc(review.headline)+'" aria-label="한 줄 평"><textarea data-key="body" aria-label="리뷰 내용">'+esc(review.body)+'</textarea></article>';
}
function openMovie(){
  var movie=movies.find(function(item){return item.id===selected});
  if(!movie)return;
  var index=movies.indexOf(movie);
  var reviews=movie.reviews.length?movie.reviews.map(reviewMarkup).join(''):'<button class="empty" id="emptyAdd">첫 번째 리뷰어를 추가하세요 <span>＋</span></button>';
  var poster=movie.poster?'<img src="'+movie.poster+'" alt="'+esc(movie.title)+' 포스터">':'<span>포스터<br>이미지 추가</span>';
  modalRoot.innerHTML='<div class="overlay" id="overlay"><section class="modal"><button class="close" id="closeModal">×</button><div class="movie-editor"><label class="detail-poster '+tones[index%tones.length]+'">'+poster+'<input type="file" accept="image/*" id="posterUpload"></label><div><p class="modal-kicker">FILM DETAIL</p><input class="title-input" id="titleEdit" value="'+esc(movie.title)+'" aria-label="영화 제목"><div class="meta-inputs"><input id="yearEdit" value="'+esc(movie.year)+'" aria-label="연도"><input id="genreEdit" value="'+esc(movie.genre)+'" aria-label="장르"></div></div></div><div class="reviews-head"><div><span>REVIEWERS</span><h2>'+movie.reviews.length+'개의 시선</h2></div><button id="addReviewer">＋ 리뷰어 추가</button></div><div class="review-list">'+reviews+'</div></section></div>';
  var overlay=document.getElementById('overlay');
  document.getElementById('closeModal').onclick=function(){modalRoot.innerHTML=''};
  overlay.onmousedown=function(event){if(event.target===overlay)modalRoot.innerHTML=''};
  document.getElementById('titleEdit').oninput=function(event){updateMovie('title',event.target.value)};
  document.getElementById('yearEdit').oninput=function(event){updateMovie('year',event.target.value)};
  document.getElementById('genreEdit').oninput=function(event){updateMovie('genre',event.target.value)};
  document.getElementById('posterUpload').onchange=function(event){
    readImage(event.target,function(value){updateMovie('poster',value);openMovie()});
  };
  function addReviewer(){
    movie.reviews.push({id:Date.now(),name:'리뷰어 '+(movie.reviews.length+1),rating:4,headline:'한 줄 평을 입력하세요',body:'영화에 대한 감상을 자유롭게 기록하세요.'});
    save();render();openMovie();
  }
  document.getElementById('addReviewer').onclick=addReviewer;
  var emptyAdd=document.getElementById('emptyAdd');
  if(emptyAdd)emptyAdd.onclick=addReviewer;
  document.querySelectorAll('[data-review]').forEach(function(card){
    var reviewId=Number(card.dataset.review);
    card.querySelectorAll('[data-key]').forEach(function(field){
      field.oninput=function(event){
        var review=movie.reviews.find(function(item){return item.id===reviewId});
        var key=event.target.dataset.key;
        review[key]=key==='rating'?Number(event.target.value):event.target.value;
        save();render();
      };
    });
    card.querySelector('[data-delete]').onclick=function(){
      movie.reviews=movie.reviews.filter(function(item){return item.id!==reviewId});
      save();render();openMovie();
    };
  });
}
document.getElementById('addMovie').onclick=addNew;
document.getElementById('exportImage').onclick=async function(){
  var button=this;
  if(!window.html2canvas){alert('이미지 저장 기능을 불러오는 중입니다. 잠시 후 다시 눌러주세요.');return}
  button.disabled=true;button.textContent='만드는 중…';document.body.classList.add('exporting');
  try{
    if(document.fonts&&document.fonts.ready)await document.fonts.ready;
    await new Promise(function(resolve){requestAnimationFrame(function(){requestAnimationFrame(resolve)})});
    var canvas=await window.html2canvas(document.body,{backgroundColor:'#090909',scale:Math.min(2,2800/window.innerWidth),useCORS:true,logging:false,windowWidth:document.documentElement.scrollWidth,windowHeight:document.documentElement.scrollHeight});
    var link=document.createElement('a');
    link.download='reframe-archive-'+new Date().toISOString().slice(0,10)+'.png';
    link.href=canvas.toDataURL('image/png');
    link.click();
  }catch(error){alert('이미지를 만들지 못했습니다. 업로드한 이미지의 크기를 줄인 뒤 다시 시도해주세요.')}
  finally{document.body.classList.remove('exporting');button.disabled=false;button.textContent='↓ 이미지 저장'}
};
document.getElementById('heroUpload').onchange=function(event){
  readImage(event.target,function(value){heroImage=value;save();render()});
};
render();

