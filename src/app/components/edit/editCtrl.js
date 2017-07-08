tracking.initUserMedia_ = function(element, opt_options) {
    window.navigator.getUserMedia({
            video: true,
            audio: !!(opt_options && opt_options.audio)
        }, function(stream) {
            tracking.localStream = stream;

            try {
                element.src = window.URL.createObjectURL(stream);
            } catch (err) {
                element.src = stream;
            }
        }, function() {
            throw Error('Cannot capture user camera.');
        }
    );
};

/**
 * Stop localStream, camera and audio
 */
tracking.stopUserMedia = function(){
    if(tracking.localStream){
        tracking.localStream.getVideoTracks()[0].stop();
    }
};


angular
    .module('classifier')
    .controller('EditCtrl',[
        'LogService',
        '$timeout',
        '$stateParams',
        'Classifier',
        '$scope',
        '$http',
        'CONFIG',
        'FileUploader',
        'Label',
        '$websocket',
        function(
            LogService,
            $timeout,
            $stateParams,
            Classifier,
            $scope,
            $http,
            CONFIG,
            FileUploader,
            Label,
            $websocket){
            var self = this;

            self.classifier = Classifier.get({classifierId:$stateParams.id});


            var dataStream = $websocket('ws://'+CONFIG.API_URL+'/classifierTraining');

            self.retrainLogs = [];

            self.startFaceTacking = function(){
                self.showFaceTracker = true;
                self.recoResult = null;
                self.classifyFacePending = false;


                var video = document.getElementById('video-reco');
                var canvas = document.getElementById('canvas-reco');
                var context = canvas.getContext('2d');
                var tracker = new tracking.ObjectTracker('face');
                var scale = 2;
                tracker.setInitialScale(4);
                tracker.setStepSize(2);
                tracker.setEdgesDensity(0.1);
                self.trackerTask = tracking.track('#video-reco', tracker, { camera: true });
                tracker.on('track', function(event) {

                    context.clearRect(0, 0, canvas.width, canvas.height);
                    event.data.forEach(function(rect) {

                        context.strokeStyle = '#a64ceb';
                        context.strokeRect(rect.x, rect.y, rect.width, rect.height);
                        context.font = '11px Helvetica';
                        context.fillStyle = "#fff";
                        context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
                        context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
                        if(!self.recoResult && !self.classifyFacePending ){


                            var hidden_canv = document.createElement('canvas');
                            hidden_canv.style.display = 'none';

                            // hidden_canv.style.display = 'none';
                            document.body.appendChild(hidden_canv);
                            hidden_canv.width =  (rect.width+20)*scale;
                            hidden_canv.height = (rect.height+20)*scale;
                            hidden_canv.visibility = 'hidden';
                            var hidden_ctx = hidden_canv.getContext('2d');
                            hidden_ctx.drawImage(
                                video,
                                (rect.x)*scale,//Start Clipping
                                (rect.y)*scale,//Start Clipping
                                (rect.width+20)*scale,//Clipping Width
                                (rect.height+20)*scale,
                                0,
                                0,
                                (rect.width+20)*scale,
                                (rect.height+20)*scale
                            );
                            var dataUrl = hidden_canv.toDataURL("image/jpeg");
                            self.classifyFacePending = true;
                            $http({
                                method:'PUT',
                                url: location.protocol+ '//'+  CONFIG.API_URL+"/rest/classifier/"+self.classifier.classifierId+"/label",
                                data:{content:dataUrl}
                            }).then(function(response){
                                self.classifyFacePending = false;
                                self.recoResult = response.data;

                            })
                        }
                    });
                });

            };


            dataStream.onMessage(function(message) {
                self.retrainLogs.push({text : message.data,dateTime:new Date()});
            });

            dataStream.send('subscribe,'+$stateParams.id);

            self.uploader = new FileUploader();
            self.uploader.onProgressItem = function(item){
                console.log(item)
                console.log( self.uploader)
            }

            self.uploader.filters.push({
                name: 'imageFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|jpeg|'.indexOf(type) !== -1;
                }
            });

            self.refreshUploadUrl = function(){
                self.uploader.url = location.protocol+ '//'+  CONFIG.API_URL+"/rest/classifier/upload/"+self.classifier.classifierId+"/"+self.currentLabel.labelId;

            } ;
            self.predictionUploader = new FileUploader();
            self.predictionUploader.url = location.protocol+ '//'+  CONFIG.API_URL+"/rest/classifier/"+$stateParams.id+"/label";

            self.predictionUploader.onAfterAddingFile = function() {
                self.predictionUploader.uploadAll();
            };

            self.openPictureManager = function(){
                self.takePhoto = true;
                self.cameraImageCount = 0;

            };

            self.startSendingCamera =function(){
                self.cameraImageCount = 0;
                self.cameraPipelineAvailable = true;
                self.shootComplete = false;

            };

            self.initTrackingJs =function(){
                var video = document.getElementById('video');
                var canvas = document.getElementById('canvas');
                var context = canvas.getContext('2d');
                var tracker = new tracking.ObjectTracker('face');
                var scale = 2;
                tracker.setInitialScale(4);
                tracker.setStepSize(2);
                tracker.setEdgesDensity(0.1);
                self.trackerTask = tracking.track('#video', tracker, { camera: true });
                tracker.on('track', function(event) {

                    context.clearRect(0, 0, canvas.width, canvas.height);
                    event.data.forEach(function(rect) {
                        if(!self.shootComplete){

                            console.log('shoot')
                            var hidden_canv = document.createElement('canvas');
                            hidden_canv.style.display = 'none';

                            // hidden_canv.style.display = 'none';
                            document.body.appendChild(hidden_canv);
                            hidden_canv.width =  (rect.width+20)*scale;
                            hidden_canv.height = (rect.height+20)*scale;
                            hidden_canv.visibility = 'hidden';
                            var hidden_ctx = hidden_canv.getContext('2d');
                            hidden_ctx.drawImage(
                                video,
                                (rect.x)*scale,//Start Clipping
                                (rect.y)*scale,//Start Clipping
                                (rect.width+20)*scale,//Clipping Width
                                (rect.height+20)*scale,
                                0,
                                0,
                                (rect.width+20)*scale,
                                (rect.height+20)*scale
                            );
                            var dataUrl = hidden_canv.toDataURL("image/jpeg");
                            self.cameraPipelineAvailable =false;
                            $http({
                                method:'PUT',
                                url: location.protocol+ '//'+  CONFIG.API_URL+"/rest/classifier/upload/"+self.classifier.classifierId+"/"+self.currentLabel.labelId,
                                data:{content:dataUrl}
                            }).then(function(reponse){
                                if ( self.cameraImageCount < 30){
                                    self.cameraImageCount++;

                                    self.shootComplete = false;
                                } else {
                                    self.shootComplete = true;
                                }
                                self.cameraPipelineAvailable =true;
                                self.currentLabel.imageFiles.push(reponse.data);
                            },function(error){
                                console.log('error')
                            }) ;
                        }

                        context.strokeStyle = '#a64ceb';
                        context.strokeRect(rect.x, rect.y, rect.width, rect.height);
                        context.font = '11px Helvetica';
                        context.fillStyle = "#fff";
                        context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
                        context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);




                    });
                });
                /* var gui = new dat.GUI();
                 gui.add(tracker, 'edgesDensity', 0.1, 0.5).step(0.01);
                 gui.add(tracker, 'initialScale', 1.0, 10.0).step(0.1);
                 gui.add(tracker, 'stepSize', 1, 5).step(0.1);*/
            }

            self.closePictureManger = function(){
                self.trackerTask.stop();
                tracking.stopUserMedia();
                //  tracking.localStream.stop();
                self.takePhoto = false;
            };

            self.shootComplete = true;

            self.predictionUploader.onBeforeUploadItem =function(item){
                self.testedImage =null;
                $timeout(function(){
                    self.testedImage =  {
                        file:item._file
                    }
                },250)

            };

            self.predictionUploader.filters.push({
                name: 'imageFilter',
                fn: function(item /*{File|FileLikeObject}*/, options) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|jpeg|'.indexOf(type) !== -1;
                }
            });


            self.predictionUploader.onCompleteItem = function(item, response){
                self.recoResult  = response;
            };

            self.uploader.onCompleteAll = function(item, response) {
                //self.classifier = Classifier.get({classifierId:$stateParams.id});
                Label.get({
                    classifierId:$stateParams.id,
                    labelId:self.currentLabel.labelId
                }).$promise.then(function(data){
                    self.currentLabel = data;
                    self.uploader.url = location.protocol+ '//'+  CONFIG.API_URL+"/rest/classifier/upload/"+self.classifier.classifierId+"/"+self.currentLabel.labelId;

                })
            };

            self.uploader.onAfterAddingAll = function() {
                self.uploader.uploadAll();
            };

            self.getImageUrl =function(imageFile){
                return location.protocol+ '//'+  CONFIG.API_URL+"/rest/classifier/file/"+imageFile.imageId+".jpg";

            };

            self.trainClassifier = function(){
                self.classifier.$train().$promise.then(function (data) {
                    self.classifier = data;

                });
            };


            self.addLabel = function(){
                var label =  prompt('Type label name ');
                if(label){
                    if(label!=''){
                        $http({
                            method:'POST',
                            url: location.protocol+ '//'+  CONFIG.API_URL+"/rest/classifier/"+self.classifier.classifierId+"/labels",
                            data:{labelName :label }
                        }).then(function(response){
                            Classifier.get({classifierId:$stateParams.id}).$promise.then(function(classifier){
                                console.log(classifier)
                                self.classifier = classifier;
                            });
                            console.log(response.data)
                            self.currentLabel = response.data;
                            self.currentLabel = response.data;
                            self.uploader.url = location.protocol+ '//'+  CONFIG.API_URL+"/rest/classifier/upload/"+self.classifier.classifierId+"/"+self.currentLabel.labelId;


                        })
                    }
                }

            }

        }])