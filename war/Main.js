//const DOMAIN="http://localhost:8080";FACEBOOK_ID="604761326359317";
const DOMAIN="https://weplaywebsite.appspot.com";FACEBOOK_ID="604761063026010";
ROOT_API=DOMAIN+'/_ah/api';
const GOOGLE_API_KEY="AIzaSyCl46r3eXdyJlj6siZoCoF2WMifESqZo_0";


var email="";

function loadScript(url, callback){   // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onreadystatechange = callback;
    script.onload = callback;
    head.appendChild(script);
}

function encode_utf8(s) {
    return unescape(encodeURIComponent(s));
}

function decode_utf8(s) {
    return decodeURIComponent(escape(s));
}

function message(s){
    if(s.substr(0,1)=="!")
        s="<img src='wait.gif'></img>"+ s.substr(1, s.length-1);
    var zone=document.getElementById("message");
    if(zone!=null)zone.innerHTML=s;
}


function init(){
    if(gapi.client==null){
        console.log("GAPI loading failed");
    }else{
        gapi.client.load('ficarbar', 'v1', function(){
            gapi.client.load('urlshortener', 'v1',function(){
                start();
            });
            console.log("gapi loaded. Start call");
        }, ROOT_API);
    }
}


function adduser(infos,func){
    gapi.client.ficarbar.adduser({infos:JSON.stringify(infos)}).then(func);
}

function getsongtoplay(evt,func){
    gapi.client.ficarbar.getsongtoplay({event:evt}).then(func);
}

function addScore(user,score,func){
    gapi.client.ficarbar.addscore({email:user,score:score}).then(func);
}

function join(event,email,password,from,func){
    gapi.client.ficarbar.join({event:event,email:email,password:password,from:from}).then(func);
}

function querymusic(query,func){
    gapi.client.ficarbar.querymusic({query:query}).then(func);
}

function getMessage(event,dt,func){
    gapi.client.ficarbar.getmessage({event:event,date:dt}).then(func);
}

function getClassement(event,func){
    gapi.client.ficarbar.getclassement({event:event}).then(func);
}

function getLastPhoto(event,func){
    gapi.client.ficarbar.lastphoto({event:event}).then(func);
}


function getplaylist(event,func){
    gapi.client.ficarbar.getplaylist({event:event}).then(func);
}


function slideshow(delay,event,func){
    gapi.client.ficarbar.slideshow({delay:delay,event:event}).then(func);
}


function quit(email,event,func){
    gapi.client.ficarbar.quit({email:email,event:event}).then(func);
}

function raz(func){
    gapi.client.ficarbar.raz().then(func);
}

function setscore(email,event,id,step,func){
    gapi.client.ficarbar.setscore({user:email,event:event,song:id,step:step}).then(func);
}

function getuser(email,func){
    gapi.client.ficarbar.getuser({email:email}).then(func);
}

function geteventsaround(pos,func){
    gapi.client.ficarbar.geteventsaround({lat:pos.latitude,lng:pos.longitude}).then(function(resp){
            if(resp.status==200)func(resp.result.items);
        });
}

function shorturl(url,func){
    gapi.client.setApiKey(GOOGLE_API_KEY);
    gapi.client.urlshortener.url.insert({longUrl:url}).then(func);
    gapi.client.setApiKey(null);
}

function geteventsfrom(email,func){
    gapi.client.ficarbar.geteventsfrom({email:email}).then(function(resp2){
        if(resp2.status==200)func(resp2.result.items);
    });
}


function getevent(id,func){
    gapi.client.ficarbar.getevent({event:id}).then(func);
}


function sendphoto(event,photo,func){
    var req= gapi.client.request({
        path: ROOT_API+'/ficarbar/v1/sendphoto',
        method: 'POST',
        params: {event:event},
        body:photo
    });
    req.execute(func);
}

function addsong(event,song,func){
    var req= gapi.client.request({
        path: ROOT_API+'/ficarbar/v1/addsong',
        method: 'POST',
        params: {event:event},
        body:song
    });
    req.execute(func);
}

function searchtorrent(query,func){
    gapi.client.ficarbar.searchtorrent({query:query}).then(func);
}

function senduser(user,func){
    var req= gapi.client.request({
        path: ROOT_API+'/ficarbar/v1/senduser',
        method: 'PUT',
        body:user
    });
    req.execute(func);
}



function addevent(email,event,func){
    var req= gapi.client.request({
        path: ROOT_API+'/ficarbar/v1/addevent',
        method: 'POST',
        params: {email:email},
        body:event
    });
    req.execute(func);
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}



function deezerSearch(query,func){
    queryd(query,function(res){
        func(JSON.parse(res));
    });
}



function utf8_to_b64(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}



function getParam(param) {
    var vars = {};
    window.location.href.replace( location.hash, '' ).replace(
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function( m, key, value ) { // callback
            vars[key] = value !== undefined ? value : '';
        }
    );
    return vars;
}



function to2D(p){
    var x= p.lng;
    var y=Math.atan(Math.sin(p.lat));
    return {x:x,y:y};
}



function mkTest(idtest){
    httpGetAsync(ROOT_API+'/ficarbar/v1/test?id='+idtest,null,function(resp){
        //r=JSON.parse(resp);
        document.write(resp);
        //document.location.href="start.html?email="+r.items[0];
    },function(err){
        document.write("Erreur d'execution : "+err);
    });
}


loadScript("https://apis.google.com/js/client.js?onload=init",function(){
    console.log("Chargement de tous les scripts ok");
});

