App.controller('ProfilCtrl', function ($scope,$state,$translate){
    initGlobal($translate);

    $scope.user=user;
    $scope.event=myevent;

    var links=[];
    links.push({title:"Player",description:"Connect this computer to your music system",url:"Views/MusicPlayer.html?event="+myevent.id});
    links.push({title:"Photos",description:"Connect this computer to a public display",url:"Views/gallery.html?photo_size=300&event="+myevent.id});
    links.push({title:"SlideShow",description:"Connect this computer to a public display",url:"Views/slideshow.html?event="+myevent.id});
    links.push({title:"Promotion",description:"Connect this computer to a public display",url:"Views/promo.html?event="+myevent.id});
    links.push({title:"Charts",description:"Connect this computer to a public display",url:"Views/publicCharts.html?event="+myevent.id});
    $scope.links=links;

    $scope.quitEvent=function(){
        quit(user.email,myevent.id,function(){
            user.currentEvent="";
            window.localStorage.setItem("user",JSON.stringify(user));
           $state.go("selEvent",{},{reload:true});
        });
    }

    $scope.closeEvent=function(){
        closeevent(myevent.id,user.email,function(){
            $state.go("selEvent",{},{reload:true});
        });
    }

    $scope.openLink=function(url){
        if(url.state!="" && url.state!=undefined)
            $state.go(url.state);
        else
            window.open(url.url);
    }

    $scope.$on("$ionicView.leave",function(){
        senduser($scope.user,"anonymous",function(){
            console.log("User save");
        });
    });
});