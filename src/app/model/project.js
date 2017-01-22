angular.module('kraken')
    .factory('Project',[
        'Compose',
        'LocalFileReader',
        '$q',
        '$window',
        function(Compose,
                 LocalFileReader,
                 $q,
                 $window){



            function _Project(options){

                var self = this;
                self.composes = [];
                self.id = (new Date()).getTime();



                if(options){
                    if(options.id) self.id = options.id;
                    if(options.name)  self.name = options.name;


                    if(options.composes){
                        angular.forEach(options.composes,function(compose){
                            self.composes.push(new Compose(compose));
                            console.log('compose reloaded');

                        })
                    }
                }
                return self;

            }

            _Project.prototype.$save = function(){
                var savedProject = localStorage.getItem('kraken_projects');
                var projects = [];

                if (savedProject){
                    projects = angular.fromJson(savedProject);
                }
                var self = this;

                if(self.composes.length <=0){
                    self.composes.push(new Compose())
                }

                var existingProject  = _Project.$getById(this.id);
                if(existingProject.position>=0){
                    projects.splice(existingProject.position,1);
                }

                projects.push(self);

                localStorage.setItem('kraken_projects',angular.toJson(projects));
            };

            _Project.prototype.$refreshYamlFromJson =function(){
                var proj =this;
                if(proj.composes){
                    angular.forEach(proj.composes,function(compose){
                        compose.$reloadFromJson();
                    })
                }

            };

            _Project.$loadAll = function(){
                var savedProject = localStorage.getItem('kraken_projects');
                var jsonProject = [];
                var projects = [];
                if (savedProject){
                    jsonProject = angular.fromJson(savedProject);
                }

                angular.forEach(jsonProject,function(json){
                    projects.push(new _Project(json));
                });

                angular.forEach(projects,function(project){
                    project.$refreshYamlFromJson();
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

            _Project.$getById = function(id){
                var savedProject = localStorage.getItem('kraken_projects');
                var projects = [];

                var foundProject = null;
                var foundIndex = -1;

                if (savedProject){
                    projects = angular.fromJson(savedProject);
                    var found =false;
                    angular.forEach(projects,function(entry,index){
                        if(!found){
                            if(entry.id === id){
                                foundProject = entry;
                                foundIndex = index;
                            }
                        }
                    });
                }
                if(!foundProject){
                    console.warn('project with id ' + id+ 'not found')
                }
                return {
                    project : foundProject,
                    position: foundIndex
                }

            };

            _Project.prototype.$drop = function(){

                var deleteProject = $window.confirm('Are you sure you want to delete this project?');
                if(deleteProject){
                    var savedProject = localStorage.getItem('kraken_projects');
                    var projects = [];

                    if (savedProject){
                        projects = angular.fromJson(savedProject);
                    }
                    var projectPosition = _Project.$getById(this.id);
                    console.log('drop', projectPosition)
                    if(projectPosition.position>=0){
                        projects.splice(projectPosition.position,1);
                    }
                    localStorage.setItem('kraken_projects',angular.toJson(projects));
                }

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
                                    $yaml:result,
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