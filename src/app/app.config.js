/**
 * Main module
 */
angular.module('classifier')
    .constant('CONFIG',{
        API_URL: "localhost:8080/classifier"
    })
    .config( [
        '$compileProvider',
        function( $compileProvider )
        {
            $compileProvider
                .aHrefSanitizationWhitelist(/^\s*(https?|data|mailto|chrome-extension):/);
        }
    ]);
