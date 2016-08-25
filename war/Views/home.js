
App.controller('HomeCtrl', function ($scope,$interval,$state,$translate){
    var h=null;
    initGlobal($translate);

    $scope.event=myevent;

    $scope.addsong=function(){
        $state.go("search");
    }

    $scope.onSetScore=function(step,index){
        setscore(email,myevent.id,$scope.songs[index].id,step,function(rep){
            $scope.songs[index].vote=true;
            $scope.songs[index].score=$scope.songs[index].score+step;
            $scope.$apply();
        });
    }

    function refresh_playlist(){
        if(isPresent("playlist") || isPresent("join"))
            getplaylist(myevent.id,function(resp) {
                $scope.currentsong=resp.result.items[resp.result.items.length-1];
                resp.result.items.splice(resp.result.items.length-1,1);
                $scope.songs = resp.result.items;
                for(var i=0;i<$scope.songs.length;i++){
                    if($scope.songs[i].from!=undefined){
                        $scope.songs[i].vote=($scope.songs[i].from.split(";")[0]===email);
                        $scope.songs[i].fromName=$scope.songs[i].from.split(";")[1];
                        $scope.songs[i].anonymous=$scope.songs[i].from.split(";")[2]=='true';
                    }

                    if(!$scope.songs[i].vote)
                        if($scope.songs[i].votants!=undefined){
                            $scope.songs[i].vote=($scope.songs[i].votants.indexOf(email+"+1")>-1) || ($scope.songs[i].votants.indexOf(email+"-1")>-1);
                        }
                }
                $scope.$apply();
            });
    }

    function refresh_event(func){
        getevent(myevent.id,function(resp) {
            if (resp.result.dtEnd != undefined && resp.result.dtEnd < new Date()) {
                $state.go("selEvent", {}, {reload: true});
                return;
            }

            myevent = resp.result;
            window.localStorage.setItem("event",JSON.stringify(myevent));
            if(typeof func=="function")func();
        });
    }

    $scope.$on("$ionicView.enter",function(event){
        refresh_event(refresh_playlist);
        h=$interval(refresh_playlist,3000);
        $interval(refresh_event,3000);
    });

    $scope.$on("$ionicView.leave",function(event){
       $interval.cancel(h);
    });

});