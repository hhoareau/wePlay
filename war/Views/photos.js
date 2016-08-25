


function resizeBase64Img(base64, maxsize,func) {
    if(base64.length<3000000){
        func(base64);
        return;
    }

    console.log("Resizing");
    var canvas = document.createElement("canvas");
    var img=new Image();
    img.src=base64;
    img.onload=function(){
        var ratio=maxsize/Math.max(this.width,this.height);

        canvas.width =this.width*ratio;
        canvas.height =this.height*ratio;
        var context = canvas.getContext("2d");

        context.drawImage(img, 0, 0,canvas.width,canvas.height);
        var rc=canvas.toDataURL("image/jpeg", 1.0);
        func(rc);
    };
}

App.controller('PhotosCtrl', function ($scope,$interval,$ionicPopup,$translate) {
   initGlobal($translate);
    var photo_interval=5000;

    var promise=$interval(refresh_photo, photo_interval);

    $scope.message="";
    $scope.event=myevent;
    $scope.withMessage = {};

    var s = window.localStorage.getItem("withMessage");
    if (s != null)
        $scope.withMessage.checked = (s == "true");
    else
        $scope.withMessage.checked = false;

    $scope.showPopup = function (func) {
        $scope.data = {};

        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input autofocus focus-me type="text" ng-model="data.message">',
            title: 'Enter your message',
            scope: $scope,
            buttons: [
                {text: 'Cancel'},
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        if (!$scope.data.message) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
                            return $scope.data.message;
                        }
                    }
                }
            ]
        });
        myPopup.then(func);
    };


    function send(theFile, photo, success, failure) {
        var max_photo_size = 500;
        resizeBase64Img(theFile, max_photo_size, function (newImg) {
            photo.photo = newImg;
            $scope.lastphoto=newImg;
            $interval.cancel(promise);

            sendphoto(myevent.id, photo,
                function () {
                    if(success!=undefined)success();
                    $scope.message="Photo sended";
                    promise=$interval(refresh_photo, photo_interval);
                },
                function () {
                    $scope.message="Photo not sended";
                    failure();
                    promise=$interval(refresh_photo, photo_interval);
                },
                function (code) {
                    console.log(code);
                }
            );
        });
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
                $scope.showPopup(function (res) {
                    if (res != undefined)photo.text = res;
                    send(theFile, photo);
                });
            else
                send(theFile, photo);
        });
    };


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

    function refresh_photo() {
        if(isPresent("addphoto"))
            getLastPhoto(myevent.id, function (resp) {
                if(resp.status!=204){
                    $scope.lastphoto = resp.result.photo;
                    $scope.$apply();
                }
            });
    }

    $scope.$on("$ionicView.leave", function () {
        window.localStorage.setItem("withMessage", $scope.withMessage.checked);
    });

    $scope.$on("$ionicView.enter", function(){
        refresh_photo();
        setInterval(refresh_photo,5000);
    });
});
