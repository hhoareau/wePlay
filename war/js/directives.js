/**
 * Created by u016272 on 12/08/2016.
 */

App.directive('focusMe', function($timeout) {
    return {
        link: function(scope, element, attrs) {
            $timeout(function() {
                element[0].focus();
            });
        }
    };
});

App.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

App.service('analyticsHandler', function ($rootScope, $window) {
    angular.element(document).ready(function () {
        (function (w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src = '//www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })($window, document, 'script', 'tm', 'YOUR-GTM-CODE');
        //note: I've changed original code to use $window instead of window
    });
});



App.factory('ExifRestorer', function () {
    //Based on MinifyJpeg
    //http://elicon.blog57.fc2.com/blog-entry-206.html

    //noinspection UnnecessaryLocalVariableJS
    var ExifRestorer = (function()
    {

        var ExifRestorer = {};
        ExifRestorer.restore = function(origFileBase64, resizedFileBase64)
        {
            if (!origFileBase64.match("data:image/jpeg;base64,")){
                return resizedFileBase64;
            }

            var rawImage = this.decode64(origFileBase64.replace("data:image/jpeg;base64,", ""));
            var segments = this.slice2Segments(rawImage);
            var image = this.exifManipulation(resizedFileBase64, segments);
            return this.encode64(image);

        };


        ExifRestorer.exifManipulation = function(resizedFileBase64, segments)
        {
            var exifArray = this.getExifArray(segments),
                newImageArray = this.insertExif(resizedFileBase64, exifArray),
                aBuffer = new Uint8Array(newImageArray);

            return aBuffer;
        };


        ExifRestorer.getExifArray = function(segments)
        {
            var seg;
            for (var x = 0; x < segments.length; x++){
                seg = segments[x];
                if (seg[0] == 255 & seg[1] == 225) //(ff e1)
                {
                    return seg;
                }
            }
            return [];
        };


        ExifRestorer.insertExif = function(resizedFileBase64, exifArray)
        {
            var imageData = resizedFileBase64.replace("data:image/jpeg;base64,", ""),
                buf = this.decode64(imageData),
                separatePoint = buf.indexOf(255,3),
                mae = buf.slice(0, separatePoint),
                ato = buf.slice(separatePoint),
                array = mae;

            array = array.concat(exifArray);
            array = array.concat(ato);
            return array;
        };



        ExifRestorer.slice2Segments = function(rawImageArray)
        {
            var head = 0,
                segments = [];

            while (1){
                if (rawImageArray[head] == 255 & rawImageArray[head + 1] == 218){break;}
                if (rawImageArray[head] == 255 & rawImageArray[head + 1] == 216)
                {
                    head += 2;
                }
                else
                {
                    var length = rawImageArray[head + 2] * 256 + rawImageArray[head + 3],
                        endPoint = head + length + 2,
                        seg = rawImageArray.slice(head, endPoint);
                    segments.push(seg);
                    head = endPoint;
                }
                if (head > rawImageArray.length){break;}
            }

            return segments;
        };

        ExifRestorer.KEY_STR = "ABCDEFGHIJKLMNOP" +
        "QRSTUVWXYZabcdef" +
        "ghijklmnopqrstuv" +
        "wxyz0123456789+/" +
        "=";

        ExifRestorer.encode64 = function(input)
        {
            var output = "",
                chr1, chr2, chr3 = "",
                enc1, enc2, enc3, enc4 = "",
                i = 0;

            do {
                chr1 = input[i++];
                chr2 = input[i++];
                chr3 = input[i++];

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                this.KEY_STR.charAt(enc1) +
                this.KEY_STR.charAt(enc2) +
                this.KEY_STR.charAt(enc3) +
                this.KEY_STR.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        };



        ExifRestorer.decode64 = function(input)
        {
            var output = "",
                chr1, chr2, chr3 = "",
                enc1, enc2, enc3, enc4 = "",
                i = 0,
                buf = [];

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                alert("There were invalid base64 characters in the input text.\n" +
                "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = this.KEY_STR.indexOf(input.charAt(i++));
                enc2 = this.KEY_STR.indexOf(input.charAt(i++));
                enc3 = this.KEY_STR.indexOf(input.charAt(i++));
                enc4 = this.KEY_STR.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                buf.push(chr1);

                if (enc3 != 64) {
                    buf.push(chr2);
                }
                if (enc4 != 64) {
                    buf.push(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return buf;
        };


        return ExifRestorer;
    })();

    return ExifRestorer;
});

App.directive('camera', function ($q, $ionicLoading,ExifRestorer) {
    // Fix for chrome
    //noinspection JSUnresolvedVariable
    window.URL = window.URL || window.webkitURL;

    /**
     * Calculate scale factor
     *
     * @param memImg
     * @returns {number}
     */
    var calcXFactor = function (memImg) {
        var maxSize = 800;
        if (memImg.width < maxSize && memImg.height < maxSize) {
            return 1;
        }

        return memImg.width > memImg.height ? maxSize / memImg.width : maxSize / memImg.height;
    };

    /**
     * Convert selected file for upload to some data URL
     * which we can set to src of any image tag
     *
     * @param files
     */
    var setPicture = function (files) {
        if (!(files.length === 1 && files[0].type.indexOf("image/") === 0)) {
            return;
        }

        // Promise for final image url to display and send to server
        var deferredImgSrc = $q.defer();
        // Promise for temp. memory image for resizing
        var memImgDefer = $q.defer();
        // Promise for file reader to read the original file data
        var binaryReaderDefer = $q.defer();

        var memImg = new Image();
        memImg.onload = function () {
            var imgCanvas = document.createElement("canvas"),
                imgContext = imgCanvas.getContext("2d");

            // Make sure canvas is as big as the picture
            var xfactor = calcXFactor(this);
            imgCanvas.width = (this.width * xfactor) >> 0;
            imgCanvas.height = (this.height * xfactor) >> 0;

            // Draw image into canvas element
            imgContext.drawImage(this, 0, 0, imgCanvas.width, imgCanvas.height);

            var targetImage = imgCanvas.toDataURL('image/jpeg', .80);

            // Send the resized image as promised
            memImgDefer.resolve(targetImage);
            memImg = null;
            imgCanvas = null;
            imgContext = null;
            $ionicLoading.hide();
        };

        $ionicLoading.show({template:'Photo sending'});


        // Read image for exif
        var binaryReader = new FileReader();
        binaryReader.onloadend = function (e) {
            binaryReaderDefer.resolve(e.target.result);
        };

        //noinspection JSUnresolvedFunction
        memImg.src = URL.createObjectURL(files[0]);
        binaryReader.readAsDataURL(files[0]);


        $q.all([memImgDefer.promise, binaryReaderDefer.promise]).then(function (images) {
            var sourceImage = images[0];
            var targetImage = images[1];
            // Copy exif data
            ExifRestorer.restore(sourceImage, targetImage);

            deferredImgSrc.resolve(targetImage);
        });

        return deferredImgSrc.promise;
    };


    /**
     * Directive definition
     */
    return {
        restrict: 'E',
        template:   '<div style="display:inline-block;text-align: center;">'+
                    '<input type="file" capture="camera" accept="image/*" id="camera" style="visibility: hidden;width:0px;height: 0px;" />'+
                    //'<i class="icon ion-photos"></i>'+
                    '<img style="display:inline-block;width:50px;padding: 0px;margin: 0px;" src="img/camera.png" ng-click="takePhoto()">'+
                    '</div>',
        scope: {
            onSelect: '&'
        },
        link: function ($scope, element) {
            var input = element.find('input');

            input.on('change', function (event) {
                $scope.onSelect({
                    photo: setPicture(event.target.files)
                });
            });

            $scope.takePhoto = function () {
                input[0].click();
            };

        }
    }
});


App.directive('imgfiles', function ($q, $ionicLoading,ExifRestorer) {
    // Fix for chrome
    //noinspection JSUnresolvedVariable
    window.URL = window.URL || window.webkitURL;


    var calcXFactor = function (memImg) {
        var maxSize = 800;
        if (memImg.width < maxSize && memImg.height < maxSize) {
            return 1;
        }

        return memImg.width > memImg.height ? maxSize / memImg.width : maxSize / memImg.height;
    };


    var setPicture = function (files) {
        if (!(files.length === 1 && files[0].type.indexOf("image/") === 0)) {
            return;
        }

        // Promise for final image url to display and send to server
        var deferredImgSrc = $q.defer();
        // Promise for temp. memory image for resizing
        var memImgDefer = $q.defer();
        // Promise for file reader to read the original file data
        var binaryReaderDefer = $q.defer();

        var memImg = new Image();
        memImg.onload = function () {

            var imgCanvas = document.createElement("canvas"),
                imgContext = imgCanvas.getContext("2d");

            // Make sure canvas is as big as the picture
            var xfactor = calcXFactor(this);
            imgCanvas.width = (this.width * xfactor) >> 0;
            imgCanvas.height = (this.height * xfactor) >> 0;

            // Draw image into canvas element
            imgContext.drawImage(this, 0, 0, imgCanvas.width, imgCanvas.height);

            var targetImage = imgCanvas.toDataURL('image/jpeg', .80);

            // Send the resized image as promised
            memImgDefer.resolve(targetImage);
            memImg = null;
            imgCanvas = null;
            imgContext = null;
        };

        $ionicLoading.show({template:'Loading flyer image'});

        // Read image for exif
        var binaryReader = new FileReader();
        binaryReader.onloadend = function (e) {
            binaryReaderDefer.resolve(e.target.result);
            $ionicLoading.hide();
        };

        //noinspection JSUnresolvedFunction
        memImg.src = URL.createObjectURL(files[0]);
        binaryReader.readAsDataURL(files[0]);

        $q.all([memImgDefer.promise, binaryReaderDefer.promise]).then(function (images) {
            var sourceImage = images[0];
            var targetImage = images[1];
            // Copy exif data
            ExifRestorer.restore(sourceImage, targetImage);

            deferredImgSrc.resolve(targetImage);
        });

        return deferredImgSrc.promise;
    };

    return {
        restrict: 'E',
        template: '<input type="file" accept="image/*" id="camera" style="visibility: hidden;" />' +
        '<img>' +
        '<img style="max-width:40px;margin-right: 5px;margin-bottom: 0px;" src="/img/camera.png" ng-click="takePhoto()">',
        scope: {
            onSelect: '&'
        },
        link: function ($scope, element) {
            var input = element.find('input');

            input.on('change', function (event) {
                $scope.onSelect({
                    photo: setPicture(event.target.files)
                });
            });

            $scope.takePhoto = function () {
                input[0].click();
            };

        }
    }
});