/**
 * Created by u016272 on 19/09/2016.
 */

var libs=[];        //Libellés liés aux RH
libs.push({
    'lang':'en',
    'labels':{
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
        'PHOTO.WITHMESSAGE':"Photo with message",
        'PROFIL.DELPHOTO':"Block",
        'PROFIL.VALIDATE':"Allow",
        'PROFIL.BLACKLIST':"Blacklist",
        'PHOTO.ENTERMESSAGE':"Enter the message",
        'PHOTO.SENDED':"Photo sended",
        'PHOTO.NOTSENDED':"Photo not sended",
        'ADDEVENT.NEEDLOC':"You must set a position for the event",
        'ADDEVENT.NEEDVALIDATE':"validation needed to publish",
        'ADDEVENT.ACT_MUSIC':"Social playlist",
        'ADDEVENT.ACT_PHOTO':"Photo sharing",
        'ADDEVENT.ACT_BETS': "Bets",
        'ADDEVENT.ACT_SONDAGE':"Instant survey",
        'ADDBETS.OPTIONSLIST':"Choose list",
        'ADDBETS.BET':"Photo sharing",
        'ADDBETS.SURVEY': "Survey",


        'SELEVENT.JOIN':"Join the event",
        'SELEVENT.FREEEVENTS':"Available events",
        "SELEVENT.GEOLOCFAILED":"Shifumix required geolocalisation to show you the event closed to you. Your position will not communicate to an other service.",

        //Les tutos
        'SELEVENT.TUTO':"Sélectionner un événement sur la carte ou fabriquez en un",
        'ADDEVENT.TUTO':"Pour créer votre événement, donner au moins un titre et une date de début",
        'ADDEVENT.TUTO_VALIDATE':"Toutes les photos devront être validé par vous avant d'être diffusées",
        'HOME.TUTO':"Ajouter votre propre musique dans la playlist de l'événement",
        'HOME.TUTOWITHMUSIC':"Voter pour ou contre les titres de la playlist pour changer l'ordre de passage",
        'PHOTO.TUTO':"Prenez une photo depuis votre téléphone, ajoutez un commentaire et partagez la avec tous les parcipants",
        'PHOTO.TUTOADMIN':"Partager vos photos mais surtout validez les photos des participants avant leur diffusion",
        'INVITE.TUTO':"Vous amis peuvent flasher le code pour rentrer directement dans la soirée. Vous pouvez également envoyer des invitations par mail",
        'PROFIL.TUTOADMIN':"Contrôler la soirée et lancer les écrans de partage de photo ou le DJ automatique",
        'PROFIL.TUTO':"Passez en anonyme ne pas divulguer votre identité dans les photos et musique proposée",
        'SELEVENT.TUTOJOIN':"Un événement est sélectionné, vous pouvez en faire partie un cliquant sur 'rejoindre'",
        'SEARCH.TUTO':"Rechercher un artist ou un titre parmis le catalogue de Deezer, YouTube ou votre propres titres",
        'SEARCH.TUTOSEL':"Cliquer sur le titre que vous souhaitez ajouter à la playlist",
        'CHARTS.TUTO':"Retrouver la liste des participants, avec leur score général et leur score de l'événement",
        'SELEVENT.TUTOPAY':"Pour rester sans pub, le fonctionnement de Shifumix implique une modeste contribution de votre part pour pouvoir continuer de créer des centaines d'événements",
        "PUBLICCHART.TUTO":"Affiche le classement des personnes connectées dans l'événement",
        'MUSICPLAYER.TUTO':"Vous êtes chez le DJ automatique, vous devez être raccordé à un système audio",
        'BETS.TUTO':"Participez au sondage et paris disponibles et créez les vôtres directement",
        'ADDBETS.TUTO':"Saisissez simplement un intitulé et les différents choix possibles pour créer instantannément un sondage ou un pari."

    }
});

libs.push({
    'lang':"fr",
    'labels':{
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
        'ADDEVENT.ACT_MUSIC':"Playlist communautaire",
        'ADDEVENT.ACT_PHOTO':"Partager des photos",
        'ADDEVENT.ACT_BETS': "Faire des paris",
        'ADDEVENT.ACT_SONDAGE':"Proposer des sondages",
        'ADDBETS.OPTIONSLIST':"Liste des choix",
        'ADDBETS.BET':"Paris",
        'ADDBETS.SURVEY': "Sondage",


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
        'PHOTO.WITHMESSAGE':"Photo avec un message",
        'PHOTO.SENDED':"Photo envoyée",
        'PHOTO.NOTSENDED':"Photo non envoyée",
        'ADDEVENT.NEEDLOC':"Vous devez préciser une position pour créer un événement",
        'SELEVENT.JOIN':"Rejoindre",
        'SELEVENT.FREEEVENTS':"Evénements disponibles",
        "SELEVENT.GEOLOCFAILED":"Shifumix à besoin de votre position pour vous proposer les évenements proches de vous. Cette position n'est jamais communiquée à un tiers.",


        //Les tutos
        'SELEVENT.TUTO':"Sélectionner un événement sur la carte ou fabriquez en un",
        'ADDEVENT.TUTO':"Pour créer votre événement, donner au moins un titre et une date de début",
        'ADDEVENT.TUTO_VALIDATE':"Toutes les photos devront être validé par vous avant d'être diffusées",
        'HOME.TUTO':"Ajouter votre propre musique dans la playlist de l'événement",
        'HOME.TUTOWITHMUSIC':"Voter pour ou contre les titres de la playlist pour changer l'ordre de passage",
        'PHOTO.TUTO':"Prenez une photo depuis votre téléphone, ajoutez un commentaire et partagez la avec tous les parcipants",
        'PHOTO.TUTOADMIN':"Partager vos photos mais surtout validez les photos des participants avant leur diffusion",
        'INVITE.TUTO':"Vous amis peuvent flasher le code pour rentrer directement dans la soirée. Vous pouvez également envoyer des invitations par mail",
        'PROFIL.TUTOADMIN':"Contrôler la soirée et lancer les écrans de partage de photo ou le DJ automatique",
        'PROFIL.TUTO':"Passez en anonyme ne pas divulguer votre identité dans les photos et musique proposée",
        'SEARCH.TUTO':"Rechercher un artist ou un titre parmis le catalogue de Deezer, YouTube ou votre propres titres",
        'SELEVENT.TUTOJOIN':"Un événement est sélectionné, vous pouvez en faire partie un cliquant sur 'rejoindre'",
        'CHARTS.TUTO':"Retrouver la liste des participants, avec leur score général et leur score de l'événement",
        'SEARCH.TUTOSEL':"Cliquer sur le titre que vous souhaitez ajouter à la playlist",
        'SELEVENT.TUTOPAY':"Pour rester sans pub, le fonctionnement de Shifumix implique une modeste contribution de votre part pour pouvoir continuer de créer des centaines d'événements",
        'PUBLICCHART.TUTO':"Affiche le classement de l'événement",
        'MUSICPLAYER.TUTO':"Vous êtes chez le DJ automatique, vous devez être raccordé à un système audio",
        'BETS.TUTO':"Participez au sondage et paris disponibles et créez les vôtres directement",
        'ADDBETS.TUTO':"Saisissez simplement un intitulé et les différents choix possibles pour créer instantannément un sondage ou un pari."

    }
});
