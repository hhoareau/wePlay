/**
 * Created by u016272 on 04/08/2016.
 */

App.controller('InviteCtlr', function ($scope,clipboard,$translate){
    initGlobal($translate);

    $scope.email={dest:"",personal:true,from:user.email};

    var url=DOMAIN+"/index.html?from="+user.id+"&event="+myevent.id;

    $scope.copy = function (withText) {
        if(withText)
            clipboard.copyText("ouvrez "+$scope.url);
        else
            clipboard.copyText($scope.url);
    };

    shorturl(url,function(url){
        var qrcodjs=new QRCode("qrcode", {
            text: url.result.id,
            width: 150,
            height: 150,
            correctLevel : QRCode.CorrectLevel.H
        });
        $scope.url=url.result.id;
        //$scope.$apply();
    });

    $scope.sendInvitations=function(){
        var inviteUrl=url;
        if($scope.email.personal)inviteUrl+="&for="+$scope.dest;
        if($scope.email.dest==$scope.email.from){
            $scope.message="you can't invite yourself";
            return;
        }

        shorturl(inviteUrl,function(url){
            sendinvitations(myevent.id,$scope.email.dest,$scope.email.from,url.result.id,function(resp) {
                if (resp.status == 200) {
                    $scope.message = $scope.email.dest + " invited";
                    $scope.email.dest = "";
                }else
                    $scope.message="probleme to invite";
            });
        });

    };
});