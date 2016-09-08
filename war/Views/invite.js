/**
 * Created by u016272 on 04/08/2016.
 */

App.controller('InviteCtlr', function ($scope,clipboard,$translate){
    initGlobal($translate);

    $scope.email={};

    var url=DOMAIN+"/index.html?from="+user.id+"&event="+myevent.id;

    shorturl(url,function(url){
        var qrcodjs=new QRCode("qrcode", {
            text: url.result.id,
            width: 150,
            height: 150,
            correctLevel : QRCode.CorrectLevel.H
        });
        $scope.url=url.result.id;
        $scope.copy = function () {
            clipboard.copyText("ouvrez "+url.result.id);
        };
        $scope.$apply();
    });

    $scope.dests="";

    $scope.sendInvitations=function(){

        var inviteUrl=url;
        if($scope.email.personal)inviteUrl+="&for="+$scope.email.dests;
        shorturl(inviteUrl,function(url){
            sendinvitations(myevent.id,$scope.email.dests,user.email,url.result.id,function(resp){
                if(resp.status==200)
                    $scope.message=$scope.email.dests+" invited";
                else
                    $scope.message="probleme to invite";
            });
        });
        $scope.email.dests="";
    }


});