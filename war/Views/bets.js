var timerBets=null;

App.controller('betsCtrl', function ($scope,$interval,$translate,$window,$ionicModal,$ionicPopup){
    $$("Ouverture des bets");
    initGlobal($translate);
    $scope.bets=[];
    $scope.newbet={};
    $scope.newbet.title="";
    $scope.newbet.options=[];
    $scope.newbet.delay=30;
    $scope.user=user;
    $scope.newbet.dtStart=new Date().getTime();

    $scope.getDtEnt=function(){
        $scope.newbet.dtEnd=$scope.newbet.dtStart+$scope.newbet.delay*1000*60;
    }

    $scope.addbet=function(){
        $scope.newbet.from=user;

        $scope.newbet.options=[];
        $scope.newbet.text_options.split(",").forEach(function(s){
            var obj={};
            obj.lib=s;
            obj.total=0.0;
            obj.quot=0.0;
           $scope.newbet.options.push(obj);
        });

        sendbet(myevent.id,$scope.newbet,function(){
            $scope.newbet.title="";
            $scope.newbet.options="";
            refresh_bets(true);
        });
    }

    function getTotals(bet){
        var tot=[0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        if(bet.hasOwnProperty("votes"))
            bet.votes.forEach(function(v){
                if(v.from.id===user.id){
                    var index=Number(v.description);
                    if(tot[index]==undefined)tot[index]=0;
                    tot[index]+= v.value*bet.options[index].quot;
                }

            });
        return tot.splice(0,bet.options.length);
    }


    $scope.mise=function(b,index){
        var v={from:user,value:0,description:index};
        showPopup($scope,$ionicPopup,$translate.instant("BETS.MESSAGEMISE"),"value",function (res) {
            if (res != undefined)v.value= res;
            if(v.value<$scope.user.score){
                sendvote(b.id,v);
                $scope.user.score -= v.value;
                refresh_bets(true);
            } else
                $scope.message=$translate.instant('BETS.NOT_ENOUGH_MONEY');
        });
    };

    $scope.validate=function(b){
        var i=0;
        //for(i=0;i< b.options.length;i++)if(b.options[i].checked)break;
        validebet(myevent.id, b.id, b.result,function(){
            refresh_bets(true);
        });
    }

    refresh_bets=function(force){
        if(isPresent("bets") || force===true)
            getBets(myevent.id,function(resp){
                $scope.bets=[];
                $scope.bets_tovalidate=[];
                for(var i=0;i<resp.result.items.length;i++){
                    var b=resp.result.items[i];
                    if(b.dtEnd>new Date().getTime()){
                        var tot=getTotals(b);
                        b.gainMax=Math.max.apply(null,tot);
                        b.gainMin=Math.min.apply(null,tot);
                        $scope.bets.push(b);
                    } else{
                        b.result=-1;
                        //b.options.forEach(function(o){o.checked=false;});
                        $scope.bets_tovalidate.push(b);
                    }


                }
                $scope.$apply();
            });
    }

    $scope.$on("$ionicView.afterEnter", function(event){
        event.stopPropagation();
        refresh_bets(true);
        if(timerBets==null)timerBets=$interval(refresh_bets,5000);
        tuto(user,"BETS.TUTO",$ionicModal,$scope,$translate);
    });
});
