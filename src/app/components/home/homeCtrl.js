angular
    .module('classifier')
    .controller('HomeCtrl',[
            '$uibModal',
            '$state',
            'Classifier',
            '$scope',
            function(
                $uibModal,
                $state,
                Classifier,
                $scope
            ){

                    var self = this;
                    self.classifiers = Classifier.query();

                    self.createNewProject = function () {
                            var modalInstance = $uibModal.open({
                                    animation: true,
                                    template: '<div class="container-fluid"><form novalidate><div class="modal-header"> ' +
                                    '<h3 class="modal-title" id="modal-title">Create new Classifier</h3> ' +
                                    '</div><div class="modal-body" id="modal-body">' +
                                    '<div class="form-group"> ' +
                                    '<label for="usr">Classifier Name:</label> ' +
                                    '<input type="text" required minlength="2" ng-model="classifier.classifierLabel" class="form-control" id="usr"> ' +
                                    '</div> <ul><li ng-repeat="compose in project.composes">' +
                                    '{{compose.name}} : <b>services </b> <span ng-repeat="(key,value) in compose.json.services">{{key}}, </span> ' +
                                    '</li></ul>' +


                                    '</div>' +
                                    '<div class="modal-footer">' +
                                    '<button class="btn btn-primary" type="button" ng-click="ok()">OK</button> ' +
                                    '<button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button> ' +
                                    '</div></div>' +
                                    '</form>',
                                    controller:['$scope',
                                            'Classifier',
                                            '$uibModalInstance',
                                            function ($scope,
                                                      Classifier,
                                                      $uibModalInstance
                                            ){
                                                    $scope.classifier = {classifierLabel:''};

                                                    $scope.ok = function() {
                                                            Classifier.save($scope.classifier).$promise.then(function(){
                                                                    self.classifiers = Classifier.query();
                                                                    $uibModalInstance.close();
                                                            });
                                                    };

                                                    $scope.cancel = function () {
                                                            $uibModalInstance.close();
                                                    };

                                            }]

                            })
                    };


            }]);