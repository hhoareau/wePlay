//const DOMAIN="http://localhost:8080";FACEBOOK_ID="604761326359317";
const DOMAIN="https://weplaywebsite.appspot.com";FACEBOOK_ID="604761063026010";
const DEBUG=true;
ROOT_API=DOMAIN+'/_ah/api';
const GOOGLE_API_KEY="AIzaSyCl46r3eXdyJlj6siZoCoF2WMifESqZo_0";

//const colors=[];
//colors["photo"]="red";

const TORRENT = 0;
const DEEZER = 1;
const SPOTIFY = 2;
const LOCAL= 3;

var email="";

function loadScript(url, callback,func_failed){   // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onreadystatechange = callback;
    script.onerror=func_failed;
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
        informe("%dangerNo connexion ...");
        setTimeout(init,10000);
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

function closeevent(event,email,func){
    gapi.client.ficarbar.closeevent({event:event,email:email}).then(func);
}

function getsongtoplay(evt,func){
    gapi.client.ficarbar.getsongtoplay({event:evt}).then(func);
}

function gettopsongs(evt,nbr,func){
    gapi.client.ficarbar.gettopsongs({event:evt,nombre:nbr}).then(func);
}



function getmagnets(torrents,func){
    gapi.client.ficarbar.getmagnets({torrents:torrents}).then(func);
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


function getuser(email,func){
    gapi.client.ficarbar.getuser({email:email}).then(func);
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

function razlocalfile(event,func){
    gapi.client.ficarbar.razlocalfile({event:event}).then(func);
}

function setscore(email,event,id,step,func){
    gapi.client.ficarbar.setscore({user:email,event:event,song:id,step:step}).then(func);
}


function geteventsaround(pos,func){
    gapi.client.ficarbar.geteventsaround({lat:pos.lat,lng:pos.lng}).then(function(resp){
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

const boundary = '-------314159265358979323846';
const delimiter = "\r\n--" + boundary + "\r\n";
const close_delim = "\r\n--" + boundary + "--";


function httpPost(service,params,body,jauge,func){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', ROOT_API+'/ficarbar/v1/'+service+"?"+params, true);
    xhr.setRequestHeader('Content-Type', 'multipart/mixed; boundary="' + boundary + '"');
    //xhr.setRequestHeader('authorization', 'Bearer ' + gapi.auth.getToken().access_token);
    xhr.upload.addEventListener("progress", function(e) {
        jauge.value=parseFloat(e.loaded / e.total * 100).toFixed(2);
    }, false);

    xhr.onreadystatechange = function(e) {
        if (xhr.readyState == 4) {
            func(xhr.responseText);
        }
    };
    xhr.send(multipartRequestBody);
}


function sendphoto(event,photo,func_success,func_rejected,func_progress){
    var req= gapi.client.request({
        path: ROOT_API+'/ficarbar/v1/sendphoto',
        method: 'POST',
        params: {event:event},
        body:photo
    }).then(func_success,func_rejected,func_progress);
}


function uploadfiles(list,func){
    var req= gapi.client.request({
        path: ROOT_API+'/ficarbar/v1/uploadfiles',
        method: 'POST',
        body:list
    });
    req.execute(func);
}


function addsong(event,song,func,err_func){
    var req= gapi.client.request({
        path: ROOT_API+'/ficarbar/v1/addsong',
        method: 'POST',
        params: {event:event},
        body:song
    }).then(func,err_func);
}

function searchtorrent(query,func){
    gapi.client.ficarbar.searchtorrent({query:query}).then(func);
}

function searchlocal(query,event,func){
    gapi.client.ficarbar.searchlocal({query:query,event:event}).then(func);
}

function senduser(user,update,func){
    var req= gapi.client.request({
        path: ROOT_API+'/ficarbar/v1/senduser',
        method: 'POST',
        body:user,
        params:{update:update}
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



function showEventIn(evt,user_pos,max_size){
    var code="";
    var d="";

    if(user_pos!=null){
        d=1000*distance(user_pos.latitude,user_pos.longitude,evt.lat,evt.lng).toFixed(1);
        d=" ("+d+"m)";
    }


    var link="<a href='javascript:setEvent(\""+evt.Id+"\",false)'>";
    if(evt.flyer.length>0)
        code=link+"<img style='max-width:"+max_size+"px;' src='"+evt.flyer+"'>";
    else
        code=link+"<h3>"+evt.title+d+"</h3><br>";

    code+="</a>";

    return code;
}




function showEventsOnMap(map,user,preview,max_size){
    geteventsaround({lat:map.center.lat(),lng:map.center.lng()},function(resp){
        //document.getElementById("zone_events").innerHTML=showEvents(evts,position.coords);

        resp.forEach(function(evt){
            var m=new google.maps.Marker({
                position: {lat:evt.lat,lng:evt.lng},
                map : map,
                user:user,
                title : evt.title,
                caption:evt.title,
                evt: JSON.stringify(evt),
                id:evt.Id,
                max_size:max_size
            });

            m.addListener("mouseover",function(){
                preview.innerHTML=showEventIn(JSON.parse(this.evt),this.user,this.max_size);
            });

            m.addListener("click",function(){
                preview.innerHTML=showEventIn(JSON.parse(this.evt),this.user,this.max_size);
            });

            m.addListener("dblclick",function(){
                preview.innerHTML=setEvent(this.id,false);
            });

        });

    });
}





loadScript("Tools.js",function(){
    //informe("Connexion ...",true);
    loadScript("https://apis.google.com/js/client.js?onload=init",function(){
        console.log("Chargement de tous les scripts ok");
    },function(){
        informe("No connexion to internet available ... retry in 10 sec",true);
        setTimeout(function(){location.reload()},10000);
    });
});


