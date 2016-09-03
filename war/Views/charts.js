/**
 * Created by u016272 on 10/08/2016.
 */

App.controller('chartsCtrl', function ($scope,$interval,$translate){
    initGlobal($translate);
    $scope.users=[];
    var h=null;

    refresh_charts=function(force){
        if(isPresent("users") || force==true)
            getClassement(myevent.id,function(resp){
                $scope.users=resp.result.items;
                $scope.$apply();
            });
    };

    $scope.$on("$ionicView.beforeLeave", function () {
        $interval.cancel(h);
    });

    $scope.$on("$ionicView.afterEnter", function(){
        refresh_charts(true);
        h=$interval(refresh_charts,5000);
    });



});
