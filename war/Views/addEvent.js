/**
 * Created by u016272 on 08/08/2016.
 */

var target=null;

App.controller("addEventCtrl", function($scope,$ionicPlatform,$state,$translate,$filter) {
    var canvas = null;
    initGlobal($translate);

    $scope.$on('mapInitialized', function(event, map) {
        $scope.map = map;

        $scope.map.addListener("center_changed",function(){
           if(target!=null)
               target.setPosition(this.getCenter());
            else{
               target = new google.maps.Marker({
                   position: pos,
                   name: "Soiree",
                   draggable: true
               });
               target.setMap(this);
           }
        });

        $scope.map.setOptions({
            disableDefaultUI:true,
            rotateControl:false,
            mapTypeId:google.maps.MapTypeId.ROADMAP,
            clickableIcons:false
            });

        if(user.pos==undefined)user.pos={latitude:48,longitude:2};

        var pos={lat:user.pos.latitude,lng:user.pos.longitude};
        if(user.pos.latitude!=undefined){
            $scope.map.setCenter(pos);
            $scope.$apply();
        }
    });

    $scope.sendEvent=function(){

        var evt=$scope.event;

        if(target==null){
            $scope.message="You must set a position for the event";
            return;
        }

        evt.dtStart=Date.parse($scope.event.dtStart);
        evt.dtEnd=evt.dtStart+evt.duration*3600*1000;
        evt.owner=user.email;
        evt.lat=target.position.lat();
        evt.lng=target.position.lng();

        if(canvas!=null)
            evt.flyer=canvas.toDataURL("image/jpeg");
        else
            evt.flyer="";

        addevent(user.email,evt,parseInt($scope.nsongs),function(resp){
            if(resp.status==200){
                if(evt.dtStart<new Date())
                    window.localStorage.setItem("currentevent",resp.id);
                $state.go("selEvent",{},{reload: true});
            }
            else
                console.log("Add error");
        });
    }

    $scope.getFlyer=function (photoPromise) {
        photoPromise.then(function (theFile) {
            $scope.theFile=theFile;
            $scope.onChangePicture();
        });
    };

    $scope.onChangePicture=function(){
        var i=new Image();
        i.src=$scope.theFile;
        i.onload=function(){
            var ratio= i.width/ i.height;
            canvas=document.createElement("canvas");
            var ctx=canvas.getContext('2d');

            canvas.width=300;
            canvas.height=canvas.width/ratio;

            var gps="";
            if(target!=null)gps="#GPS:"+target.position.lat().toFixed(3)+","+target.position.lng().toFixed(3);

            ctx.drawImage(i,0,0,canvas.width,canvas.height);

            var dtEnd=Date.parse($scope.event.dtStart)+$scope.event.duration*1000*3600;
            var sDate="Le "+$filter('date')($scope.event.dtStart,'dd/MM/yyyy')+
                " de "+$filter('date')($scope.event.dtStart,'h')+" a "+
                $filter('date')(dtEnd,'h')+"H";

            if($scope.event.autoflyer){
                addText(ctx,100,canvas.height-40,"white",13,sDate,null,300);
                addText(ctx,20,20,"white",20,$scope.event.title,null,200);
                //addText(ctx,150,canvas.height-20,"white",15,gps,null,200);
            }

            $scope.event.flyer=canvas.toDataURL("image/jpeg");
            $scope.$apply();
        }
    }

    $scope.event={};
    $scope.nsongs=10;
    $scope.event.dtStart=new Date();
    $scope.event.autoflyer=false;
    $scope.event.title=user.firstname+"'s night";
    $scope.event.duration=8;
    $scope.event.maxonline=100;
    $scope.event.minDistance=1000;
});