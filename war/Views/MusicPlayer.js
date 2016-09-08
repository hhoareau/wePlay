/**
 * Created by u016272 on 12/08/2016.
 */

const delayFadeOut=15;
const maxDuration=3600;

var players=[];
var timer = null;
var playersReady=false;
var crossfadeTimer = null;
var currentPlayer = 0;
var reader = window.jsmediatags;
var file;
var lst = [];

function setUserAgent(window, userAgent) {
    if (window.navigator.userAgent != userAgent) {
        var userAgentProp = { get: function () { return userAgent; } };
        try {
            Object.defineProperty(window.navigator, 'userAgent', userAgentProp);
        } catch (e) {
            window.navigator = Object.create(navigator, {
                userAgent: userAgentProp
            });
        }
    }
}

//var client = new WebTorrent();
function torrentload() {
    gettopsongs(idEvent, 5, function (res) {
        res.result.items.forEach(function (song) {
            if (song.text.substring(0, 4) != "event") {
                getmagnets(song.text, function (res) {
                    client.add(res.result.items[0], function (torrent) {
                        // Got torrent metadata!
                        console.log('Client is downloading:', torrent.infoHash);
                        torrent.files.forEach(function (file) {
                            // Display the file by appending it to the DOM. Supports video, audio, images, and
                            // more. Specify a container element (CSS selector or reference to DOM node).
                            file.appendTo('body');
                            console.log("Start downloading ...");
                        });
                    });
                });
            }
        });
    });
}

function getSongs(files, func) {
    var queue = [];
    var j = 0;
    var mp3 = canPlay('audio/mpeg;'), ogg = canPlay('audio/ogg; codecs="vorbis"');
    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var path = file.webkitRelativePath || file.mozFullPath || file.name;

        var size = file.size || file.fileSize || 4096;
        if (size < 4095 || (file.name.indexOf('mp3') == -1 && file.name.indexOf('ogg') == -1 && file.name.indexOf('oga') == -1)) {
            continue;
        }
        file.index = i;
        file.path = path;
        queue.push(file);
    }

    if (queue.length == 0)func(queue);
    for (var i = 0; i < queue.length; i++) {
        parseFile(queue[i], function (tags, f) {
            var t2 = guessSong(f.webkitRelativePath || f.mozFullPath || f.name);
            if ((queue[i] != undefined)) {
                queue[i].title = tags.Title || t2.Title;
                queue[i].artist = tags.Artist || t2.Artist;
                queue[i].album = tags.Album || t2.Album;
                queue[i].genre = tags.Genre || "";

                if(queue[i].title=="" && queue[i].artist==""){
                    consle.log(queue[i]);
                }
            }

            if (i == queue.length - 1)
                func(queue);
        });
    }
}
function parseFile(file, callback) {
    if (localStorage[file.name]) return callback(JSON.parse(localStorage[file.name]), file);
    ID3v2.parseFile(file, function (tags) {
        //to not overflow localstorage
        localStorage[file.name] = JSON.stringify({
            Title: tags.Title,
            Artist: tags.Artist,
            Album: tags.Album,
            Genre: tags.Genre,
            File: file.name
        });
        callback(tags, file);
    });
}
function runSearch(query) {
    var regex = new RegExp(query.trim().replace(/\s+/g, '.*'), 'ig');
    for (var i = $('songtable').getElementsByTagName('tr'), l = i.length; l--;) {
        if (regex.test(i[l].innerHTML)) {
            i[l].className = 'visible'
        } else {
            i[l].className = 'hidden';
        }
    }
}
function canPlay(type) {
    var a = document.createElement('audio');
    return !!(a.canPlayType && a.canPlayType(type).replace(/no/, ''));
}


function analyseDirectory(finder, func) {
    informe("analyse du repertoire "+finder,true);

    clearTimeout(timer);
    lst = [];

    getSongs(finder.files, function (songs) {
        for (var i = 0; i < songs.length; i++) {

            if (songs[i].title == undefined || songs[i].title == null)continue;
            if (songs[i].name == undefined || songs[i].name == null)continue;
            if (songs[i].artist == undefined || songs[i].artist == null)continue;

            if (songs[i].name.length > 0 && songs[i].title.length > 0 && songs[i].artist.length > 0)
                lst.push({
                    event: getParam()["event"],
                    text: songs[i].path,
                    artist: songs[i].artist.toLowerCase(),
                    title: songs[i].title.toLowerCase(),
                    origin: LOCAL
                });
        }
        if (lst.length > 0){
            informe("Directory uploading ...",true);
            uploadfiles({files: lst}, function () {
                informe(lst.length + " songs loaded");
            });
        }
        else
            informe("No song to load");

        playNextSong();
    });
}

