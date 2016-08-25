/**
 * Created by u016272 on 10/08/2016.
 */

App.controller('chartsCtrl', function ($scope,$interval,$translate){
    initGlobal($translate);
    $scope.users=[];

    refresh_charts=function(){
        getClassement(myevent.id,function(resp){
            $scope.users=resp.result.items;
        });
    };

    refresh_charts();
    var p=$interval(refresh_charts,10000);

    $scope.$on("$ionicView.leave",function(){
       $interval.cancel(p);
    });

});
