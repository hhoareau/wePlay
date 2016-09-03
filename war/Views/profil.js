App.controller('ProfilCtrl', function ($scope,$state,$translate,$ionicPopup,$window) {
    initGlobal($translate);

    $scope.user = user;
    $scope.event = myevent;

    var links = [];
    links.push({
        title: "Player",
        description: "PROFIL.PLAYER",
        url: "Views/MusicPlayer.html?event=" + myevent.id
    });
    links.push({
        title: "Photos",
        description: "PROFIL.GALLERY",
        url: "Views/gallery.html?photo_size=300&event=" + myevent.id
    });
    links.push({
        title: "SlideShow",
        description: "PROFIL.SLIDESHOW",
        url: "Views/slideshow.html?event=" + myevent.id
    });
    links.push({
        title: "Promotion",
        description: "PROFIL.PROMOTION",
        url: "Views/promo.html?event=" + myevent.id
    });
    links.push({
        title: "Charts",
        description: "PROFIL.CHARTS",
        url: "Views/publicCharts.html?event=" + myevent.id
    });
    $scope.links = links;

    $scope.quitEvent = function () {
        quit(user.email, myevent.id, function (resp) {
            user = resp.result;
            window.localStorage.setItem("user", JSON.stringify(user));
            $state.go("selEvent", {}, {reload: true});
        });
    }

    $scope.closeEvent = function () {
        showConfirm($ionicPopup, "Close the event ?", function () {
            closeevent(myevent.id, user.email, function () {
                $state.go("selEvent", null, {reload: true});
            });
        });
    }

    $scope.openLink = function (url) {
        if (url.state != "" && url.state != undefined)
            $state.go(url.state);
        else
            window.open(url.url);
    }

    $scope.$on("$ionicView.leave", function () {
        senduser($scope.user, "anonymous", function () {
            console.log("User save");
        });
    });

    $scope.$on("$ionicView.enter", function () {
        var delay=(new Date()-user.dtFirstConnexion)/(1000*60);
        if(delay<DELAY_TUTO)
            showConfirm($ionicPopup, "Are you connected to an audio device ?", function () {
                $window.open("Views/MusicPlayer.html?event=" + myevent.id);
            });
    });
});