angular
    .module('kraken')
    .controller('MainController',[
        'Project',
        'LogService',
        '$timeout'
        ,function(
            Project,
            LogService,
            $timeout){

            var self = this;

            self.logService = LogService;
            self.project = new Project({
                name : 'default'
            });

            self.getFile = function(files) {
                self.project.loadAllLocally(files).then(function(){
                    console.log('load success');
                },function(){
                    alert('please catch this error');
                });
            };



            self.downloadYaml = function(){

                var i = 0;
                angular.forEach(self.project.composes,function(){
                    console.log('downloadAnchorElem'+i);
                    var el = angular.element(document.getElementById('downloadAnchorElem'+i));
                    console.log(el)
                    el.triggerHandler('click');

                    i++
                });

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
                        console.log('dsave')
                    }
                }

            };

        }]);