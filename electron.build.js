'use strict';
var packager = require('electron-packager');
var options = {
    'all': true,
    'dir': './compiled-js/client',
    'app-copyright': "King's Tithe, 2020",
    'app-version': '0.0.1',
    'asar': false,
    'extraResource': './assets',
    'icon': './app.ico',
    'name': 'ProjectDungeon',
    'out': './dist/client',
    'overwrite': true,
    'prune': true,
    'version': '0.0.1',
    'version-string': {
        'CompanyName': "King's Tithe",
        /*This is what display windows on task manager, shortcut and process*/
        'FileDescription': 'Project Dungeon role-playing game',
        'OriginalFilename': 'ProjectDungeon',
        'ProductName': 'ProjectDungeon',
        'InternalName': 'ProjectDungeon'
    }
};
packager(options, function done_callback(err, appPaths) {
    console.log("Error: ", err);
    console.log("appPaths: ", appPaths);
});