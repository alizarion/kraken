angular
    .module('kraken')
    .controller('EditCtrl',[
        'Project',
        'LogService',
        '$timeout',
        'ProjectService',
        '$scope',
        'Compose'
        ,function(
            Project,
            LogService,
            $timeout,
            ProjectService,
            $scope,
            Compose){
            var self = this;

            self.currentProject = ProjectService.getCurrentProject() || new Project();
            self.active = 0;
            //self code mirror after first rendering
            self.options = {
                displayLinks:true,
                displayDependsOn :true
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
                    self.currentProject.$save();
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