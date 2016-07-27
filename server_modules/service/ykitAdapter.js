/**
 * Created by Ellery1 on 16/7/27.
 */
var HOST_FILE_NAME = 'ykit.hosts',
    fs = require('fs'),
    Path = require('path'),
    formatRuleList = require('./hostUtils').formatRuleList,
    exportHostList = require('./hostUtils').exportHostList;

var rignore = /^\./,
    rykit = /\_ykit$/;

function fetchGroupConfigFromYkitFolder(serverInfo) {

    var ret = {};

    iterateFolder(process.cwd(), function (folder) {

        var realPath = Path.resolve(process.cwd(), folder),
            renderedHosts = extractHostFile(Path.resolve(realPath, HOST_FILE_NAME), serverInfo);

        if (renderedHosts) {

            ret[folder + '_ykit'] = renderedHosts;
        }
    });

    return ret;
}

function syncGroupConfigToYkitFolder(config, serverInfo) {

    Object.keys(config.group).forEach(function (key) {

        var setting = config.group[key];

        writeSettingToYkitHosts(key, setting, serverInfo);
    });
}

function writeSettingToYkitHosts(groupname, setting, serverInfo) {

    if (rykit.test(groupname)) {

        var folederPath = Path.resolve(process.cwd(), groupname.replace(/\_ykit$/, '')),
            hyConfigPath = Path.resolve(folederPath, 'ykit.hy.js'),
            hostsPath = Path.resolve(folederPath, 'ykit.hosts'),
            renderedHostList = exportHostList(setting, serverInfo);

        try {

            if (fs.existsSync(folederPath) && fs.existsSync(hyConfigPath)) {

                fs.writeFileSync(hostsPath, renderedHostList, 'utf8');
                fs.chmodSync(hostsPath, '777');
            }
        }
        catch (e) {

            console.log(e.stack);
        }
    }
}

function iterateFolder(path, operate) {

    var folders = fs.readdirSync(path).filter(function (item) {

        return fs.statSync(item).isDirectory() && !rignore.test(item) && fs.existsSync(Path.resolve(process.cwd(), item, 'ykit.hy.js'));
    });

    folders.forEach(function (folder) {

        operate(folder);
    });
}

function extractHostFile(filepath, serverInfo) {

    if (fs.existsSync(filepath)) {

        return formatRuleList(fs.readFileSync(filepath, 'utf8'), serverInfo);
    }

    return [];
}

module.exports = {
    fetchGroupConfig: fetchGroupConfigFromYkitFolder,
    syncGroupConfig: syncGroupConfigToYkitFolder
};