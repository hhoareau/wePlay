
var timerEvent=null;

App.controller("tabsCtrl", function($scope,$state,$interval,$ionicHistory) {


    $scope.$on("$ionicView.loaded",function(event) {
        $interval.cancel(timerEvent);
        hEvent = $interval(function () {
            if (myevent == null)
                $interval.cancel(hEvent);
            else {
                var currentView=$ionicHistory.currentView().stateName;
                if(currentView!="tabs.charts" && timerCharts!=null){
                    $interval.cancel(timerCharts);
                    timerCharts=null;
                }
                if(currentView!="tabs.home" && timerHome!=null){
                    $interval.cancel(timerHome);
                    timerHome=null;
                }
                if(currentView!="tabs.photos" && timerPhotos!=null){
                    $interval.cancel(timerPhotos);
                    timerPhotos=null;
                 }


                refresh_event(myevent.id,function () {},
                    function () {
                        $$("RefreshEvent: l'event n'existe plus");
                        leave(user.id,myevent.id,$interval,function(){
                            $state.go("selEvent", {}, {reload: true});
                        });
                    });
            }
        },3000);
    });

});
