/**
 * Created by u016272 on 29/07/2016.
 */
var App = angular.module('App', ['ionic','pascalprecht.translate','ngCordova','angular-clipboard','facebook','ngStorage','ngMap']);

App.config(function($stateProvider,$ionicConfigProvider,$urlRouterProvider,FacebookProvider,$translateProvider) {

    FacebookProvider.init({
        appId:FACEBOOK_ID,
        version    : 'v2.7'
    });

    $translateProvider.translations('en',{
       'ADDEVENT.TITLE':'Title',
        'ADDEVENT.ADDRESS':'Address of the event',
        'ADDEVENT.DURATION':'Duration',
        'ADDEVENT.SAVE':'Save',
        'SELEVENT.CREATE':'Make Your Event',
        'SELEVENT.WELCOME':'Hello, Find an event !',
        'ADDEVENT.PASSWORD': "Password to enter (optional)",
        'ADDEVENT.START': "Start",
        'SELEVENT.NOPOSITION': "You must authorize geolocalisation to select an event",
        'SELEVENT.USELASTPOSITION': "No geolocalisation, Last position used",
        'PROFIL.PLAYER':"To play the playlist on your audio system",
        'PROFIL.GALLERY':"Connect this computer to a public display",
        'PROFIL.SLIDESHOW':"Connect this computer to a public display",
        'PROFIL.CHARTS':"Connect this computer to a public display",
        'ADDEVENT.LABELSONG': "songs",
        'HOME.ADDSONG':'Push your music !',
        'ADDEVENT.VISIBLE': "Event visible at",
        'ADDEVENT.SONGSBYDEFAULT': "Start playlist with ",
        'SELEVENT.MYEVENTS': "My events",
        'PROFIL.CLOSE_EVENT': "Close This Event",
        'PROFIL.ANONYMOUS': "Anonymous",
        "PHOTO.TAKEPICTURE": "Take a picture",
        'ADDEVENT.MAXGUEST': "Max guest",
        'ADDEVENT.DESCRIPTION': "Teaser of your event",
        'ADDEVENT.WEBSITE':"Web site of your event",
        'SELEVENT.LOGOUT':"Change profil",
        'SELEVENT.TITREPROFIL':"Your profil",
        'INVITE.COPY':"Copy the link",
        'INVITE.PERSONAL':"Personal",
        'INVITE.DEST':"Email to invited",
        'SELEVENT.LOCALISE': "Find me",
        'INVITE.SEND':"Send",
        'PHOTO.DOWNLOAD':"Photos download",
        'ADDEVENT.APARTIRDE':"Start time",
        'INVITE.CANCEL':"probleme to invite",
        'INVITE.YOURSELF':"you can't invite yourself",
        'INVITE.CONFIRM':" receive invite in 2 minutes",
        'SEARCH.WAITING':"Searching",
        'PROFIL.DELPHOTO':"Block",
        'PROFIL.VALIDATE':"Allow",
        'PROFIL.BLACKLIST':"Blacklist",
        'PHOTO.ENTERMESSAGE':"Enter the message",
        'PHOTO.SENDED':"Photo sended",
        'PHOTO.NOTSENDED':"Photo not sended",
        'ADDEVENT.NEEDLOC':"You must set a position for the event",
        'ADDEVENT.NEEDVALIDATE':"Moderation needed to publish",
        'SELEVENT.JOIN':"Join the event",

        //Les tutos
        'SELEVENT.TUTO':"Sélectionner un événement sur la carte ou fabriquez en un",
        'ADDEVENT.TUTO':"Pour créer votre événement, donner au moins un titre et une date de début",
        'ADDEVENT.TUTO_VALIDATE':"Toutes les photos devront être validé par vous avant d'être diffusées",
        'HOME.TUTO':"Ajouter votre propre musique dans la playlist de l'événement",
        'HOME.TUTOWITHMUSIC':"Voter pour ou contre les titres de la playlist pour changer l'ordre de passage",
        'PHOTO.TUTO':"Prenez une photo depuis votre téléphone, ajoutez un commentaire et partagez la avec tous les parcipants",
        'PHOTO.TUTOADMIN':"Partager vos photos mais surtout validez les photos des participants avant leur diffusion",
        'INVITE.TUTO':"Vous amis peuvent flasher le code pour rentrer directement dans la soirée. Vous pouvez également envoyer des invitations par directement par mail",
        'PROFIL.TUTOADMIN':"Contrôler la soirée et lancer les écrans de partage de photo ou le DJ automatique",
        'PROFIL.TUTO':"Passez en anonyme ne pas divulguer votre identité dans les photos et musique proposée",
        'SELEVENT.TUTOJOIN':"Un événement est sélectionné, vous pouvez en faire partie un cliquant sur 'rejoindre'",
        'SEARCH.TUTO':"Rechercher un artist ou un titre parmis le catalogue de Deezer, YouTube ou votre propres titres",
        'SEARCH.TUTOSEL':"Cliquer sur le titre que vous souhaitez ajouter à la playlist"

    });

    $translateProvider.translations('fr',{
        'ADDEVENT.TITLE':'Titre',
        'SELEVENT.TITREPROFIL':"Mon profil",
        'ADDEVENT.ADDRESS':"Adresse de l'évenement",
        'ADDEVENT.APARTIRDE':"A partir de",
        'ADDEVENT.DURATION':'Durée',
        'ADDEVENT.SAVE':'Enregistrer',
        'ADDEVENT.START': "Start",
        'SELEVENT.CREATE':'Créer un évenement',
        'ADDEVENT.NEEDVALIDATE':"Modération des photos",
        'SELEVENT.WELCOME':'Bonjour, Trouver un événement !',
        'ADDEVENT.PASSWORD': "Mot de passe",
        'ADDEVENT.LABELSONG': "titres",
        "SELEVENT.NOPOSITION": "Vous devez activer la géolocalisation pour sélectionner un événement",
        'ADDEVENT.SONGSBYDEFAULT': "Playlist de départ",
        'ADDEVENT.VISIBLE': "Evénement visible a",
        'HOME.ADDSONG':'Ajouter votre musique !',
        'INVITE.PERSONAL':"Invitation personnelle",
        'INVITE.DEST':"Email à inviter",
        'SELEVENT.USELASTPOSITION': "Localisation impossible, utilisation de la dernière position",
        'SELEVENT.JOINFAILED': "impossible de ce joindre à cet évenement",
        'SELEVENT.MYEVENTS': "Mes événements",
        'SELEVENT.LOCALISE': "Me trouver",
        'PROFIL.CLOSE_EVENT': "Clore l'événement",
        'PROFIL.ANONYMOUS': "Anonyme",
        "PHOTO.TAKEPICTURE": "Partager une photo",
        'ADDEVENT.MAXGUEST': "Participants max",
        'SELEVENT.LOGOUT':"Changer de profil",
        'ADDEVENT.DESCRIPTION':"Teaser de l'événement",
        'ADDEVENT.WEBSITE':"Site web de l'événement",
        'INVITE.COPY':"Copier le lien",
        'INVITE.SEND':"Envoyer",
        'PHOTO.DOWNLOAD':"Télécharger mes photos",
        'INVITE.CANCEL':"Probleme pour envoyer l'invitation",
        'INVITE.YOURSELF':"Vous ne pouvez pas vous inviter vous même",
        'INVITE.CONFIRM':" recevra l'invitation dans 2 minutes",
        'SEARCH.WAITING':"Recherche",
        'PROFIL.DELPHOTO':"Bloquer !",
        'PROFIL.VALIDATE':"Valider !",
        'PROFIL.BLACKLIST':"Blacklister",
        'PHOTO.ENTERMESSAGE':"Entrer votre message",
        'PHOTO.SENDED':"Photo envoyée",
        'PHOTO.NOTSENDED':"Photo non envoyée",
        'ADDEVENT.NEEDLOC':"Vous devez préciser une position pour créer un événement",
        'SELEVENT.JOIN':"Rejoindre",


        //Les tutos
        'SELEVENT.TUTO':"Sélectionner un événement sur la carte ou fabriquez en un",
        'ADDEVENT.TUTO':"Pour créer votre événement, donner au moins un titre et une date de début",
        'ADDEVENT.TUTO_VALIDATE':"Toutes les photos devront être validé par vous avant d'être diffusées",
        'HOME.TUTO':"Ajouter votre propre musique dans la playlist de l'événement",
        'HOME.TUTOWITHMUSIC':"Voter pour ou contre les titres de la playlist pour changer l'ordre de passage",
        'PHOTO.TUTO':"Prenez une photo depuis votre téléphone, ajoutez un commentaire et partagez la avec tous les parcipants",
        'PHOTO.TUTOADMIN':"Partager vos photos mais surtout validez les photos des participants avant leur diffusion",
        'INVITE.TUTO':"Vous amis peuvent flasher le code pour rentrer directement dans la soirée. Vous pouvez également envoyer des invitations par directement par mail",
        'PROFIL.TUTOADMIN':"Contrôler la soirée et lancer les écrans de partage de photo ou le DJ automatique",
        'PROFIL.TUTO':"Passez en anonyme ne pas divulguer votre identité dans les photos et musique proposée",
        'SEARCH.TUTO':"Rechercher un artist ou un titre parmis le catalogue de Deezer, YouTube ou votre propres titres",
        'SELEVENT.TUTOJOIN':"Un événement est sélectionné, vous pouvez en faire partie un cliquant sur 'rejoindre'",
        'SEARCH.TUTOSEL':"Cliquer sur le titre que vous souhaitez ajouter à la playlist"
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

        .state('tabs.charts', {
            url: '/charts',
            views: {
                'charts-tab':{
                    templateUrl: 'Views/charts.html'
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