window.onfocus=function(e){
    $$("event "+JSON.stringify(e));
}

window.onbeforeunload=function (event) {
    $$("unload form");
    var idEvent=getParam()["event"];

    updateevent(idEvent,"musicPlayer",null,function(){
        if(lst.length>0){
            razlocalfile(idEvent);
            $$("RAZ des fichiers locaux");
        }
    });

    players.forEach(function(player){player.Quit();});

    var rc = (lst.length>0);
    for(var i=0;i<players.length;i++)
        rc = rc || players[i].player.isPlaying();

    if (rc)
        return("You're playing music. Are you sure you want to stop ?");
};


window.onfocus=function() {
    updateevent(getParam()["event"], "hasFocus", true);
};


function allPlayersAreReady(){
    if(getParam()["offline"]=="true")return true;
    if(playersReady)return true;

    var rc=true;
    for(var i=0;i<players.length;i++)
        if(!players[i].player.isReady()){
            rc=false;
            players[i].window.style.visibility="hidden";
        }
        else
            players[i].window.style.visibility="visible";

    if(rc){
        informe("All players are ready, you can push your music !");
        var nplayer=findBestPlayer(LOCAL);
        players[nplayer].player.playFile("/img/ready.mp3");
        players[nplayer+1].player.playFile("/img/ready.mp3");

        var nplayer=findBestPlayer(YOUTUBE);
        players[nplayer].player.playFile("rwdUVjyxWrM");
        players[nplayer+1].player.playFile("rwdUVjyxWrM");
        setTimeout(function(){
            players[nplayer].player.pause();
            players[nplayer+1].player.pause();
        },2000);

        playersReady=true;
    }

    return rc;
}


//Rechercher du meilleur player suivant le type de chanson à jouer
function findBestPlayer(origin) {
    for(var i=0;i<players.length;i++)
        if(
            (players[i].origin==origin && !players[i].player.isPlaying()) ||
            (origin==DEEZER && players[i].origin==DEEZER)
        )return(i);

    $$("None player available");
    return -1;
}

function playNextSong() {
    clearTimeout(timer);
    if (allPlayersAreReady()) {
        getsongtoplay(getParam()["event"], function (rep) {
            if (rep.status == 204) {
                timer = setTimeout(playNextSong, 10000);
            } else {
                clearTimeout(timer);
                var song=rep.result;
                if(song==undefined)song=rep;

                var idSong = song.text;
                var r={
                    old:currentPlayer,
                    new:findBestPlayer(song.origin)
                };
                if(r.new==-1)return false;

                currentPlayer = r.new;
                players[r.new].buttonplay.src="/img/play.png";
                players[r.old].buttonplay.src="/img/pause.png";

                //Assure le crossfade entre les deux players s'ils sont différents
                if (r.old != r.new) {
                    players[r.old].player.fade(-10);
                    players[r.new].player.fade(+10);
                }

                var tempoDuration=10;
                //Start the song to the new player
                players[r.new].player.play(idSong, 2, function () {
                    if(song.from!=undefined){
                        $("djname").innerHTML="<span style='color: black;'>"+song.from.firstname+"</span>";
                        $("djname").left=$("djlogo").left+$("djlogo").width/2-$("djname").width/2;
                        $("djname").top=$("djlogo").top+100;
                    }

                    $$("Duree actuel du titre : "+song.duration);
                    var delayToNextSong;

                    if (song.duration > 0){
                        delayToNextSong=(song.duration - delayFadeOut);
                        timer = setTimeout(playNextSong, delayToNextSong * 1000);
                        $$("Chargement du prochain titre dans "+delayToNextSong+" sec");

                    }
                    else{
                        $$("Programme la récupération de la duree du titre pour les prochaines secondes");
                        setTimeout(function () {
                            song.duration = players[r.new].player.getDuration() - tempoDuration;

                            delayToNextSong = (Math.min(song.duration, maxDuration) - delayFadeOut);
                            $$("Récupération de la duree a posteriori : " + song.duration);

                            timer = setTimeout(playNextSong, delayToNextSong * 1000);
                            $$("Chargement du prochain titre dans "+delayToNextSong+" sec");

                        }, tempoDuration * 1000);
                    }


                }, function (err) { razlocalfile(getParam()["event"], function () {
                        informe("Local songs deleted");
                    });
                });
            }
        });
    } else {
        timer = setTimeout(playNextSong, 5000);
        informe("waiting for the players ...",true);
    }
}


