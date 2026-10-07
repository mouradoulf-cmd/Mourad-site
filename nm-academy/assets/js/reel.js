/* Hero phone reel: load and play each video only while it is on screen. */
(function(){
  var reel=document.getElementById('reel'); if(!reel) return;
  var vids=[].slice.call(reel.querySelectorAll('video'));
  // on small screens the reel scrolls sideways: start on the centre phone
  function centre(){if(reel.scrollWidth>reel.clientWidth+4){var c=reel.querySelector('.p3');if(!c)return;var r=reel.getBoundingClientRect(),b=c.getBoundingClientRect();reel.scrollLeft+=(b.left-r.left)-(r.width-b.width)/2;}}
  centre();window.addEventListener('load',centre);
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce||!('IntersectionObserver' in window)) return; // posters stay visible
  var io=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;
    if(e.isIntersecting){ if(!v.src){v.src=v.dataset.src;} var p=v.play(); if(p&&p.catch)p.catch(function(){}); }
    else if(!v.paused){ v.pause(); }
  })},{threshold:.25});
  vids.forEach(function(v){io.observe(v)});
})();
