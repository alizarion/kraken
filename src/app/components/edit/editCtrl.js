angular
    .module('kraken')
    .controller('EditCtrl',[
        'Project',
        'LogService',
        '$timeout',
        '$scope',
        'Compose',
        '$stateParams',
        '$uibModal',
        'util'
        ,function(
            Project,
            LogService,
            $timeout,
            $scope,
            Compose,
            $stateParams,
            $uibModal,
            util){
            var self = this;

            if($stateParams.projectId){
                self.currentProject = new Project(Project.$getById($stateParams.projectId,$stateParams.collection).project);
                if($stateParams.collection === 'shared_projects' ){
                    self.currentProject.fromShared =  self.currentProject.id;
                    self.currentProject.id = util.UUID();
                }

            }

            if($stateParams.project){
                LZMA.decompress($stateParams.project.split(','), function on_decompress_complete(result) {
                    self.currentProject =new Project(angular.fromJson(result));
                    if(Project.$getById(self.currentProject.id,'kraken_projects').project){
                        self.currentProject.$save('kraken_projects')
                    } else {
                        self.currentProject.fromShared =  self.currentProject.id;

                        self.currentProject.$save('shared_projects');
                        self.currentProject.id = util.UUID();
                    }


                    self.refreshEditor();
                }, function on_decompress_progress_update(percent) {
                    /// Decompressing progress code goes here.
                    document.title = "Decompressing: " + (percent * 100) + "%";
                });
            }





            self.active = 0;
            //self code mirror after first rendering
            self.options = {
                displayLinks:true,
                displayDependsOn :true,
                displayVolumes :true
            };


            self.refreshEditor = function(){
                $timeout(function(){
                    $scope.$broadcast('CodeMirror',function(cm){
                        cm.refresh();
                    });
                },250);
            };

            self.removeCompose = function(compose,event,index){
                var index = self.currentProject.composes.indexOf(compose);
                if(index >= 0){
                    self.currentProject.composes.splice(index,1);

                    self.currentProject.getCompose();
                }
                self.active = index-1 >= 0?  index-1 : 0;
                self.refreshEditor();
                event.preventDefault();
            };

            self.changeName = function(compose,event){

                var newName = prompt("Please the new name of your compose file", compose.name);
                if(newName){
                    angular.forEach(self.currentProject.composes,function(c){
                        if(c.name === compose.name){
                            if(newName.indexOf('.yml')<0){
                                newName = newName + '.yml';
                            }
                            c.name = newName + '';
                        }
                    });
                    self.currentProject.$save('kraken_projects');
                }
                self.refreshEditor();
                event.preventDefault();
            };

            self.addNewCompose = function(event){
                var name = prompt("Please enter your docker compose file name", ".yml");
                if(name){
                    self.currentProject.composes.push(new Compose({
                        name:name
                    }));
                }

                self.refreshEditor();


                event.preventDefault();

                $timeout(function(){
                    self.active =   self.currentProject.composes.length -1;

                },100)
            };

            self.logService = LogService;


            self.share = function(){
                LZMA.compress(JSON.stringify(self.currentProject), 5,function on_compress_complete(result) {
                    var url = location.protocol + '//' + location.host + location.pathname + '#/home/edit/?project=' +result;

                    $uibModal.open({
                        animation:true,
                        template: '<div class="modal-header"><h3 class="modal-title" id="modal-title-{{name}}">Your can Share this project by using the following link</h3></div>\n<div class="modal-body" id="modal-body-{{name}}">\n    <div class="input-group">\n        <input type="text" class="form-control" value="{{url}}" >\n        <span class="input-group-btn">\n        <button class="btn btn-secondary" ng-copy="url" type="button">Copy!</button>\n      </span>\n    </div>\n</div>',
                        controller:['$scope', function($scope) {
                            $scope.url = url;
                        }]
                    });

                }, function on_compress_progress_update(percent) {
                    /// Compressing progress code goes here.
                    document.title = "Compressing: " + (percent * 100) + "%";
                });


            };

            self.downloadYaml = function(){

                var i = 0;
                var elems = [];
                angular.forEach(self.currentProject.composes,function(){

                    elems.push(document.getElementById('downloadAnchorElem'+i));
                    i++
                });
                setTimeout(function(){
                    for(var element in elems){
                        elems[element].click();
                    }
                },200);

            };

            self.editorOptions = {
                lineWrapping: true,
                lineNumbers: true,
                matchTags: {bothTags: true},
                extraKeys: {"Ctrl-Space": "autocomplete"},
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
                styleActiveLine: true,
                theme: "dracula",
                lint: true,
                mode: 'text/x-yaml',
                smartIndent:false,
                indentWithTabs :false,
                commands :  {
                    save :function(){
                    }
                }

            };


            self.refreshEditor();

        }]);