function chkCompatibility() {
    if (window.createObjectURL) {
    } else if (window.createBlobURL) {
    } else if (window.URL && window.URL.createObjectURL) {
    } else if (window.webkitURL && window.webkitURL.createObjectURL) {
    } else {
        informe("$danger$Your browser probably does not support Object URLs");
    }

    var a = document.createElement('audio');
    if (!a.canPlayType) informe("$danger$Your browser does not support HTML5 Audio<br>");
    if (!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, '')))
        informe("$danger$Your browser does not support Ogg Vorbis Playback<br>");
    if (!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, '')))
        informe("$danger$Your browser does not support MP3 Playback<br>");
}


function logoutDeezer(){
    players.forEach(function(player){
       if(player.origin==DEEZER);
            player.player.Quit();
    });
}

//Permet la creation des players
//@param h hauteur du lecteur
//@param w
//@param zone
//@param pauseImave image a placer lorsque le lecteur est en pause
//@param h hauteur du lecteur
function createPlayers(zone,lst,h,w,pauseImage){
    $$("initialisation des players");
    var k=0;
    var divs=zone.getElementsByTagName("div");
    for(var i=0;i<divs.length;i++){
        var div=divs[i];
        if(div.innerHTML=="player"){
            players[k]={};
            div.innerHTML="<img style='width:30px;' id='state"+k+"' src='/img/pause.png'><br>";
            var iframe=document.createElement("iframe");
            iframe.id="player"+i;
            iframe.index=i;
            iframe.sizeplayer=h;
            iframe.addEventListener("onloadframe",function(){onLoadFrame(this);});
            iframe.src="/players/"+lst[k*2];
            iframe.style="height:"+h+"px;"+"width:"+w+"px;";
            iframe.pauseImage="/img/"+pauseImage;
            div.appendChild(iframe);
            players[k].buttonplay=document.getElementById("state"+k);
            players[k].player=iframe.contentWindow;
            players[k].typePlayer=lst[k*2].replace("Player.html","");
            players[k].origin=lst[k*2+1];
            players[k].window=iframe;
            setUserAgent(players[k].player,"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36");
            k++;
        }
    }
}

function start() {
    informe("Players loading",true);

    refresh_event(getParam()["event"],function(){
        if(myevent.musicPlayer!=null){
            informe("Only one player is authorized");
            setTimeout(function(){window.close()},2000);
            return;
        }

        myevent.musicPlayer=navigator.platform;
        sendevent(myevent);

        createPlayers(
            $("players"),
            ["deezerPlayer.html?appid="+DEEZER_KEY+"&domain="+DOMAIN,DEEZER,"filePlayer.html",LOCAL,
                "filePlayer.html",LOCAL,"youtubePlayer.html",
                YOUTUBE,"youtubePlayer.html",YOUTUBE],
            100,100);

        informe("waiting players",true);

        //chkCompatibility();
        //getInvite(getParam()["event"],150);

        //Utiliser un torrent : WebTorrent
        //var WebTorrent = require('webtorrent');
        /*

         var magnetURI = 'magnet:?xt=urn:btih:F6B163EC5643A37E4A44D38FE9B538D261D020A9&dn=single+yo+gotti+rihanna+feat+young+thug+hip+hop+rap+single+2015+itunes+plus+m4a+aac+exclusive+june+2015+uj+rip&tr=udp%3A%2F%2Ftracker.publicbt.com%2Fannounce&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce';

         */
        //document.getElementById("fileselector").value=getCookie("pathfile");
        //torrentload();

        setTimeout(playNextSong, 5000);
    },function(){
        informe("This event not exist");
        setTimeout(function(){window.close()},2000);
    });
}
