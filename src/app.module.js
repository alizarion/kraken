/**
 * Main module
 */


angular.module('kraken',['kraken.codemirror','ui.layout','ui.bootstrap'])
    .config( [
        '$compileProvider',
        function( $compileProvider )
        {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|data|mailto|chrome-extension):/);
        }
    ]);
