var markers;
var circles;
var lastPos;
var myposition;


App.controller("selEventCtrl", function($scope,$state,Facebook,$ionicModal,$interval,$timeout,$ionicPopup,$ionicHistory,$translate,$window){

    //see: https://blog.brunoscopelliti.com/facebook-authentication-in-your-angularjs-web-app/
    /*
    $scope.logout=function(){
        $rootScope.$apply(function() {
            $rootScope.user = _self.user = {};
            $state.go("login");
        });
    };
    */
    $scope.logout = function() {
        Facebook.logout(function(){
            localStorage.setItem("user",null);
            $state.go("login",{},{reload:true});
        });
    };

    $scope.createFacebookEvent=function(evt){
        $state.go("addEvent",{facebook_event:evt},{reload:true});
    };

    $scope.openfacebook=function(){
        $window.open(user.home);
    }

    $scope.joinEvent=function(evt){
        if(evt.password.length>0)
            showPopup($scope,$ionicPopup,"SELEVENT.PRIVATE","password",function(password){
               $scope.setEvent(evt,password);
            });
        else
            $scope.setEvent(evt);
    };

    $scope.buyEvent=function(){
      $$("declenchement d'un achat");
      //TODO: ici ajouter l'achat d'event
    };

    showEventsOnMap=function(){
        $$("recherche des evenements autour du centre de la carte");

        if($scope.map==undefined)return;

        var center=$scope.map.getCenter();

        clearMap();

        $$("recherche des evenements autour de "+JSON.stringify(center));

        var sq=$scope.map.getBounds();

        geteventsinsquare(sq,function(resp){
            if(resp.hasOwnProperty("length")){
                $$(resp.length+" evenements identifiés");

                for (var i = 0; i < resp.length; i++) {
                    var evt = resp[i];
                    if(user.pos!=null && user.pos!=undefined){
                        resp[i].distance=1000*distance(user.pos.latitude,user.pos.longitude,evt.lat,evt.lng).toFixed(1);
                    }
                }

                $scope.events=resp;

                resp.forEach(function(evt){
                    var icon="/img/party.png";
                    if(evt.dtStart>new Date())icon="/img/invitation.png";
                    markers.push(new google.maps.Marker({
                        position: {lat:evt.lat,lng:evt.lng},
                        user: user,
                        title : evt.title,
                        caption:evt.title,
                        evt: evt,
                        icon: icon,
                        map: $scope.map,
                        id:evt.Id,
                        max_size:new google.maps.Size(30,30)
                    }));

                    if(evt.minDistance<1000)
                        circles.push(new google.maps.Circle({
                            center: {lat:evt.lat,lng:evt.lng},
                            map: $scope.map,
                            strokeColor: '#FF0000',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: '#FF0000',
                            fillOpacity: 0.35,
                            radius: evt.minDistance
                        }));


                    markers[markers.length-1].addListener("mouseover",function(evt){
                        evt.stopPropagation();
                        $scope.preview=this.evt;
                        $scope.$apply();
                        tuto(user,"SELEVENT.TUTOJOIN",$ionicModal,$scope,$translate);
                    });

                    markers[markers.length-1].addListener("dblclick",function(evt){
                        $scope.joinEvent(this.evt);
                    });
                });
            }
        });
    };

    clearMap=function(){
        $$("Sortie de la form, raz des markers");
        myposition.setMap(null);
        if(markers.length>0){
            markers.forEach(function(marker){marker.setMap(null);});
            circles.forEach(function(circle){circle.setMap(null);});
        }

    };

    $scope.setEvent=function(evt,password){
        window.localStorage.setItem("event",JSON.stringify(evt));
        join(evt.id,user.id,password,window.localStorage.getItem("from"),function(rep){
            user=rep.result;
            window.localStorage.setItem("user", JSON.stringify(user));
            if(rep.result.currentEvent!=undefined && rep.result.currentEvent.length>0) {
                window.localStorage.setItem("lastorder",0);

                $ionicHistory.clearCache().then(function(){
                    clearMap();
                    if(evt.owner.id==user.id && user.connexions.length>1)
                        $state.go("tabs.profil",{},{reload:true});
                    else
                        $state.go("tabs.home",{},{reload:true});
                });
            }
            else $scope.message=$translate.instant(user.message);
        });
    };


    $scope.addEvent=function(){
        clearMap();
        $state.go("addEvent",{},{reload:true});
    };

    $scope.centerOnLoc=function(){
        var pos={lat:user.lat,lng:user.lng};
        $$("recentrage de la carte sur la geoloc "+JSON.stringify(pos));
        $scope.map.setCenter(pos);
        showEventsOnMap();
    };

    localize=function(func_success,func_abort){
        $$("Déclenchement de la Localisation");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                if(func_success!=undefined)func_success();
            },function(){
                if(func_abort!=undefined)func_abort();
            },{
                enableHighAccuracy: true,
            });
        }
    };

    $scope.$on('mapInitialized', function(event, map) {
        $$("initialisation de la carte");
        zoom = 15;
        event.stopPropagation();

        $scope.map = map;

        $scope.map.setOptions({
            disableDefaultUI:true,
            rotateControl:false,
            mapTypeId:google.maps.MapTypeId.ROADMAP,
            clickableIcons:false
        });


        $scope.map.addListener("mouseup",function(event){
            $$("map change");
            if(lastPos!=$scope.map.getCenter()){
                lastPos=$scope.map.getCenter();
                showEventsOnMap();
            }
        });


        myposition=new google.maps.Marker({
            position: {lat:user.lat,lng:user.lng},
            title : user.firstname,
            caption:user.firstname,
            animation: google.maps.Animation.DROP,
            zIndex: -1,
            icon: "/img/me.png",
            map: $scope.map
        });

        $scope.centerOnLoc();
    });

    $scope.deleteEvent=function(index){
        delevent($scope.myevents[index].id,user.id,function(resp){
            $scope.myevents=resp.result.items;
            $scope.$apply();
            showEventsOnMap();
        });
    };

    checkInvitation=function(){
        var inviteEvent=window.localStorage.getItem("inviteEvent");
        var _for=window.localStorage.getItem("for");
        if(inviteEvent!=undefined && inviteEvent.indexOf("event")==0 &&
            (_for==user.email || _for=="undefined")){
            $$("Réception d'une invitation");
            getevent(inviteEvent,null,function(resp){
                if(resp.status==200){
                    window.localStorage.setItem("inviteEvent",null);
                    window.localStorage.setItem("for",null);
                    $scope.joinEvent(resp.result);
                }else{
                    $scope.message="Event don't existe";
                }
            });
        }
    };

    $scope.$on("$ionicView.beforeLeave",function(event){
        clearMap();
    });


    $scope.$on("$ionicView.loaded",function(event){
        $$("ionicView.loaded.",event);
        event.stopPropagation();

        initGlobal($translate);

        markers=[];
        circles=[];

        $scope.events=[];
        $scope.preview={};
        $scope.user=user;
        $scope.facebook_events=[];

        window.localStorage.setItem("event",null);

        JSON.parse(localStorage.getItem("facebook_events")).forEach(function(e){
            if(new Date(e.end_time).getTime()>new Date().getTime() ||
                new Date(e.start_time).getTime()>new Date().getTime())
                $scope.facebook_events.push(e);
        });

        geteventsfrom(user.id, function (evts) {
            $scope.myevents=evts;
            $scope.now=new Date().getTime();
            $scope.$apply();
        });

        tuto(user,"SELEVENT.TUTO",$ionicModal,$scope,$translate);

        if(user.freeEvents<15)
            tuto(user,"SELEVENT.TUTOPAY",$ionicModal,$scope,$translate);
    });
});