angular.module('kraken')
    .factory('Project',[
        'Compose',
        'LocalFileReader',
        '$q',
        function(Compose,
                 LocalFileReader,
                 $q){



            function _Project(options){

                var self = this;
                self.composes = [];
                if(options.composes){
                    angular.forEach(options.composes,function(compose){
                        self.composes.push(new Compose(compose));
                    })
                }
                return angular.extend(self,options || {});

            }

            _Project.prototype.$save = function(){
                var savedProject = localStorage.getItem('kraken_projects');
                var projects = [];
                if (savedProject){
                    projects = angular.fromJson(savedProject);
                }
                projects.push(this);
                localStorage.setItem('kraken_projects',angular.toJson(projects));
            };

            _Project.prototype.$loadAll = function(){
                var savedProject = localStorage.getItem('kraken_projects');
                var jsonProject = [];
                var projects = [];
                if (savedProject){
                    jsonProject = angular.fromJson(savedProject);
                }

                angular.forEach(jsonProject,function(json){
                    projects.push(new _Project(json));
                });
                return projects;
            };

            _Project.prototype.getCompose = function(){

                var self = this;

                var result = null;
                angular.forEach(self.composes,function(compose){
                    //TODO find solution to null
                    result = angular.merge(compose.json,result);
                });
                return result;
            };


            _Project.prototype.loadAllLocally = function(files){
                var self = this;
                var deferred = $q.defer();
                var prom = [];
                angular.forEach(files,function(file) {
                    prom.push(LocalFileReader.readAsText(file)
                        .then(function(result){
                            self.composes.push(new Compose(
                                {
                                    name : file.name,
                                    yaml:result,
                                    json: jsyaml.safeLoad(result)
                                }))
                        }));

                });
                $q.all(prom).then(function () {
                    deferred.resolve(self.getCompose());
                },function(cause){
                    deferred.reject(cause);
                });
                return deferred.promise;
            };

            return _Project;
        }]);