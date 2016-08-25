/**
 * Created by u016272 on 04/08/2016.
 */

App.controller('InviteCtlr', function ($scope,clipboard){
    initGlobal();

    $scope.email={};

    inviteUrl=DOMAIN+"/index.html?from="+email+"&event="+event;
    shorturl(inviteUrl,function(url){
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
        sendinvitations(myevent.id,$scope.email.dests,user.email);
        $scope.email.dests="";
    }


});