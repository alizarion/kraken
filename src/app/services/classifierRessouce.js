angular.module('classifier').factory('Classifier',['$resource','CONFIG',function($resource,CONFIG){
    return $resource(location.protocol + '//' +CONFIG.API_URL+'/rest/classifier/:classifierId', null,
        {
            'update': { method:'PUT' },
            'train': {
                method:'PUT',
                url: location.protocol + '//' +CONFIG.API_URL+'/rest/classifier/:classifierId/train',
                params: {classifierId:'@classifierId'}
            }
        });
}]);