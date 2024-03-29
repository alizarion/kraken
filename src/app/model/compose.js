angular.module('kraken').factory('Compose',[
    '$rootScope','util',
    function($rootScope,util){


        _Compose.prototype.$reloadFromYaml  = function(){

            if (this.$yaml){
                this.json = jsyaml.safeLoad(this.$yaml);

            }

        };

        _Compose.prototype.$reloadFromJson  = function(){
            if (this.json){
                this.$yaml = jsyaml.safeDump(this.json);
            }
        };

        function _Compose(options){
            var self =this;

            if(options){
                options.color = '#'+Math.floor(Math.random()*16777215).toString(16);

                if(!options.name) options.name = 'initial-default-docker-compose.yml';
                if(!options.json) { options.json = {
                    version:2,
                        services:{
                        proxy: {
                            image: 'httpd',
                                ports: ['80:80']
                        }
                    }
                }
                }
            }
           else {
                options = {
                    name: 'initial-default-docker-compose.yml',
                    color:'#'+Math.floor(Math.random()*16777215).toString(16),
                    json:{
                        version:2,
                        services:{
                            proxy: {
                                image: 'httpd',
                                ports: ['80:80']
                            }
                        }
                    }

                };

            }
            options.$yaml = jsyaml.safeDump(options.json);


            $rootScope.$on('compose:update:yaml',function(){
                self.$reloadFromYaml();
            });

            return angular.extend(self,options || {});


        }

        return _Compose;
    }]);