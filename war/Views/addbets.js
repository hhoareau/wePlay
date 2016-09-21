var timerBets=null;

App.controller('addbetsCtrl', function ($scope,$interval,$translate,$window,$ionicModal,$ionicPopup,$state){
    $$("Ouverture des bets");
    initGlobal($translate);


    $scope.getDtEnt=function(){
        $scope.newbet.dtEnd=$scope.newbet.dtStart+$scope.newbet.delay*1000*60;
    }

    $scope.addbet=function(){
        $scope.options.forEach(function(s){
            var obj={};
            obj.lib=s;
            obj.total=0.0;
            obj.quot=0.0;
           $scope.newbet.options.push(obj);
        });

        sendbet(myevent.id,$scope.newbet,function(){
            $scope.newbet={};
            $state.go("tabs.bets",{},{reload:true});
        });
    }

    $scope.addOption=function(){
        $scope.options.push($scope.newbet.text_option);
        $scope.newbet.text_option="";
    }

    $scope.$on("$ionicView.afterEnter", function(event){
        event.stopPropagation();

        $scope.bets=[];
        $scope.newbet={};
        $scope.newbet.title="";
        $scope.newbet.text_option="";
        $scope.options=[];
        $scope.newbet.options=[];
        $scope.newbet.delay=30;
        $scope.newbet.from=user;
        $scope.user=user;
        $scope.newbet.dtStart=new Date().getTime();
        $scope.newbet.dtEnd=new Date().getTime()+$scope.newbet.delay*1000*60;

        tuto(user,"ADDBETS.TUTO",$ionicModal,$scope,$translate);
    });
});
