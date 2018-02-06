var _serverConfig = {
    protocol: "http",
    address: "c4a.etive.org",
    path: "is",
    apiDir: "api",
    engineDir: "engines"
}

var _serverConfigBaseURL = _serverConfig.protocol + "://" + _serverConfig.address + "/" + _serverConfig.path + "/";
_serverConfig.apiURL = _serverConfigBaseURL + _serverConfig.apiDir;
_serverConfig.engineURL = _serverConfigBaseURL + _serverConfig.engineDir;