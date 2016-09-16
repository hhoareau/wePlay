var timerPhotos=null;

App.controller('PhotosCtrl', function ($scope,$ionicPopup,$ionicModal,$ionicLoading,$translate,$interval,$timeout) {
    initGlobal($translate);
    var photo_interval=5000;

    $scope.message="";
    $scope.event=myevent;
    $scope.withMessage = {};

    $scope.downloadPhotos=function (col){
        col.items.forEach(function(photo){
        });
    }

    var s = window.localStorage.getItem("withMessage");
    if (s != null)
        $scope.withMessage.checked = (s == "true");
    else
        $scope.withMessage.checked = false;


    function send(theFile, photo, success, failure) {
        var max_photo_size = 500;
        $ionicLoading.show({template:'Photo sending'});

        $timeout(function(){
            resizeBase64Img(theFile, max_photo_size, function (newImg) {

                photo.photo = newImg;
                $scope.lastphoto=newImg;
                $ionicLoading.hide();

                sendphoto(myevent.id, photo,

                    function () {
                        if(success!=undefined)success();
                        $scope.message=$translate.instant("PHOTO.SENDED");
                        promise=$interval(refresh_photo, photo_interval);
                    },
                    function () {
                        $scope.message=$translate.instant("PHOTO.NOTSENDED");
                        failure();
                        promise=$interval(refresh_photo, photo_interval);
                    },
                    function (code) {
                        console.log(code);
                    }
                );
            });
        },200);
    }


    $scope.getPhoto = function (photoPromise) {

        photoPromise.then(function (theFile) {

            var photo = {};
            photo.text = "";
            photo.anonymous = ($scope.anonymous == true);
            photo.idEvent = myevent.id;
            photo.type = 0;
            photo.dtMessage = Date.parse(new Date());
            photo.from = email;

            if ($scope.withMessage.checked != null && $scope.withMessage.checked)
                showPopup($scope,$ionicPopup,$translate.instant("PHOTO.ENTERMESSAGE"),"message",function (res) {
                    if (res != undefined)photo.text = res;
                    send(theFile, photo);
                });
            else
                send(theFile, photo);
        });
    };


    /*
    $scope.takePicture = function () {
        var options = {
            quality: 50,
            destinationType: 1,
            sourceType: 0,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
            encodingType: 0     // 0=JPG 1=PNG
        }

        // Take picture using device camera and retrieve image as base64-encoded string
        //@see: https://github.com/driftyco/ionic-example-cordova-camera/blob/master/plugins/org.apache.cordova.camera/doc/index.md
        navigator.camera.getPicture(function (imageData) {

            var photo = "data:image/jpeg;base64," + imageData;
            sendphoto(myevent.id, photo);
        }, function () {
        }, options);
    };
    */

    $scope.updateWithMessage=function(){
        localStorage.setItem("withMessage",$scope.withMessage.checked);
    }

    refresh_photo=function(force) {
        if(isPresent("addphoto") || force){
            $scope.tovalidate=false;
            if(user.id==myevent.owner.id && myevent.needValidate==true)$scope.tovalidate=true;

            getLastPhoto(myevent.id, !$scope.tovalidate, function (resp) {
                if(resp.status!=204){
                    $scope.lastphoto = resp.result;
                    if(!resp.result.anonymous)
                        getuser(resp.result.from,function(r){
                            $scope.from= r.result;
                        });
                    $scope.$apply();
                } else{
                    $scope.lastphoto=null;
                }
            });
        }

    }

    $scope.delphoto=function(){
        delmessage($scope.lastphoto.id,refresh_photo);
    }

    $scope.validatephoto=function(){
        validatemessage($scope.lastphoto.id,refresh_photo);
    }

    $scope.blacklist=function(){
        blacklist($scope.lastphoto.from);
    }



    $scope.$on("$ionicView.afterEnter", function(){
        refresh_photo(true);
        timerPhotos=$interval(function(){
            refresh_photo(false);
        },5000);

        if(user.id==myevent.owner.id && myevent.needValidate==true)
            tuto(user,"photo_admin",$ionicModal,$scope);
        else
            tuto(user,"photo",$ionicModal,$scope);
    });
});
