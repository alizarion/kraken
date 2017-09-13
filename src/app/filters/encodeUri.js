angular.module('kraken')
    .filter('encodeURI',[ function() {
        return window.encodeURIComponent;
    }]);