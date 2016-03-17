var _ = require('underscore');
var s = require('underscore.string');

module.exports = function($) {
    $ = $ || {
            lib: {},
            views: {},
            plugins: {},
            controllers: {},
            services: {},
            managers: {}
        };

    $.load = function() {
        console.log('')
        console.log('LOADING');

        var process = function(moduleName, list) {
            var module = $[moduleName];

            _.each(list, function(item) {
                if (item.name.indexOf('index') !== -1) {
                    return;
                }
                var splits = item.name.split('/');
                if (splits.length > 1) {
                    var ref = module;
                    _.each(splits, function(split, index) {
                        split = s.camelize(split);
                        if (index === splits.length - 1) {
                            ref[split] = item.module;
                        } else {
                            ref = ref[split] || (ref[split] = {});
                        }
                    });
                } else {
                    module[s.camelize(item.name)] = item.module;
                }
            });
            console.log('loaded', moduleName, module);
        };

        process('lib', require('../../lib/**/*.js', {mode: 'list'}));
        process('views', require('../../views/**/*{.ejs,.js}', {mode: 'list'}));
        process('plugins', require('../../plugins/**/*.js', {mode: 'list'}));
        process('controllers', require('../../controllers/**/*.js', {mode: 'list'}));
        process('services', require('../../services/**/*.js', {mode: 'list'}));
        process('managers', require('../../managers/**/*.js', {mode: 'list'}));

        return $;
    };

    return $;
};
