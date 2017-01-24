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
        'src/app/**/*.module.js',
        'src/app/**/*.js'
    ],
    /**
     * Liste des librairies minifié à utiliser en prod
     */
    jsDependencies: [
        'node_modules/angular/angular.min.js',
        'node_modules/angular-ui-router/release/angular-ui-router.min.js',
        'src/assets/js/extend-array.js',
        'node_modules/js-yaml/dist/js-yaml.min.js',
        'node_modules/vis/dist/vis-network.min.js',
        'node_modules/angular-ui-layout/src/ui-layout.js',
        'node_modules/codemirror/lib/codemirror.js',
        'node_modules/codemirror/addon/lint/lint.js',
        'node_modules/codemirror/addon/lint/yaml-lint.js',
        'node_modules/codemirror/addon/hint/show-hint.js',
        'node_modules/angular-breadcrumb/release/angular-breadcrumb.min.js',
        'src/assets/js/docker-compose-hint.js',
        'node_modules/codemirror/keymap/sublime.js',
        'node_modules/codemirror/mode/yaml/yaml.js',
        'node_modules/angular-ui-layout/src/ui-layout.js',
        'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
        'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js'


    ] ,
    cssDependencies: [
        'node_modules/bootstrap/dist/css/bootstrap.css',
        'node_modules/codemirror/addon/lint/lint.css',
        'node_modules/codemirror/addon/hint/show-hint.css',
        'node_modules/font-awesome/css/font-awesome.min.css',
        'node_modules/vis/dist/vis-network.min.css',
        'node_modules/angular-ui-layout/src/ui-layout.css',
        'node_modules/codemirror/lib/codemirror.css',
        'node_modules/codemirror/theme/dracula.css',
        'node_modules/angular-ui-layout/src/ui-layout.css',

    ],
    fontDependencies :[

    ]
};