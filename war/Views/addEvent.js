/**
 * Created by u016272 on 08/08/2016.
 */

var target=null;
var circle=null;

App.controller("addEventCtrl", function($scope,$ionicModal,$ionicPlatform,$state,$translate,$filter,$ionicLoading,$timeout) {
    var canvas = null;
    initGlobal($translate);

    $scope.srcList = [
        { text: "YouTube", checked: true },
        { text: "Deezer", checked: true },
        { text: "Local", checked: true }
    ];

    $scope.activities = [
        { text: $translate.instant("ADDEVENT.ACT_MUSIC"), checked: true },
        { text: $translate.instant("ADDEVENT.ACT_PHOTO"), checked: true },
        { text: $translate.instant("ADDEVENT.ACT_BETS"), checked: true },
        { text: $translate.instant("ADDEVENT.ACT_SONDAGE"), checked: true }
    ];

    reverse_geocode=function(){
        new google.maps.Geocoder().geocode({location:target.position},function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    $scope.event.address=results[0].formatted_address;
                } else {
                    $scope.event.address="";
                }
                $scope.$apply();
                $scope.onChangePicture();
            }
        });
    }

    $scope.$on('mapInitialized', function(event, map) {
        $scope.map2 = map;
        event.stopPropagation();

        $scope.map2.addListener("mousedown",function(evt){
            $scope.event.address="";
        });

        $scope.map2.addListener("mouseup",function(evt){
            reverse_geocode();
        });



        $scope.map2.addListener("center_changed",function(evt){
            if(target!=null){
                circle.setCenter(this.getCenter());
                target.setPosition(this.getCenter());
            }else{
                target = new google.maps.Marker({
                   position: {lat:user.lat,lng:user.lng},
                   name: "Soiree",
                   draggable: true,
                   map:this
                });

                reverse_geocode();

                circle=new google.maps.Circle({
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.1,
                    fillColor: '#FF0000',
                    fillOpacity: 0.1,
                    map: this,
                    center:  {lat:user.lat,lng:user.lng},
                    radius: $scope.minDistance
                });
            }
        });

        $scope.map2.setOptions({
            disableDefaultUI:true,
            rotateControl:false,
            mapTypeId:google.maps.MapTypeId.ROADMAP,
            clickableIcons:false
            });

        if($scope.event.address.length===0)
            $scope.map2.setCenter({lat:user.lat,lng:user.lng});
        else
            $scope.searchAddress();

        $scope.$apply();
    });

    $scope.searchAddress=function(){
        new google.maps.Geocoder().geocode({'address':$scope.event.address},function(infos){
            if(infos.length==1)
                $scope.map2.setCenter({
                    lat:infos[0].geometry.location.lat(),
                    lng:infos[0].geometry.location.lng()
                });
        });
    };

    $scope.sendEvent=function(){
        var evt=$scope.event;

        if(target==null){
            $scope.message=$translate.instant("ADDEVENT.NEEDLOC")
            return;
        }

        evt.dtStart=new Date(new Date($scope.event.dtStart).toDateString()+" "+evt.hour+":00").getTime();
        evt.dtEnd=new Date(evt.dtStart).getTime()+evt.duration*3600*1000;
        evt.owner=user;
        evt.lat=target.position.lat();
        evt.lng=target.position.lng();

        if(canvas!=null)
            evt.flyer=canvas.toDataURL("image/jpeg");
        else
            evt.flyer="";

        addevent(user.id,evt,parseInt($scope.nsongs),function(resp){
            user.freeEvents--;
            localStorage.setItem("user",JSON.stringify(user));

            if(resp.status==200){
                $state.go("selEvent",{message:'eventcreated'},{reload: true});
            }
            else
                $$("Add Event error"+JSON.stringify(resp));
        });
    };

    $scope.getFlyer=function (photoPromise) {
        photoPromise.then(function (theFile) {
            $scope.theFile=theFile;
            $scope.onChangePicture();
            $scope.$apply();
        });
    };

    $scope.showTutoValidate=function(){
        tuto(user,"ADDEVENT.TUTOVALIDATE",$ionicModal,$scope,$translate);
    }

    $scope.onChangePicture=function(){
        if($scope.theFile==undefined)return;

        var i=new Image();
        i.src=$scope.theFile;
        i.onload=function(){
            var ratio= i.width/ i.height;
            canvas=document.createElement("canvas");
            var ctx=canvas.getContext('2d');

            canvas.width=300;
            canvas.height=canvas.width/ratio;

            var address="";
            if($scope.event.address.length==0)
                address="#GPS:"+target.position.lat().toFixed(3)+","+target.position.lng().toFixed(3);
            else
                address=$scope.event.address;

            if(address.length>30){
                var pos=address.indexOf(",");
                if(pos>15){
                    address=address.substr(0,pos)+"<br>"+address.substr(pos+1);
                }
            }


            ctx.drawImage(i,0,0,canvas.width,canvas.height);

            var dtEnd=Date.parse($scope.event.dtStart)+$scope.event.duration*1000*3600;
            var sDate="Le "+$filter('date')($scope.event.dtStart,'dd/MM/yyyy')+
                " de "+$filter('date')($scope.event.dtStart,'h')+" a "+
                $filter('date')(dtEnd,'h')+"H";


            if($scope.event.flyer.length>0){
                var color="white";
                if($scope.event.flyer_black)color="black";

                addText(ctx,20,20,color,20,$scope.event.title,null,200);

                if($scope.event.flyer_address){
                    if(address.indexOf("<br>")>0){
                        addText(ctx,20,45,color,13,address.split("<br>")[0].trim(),null,200);
                        addText(ctx,20,60,color,13,address.split("<br>")[1].trim(),null,200);
                    }else
                        addText(ctx,20,40,color,13,address,null,200);
                }

                if($scope.event.flyer_horaire)
                    addText(ctx,canvas.width-textWidth(ctx,18,sDate)-30,canvas.height-30,color,18,sDate,null,300);

                if($scope.event.flyer_teaser && $scope.event.description!=undefined)
                    addText(ctx,canvas.width*0.2,canvas.height/2,color,14,$scope.event.description,null,canvas.width*0.8);

            }

            $scope.event.flyer=canvas.toDataURL("image/jpeg");
            $scope.$apply();
        }
    }

    $scope.event={};
    $scope.nsongs=10;
    $scope.event.flyer="";
    $scope.event.flyer_address=true;
    $scope.event.flyer_black=false;
    $scope.event.flyer_teaser=true;
    $scope.event.flyer_horaire=true;

    $scope.event.duration=8;
    $scope.event.maxonline=100;
    $scope.event.minDistance=10000;
    $scope.event.password="";

    if($state.params.facebook_event!=undefined){
        $scope.event.id="facebookevent"+$state.params.facebook_event.id;
        $scope.event.title=$state.params.facebook_event.name;
        $scope.event.dtStart=new Date($state.params.facebook_event.start_time);
        $scope.event.hour=new Date($state.params.facebook_event.start_time).getHours();
        if($state.params.facebook_event.end_time!=undefined)
            $scope.event.duration=(new Date($state.params.facebook_event.end_time)-new Date($state.params.facebook_event.start_time))/(3600*1000);
        $scope.event.description=$state.params.facebook_event.description;
        $scope.event.address=$state.params.facebook_event.place.name;
        $scope.event.facebookid=$state.params.facebook_event.id;
    }else{
        $scope.event.dtStart=new Date();
        $scope.event.title=user.firstname+"'s night";
        $scope.event.address="";
        $scope.event.hour=new Date().getHours()-1;
        if($scope.event.hour<0)$scope.event.hour=0;
    }


    $scope.$on("$ionicView.afterEnter", function(){
        tuto(user,"ADDEVENT.TUTO",$ionicModal,$scope,$translate);
    });

});

