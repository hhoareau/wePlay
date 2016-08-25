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
    });

    $scope.login = function() {
        // From now on you can use the Facebook service just as Facebook api says
        Facebook.login(function(response) {
            $scope.me();
        });
    };

    $scope.IntentLogin = function() {
        if(!userIsConnected) {
            $scope.login();
        } else
            $scope.me();
    };


    $scope.me = function() {
        Facebook.api('/me',{fields:"locale,first_name,last_name,email,picture"}, function(response) {
            response.picture=response.picture.data.url;
            adduser(response,function(user){
                window.localStorage.setItem("user",JSON.stringify(user.result));
                window.localStorage.setItem("email",user.result.email);
                $state.go("selEvent",{},{reload:true});
            });
        });
    };


    $scope.logout = function() {
        Facebook.logout(function() {
            $scope.$apply(function() {
                $scope.user   = {};
                $scope.logged = false;
            });
        });
    }

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

});

