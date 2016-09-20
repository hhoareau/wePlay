
var timerHome=null;

App.controller('HomeCtrl', function ($scope,$interval,$state,$translate,$window,$ionicModal){

    $scope.addsong=function(){
        $state.go("search");
    }

    $scope.onSetScore=function(step,index){
        var vote={event:myevent.id,from:user,value:step,description:""};
        sendvote($scope.songs[index].id,vote,function(rep){
            $scope.songs[index].vote=true;
            $scope.songs[index].score=$scope.songs[index].score+step;
            $scope.$apply();
        });
    }

    function refresh_playlist(force,func){
        if(isPresent("playlist") || isPresent("join") || force==true)
            getplaylist(myevent.id,function(resp) {
                $scope.songs=[];
                $scope.currentsong=resp.result.items[resp.result.items.length-1];
                resp.result.items.splice(resp.result.items.length-1,1);
                $scope.songs = resp.result.items;
                for(var i=0;i<$scope.songs.length;i++){
                    if($scope.songs[i].from!=undefined){
                        $scope.songs[i].vote=($scope.songs[i].from.id===user.id);
                        $scope.songs[i].fromName=$scope.songs[i].from.firstname;
                        $scope.songs[i].anonymous=$scope.songs[i].from.anonymous;
                    }

                    if(!$scope.songs[i].vote)
                        if($scope.songs[i].votants!=undefined){
                            $scope.songs[i].vote=($scope.songs[i].votants.indexOf(user.id+"+1")>-1) ||
                            ($scope.songs[i].votants.indexOf(user.id+"-1")>-1);
                        }
                }

                func();
            });
    }

    $scope.$on("$ionicView.afterEnter",function() {
        refresh_playlist(true,function(){
            if(timerHome==null)timerHome=$interval(refresh_playlist,5000);
            if(user.connexions.length<2 && $scope.songs.length>0 &&
                user.id==myevent.owner.id && myevent.musicPlayer==null) {
                    tuto(user,"help_player",$ionicModal,$scope,function(){
                        $window.open("/Views/musicPlayer.html?event="+myevent.id+"&showTuto=true");
                    });
            }
        });
    });

    $scope.$on("$ionicView.beforeLeave",function(){
        $interval.cancel(timerHome);
    });

    $scope.$on("$ionicView.unload",function(event,data){
        initGlobal();
        leave(user.id,myevent.id);
    });

    $scope.$on("$ionicView.loaded",function(event,data){
        initGlobal($translate);
        $scope.event=myevent;

        if($scope.songs==undefined || $scope.songs.length==0)
            tuto(user,"HOME.TUTO",$ionicModal,$scope,$translate);
        else
            if($scope.songs.length>1)
                tuto(user,"HOME.TUTOWITHMUSIC",$ionicModal,$scope,$translate);
    });

});