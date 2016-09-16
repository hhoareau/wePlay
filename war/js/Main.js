//const DOMAIN="http://localhost:8080";FACEBOOK_ID="604761326359317";GOOGLE_API_KEY="AIzaSyCl46r3eXdyJlj6siZoCoF2WMifESqZo_0";
//const DOMAIN="https://weplaywebsite.appspot.com";FACEBOOK_ID="604761063026010";GOOGLE_API_KEY="AIzaSyCl46r3eXdyJlj6siZoCoF2WMifESqZo_0";
//const DOMAIN="https://shifumixwww.appspot.com";FACEBOOK_ID="901681453271015";GOOGLE_API_KEY="AIzaSyD9ulABAnLWARLXAIajXW5c-3Rj5Wqp-Ss";

var ADMIN_PASSWORD="hh4271";

if(window.location.host=="localhost:8080"){
    DOMAIN="http://"+window.location.host;
    FACEBOOK_ID="911650875607406";
    GOOGLE_API_KEY="AIzaSyD9ulABAnLWARLXAIajXW5c-3Rj5Wqp-Ss";
    DEEZER_KEY="190762";
    //DEEZER_KEY="182662";
};
if(window.location.host=="weplaywebsite.appspot.com"){
    DOMAIN="https://"+window.location.host;
    FACEBOOK_ID="604761063026010";
    GOOGLE_API_KEY="AIzaSyCl46r3eXdyJlj6siZoCoF2WMifESqZo_0";
    DEEZER_KEY="182662";
}

if(window.location.host=="shifumixweb.appspot.com"){
    DOMAIN="https://"+window.location.host;
    FACEBOOK_ID="901681453271015";
    GOOGLE_API_KEY="AIzaSyD9ulABAnLWARLXAIajXW5c-3Rj5Wqp-Ss";
    DEEZER_KEY="190762";
}

const DELAY_TUTO=10; //10 minutes
const DEBUG=true;
ROOT_API=DOMAIN+'/_ah/api';


//const colors=[];
//colors["photo"]="red";

const TORRENT = 0;
const DEEZER = 1;
const SPOTIFY = 2;
const LOCAL= 3;
const YOUTUBE=4;

var email=null;
var user=null;
var from=null;
var myevent=null;

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
        s="<img src='/img/wait.gif'>"+ s.substr(1, s.length-1);
    var zone=document.getElementById("message");
    if(zone!=null)zone.innerHTML=s;
}

var hTimeout;

function init(){
    if(gapi.client==null){
        informe("%dangerNo connexion ...");
        hTimeout=setTimeout(init,10000);
    }else{
        clearTimeout(hTimeout);
        gapi.client.load('ficarbar', 'v1', function(){
            gapi.client.load('urlshortener', 'v1',function(){
                gapi.client.load('youtube', 'v3', function() {
                    start();
                });
            });
            console.log("gapi loaded. Start call");
        }, ROOT_API);
    }
}


function adduser(infos,func){
    gapi.client.ficarbar.adduser({infos:JSON.stringify(infos)}).then(func);
}

function delevent(event,user,func){
    gapi.client.ficarbar.delevent({event:event,user:user}).then(func);
}


function closeevent(event,email,func){
    $$("Fermeture de l'event à la demande de "+email);
    gapi.client.ficarbar.closeevent({event:event,email:email}).then(func);
}

function getcurrentsong(evt,func){
    gapi.client.ficarbar.getcurrentsong({event:evt}).then(func);
}

function getsongtoplay(evt,func){
    try{
        gapi.client.ficarbar.getsongtoplay({event:evt}).then(func);
    } catch (e){
        httpGet("getsongtoplay?event="+evt,func);
    }

}

function gettopsongs(evt,nbr,func){
    gapi.client.ficarbar.gettopsongs({event:evt,nombre:nbr}).then(func);
}

function getmagnets(torrents,func){
    gapi.client.ficarbar.getmagnets({torrents:torrents}).then(func);
}

function addScore(user,score,func){
    gapi.client.ficarbar.addscore({user:user,score:score}).then(func);
}

function join(event,email,password,from,func){
    gapi.client.ficarbar.join({event:event,user:email,password:password,from:from}).then(func);
}

