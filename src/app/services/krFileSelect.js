angular
    .module('kraken').directive('krFileSelect',[function(){

    return {
        restrict :'EA',
        scope:
        {
            getFile : '&'
        },
        link: function($scope,el){

            el.bind("change", function(e){

                var file = (e.srcElement || e.target).files;
                $scope.getFile({files : file});
            })

        }

    }
}]);
