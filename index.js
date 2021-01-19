var _ = require('underscore');
var s = require('underscore.string');

var $ = module.exports = {};

var dirs = ['lib', 'helpers', 'views', 'plugins', 'controllers', 'services', 'managers', 'orchestrators', 'components'];

var lazy = function(func) {
    func.lazy = function() {
        var topArgs = arguments;

        var iam = function() {
            if (iam.lazy) {
                return iam;
            }
            var me = func.apply(null, topArgs);
            _.extend(iam, me);
            iam.lazy = true;
            var callback = topArgs[topArgs.length-1];
            if (_.isFunction(callback)) {
                callback(me);
            }
            return iam;
        };
        return iam;
    };
    return func;
};

var process = function(moduleName, list) {
    if (moduleName === 'components-views') {
        var module = $['views'];
        // console.log("!!!!YES1",moduleName);
        return _.each(list, function(item) {
            // console.log("!!!!YES2",item);
            item.name = item.name.split(/\.e?js/)[0];
            item.name = item.name.split('../../components/')[1];
            // console.log("!!!!YES3",item.name);
            if (item.name.indexOf('express') !== -1) {
                return;
            }
            // console.log("!!!!YES4",s.camelize(item.name));
            if (_.isFunction(item.module)) {
                lazy(item.module);
            }

            module[item.name] = item.module;
            // console.log("!!!!YES5",module[s.camelize(item.name)]);
        });
    }

    var module = $[moduleName];

    _.each(list, function(item) {
        //console.log('module item.name=', item.name);

        if (_.isFunction(item.module)) {
            lazy(item.module);
        }

        item.name = item.name.split('../../'+moduleName+'/')[1];

        if (item.name.indexOf('express') !== -1) {
            return;
        }

        var isIndex = item.name.indexOf('index.js') !== -1;

        item.name = item.name.split(/\.e?js/)[0];

        var splits = item.name.split('/');
        if (splits.length > 1) {
            var ref = module;
            var prevSplit = null;
            var prevRef = null;
            _.each(splits, function(split, index) {
                split = s.camelize(split);
                if (index === splits.length - 1) {
                    ref[split] = item.module;
                    if (isIndex) {
                        //console.log('extend prevSplit = ', prevSplit);
                        _.extend(prevRef[prevSplit], item.module);
                    }
                } else {
                    var localRef = ref;
                    ref = ref[split] || (ref[split] = lazy(function() {
                        return _.isFunction(localRef[split].index) && localRef[split].index.apply(this,arguments);
                    }));
                }
                prevSplit = split;
                prevRef = ref;
            });
        } else {
            module[s.camelize(item.name)] = item.module;
            if (isIndex) {
                //console.log('extend module = ', module);
                _.extend(module, item.module);
            }
        }
    });
};

$.load = function(_$) {
    console.log('');
    console.log('LOADING');

    if (_$) {
        _.extend($, _$);
    } else {
        _.each(dirs, function(dir) {
            $[dir] = function() {
                return _.isFunction($[dir].index) && $[dir].index.apply(this,arguments);
            };
        });
    }

    console.log('loading lib');
    process('lib', require('glob:../../lib/**/!(index).js'));
    process('lib', require('glob:../../lib/**/index.js'));

    console.log('loading helpers');
    process('helpers', require('glob:../../helpers/**/!(index).js'));
    process('helpers', require('glob:../../helpers/**/index.js'));

    console.log('loading views');
    process('views', require('glob:../../views/**/!(index).ejs'));
    process('views', require('glob:../../views/**/index.ejs'));

    console.log('loading plugins');
    process('plugins', require('glob:../../plugins/**/!(index).js'));
    process('plugins', require('glob:../../plugins/**/index.js'));

    console.log('loading controllers');
    process('controllers', require('glob:../../controllers/**/!(index).js'));
    process('controllers', require('glob:../../controllers/**/index.js'));

    console.log('loading services');
    process('services', require('glob:../../services/**/!(index).js'));
    process('services', require('glob:../../services/**/index.js'));

    console.log('loading managers');
    process('managers', require('glob:../../managers/**/!(index).js'));
    process('managers', require('glob:../../managers/**/index.js'));

    console.log('loading orchestrators');
    process('orchestrators', require('glob:../../orchestrators/**/!(index).js'));
    process('orchestrators', require('glob:../../orchestrators/**/index.js'));

    console.log('loading components');
    process('components-views', require('glob:../../components/**/*.ejs'));
    process('components', require('glob:../../components/**/!(index).js'));
    process('components', require('glob:../../components/**/index.js'));

    console.log('LOADED');

    return $;
};
