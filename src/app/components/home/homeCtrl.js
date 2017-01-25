angular
    .module('kraken')
    .controller('HomeCtrl',[
        'Project',
        '$uibModal',
        '$state',
        'ProjectService',
        '$scope',
        function(
            Project,
            $uibModal,
            $state,
            ProjectService,
            $scope
        ){

            var self = this;
            self.projectService = ProjectService;
            self.projectService.refresh();

            self.setCurrentProject = function(project){
                self.projectService.setCurrentProject(project);
                $state.transitionTo('home.edit');
            } ;

            self.updateProjectName = function(project,event){

                var newName = prompt("Please enter the new name of you project", project.name);
                if(newName){
                    project.name =  newName;
                    project.$save();
                }
                event.preventDefault();
            };


            self.createNewProject = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    template: '<div class="container-fluid"><form novalidate><div class="modal-header"> ' +
                    '<h3 class="modal-title" id="modal-title">Create new project</h3> ' +
                    '</div><div class="modal-body" id="modal-body">' +
                    '<div class="form-group"> ' +
                    '<label for="usr">Project Name:</label> ' +
                    '<input type="text" required minlength="2" ng-model="project.name" class="form-control" id="usr"> ' +
                    '</div> <ul><li ng-repeat="compose in project.composes">' +
                    '{{compose.name}} : <b>services </b> <span ng-repeat="(key,value) in compose.json.services">{{key}}, </span> ' +
                    '</li></ul>' +

                    '<label  class="btn btn-primary btn-lg btn-block btn-file">Import your Docker Compose files (Optional)<input type="file" multiple accept=".yml" kr-file-select get-file="project.loadAllLocally(files)" class="hidden"> ' +
                    '</label>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                    '<button class="btn btn-primary" type="button" ng-click="ok()">OK</button> ' +
                    '<button class="btn btn-warning" type="button" ng-click="cancel()">Cancel</button> ' +
                    '</div></div>' +
                    '</form>',
                    controller:['$scope',
                        'Project',
                        '$uibModalInstance',
                        'ProjectService',
                        function ($scope,
                                  Project,
                                  $uibModalInstance,
                                  ProjectService){
                            $scope.project = new Project();

                            $scope.ok = function() {
                                $scope.project.$save();
                                ProjectService.refresh();
                                $uibModalInstance.close();
                            };

                            $scope.cancel = function () {
                                $uibModalInstance.close()
                            };

                        }]

                })
            };


        }]);