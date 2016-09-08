App.controller("selEventCtrl", function($scope,$state,Facebook,$ionicModal,$interval,$timeout,$ionicPopup,$ionicHistory,$translate,$window){

    var mapRefresh=false;
    var markers=[];
    var timer;
    var lastPos;
    var myposition=null;

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
            showPopup($scope,$ionicPopup,"This event is protected","password",function(password){
               $scope.setEvent(evt,password);
            });
        else
            $scope.setEvent(evt);
    };

    showEventsOnMap=function(){
        $$("recherche des evenements autour du centre de la carte");

        if($scope.map==undefined)return;

        var center=$scope.map.getCenter();

        $$("recherche des evenements autour de "+JSON.stringify(center));
        geteventsaround({lat:center.lat(),lng:center.lng()},function(resp){
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
                        max_size:20
                    }));

                    markers[markers.length-1].addListener("mouseover",function(){
                        $scope.preview=this.evt;
                        $scope.$apply();
                    });

                    markers[markers.length-1].addListener("dblclick",function(){
                        $scope.joinEvent(this.evt);
                    });
                });
            }
        });
    };

    $scope.setEvent=function(evt,password){
        window.localStorage.setItem("event",JSON.stringify(evt));

        join(evt.id,user.id,password,window.localStorage.getItem("from"),function(rep){
            user=rep.result;
            window.localStorage.setItem("user", JSON.stringify(user));
            if(rep.result.currentEvent!=undefined && rep.result.currentEvent.length>0) {
                window.localStorage.setItem("lastorder",0);

                markers.forEach(function(marker){marker.setMap(null);});
                markers=[];

                $ionicHistory.clearCache().then(function(){
                    if(evt.owner.id==user.id)
                        $state.go("tabs.profil",{},{reload:true});
                    else
                        $state.go("tabs.home",{},{reload:true});
                });
            }
            else
                $scope.message=$translate.instant(user.message);
        });
    }
    $scope.addEvent=function(){
        $state.go("addEvent",{},{reload:true});
    };

    $scope.centerOnLoc=function(){
        $scope.getPos(function(){
            var pos={lat:user.lat,lng:user.lng};
            $$("recentrage de la carte sur la geoloc "+JSON.stringify(pos));
            if($scope.map!=undefined)$scope.map.setCenter(pos);
        });
    };

    $scope.getPos=function(func_success,func_abort){
        $$("Déclenchement de la Localisation");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                $$("position identifiée "+JSON.stringify(position));
                var d=distance(user.lat,user.lng,position.coords.latitude,position.coords.longitude);
                if(d>50){
                    $$("mise a jour de la position");
                    user.lat=position.coords.latitude;
                    user.lng=position.coords.longitude;
                    user.dtLastPosition=position.timestamp;
                    user.precision=position.coords.accuracy;

                    if(myposition==null)
                        myposition=new google.maps.Marker({
                            position: {lat:user.lat,lng:user.lng},
                            title : user.firstname,
                            caption:user.firstname,
                            animation: google.maps.Animation.DROP,
                            zIndex: -1,
                            icon: "/img/me.png",
                            map: $scope.map
                        });
                    else
                        myposition.setPosition({lat:user.lat,lng:user.lng});

                    window.localStorage.setItem("user",JSON.stringify(user));
                    senduser(user,null,function(rep){
                        console.log(rep);
                    });
                }
                if(func_success!=undefined)func_success();

            },function(){
                $$("Localisation failed, precision à l'infinie pour le user");
                if(user.precision!=1000000){
                    user.precision=1000000;
                    window.localStorage.setItem("user",JSON.stringify(user));
                    senduser(user,null);
                }

                $scope.message=$translate.instant('SELEVENT.NOPOSITION');

                if(func_abort!=undefined)func_abort();

            },{
                enableHighAccuracy: true,
                timeout: 50000,
                maximumAge: 20000
            });
        }
    }

    $scope.$on('mapInitialized', function(event, map) {
        $$("initialisation de la carte");
        zoom = 15;

        $scope.map = map;

        $scope.map.setOptions({
            disableDefaultUI:true,
            rotateControl:false,
            mapTypeId:google.maps.MapTypeId.ROADMAP,
            clickableIcons:false
        });

        /*
        if(user.pos!=undefined){
            $scope.message=$translate.instant('SELEVENT.USELASTPOSITION');
            $scope.map.setCenter({lat:user.pos.latitude,lng:user.pos.longitude});
        }
        */

        $scope.map.addListener("center_changed",function(event){
            var pos=$scope.map.getCenter();
            if(lastPos==undefined){
                showEventsOnMap();
                lastPos=pos;
                return;
            }
            var d=distance(pos.lat(),pos.lng(),lastPos.lat(),lastPos.lng());
            if(d>1)
                showEventsOnMap();

            lastPos=pos;

        });

        $timeout(function(){
            $$("déclenchement de la loc");
            user.lat=0;
            user.lng=0;
            $scope.getPos(function(){
                $timeout(function(){
                    $scope.centerOnLoc();
                },500);
            },function(){
                $timeout(function(){
                    $window.close();
                },1000);
            });
        },1000);

    });

    $scope.events=[];
    $scope.myevents=[];
    $scope.preview={};
    $scope.user=user;
    $scope.facebook_events=[];

    JSON.parse(localStorage.getItem("facebook_events")).forEach(function(e){
        if(new Date(e.end_time).getTime()>new Date().getTime() ||
            new Date(e.start_time).getTime()>new Date().getTime())
            $scope.facebook_events.push(e);
    });

    $scope.$on("$ionicView.loaded",function(){
        window.localStorage.setItem("event",null);

        geteventsfrom(user.id, function (evts) {
            $scope.myevents=evts;
        });

        /*
        if(user.currentEvent!=null && user.currentEvent.length>0){
            $$("reconnexion avec l'evenement courant");
            getevent(user.currentEvent,null,function(resp){
                if(resp.status===200 && resp.result.dtEnd<new Date())
                    $scope.joinEvent(resp.result,false);
            });
        }
        */

        var inviteEvent=window.localStorage.getItem("inviteEvent");
        var _for=window.localStorage.getItem("for");

        if(inviteEvent!=undefined && inviteEvent.indexOf("event")==0 &&
            (_for==user.email || _for==undefined)){
            $$("transfert à l'invitation");
            getevent(inviteEvent,null,function(resp){
                $scope.joinEvent(resp.result);
                window.localStorage.setItem("inviteEvent",undefined);
            });
        }

        tuto(user,"selevent",$ionicModal,$scope,"help_selevent.svg");
    });


    initGlobal($translate);

});