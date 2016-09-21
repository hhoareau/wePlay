var timerBets=null;

App.controller('betsCtrl', function ($scope,$interval,$translate,$window,$ionicModal,$ionicPopup,$state){
    $$("Ouverture des bets");
    initGlobal($translate);
    $scope.bets=[];
    $scope.user=user;

   $scope.newbet=function(){
       $state.go("addbets",{},{reload:true});
   }

    $scope.remove=function(bet){
        validebet(myevent.id,bet.id,-1,function(resp){
            user=resp.result;
            $scope.user=user;
            $scope.message=$translate.instant("BETS.DELETE");
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
            if(v.value<$scope.user.credits){
                sendvote(b.id,v);
                $scope.user.credits -= v.value;
                refresh_bets(true);
            }else
                $scope.message=$translate.instant('BETS.NOT_ENOUGH_MONEY');
        });
    };

    $scope.validate=function(b){
        var i=0;
        //for(i=0;i< b.options.length;i++)if(b.options[i].checked)break;
        validebet(myevent.id, b.id, b.result,function(){
            refresh_bets(true);
        });
    };

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
                    }else{
                        b.result=-1;
                        $scope.bets_tovalidate.push(b);
                    }
                }
                $scope.$apply();
            });
    };

    $scope.$on("$ionicView.afterEnter", function(event){
        event.stopPropagation();
        refresh_bets(true);
        if(timerBets==null)timerBets=$interval(refresh_bets,5000);
        tuto(user,"BETS.TUTO",$ionicModal,$scope,$translate);
    });
});
