var timerCharts=null;

App.controller('chartsCtrl', function ($scope,$interval,$translate,$window,$ionicModal){
    initGlobal($translate);
    $scope.users=[];

    refresh_charts=function(force){
        if(isPresent("users") || force==true)
            getClassement(myevent.id,function(resp){
                $scope.users=resp.result.items;
            });
    };

    $scope.showUser=function(u){
        $window.open(u.home);
    }

    $scope.$on("$ionicView.afterEnter", function(){
        refresh_charts(true);
        if(timerCharts==null)timerCharts=$interval(refresh_charts,5000);
        tuto(user,"CHARTS.TUTO",$ionicModal,$scope,$translate);
    });
});
