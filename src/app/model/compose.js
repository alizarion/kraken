angular.module('kraken').factory('Compose',[
    '$rootScope',
    function($rootScope){


        _Compose.prototype.$reloadFromYaml  = function(){


            if (this.yaml){
                    console.log(this.yaml);
                    this.json = jsyaml.safeLoad(this.yaml);

            }

        };

        _Compose.prototype.$reloadFromJson  = function(){
            if (this.json){
                this.yaml = jsyaml.safeDump(this.json);
            }
        };

        function _Compose(options){
            var self =this;
            $rootScope.$on('compose:update:yaml',function(){
                self.$reloadFromYaml();
            });

            return angular.extend(self,options || {});


        }

        return _Compose;
    }]);