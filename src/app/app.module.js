/**
 * Main module
 */
angular.module('kraken',
    [
        'kraken.codemirror',
        'ui.layout',
        'ui.bootstrap',
        'ui.router',
        'ncy-angular-breadcrumb'
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
