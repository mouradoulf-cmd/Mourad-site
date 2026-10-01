/* Demo storage (browser localStorage). A real launch replaces this with a server + database. */
(function(){
  var KEY='jongngai_v1';
  var DEFAULT={
    shop:{name:'ร้านตัวอย่าง สปา & เสริมสวย',open:10,close:20,line:''},
    services:[
      {id:'s1',name:'นวดไทย 60 นาที',mins:60,price:350},
      {id:'s2',name:'นวดน้ำมัน 90 นาที',mins:90,price:650},
      {id:'s3',name:'ตัดผม',mins:45,price:300},
      {id:'s4',name:'ทำเล็บเจล',mins:60,price:500}
    ],
    bookings:[]
  };
  function load(){
    try{var d=JSON.parse(localStorage.getItem(KEY));if(d&&d.shop)return d;}catch(e){}
    return JSON.parse(JSON.stringify(DEFAULT));
  }
  function save(d){try{localStorage.setItem(KEY,JSON.stringify(d));}catch(e){}}
  window.Store={
    get:load,
    save:save,
    addBooking:function(b){var d=load();b.id='b'+Date.now();b.status='new';b.createdAt=Date.now();d.bookings.push(b);save(d);return b;},
    setStatus:function(id,st){var d=load();d.bookings.forEach(function(b){if(b.id===id)b.status=st;});save(d);},
    taken:function(date){return load().bookings.filter(function(b){return b.date===date&&b.status!=='no';}).map(function(b){return b.time;});},
    reset:function(){try{localStorage.removeItem(KEY);}catch(e){}}
  };
})();