function querymusic(query,func){
    gapi.client.ficarbar.querymusic({query:query}).then(func);
}


function getuser(email,func){
    try{
        gapi.client.ficarbar.getuser({user:email}).then(func);
    } catch (e){
        httpGet("getuser?email="+email,func);
    }

}

function getMessage(event,dt,func){
    gapi.client.ficarbar.getmessage({event:event,date:dt}).then(func);
}


function delmessage(id,func){
    gapi.client.ficarbar.delmessage({message:id}).then(func);
}

function validatemessage(id,func){
    gapi.client.ficarbar.validatemessage({message:id}).then(func);
}

function blacklist(user,func){
    gapi.client.ficarbar.blacklist({user:user}).then(func);
}

function getClassement(event,func){
    try{
        gapi.client.ficarbar.getclassement({event:event}).then(func);

    } catch (e){
        httpGet("getclassement?event="+event,func);
    }
}

function getLastPhoto(event,validate,func){
    try{
        gapi.client.ficarbar.lastphoto({validate:validate,event:event}).then(func);
    } catch (e){
        httpGet("lastphoto?event="+event,func);
    }
}


function getplaylist(event,func){
    gapi.client.ficarbar.getplaylist({event:event}).then(func);
}


function sendinvitations(event,dests,from,shorturl,func){
    gapi.client.ficarbar.sendinvite({
        event:event,
        dests:dests,
        from:from,
        shorturl:shorturl}).then(func);
}

function mailtosend(readonly,func){
    gapi.client.ficarbar.mailtosend({readonly:readonly,password:'hh4271'}).then(func);
}

function slideshow(delay,event,func){
    try{
        gapi.client.ficarbar.slideshow({delay:delay,event:event}).then(func);
    } catch (e){
        httpGet("slideshow?event="+event+"&delay="+delay,func);
    }
}

function stopcurrentsong(event,func){
    gapi.client.ficarbar.stopcurrentsong({event:event}).then(func);
}

function sendevent(event,func){
    $$("Post de l'event au serveur:"+JSON.stringify(event));
    var req= gapi.client.request({
        path: ROOT_API+'/ficarbar/v1/sendevent',
        method: 'POST',
        body:event
    }).then(func);
}

function quit(iduser,event,func){
    gapi.client.ficarbar.quit({user:iduser,event:event}).then(func);
}

function updateevent(event,field,value,func){
    //httpGet("updateevent?event="+event+"&field="+field+"&value="+value,func,null,false);
    gapi.client.ficarbar.updateevent({event:event,value:value,field:field}).then(func);
}

function raz(func){
    try{
        gapi.client.ficarbar.raz().then(func);
    } catch (e){
        httpGet("raz",func);
    }

}

function razlocalfile(event,func){
    gapi.client.ficarbar.razlocalfile({event:event}).then(func);
}

function setscore(email,event,id,step,func){
    gapi.client.ficarbar.setscore({user:email,event:event,song:id,step:step}).then(func);
}


function sanity(func){
    gapi.client.ficarbar.sanity({password:ADMIN_PASSWORD}).then(func);
}

function geteventsaround(pos,func){
    try{
        gapi.client.ficarbar.geteventsaround({lat:pos.lat,lng:pos.lng}).then(function(resp){
            if(resp.status==200)func(resp.result.items);
        });
    } catch(e) {
        httpGet("geteventsaround?lat=48&lng=2", func);
    }

}

function shorturl(url,func){
    gapi.client.setApiKey(GOOGLE_API_KEY);
    gapi.client.urlshortener.url.insert({longUrl:url}).then(func);
    gapi.client.setApiKey(null);
}

function geteventsfrom(email,func){
    gapi.client.ficarbar.geteventsfrom({user:email}).then(function(resp2){
        if(resp2.status==200)func(resp2.result.items);
    });
}

function getevent(id,user,func){
    if(user==null)
        gapi.client.ficarbar.getevent({event:id}).then(func);
    else
        gapi.client.ficarbar.getevent({event:id,user:user.id,lat:user.lat,lng:user.lng}).then(func);
}

const boundary = '-------314159265358979323846';
const delimiter = "\r\n--" + boundary + "\r\n";
const close_delim = "\r\n--" + boundary + "--";

