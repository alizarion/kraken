/**
 * Main module
 */
angular.module('classifier',
    [
        'ui.layout',
        'ui.bootstrap',
        'ui.router',
        'ncy-angular-breadcrumb',
        'ngResource',
        'wu.masonry',
        'angularFileUpload',
        'ngWebSocket'
    ]
)
    .config( [
        '$compileProvider','$locationProvider',
        function(
            $compileProvider,$locationProvider
        )
        {
            $locationProvider.html5Mode(false);
            $locationProvider.hashPrefix('');
            $compileProvider
                .aHrefSanitizationWhitelist(/^\s*(https?|data|mailto|chrome-extension):/);
        }
    ]);
