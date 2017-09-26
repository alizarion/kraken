angular.module('kraken').service('ProjectService',['Project',function(Project){

    var self = this;

    self.refresh = function(){
        self.yourProjects = Project.$loadAll('kraken_projects');
        self.sharedProjects =  Project.$loadAll('shared_projects');
    };

    self.getLoadedProjects = function(){
        return self;
    };
    self.getCurrentProject = function(){
        return self.currentProject;
    };

    self.setCurrentProject = function(current){
        self.currentProject = current;
    };


    return self;
}]);