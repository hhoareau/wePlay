App.controller('SearchCtrl',function($scope,$state,$ionicHistory,$translate,$ionicLoading){
    initGlobal($translate);


    DZ.init({appId  : '182662',channelUrl : 'https://weplaywebsite.appspot.com/channel.html'});

    $scope.searching=false;
    $scope.songs=[];
    $scope.query={value: window.localStorage.getItem("last_search")};

    $scope.add=function(song){
        var s={};

        user=JSON.parse(window.localStorage.getItem("user"));

        s.title=song.title;
        s.from=email+";"+user.firstname+";"+user.anonymous;
        s.type=3;
        s.idEvent=myevent.id;
        s.origin=song.origin;
        s.text=song.text;
        s.author=song.author;
        s.dtPlay=null;
        s.Id=s.idEvent+"_"+song.id;
        s.duration=song.duration;

        var id=myevent.id;

        addsong(id,s,function(rep){
            if(rep.status!=200)
                console.log("Song not added : ");

            $state.go("tabs.home");

        },function(err){
            console.log("Song not added : "+err);
        });
    }

    $scope.search=function(){
        var q=$scope.query.value;
        if(q.length>2){
            $ionicLoading.show({template:'Searching'});
            if($scope.songs.length>0)$scope.songs.clear();

            window.localStorage.setItem("last_search",q);
            //Toast.create("Respons loading");

            searchvideo(q,10,function(resp){
                $ionicLoading.hide();
                var k=0;
                resp.forEach(function(item){
                    if(item.id.videoId!=undefined){
                        k++;
                        song={};
                        song.origin=YOUTUBE;
                        song.text=item.id.videoId;
                        song.id="yt"+item.id.videoId;
                        song.duration=0;
                        song.order=k;
                        var s=item.snippet.title;
                        if(s.indexOf(" - ")){
                            song.author= s.split(" - ")[0];
                            song.title=s.split(" - ")[1];
                        } else {
                            song.title=s;
                            song.author="";
                        }
                        if(song.title!=undefined && song.title.length+song.author.length>5)
                            $scope.songs.push(song);
                    }
                });
            });

            searchlocal(q,myevent.id,function(resp){
                $ionicLoading.hide();
                if(resp.status==200 && resp.result.items!=undefined){
                    $scope.searching=false;
                    resp.result.items.forEach(function(song){
                        song.order=0;
                        $scope.songs.push(song);
                    });
                }
            });

            DZ.api('/search/?q='+q, function(response){
                $ionicLoading.hide();
                for(var i=0;i<response.data.length;i++){
                    var s=response.data[i];
                    s.origin=1;
                    s.order=i;
                    s.author = s.author || s.artist.name;
                    if(s.text==undefined)s.text=s.id;
                    s.title=s.title.replace(new RegExp("'",'g')," ");

                    $scope.songs.push(s);
                }

                $scope.$apply();

            });


        }
    }

    $scope.clearSearch=function(){
        $scope.songs.clear();
    }

    $scope.cancel=function(){
        $ionicHistory.goBack();
    }

    $scope.$on("$ionicView.enter", function( event ){
        $scope.search();
    });


});
