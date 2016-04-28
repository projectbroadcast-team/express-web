var _ = require('underscore');
var s = require('underscore.string');

var $ = module.exports = {
    lib: {},
    views: {},
    plugins: {},
    controllers: {},
    services: {},
    managers: {}
};

$.load = function(_$) {
    if (_$) {
        _.extend($, _$);
    }

    console.log('');
    console.log('LOADING');

    var process = function(moduleName, list, onlyIndexes) {
        var module = $[moduleName];

        _.each(list, function(item) {
            //console.log('!!!item.name', item.name);
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
        if (onlyIndexes) {
            console.log('loaded', moduleName, module);
        }
    };

    process('lib', require('../../lib/**/*.js', {mode: 'list', options: {ignore:'../../lib/**/index.js'} }));
    process('lib', require('../../lib/**/index.js', {mode: 'list'}), true);

    process('views', require('../../views/**/*{.ejs,.js}', {mode: 'list', options: {ignore:'../../views/**/index.js'} }));
    process('views', require('../../views/**/index.js', {mode: 'list'}), true);

    process('plugins', require('../../plugins/**/*.js', {mode: 'list', options: {ignore:'../../plugins/**/index.js'} }));
    process('plugins', require('../../plugins/**/index.js', {mode: 'list'}), true);

    process('controllers', require('../../controllers/**/*.js', {mode: 'list', options: {ignore:'../../controllers/**/index.js'} }));
    process('controllers', require('../../controllers/**/index.js', {mode: 'list'}), true);

    process('services', require('../../services/**/*.js', {mode: 'list', options: {ignore:'../../services/**/index.js'} }));
    process('services', require('../../services/**/index.js', {mode: 'list'}), true);

    process('managers', require('../../managers/**/*.js', {mode: 'list', options: {ignore:'../../managers/**/index.js'} }));
    process('managers', require('../../managers/**/index.js', {mode: 'list'}), true);

    return $;
};