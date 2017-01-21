/**
 * simple config file
 */
var pkg = require('./package.json');

module.exports = {

    dist: 'dist',
    /**
     * Header de la distribution.
     */
    banner:
        '/*!\n' +
        ' * Kraken 2017 CrossView.\n' +
        ' * http://alizarion.github.io/kraken\n' +
        ' *\n' +
        ' * Kraken, v<%= pkg.version %>\n' +
        ' * Apache 2.0 license.*/\n' ,

    closureStart: '(function() { var debugMode = false; \n',
    closureEnd: '\n})();',
    /**
     * Liste des fichiers JS de l'application qui seront minifier pour la prod.
     */
    src : [
        '!src/app/**/*Test.js', // Exclude test files
        'src/app/**/*.js'
    ],
    /**
     * Liste des librairies minifié à utiliser en prod
     */
    jsDependencies: [
        'src/assets/lib/ionic/release/js/ionic.bundle.min.js',
        'src/assets/lib/gmap/gmap3sensorfalse.js',
        'src/assets/lib/angular-sanitize/angular-sanitize.min.js',
        'src/assets/lib/angular-resource/angular-resource.min.js',
        'src/assets/lib/angular-messages/angular-messages.min.js',
        'src/assets/lib/angular-translate/angular-translate.min.js',
        'src/assets/lib/ng-file-upload/angular-file-upload-all.min.js',
        'src/assets/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
        'src/assets/lib/persistence/lib/persistence.js',
        'src/assets/lib/persistence/lib/persistence.store.cordovasql.js',
        'src/assets/lib/persistence/lib/persistence.store.websql.js',
        'src/assets/lib/persistence/lib/persistence.store.sql.js',
        'src/assets/lib/imgcache.js/js/imgcache.js',
        'src/assets/lib/moment/moment.js',
        'src/assets/lib/angular-moment/angular-moment.js',
        'src/assets/lib/angular-base64/angular-base64.min.js',
        'src/assets/lib/ng-tags-input/ng-tags-input.js',
        'src/assets/lib/angular-cached-resource/angular-cached-resource.min.js',
        'src/assets/lib/ngCordova/dist/ng-cordova.min.js',
        'src/assets/lib/ng-walkthrough/ng-walkthrough.js'

    ] ,
    cssDependencies: [
        'src/assets/lib/ng-tags-input/ng-tags-input.css',
        'src/assets/lib/ionicons/css/ionicons.min.css',
        'src/assets/lib/ng-walkthrough/css/ng-walkthrough.css',
        'src/app/composite/tabSlideBox/tabSlideBox.css',
        'src/assets/lib/components-font-awesome/css/font-awesome.min.css'

    ],
    fontDependencies :[

    ]
};