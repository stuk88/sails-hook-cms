'use strict';
var path = require('path');
var fs = require('fs-extra');
var ncp = require('ncp').ncp;

module.exports = function(sails, cb) {
    cb = cb || function() {};

    let copyAction = _.get(sails,"config.cms.assets", 'copy');

    if (copyAction === 'link') {
        var assetsDir = path.join(__dirname, '../assets');
        var destAssets = path.join(sails.config.appPath, 'assets/admin');
        if (!fs.ensureDirSync(destAssets)) {
            fs.symlink(assetsDir, destAssets, 'dir', cb);
        } else {
            return cb();
        }
    } else if (copyAction === 'copy') {
        var assetsDir = path.join(__dirname, '../assets');
        var destAssets = path.join(sails.config.appPath, 'assets/admin');
        var viewsDir = path.join(__dirname, '../views');
        var destViews = path.join(sails.config.appPath, 'views/admin');
        var overwrite = _.get(sails, 'config.cms.overwrite', false);
        fs.copy(viewsDir, destViews, { overwrite: overwrite }, () => {
            fs.copy(assetsDir, destAssets, { overwrite: overwrite }, cb);
        });
    } else {
        cb(new Error('Assets not configured !'));
    }
};