function httpPost(service,params,body,jauge,func){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', ROOT_API+'/ficarbar/v1/'+service+"?"+params, true);

    /*
    xhr.upload.addEventListener("progress", function(e) {
        jauge.value=parseFloat(e.loaded / e.total * 100).toFixed(2);
    }, false);
    */

    xhr.onreadystatechange = function(e) {
        if (xhr.readyState == 4) {
            func(xhr.responseText);
        }
    };
    xhr.send(JSON.stringify(body));
}

function httpGet(service,func,func_error,asynchron){
    if(asynchron==undefined)asynchron=true;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', ROOT_API+'/ficarbar/v1/'+service, asynchron);
    xhr.onreadystatechange = function(e) {
        if (xhr.readyState == 4) {
            func(JSON.parse(xhr.responseText));
        } else
            if(func_error!=undefined)func_error(xhr);
    };
    xhr.send();
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
    try{
        var req= gapi.client.request({
            path: ROOT_API+'/ficarbar/v1/uploadfiles',
            method: 'POST',
            body:list
        });
        req.execute(func);
    } catch(e){
        httpPost("uploadfiles",{},list,null,func);
    }
}

function addsong(id,song,func,err_func){
    gapi.client.request({
        path: ROOT_API+'/ficarbar/v1/addsong',
        method: 'POST',
        params: {event:id},
        body:song
    }).then(func,err_func);
}

function searchtorrent(query,func){
    gapi.client.ficarbar.searchtorrent({query:query}).then(func);
}

function searchlocal(query,event,func){
    gapi.client.setApiKey(null);
    gapi.client.ficarbar.searchlocal({query:query,event:event}).then(func);
}

function searchvideo(query,max_result,func){
    gapi.client.setApiKey(GOOGLE_API_KEY);
    gapi.client.youtube.search.list({
        q: query,
        order: 'viewCount',
        type:'video',
        part: 'id,snippet',
        format: '5',
        maxResults: max_result
    }).then(function(resp){
        gapi.client.setApiKey(null);
        func(resp.result.items);
    },function(err){
        console.log(err);
        gapi.client.setApiKey(null);
    });
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

function addevent(email,event,nsongs,func,err_func){
    var req= gapi.client.request({
        path: ROOT_API+'/ficarbar/v1/addevent',
        method: 'POST',
        params: {user:email,nsongs:nsongs},
        body:event
    }).then(func,err_func);
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

    var link="<a href='javascript:setEvent(\""+evt.Id+"\",false)'>";
    if(evt.flyer.length>0)
        code=link+"<img style='max-width:"+max_size+"px;' src='"+evt.flyer+"'>";
    else
        code=link+"<h3>"+evt.title+d+"</h3><br>";

    code+="</a>";

    return code;
}

function initGlobal(translater){
    try{
        user=JSON.parse(window.localStorage.getItem("user"));
    }catch (e){
        window.localStorage.setItem("user","");
        location.href="/index.html";
    }

    var s=window.localStorage.getItem("event");
    if(s!=undefined && s.length>0)
        myevent=JSON.parse(s);
    else
        myevent=null;

    try{
        if(user==undefined || gapi==undefined || gapi.client==undefined)
            document.location.href="/";
    }catch (e){
        if(myevent!=null && myevent.dtEnd==null)
            document.location.href="/index.html?event="+myevent.id;
        else
            document.location.href="/index.html";
    }


    if(translater!=undefined)
        translater.use(user.lang);

    from=window.localStorage.getItem("from");
}

//Check if an order must be executed
function isPresent(o){
    myevent=JSON.parse(window.localStorage.getItem("event"));
    o=o.toLowerCase();

    lastorder=window.localStorage.getItem("lastorder_"+o);
    if(lastorder==null)lastorder=0;

    for(var i=myevent.orders.length-1;i>=0;i--){
        var ord=JSON.parse(myevent.orders[i]);
        if(ord.dtOrder>lastorder && ord.order==o){
            window.localStorage.setItem("lastorder_"+o,ord.dtOrder);
            return true;
        }
    }
    return false;
}


function getInvite(idEvent,size){
    shorturl(DOMAIN+"/index.html?event="+idEvent,function(short){
        new QRCode(document.getElementById("qrcode"), {
            text: short.result.id,
            width: size,
            height: size,
            correctLevel : QRCode.CorrectLevel.H
        });
        var elt_url=document.getElementById("url");
        if(elt_url!=null)
            elt_url.innerHTML="<h2>"+short.result.id+"</h2>";
    });
}


function contain(user,l_user){
    for(var i=0;i<l_user.length;i++)
       if(l_user[i].id==user.id)return true;

    return false;
}

function refresh_event(idevent,func,func_quit,func_error){
    getevent(idevent,user,function(resp) {
        if(resp.status!=200)
            if(func_error!=undefined)
                func_error();
            else
                func_quit();
        else{
            myevent = resp.result;
            window.localStorage.setItem("event",JSON.stringify(myevent));
            if (myevent.dtEnd != undefined && myevent.dtEnd < new Date())
                func_quit()
            else
                func(resp.result);
        }
    });
}

showPopup = function ($scope,$ionicPopup,title,placeholder,func) {
    $scope.data = {};

    // An elaborate, custom popup
    var myPopup = $ionicPopup.show({
        template: '<input autofocus focus-me type="text" ng-model="data.message" placeholder="'+placeholder+'">',
        title: title,
        scope: $scope,
        buttons: [
            {text: 'Cancel'},
            {
                text: '<b>Save</b>',
                type: 'button-positive',
                onTap: function (e) {
                    if (!$scope.data.message) {
                        //don't allow the user to close unless he enters wifi password
                        e.preventDefault();
                    } else {
                        return $scope.data.message;
                    }
                }
            }
        ]
    });

    myPopup.then(func);
};

showConfirm = function($ionicPopup,message,func_yes,func_no) {
    $ionicPopup.confirm({
        title: 'Confirm',
        template: message
    }).then(function(res) {
        if(res) {
            func_yes();
        } else {
            if(func_no!=undefined)func_no();
        }
    });
};

showModal=function($ionicModal,$scope,src,func){
    $scope.imageSrc="/img/"+src;
    $ionicModal.fromTemplateUrl('/modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
    });

    $scope.closeModal=function(){
        $scope.modal.hide();
    }

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });

    $scope.$on('modal.hidden', func);
    $scope.$on('modal.removed', func);
};



