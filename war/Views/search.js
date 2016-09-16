App.controller('SearchCtrl',function($scope,$state,$ionicHistory,$translate,$ionicLoading,$window){
    initGlobal($translate);

    $scope.viewCharts = function () {
        $window.open('http://www.uk-charts.top-source.info/2000-to-2009.shtml');
    };

    addResult=function(s){
        for(var i=0;i<$scope.songs.length;i++){
            if(s.order<=$scope.songs[i].order)break;
        }
        $scope.songs.splice(i,0,s);
    }

    DZ.init({appId  : '182662',channelUrl : 'https://weplaywebsite.appspot.com/channel.html'});


    $scope.searching=false;
    $scope.songs=[];
    $scope.query={value: window.localStorage.getItem("last_search")};

    $scope.add=function(song){
        var s={};

        user=JSON.parse(window.localStorage.getItem("user"));

        s.title=song.title.replace("\"","").replace("\"","").replace("\"","");
        s.from=user;
        s.type=3;
        s.idEvent=myevent.id;
        s.origin=song.origin;
        s.text=song.text;
        s.author=song.author;
        s.dtPlay=null;
        s.Id=s.idEvent+"_"+song.id;
        s.duration=song.duration;

        $$("Add song",s);

        var id=myevent.id;

        addsong(id,s,function(rep){
            if(rep.status!=200)
                $$("Song not added",rep);

            $state.go("tabs.home");

        },function(err){
            $$("Song not added : ",err);
        });
    }

    $scope.search=function(){
        var q=$scope.query.value;
        if(q.length>2){
            $ionicLoading.show({template:$translate.instant("SEARCH.WAITING")});
            if($scope.songs.length>0)$scope.songs.clear();

            window.localStorage.setItem("last_search",q);
            //Toast.create("Respons loading");

            searchlocal(q,myevent.id,function(resp){
                $ionicLoading.hide();
                if(resp.status==200 && resp.result.items!=undefined){
                    $scope.searching=false;
                    resp.result.items.forEach(function(song){
                        song.order=0;

                        addResult(song);
                    });
                }

                DZ.api('/search/?q='+q, function(response){
                    $$("Deezer respons:",response);
                    $ionicLoading.hide();
                    for(var i=0;i<response.data.length;i++){
                        var s=response.data[i];
                        s.origin=1;
                        s.order=i;
                        s.author = s.author || s.artist.name;
                        if(s.text==undefined)s.text=s.id;
                        s.title=s.title.replace(new RegExp("'",'g')," ");
                        addResult(s);
                    }
                });

                searchvideo(q,10,function(resp){
                    $$("Youtube response :",resp);
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
                                addResult(song);
                        }
                    });
                });


            });








        }
    }

    $scope.clearSearch=function(){
        $scope.songs.clear();
    }

    $scope.cancel=function(){
        $ionicHistory.goBack();
    }

    $scope.$on("$ionicView.afterEnter", function(){
        $scope.search();
    });


});

