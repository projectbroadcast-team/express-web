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
        var process = function(moduleName, list) {
            var module = $[moduleName];

            _.each(list, function(item) {
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

        process('lib', require('../../lib/**/*.js', {mode: 'list', options: { ignore: '../../lib/index.js'}}));
        process('views', require('../../views/**/*.ejs', {mode: 'list', options: { ignore: '../../views/index.js'}}));
        process('plugins', require('../../plugins/**/*.js', {mode: 'list', options: { ignore: '../../plugins/index.js'}}));
        process('controllers', require('../../controllers/**/*.js', {mode: 'list', options: { ignore: '../../controllers/index.js'}}));
        process('services', require('../../services/**/*.js', {mode: 'list', options: { ignore: '../../services/index.js'}}));
        process('managers', require('../../managers/**/*.js', {mode: 'list', options: { ignore: '../../managers/index.js'}}));

        return $;
    };

    return $;
};
