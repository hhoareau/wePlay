/**
 * Created by u016272 on 29/07/2016.
 */
var App = angular.module('App', ['ionic','pascalprecht.translate','ngCordova','angular-clipboard','facebook','ngStorage','ngMap']);

App.config(function($stateProvider,$urlRouterProvider,FacebookProvider,$translateProvider) {
    FacebookProvider.init(FACEBOOK_ID);

    $translateProvider.translations('en',{
       'ADDEVENT.TITLE':'Title',
        'ADDEVENT.START':'Start',
        'ADDEVENT.DURATION':'Duration',
        'ADDEVENT.SAVE':'Save my Event',
        'SELEVENT.CREATE':'Create your Event',
        'SELEVENT.WELCOME':'Hello, Find an event !',
        'ADDEVENT.PASSWORD': "Password to enter (optional)",
        'SELEVENT.NOPOSITION': "Geolocalisation required to find an event",
        'SELEVENT.USELASTPOSITION': "No geolocalisation, Last position used",
        'ADDEVENT.LABELSONG': "songs",
        'HOME.ADDSONG':'Push your music !',
        'ADDEVENT.VISIBLE': "Event visible at",
        'ADDEVENT.SONGSBYDEFAULT': "Start playlist with ",
        'SELEVENT.MYEVENTS': "My old and futur events",
        'PROFIL.CLOSE_EVENT': "Close This Event",
        'PROFIL.ANONYMOUS': "Anonymous",
        "PHOTO.TAKEPICTURE": "Take a picture",
        'ADDEVENT.MAXGUEST': "Max guest",
        'ADDEVENT.DESCRIPTION': "Teaser of your event",
        'ADDEVENT.WEBSITE':"Web site of your event"
    });

    $translateProvider.translations('fr',{
        'ADDEVENT.TITLE':'Titre',
        'ADDEVENT.START':'Début',
        'ADDEVENT.DURATION':'Durée',
        'ADDEVENT.SAVE':'Enregistrer',
        'SELEVENT.CREATE':'Créer un évenement',
        'SELEVENT.WELCOME':'Bonjour, Trouver un événement !',
        'ADDEVENT.PASSWORD': "Mot de passe",
        'ADDEVENT.LABELSONG': "titres",
        "SELEVENT.NOPOSITION": "Géolocatlisation nécessaire pour trouver un évenement",
        'ADDEVENT.SONGSBYDEFAULT': "Playlist de départ",
        'ADDEVENT.VISIBLE': "Evénement visible a",
        'HOME.ADDSONG':'Ajouter votre musique !',
        'SELEVENT.USELASTPOSITION': "Localisation impossible, utilisation de la dernière position",
        'SELEVENT.JOINFAILED': "impossible de ce joindre à cet évenement",
        'SELEVENT.MYEVENTS': "Mes événements passés ou futurs",
        'PROFIL.CLOSE_EVENT': "Clore l'événement",
        'PROFIL.ANONYMOUS': "Anonyme",
        "PHOTO.TAKEPICTURE": "Partager une photo",
        'ADDEVENT.MAXGUEST': "Participants max",
        'ADDEVENT.DESCRIPTION':"Teaser de l'événement",
        'ADDEVENT.WEBSITE':"Site web de l'événement"
    });

    $translateProvider.preferredLanguage('en');

    $stateProvider
        .state('tabs', {
            url: '/tabs',
            templateUrl: 'Views/tabs.html',
            abstract: true
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

        .state('tabs.charts', {
            url: '/charts',
            views: {
                'charts-tab':{
                    templateUrl: 'Views/charts.html'
                }
            }
        });

    $urlRouterProvider
        .otherwise('/start');
    });



App.run(function($ionicPlatform,$state){
    $ionicPlatform.ready(function() {

    });
});

