angular.module('classifier')
    .filter('encodeURI',[ function() {
        return window.encodeURIComponent;
    }]);