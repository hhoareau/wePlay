
var timerEvent=null;

App.controller("tabsCtrl", function($scope,$state,$interval,$ionicHistory) {

    function quitEvent(){
        $$("RAZ des timers")
        if($interval==null){
            clearInterval(timerCharts);
            clearInterval(timerHome);
            clearInterval(timerPhotos);
            clearInterval(timerEvent);
            clearInterval(timerBets);
        }else{
            $interval.cancel(timerCharts);
            $interval.cancel(timerHome);
            $interval.cancel(timerPhotos);
            $interval.cancel(timerEvent);
            $interval.cancel(timerBets);
        }
        $state.go("selEvent", {}, {reload: true})
    }


    $scope.$on("$ionicView.loaded", function (event) {
        $$("tabsCtrl loaded");
        event.stopPropagation()
        $interval.cancel(timerEvent);
        timerEvent = $interval(function () {

            $$("Analyse de l'event");

            if (myevent == null)
                $interval.cancel(timerEvent);
            else {
                var currentView = $ionicHistory.currentView().stateName;

                if (currentView != "tabs.charts" && timerCharts != null) {
                    $interval.cancel(timerCharts);
                    timerCharts = null;
                }
                if (currentView != "tabs.home" && timerHome != null) {
                    $interval.cancel(timerHome);
                    timerHome = null;
                }
                if (currentView != "tabs.photos" && timerPhotos != null) {
                    $interval.cancel(timerPhotos);
                    timerPhotos = null;
                }

                if (currentView != "tabs.bets" && timerBets != null) {
                    $interval.cancel(timerBets);
                    timerBets = null;
                }

                refresh_event(myevent.id,
                    function () {
                        if (
                            myevent.Presents == undefined ||
                            !contain(user, myevent.Presents) ||
                            myevent.dtEnd<new Date()
                        ) quitEvent();
                    },

                    function () {
                        $$("RefreshEvent: l'event n'existe plus");
                        leave(user.id, myevent.id, $interval, quitEvent);
                    });
            }
        }, 3000);
    });

    $scope.$on("$ionicView.beforeUnload", function (event) {
        $interval.cancel(timerEvent);
    });

});