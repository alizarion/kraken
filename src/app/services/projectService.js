angular.module('kraken').service('ProjectService',['Project',function(Project){

    var self = this;

    self.refresh = function(){
        self.loadedProjects = Project.$loadAll();
    };

    self.getLoadedProjects = function(){
        return self.loadedProjects;
    };
    self.getCurrentProject = function(){
        return self.currentProject;
    };

    self.setCurrentProject = function(current){
        self.currentProject = current;
    };


    return self;
}]);