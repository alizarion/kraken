/**
 * Main module
 */
angular.module('kraken').config( [
        '$compileProvider',
        function( $compileProvider )
        {
            $compileProvider
                .aHrefSanitizationWhitelist(/^\s*(https?|data|mailto|chrome-extension):/);
        }
    ]);
