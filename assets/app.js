(function(){
var K='sc_saved',base=document.body.dataset.base||'';
function get(){try{return JSON.parse(localStorage.getItem(K))||[]}catch(e){return[]}}
function set(a){localStorage.setItem(K,JSON.stringify(a));sync()}
function toast(m){var t=document.querySelector('.toast');t.textContent=m;t.classList.add('on');setTimeout(function(){t.classList.remove('on')},2200)}
function sync(){var s=get();document.querySelectorAll('[data-saved-count]').forEach(function(e){e.textContent=s.length});
document.querySelectorAll('[data-save]').forEach(function(b){var on=s.indexOf(b.dataset.save)>-1;b.classList.toggle('saved',on);b.textContent=on?'★ Saved':'☆ Save'})}
document.addEventListener('click',function(e){var b=e.target.closest('[data-save]');if(!b)return;var s=get(),k=b.dataset.save,i=s.indexOf(k);if(i>-1){s.splice(i,1);toast('Removed')}else{s.push(k);toast('Saved to My reminders')}set(s)});
// home filters
var f=document.getElementById('finder');
if(f&&window.SCH){var p=new URLSearchParams(location.search);['state','major','due_before'].forEach(function(n){if(p.get(n))f.elements[n].value=p.get(n)});
 function apply(){var st=f.state.value,mj=f.major.value,db=f.due_before.value,n=0;
  document.querySelectorAll('#results .card[data-slug]').forEach(function(c){var s=SCH.find(function(x){return x.slug===c.dataset.slug});
   var ok=(!st||s.state===st||s.state==='any')&&(!mj||s.major===mj)&&(!db||s.due<=db)&&!(s.passed&&(st||mj));c.hidden=!ok;if(ok)n++});
  var hub=st?'scholarships/state/'+st+'/':mj?'scholarships/major/'+mj+'/':'';
  document.querySelector('link[rel=canonical]').href='https://scholarshipclock.com/'+hub;
  document.getElementById('results-note').innerHTML=n+' matches · Sample data'+(hub?' · <a href="'+hub+'">Open hub</a>':'')}
 f.addEventListener('submit',function(e){e.preventDefault();var q=new URLSearchParams();['state','major','due_before'].forEach(function(n){if(f.elements[n].value)q.set(n,f.elements[n].value)});history.replaceState(null,'','?'+q);apply()});
 if(location.search)apply()}
// countdown
var cd=document.querySelector('[data-countdown]');if(cd){var d=new Date(cd.closest('[data-due]').dataset.due+'T23:59:00'),ms=d-new Date();cd.textContent=ms<0?'Closed':Math.ceil(ms/864e5)+' days'}
// reminders
var sv=document.getElementById('saved');
if(sv){var p2=new URLSearchParams(location.search).get('add');if(p2){var s=get();if(s.indexOf(p2)<0){s.push(p2);set(s)}}
 fetch(base+'index.html').then(function(r){return r.text()}).then(function(t){var m=t.match(/window\.SCH=(\[.*?\]);<\/script>/);var all=m?JSON.parse(m[1]):[];
  function draw(){var s=get();sv.innerHTML=s.length?'':'<p class="muted">Nothing saved yet. Tap ☆ Save on any scholarship.</p>';
   s.forEach(function(k){var x=all.find(function(a){return a.slug===k});if(!x)return;sv.insertAdjacentHTML('beforeend','<article class="card"><div class="ctop"><span class="pill due">Due '+x.dd+'</span><span class="amt">$'+x.amt.toLocaleString()+'</span></div><h3><a href="'+base+'scholarships/'+k+'/">'+x.name+'</a></h3><button class="btn ghost" data-save="'+k+'">★ Saved</button></article>')});sync()}
  draw();document.addEventListener('click',function(e){if(e.target.closest('[data-save]'))setTimeout(draw,10)});
  var rf=document.getElementById('remform');rf.addEventListener('change',function(){rf.email.hidden=rf.how.value!=='email';rf.email.required=!rf.email.hidden});
  rf.addEventListener('submit',function(e){e.preventDefault();var s=get().map(function(k){return all.find(function(a){return a.slug===k})}).filter(Boolean);if(!s.length){toast('Save a scholarship first');return}
   if(rf.how.value==='ics'){var L=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//ScholarshipClock//EN'];s.forEach(function(x){var d=x.due.replace(/-/g,'');L.push('BEGIN:VEVENT','UID:'+x.slug+'@scholarshipclock.com','DTSTAMP:20261013T000000Z','DTSTART;VALUE=DATE:'+d,'SUMMARY:Deadline: '+x.name,'DESCRIPTION:Due '+x.dd+' '+x.time,'BEGIN:VALARM','TRIGGER:-P7D','ACTION:DISPLAY','DESCRIPTION:Due in 7 days','END:VALARM','END:VEVENT')});L.push('END:VCALENDAR');
    var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([L.join('\r\n')],{type:'text/calendar'}));a.download='scholarship-deadlines.ics';a.click();toast('Calendar file downloaded')}
   else{localStorage.setItem('sc_email',rf.email.value);toast('Demo: reminders scheduled (not actually sent)')}})})}
sync()})();
