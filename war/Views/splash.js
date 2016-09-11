/**
 * Created by u016272 on 08/08/2016.
 * see: http://anandsekar.github.io/initialize-google-appengine-and-angularjs/
 */

'use strict';
function init() {
    setTimeout(function(){
        window.init();
    },500);
}

App.factory("cloudendpoint", function ($q) {
    return {
        init:function() {
            var hwdefer=$q.defer();
            var oauthloaddefer=$q.defer();
            var oauthdefer=$q.defer();
            gapi.client.load('ficarbar', 'v1', function() {hwdefer.resolve(gapi);}, ROOT_API);
            gapi.client.load('urlshortener', 'v1', function() {hwdefer.resolve(gapi);});
            gapi.client.load('geocoding', 'v1', function() {hwdefer.resolve(gapi);});
            gapi.client.load('youtube', 'v3', function() {hwdefer.resolve(gapi);});
            gapi.client.load('oauth2', 'v2', function(){oauthloaddefer.resolve(gapi);});
            var chain=$q.all([hwdefer.promise,oauthloaddefer.promise]);

            return chain;
        },

        doCall: function(callback) {
            var p=$q.defer();
            gapi.auth.authorize({client_id: 'clientid', scope: 'https://www.googleapis.com/auth/userinfo.email',
                immediate: true}, function(){
                var request = gapi.client.oauth2.userinfo.get().execute(function(resp) {
                    if (!resp.code) {
                        p.resolve(gapi);
                    } else {
                        p.reject(gapi);
                    }
                });
            });
            return p.promise;
        },
        sigin:function(callback) {
            gapi.auth.authorize({client_id: 'clientid', scope: 'https://www.googleapis.com/auth/userinfo.email',immediate: false}, callback);
        }
    }
});


App.controller("startCtrl", function($scope,$window,cloudendpoint,$state) {
    $scope.message="Loading ...";

    $window.init = function () {
        $scope.$apply($scope.initgapi);
    };

    $scope.initgapi = function () {
        cloudendpoint.init().then(function () {
            if(gapi==undefined || gapi.client==undefined || gapi.client.ficarbar==undefined)
                setTimeout($scope.initgapi,2000);
            else
                $state.go("login",{},{reload:true});
        }, function () {
            alert('notinited')
        });
    }

    function noConnexion(){
        $scope.message="Internet connexion failed. Retry in 10 seconds ...";
        setTimeout(function(){
            location.href=DOMAIN;
        },10000);
    }

    loadScript("js/Tools.js",function(){
        loadScript("https://apis.google.com/js/client.js?onload=init",function(){
            loadScript("https://e-cdns-files.dzcdn.net/js/min/dz.js",function(){
                loadScript("https://maps.googleapis.com/maps/api/js?key="+GOOGLE_API_KEY,function() {

                    (function(d, s, id){
                        var js, fjs = d.getElementsByTagName(s)[0];
                        if (d.getElementById(id)) {return;}
                        js = d.createElement(s); js.id = id;
                        js.src = "//connect.facebook.net/en_US/sdk.js";
                        fjs.parentNode.insertBefore(js, fjs);
                    }(document, 'script', 'facebook-jssdk'));

                    console.log("Scripts distants chargés");
                },noConnexion);
            },noConnexion);
        },noConnexion);
    });
});



