angular.module('kraken').service('LogService',[function(){

        var self =  this;
        self.history = [];


        return {
            warn:function(warn){
                self.history.push(
                    {
                        type:'warning',
                        message:warn
                    }
                );
            },
            error:function(error){
                self.history.push(
                    {
                        type:'danger',
                        message:error
                    }
                );
            },
            info:function(info){
                self.history.push(
                    {
                        type:'info',
                        message:info
                    }
                );
            },
            history: self.history

        }

    }])
    .factory('$exceptionHandler', ['$log', 'LogService', function($log, LogService) {
        return function CustomHandler(exception, cause) {
            LogService.error(exception);
            $log.warn(exception, cause);
        };
    }]);