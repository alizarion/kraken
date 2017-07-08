angular.module('classifier').factory('Label',['$resource','CONFIG',function($resource,CONFIG){
    return $resource(location.protocol + '//' +CONFIG.API_URL+'/rest/classifier/:classifierId/label/:labelId',
        {
            classifierId:'@classifierId',
            labelId:'labelId'
        },
        {

        });
}]);