'use strict';
var path = require('path');
var fs = require('fs-extra');
var ncp = require('ncp').ncp;

module.exports = function(sails, cb) {
    cb = cb || function() {};

    // Check and set default value
    if (!sails.config.cms.assets) {
        sails.config.cms.assets = 'copy';
    }

    if (sails.config.cms.assets === 'link') {
        var assetsDir = path.join(__dirname, '../assets');
        var destAssets = path.join(sails.config.appPath, 'assets/admin');
        if (!fs.ensureDirSync(destAssets)) {
            fs.symlink(assetsDir, destAssets, 'dir', cb);
        } else {
            return cb();
        }
    } else if (sails.config.cms.assets === 'copy') {
        var assetsDir = path.join(__dirname, '../assets');
        var destAssets = path.join(sails.config.appPath, 'assets/admin');
        fs.copy(assetsDir, destAssets, cb);
    } else {
        cb(new Error('Assets not configured !'));
    }
};