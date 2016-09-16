/**
 * Created by u016272 on 08/08/2016.
 */

App.controller("loginCtrl", function($scope,Facebook,$state,$window){

    var userIsConnected = false;
    $scope.user = {};

    // Defining user logged status
    $scope.logged = false;

    // And some fancy flags to display messages upon user status change
    $scope.byebye = false;
    $scope.salutation = false;

    $scope.$watch(
        function() {
            return Facebook.isReady();
        },
        function(newVal) {
            if (newVal)
                $scope.facebookReady = true;
        }
    );

    Facebook.getLoginStatus(function(response) {
        if (response.status == 'connected') {
            userIsConnected = true;
            $scope.me();
        }
        if (response.status == 'not_authorized') {
            userIsConnected = false;
            $scope.message="Shifumix need your email to recognize you";
        }
    });

    $scope.login = function() {
        // From now on you can use the Facebook service just as Facebook api says
        $scope.message="Connexion ...";
        Facebook.login(function(response) {
            $scope.me();
        },{scope:"public_profile,user_friends,email,user_events",return_scopes: true,enable_profile_selector:true});
    };


    $scope.IntentLogin = function() {
        if(!userIsConnected) {
            $scope.login();
        } else
            $scope.me();
    };


    $scope.me = function() {
        $scope.message="Connexion ...";
        var s=window.localStorage.getItem("user");
        if(s=="null"){
            window.localStorage.setItem("user","encours");
            Facebook.api('/me',{fields:"locale,first_name,last_name,email,picture"}, function(response) {
                response.picture=response.picture.data.url;
                adduser(response,function(user){
                    window.localStorage.setItem("user",JSON.stringify(user.result));
                    $state.go("selEvent",{},{reload:true});
                });
            });
            Facebook.api("/me/events", function (resp) {
                rc=[];
                resp.data.forEach(function(evt){
                    Facebook.api("/"+evt.id,function(resp_evt){
                       rc.push(resp_evt);
                    });
                })
                localStorage.setItem("facebook_events",JSON.stringify(rc));
            });
        }
    };

    /**
     * Taking approach of Events :D
     */
    $scope.$on('Facebook:statusChange', function(ev, data) {
        console.log('Status: ', data);
        if (data.status == 'connected') {
            $scope.me();
        } else {
            $scope.$apply(function() {
                $scope.salutation = false;
                $scope.byebye     = true;

                // Dismiss byebye message after two seconds
                $timeout(function() {
                    $scope.byebye = false;
                }, 2000)
            });
        }
    });

    $scope.$on("$ionicView.loaded",function(){
        window.localStorage.setItem("user",null);
    });
});