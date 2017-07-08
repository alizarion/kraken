(function (module) {
     
    var LocalFileReader = function ($q, $log,$rootScope) {
 
        var onLoad = function(reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.resolve(reader.result);
                });
            };
        };
 
        var onError = function (reader, deferred, scope) {
            return function () {
                scope.$apply(function () {
                    deferred.reject(reader.result);
                });
            };
        };
 
        var onProgress = function(reader, scope) {
            return function (event) {
                scope.$broadcast("fileProgress",
                    {
                        total: event.total,
                        loaded: event.loaded
                    });
            };
        };
 
        var getReader = function(deferred, scope) {
            var reader = new FileReader();
            reader.onload = onLoad(reader, deferred, scope);
            reader.onerror = onError(reader, deferred, scope);
            reader.onprogress = onProgress(reader, scope);
            return reader;
        };
 
        var readAsText = function (file) {
            var deferred = $q.defer();
             
            var reader = getReader(deferred, $rootScope);
            reader.readAsText(file);
             
            return deferred.promise;
        };
 
        return {
            readAsText: readAsText
        };
    };
 
    module.factory("LocalFileReader",
                   ["$q", "$log", '$rootScope', LocalFileReader]);
 
}(angular.module("classifier")));