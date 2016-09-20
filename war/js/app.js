/**
 * Created by u016272 on 29/07/2016.
 */
var App = angular.module('App', ['ionic','pascalprecht.translate','ngCordova','angular-clipboard','facebook','ngStorage','ngMap']);

App.config(function($stateProvider,$ionicConfigProvider,$urlRouterProvider,FacebookProvider,$translateProvider) {

    FacebookProvider.init({
        appId:FACEBOOK_ID,
        version    : 'v2.7'
    });

    libs.forEach(function(lib){
        $translateProvider.translations(lib.lang,lib.labels);
    });

    $translateProvider.preferredLanguage('en');

    $stateProvider
        .state('tabs', {
            url: '/tabs',
            templateUrl: 'Views/tabs.html',
            abstract: true,
            controller: 'tabsCtrl'
        })

        .state('selEvent', {
            url: '/selEvent',
            cache: false,
            templateUrl: 'Views/selEvent.html',
            controller: 'selEventCtrl'
        })

        .state('login', {
            url: '/login',
            templateUrl: 'Views/login.html',
            cache: false,
            controller: 'loginCtrl'
        })

        .state('start', {
            url: '/start',
            templateUrl: 'Views/splash.html',
            controller: 'startCtrl',
            cache:false
        })

        .state('tabs.home', {
            url: '/home',
            parent: 'tabs',
            views: {
                'home-tab': {
                    templateUrl: 'Views/home.html',
                    controller: 'HomeCtrl'
                }
            }
        })

        .state('tabs.profil', {
            url: '/profil',
            parent: 'tabs',
            views: {
                'profil-tab': {
                    templateUrl: 'Views/profil.html',
                    controller: 'ProfilCtrl'
                }
            }
        })

        .state('tabs.photos', {
            url: '/photos',
            parent: 'tabs',
            views: {
                'photos-tab': {
                    templateUrl: 'Views/photos.html',
                    controller: 'PhotosCtrl'
                }
            }
        })

        .state('search', {
            url: '/search',
            templateUrl: 'Views/search.html',
            controller: 'SearchCtrl'
        })

        .state('addEvent', {
            url: '/addevent',
            params: {facebook_event:null},
            cache: false,
            templateUrl: 'Views/addEvent.html',
            controller: 'addEventCtrl'
        })

        .state('tabs.invite', {
            url: '/invite?event&email',
            parent: 'tabs',
            views: {
                'invite-tab':{
                    templateUrl: 'Views/invite.html',
                    controller: 'InviteCtlr'
                }
            }
        })

        .state('tabs.bets', {
            url: '/bets',
            views: {
                'bets-tab':{
                    templateUrl: 'Views/bets.html',
                    controller: 'betsCtrl'
                }
            }
        })

        .state('tabs.charts', {
            url: '/charts',
            views: {
                'charts-tab':{
                    templateUrl: 'Views/charts.html',
                    controller: 'chartsCtrl'
                }
            }
        });

    //$ionicConfigProvider.views.maxCache(0);

    $urlRouterProvider.otherwise('/start');
    });


App.run(function($ionicPlatform,$window){
    $ionicPlatform.ready(function() {
        //Chargement de google meta tag
        (function (w, d, s, l, i) {
            w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src = '//www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })($window, document, 'script', 'tm', 'GTM-MJBVLV');
        //note: I've changed original code to use $window instead of window
    });
});

