angular.module('classifier').service('LogService',[function(){

        var self =  this;
        self.history = [];


        return {
            warn:function(warn){
                self.history.push(
                    {
                        type:'warning',
                        message:warn,
                        date:new Date()
                    }
                );
            },
            error:function(error){
                self.history.push(
                    {
                        type:'danger',
                        message:error,
                        date:new Date()
                    }
                );
            },
            info:function(info){
                self.history.push(
                    {
                        type:'info',
                        message:info,
                        date:new Date()
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