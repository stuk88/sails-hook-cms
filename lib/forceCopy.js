'use strict';
var path = require('path');
var fs = require('fs-extra');

var assetsDir = path.join(__dirname, '../assets');
var viewsDir = path.join(__dirname, '../views');

// Resolve the app root (two levels up from node_modules/sails-hook-cms/lib)
var appPath = path.resolve(__dirname, '../../..');
var destAssets = path.join(appPath, 'assets/admin');
var destViews = path.join(appPath, 'views/admin');

console.log('Force copying views to', destViews);
console.log('Force copying assets to', destAssets);

fs.copy(viewsDir, destViews, { overwrite: true }, function(err) {
    if (err) return console.error('Error copying views:', err);
    console.log('Views copied successfully.');
    
    fs.copy(assetsDir, destAssets, { overwrite: true }, function(err) {
        if (err) return console.error('Error copying assets:', err);
        console.log('Assets copied successfully.');
    });
});
