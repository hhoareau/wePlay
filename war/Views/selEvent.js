App.controller("selEventCtrl", function($scope,$state,$interval,$ionicHistory,$translate){

    window.localStorage.setItem("event","");
    initGlobal($translate);
    var promise;



    $scope.events=[];
    $scope.myevents=[];
    $scope.preview={};
    $scope.user=user;

    var inviteEvent=window.localStorage.getItem("inviteEvent");
    if(inviteEvent!=undefined && inviteEvent.indexOf("event")==0){
        user.currentEvent=window.localStorage.getItem("inviteEvent");
        window.localStorage.setItem("inviteEvent",undefined);
    }

    showEventsOnMap=function(map){
        var center=map.getCenter();
        geteventsaround({lat:center.lat(),lng:center.lng()},function(resp){
            if(resp.hasOwnProperty("length")){
                for (var i = 0; i < resp.length; i++) {
                    var evt = resp[i];
                    if (user.currentEvent == evt.Id)
                        $scope.setEvent(evt, false);

                    if(user.pos!=null && user.pos!=undefined){
                        resp[i].distance=1000*distance(user.pos.latitude,user.pos.longitude,evt.lat,evt.lng).toFixed(1);
                    }
                }

                $scope.events=resp;

                resp.forEach(function(evt){
                    var m=new google.maps.Marker({
                        position: {lat:evt.lat,lng:evt.lng},
                        user: user,
                        title : evt.title,
                        caption:evt.title,
                        evt: evt,
                        id:evt.Id,
                        max_size:20
                    });

                    m.setMap(map);

                    m.addListener("mouseover",function(){
                        /*
                        if(this.evt.flyer!=null && this.evt.flyer.length>0){
                            var infowindow = new google.maps.InfoWindow({
                                content: "<img style=\"padding:0px;margin:0px;max-width:100px;\" src=\""+this.evt.flyer+"\">",
                                maxWidth : 200
                            });
                            infowindow.open($scope.map, this);
                        }
                        */




                        $scope.preview=this.evt;
                        $scope.$apply();
                    });

                    m.addListener("dblclick",function(){
                        $scope.setEvent(this.evt,false);
                    });

                });
            }

        });
    };

    $scope.setEvent=function(evt,bPass){
        var password="";
        window.localStorage.setItem("event", JSON.stringify(evt));

        //if(bPass)password=prompt("mot de passe");

        join(evt.id,user.email,password,window.localStorage.getItem("from"),function(rep){
            if(rep.result.currentEvent!=undefined && rep.result.currentEvent.length>0) {
                window.localStorage.setItem("user", JSON.stringify(rep.result));
                window.localStorage.setItem("lastorder",0);
                $interval.cancel(promise);
                $ionicHistory.clearCache().then(function(){
                    if(evt.owner==user.email)
                        $state.go("tabs.profil",{},{reload:true});
                    else
                        $state.go("tabs.home",{},{reload:true});
                });
            }
            else
                $scope.message=$translate.instant("SELEVENT.JOINFAILED");
        });
    }

    $scope.addEvent=function(){
        $state.go("addEvent",{},{reload:true});
    };

    $scope.$on('$destroy', function() {
        var bc=$interval.cancel(promise);
    });


    $scope.getPos=function(func_success,func_abort){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                user.pos = {latitude: position.coords.latitude, longitude: position.coords.longitude};
                user.dtLastPosition=new Date();
                window.localStorage.setItem("user",JSON.stringify(user));
                $scope.map.setCenter({lat:user.pos.latitude,lng:user.pos.longitude});
                if(func_success!=undefined)func_success();
            },function(){if(func_abort!=undefined)func_abort();});
        }
        else
            func_abort();
    }

    $scope.$on('mapInitialized', function(event, map) {
        zoom = 15;
        $scope.map = map;
        $scope.getPos(
            function(){showEventsOnMap(map);},
            function () {$scope.message=$translate.instant('SELEVENT.NOPOSITION');}
        );

        $scope.map.addListener("center_changed",function(){
            showEventsOnMap(this);
        });

        $scope.map.setOptions({
            disableDefaultUI:true,
            rotateControl:false,
            mapTypeId:google.maps.MapTypeId.ROADMAP,
            clickableIcons:false
        });

        if(user.pos!=undefined){
            $scope.message=$translate.instant('SELEVENT.USELASTPOSITION');
            $scope.map.setCenter({lat:user.pos.latitude,lng:user.pos.longitude});
        }

    });

    $scope.$on('$ionicView.beforeLeave', function() {
       $interval.cancel(promise);
    });

    geteventsfrom(email, function (evts) {
        $scope.myevents=evts;
    });

});