function resizeBase64Img(base64, maxsize,func) {
    if(base64.length<3000000){
        func(base64);
        return;
    }

    $$("Resizing photo");
    var canvas = document.createElement("canvas");
    var img=new Image();
    img.src=base64;
    img.onload=function(){
        $$("photo loaded");
        var ratio=maxsize/Math.max(this.width,this.height);

        canvas.width =this.width*ratio;
        canvas.height =this.height*ratio;
        var context = canvas.getContext("2d");

        context.drawImage(img, 0, 0,canvas.width,canvas.height);
        $$("drawImage ended");

        var rc=canvas.toDataURL("image/jpeg", 1.0);
        $$("end conversion");

        func(rc);
    };
}


function leave(id_user,id_event,$interval,func){
    $$(user.email+" quitte l'event");
    quit(id_user, id_event, function (resp) {
        user = resp.result;
        window.localStorage.setItem("user", JSON.stringify(user));
        $$("départ enregistré");
        if(func!=undefined)func();
    });
}

toast=function($ionicLoading,msg){
    $ionicLoading.show({template:msg});
    setTimeout(function(){
        $ionicLoading.hide();
    },2000);
}

//Permet l'affichage d'un ecran de tuto dont le nom du fichier est dans img
tuto=function(user,img,$ionicModal,$scope,func){
    $$("Affichage du tuto "+img);
    if(user==undefined)return;
    if(img.indexOf(".")==-1)img+=".svg";

    if(user.history.indexOf(img)==-1){
        user.history+=";"+img;
        $$("Mise a jour du user",user);
        senduser(user,"history",function(resp){
            localStorage.setItem("user",JSON.stringify(resp));
        });
        setTimeout(function(){
            img=img.split(".")[0]+"_"+user.lang+"."+img.split(".")[1];
            showModal($ionicModal,$scope,img,func);
        },1000);
    }
}