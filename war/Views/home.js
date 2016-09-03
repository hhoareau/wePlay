
App.controller('HomeCtrl', function ($scope,$interval,$state,$translate){
    var h=null;
    initGlobal($translate);

    $scope.event=myevent;

    $scope.addsong=function(){
        $state.go("search");
    }

    $scope.onSetScore=function(step,index){
        setscore(user.id,myevent.id,$scope.songs[index].id,step,function(rep){
            $scope.songs[index].vote=true;
            $scope.songs[index].score=$scope.songs[index].score+step;
            $scope.$apply();
        });
    }

    function refresh_playlist(force){
        if(isPresent("playlist") || isPresent("join") || force==true)
            getplaylist(myevent.id,function(resp) {
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
                $scope.$apply();
            });
    }

    $scope.$on("$ionicView.afterEnter",function() {
        refresh_playlist(true);
        h=$interval(refresh_playlist,5000);
    });

    $scope.$on("$ionicView.beforeLeave",function(){
        $interval.cancel(h);
    });

});