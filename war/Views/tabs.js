

App.controller("tabsCtrl", function($scope,$state,$interval) {
    var hEvent =null;

    $scope.$on("$ionicView.loaded",function(event) {
        $interval.cancel(hEvent);
        hEvent = $interval(function () {
            if (myevent == null)
                $interval.cancel(hEvent);
            else {
                refresh_event(myevent.id,function () {},
                    function () {
                        //quit(user.id,myevent.id,function(resp){
                        //    if(resp.hasOwnProperty("result"))user=resp.result;
                        //    localStorage.setItem("user",JSON.stringify("user"));

                        $state.go("selEvent", {}, {reload: true});
                        $interval.cancel(hEvent);
                    });
            }
        },3000);
    });
});



