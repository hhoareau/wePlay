App.controller('ProfilCtrl', function ($scope,$state,$translate,$ionicPopup,$window,$interval,$ionicModal) {
    initGlobal($translate);

    $scope.user = user;
    $scope.event = myevent;
    $scope.links=[];

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

    links.forEach(function(lk){
        lk.description=$translate.instant(lk.description);
        $scope.links.push(lk);
    });

    $scope.updateAnonymous=function(){
        senduser($scope.user, "anonymous", function (resp) {
            localStorage.setItem("user",JSON.stringify(resp));
        });
    }

    $scope.quitEvent = function () {
        leave(user.id,myevent.id,$interval);
    }

    $scope.closeEvent = function () {
        showConfirm($ionicPopup, "Close the event ?", function () {
            closeevent(myevent.id, user.email);
        });
    }

    $scope.openLink = function (url) {
        if (url.state != "" && url.state != undefined)
            $state.go(url.state);
        else
            window.open(url.url);
    }
    
    $scope.$on("$ionicView.afterEnter", function () {
        tuto(user,"profil",$ionicModal,$scope,"help_profil.svg");
    });
});