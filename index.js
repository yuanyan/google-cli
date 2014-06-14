var querystring = require('querystring');
var util = require('util');
var request = require('request');
var async = require('async');
var open = require('open');

exports.symbols = {
    ok: '✓',
    err: '✖'
};

// With node.js on Windows: use symbols available in terminal default fonts
if ('win32' == process.platform) {
    exports.symbols.ok = '\u221A';
    exports.symbols.err = '\u00D7';
}

function getIPS(){
    var ips = require('./ips');
    return ips;
}

function check(ip, done){
    request.head('http://' + ip, function (error, response, body) {
        if(error){
            console.log(ip, exports.symbols.err)
            done(null);
        }else{
            console.log(ip, exports.symbols.ok)
            done(ip);
        }
    })
}

function getIP(done){
    async.mapLimit(getIPS(), 50, check, function(err, results){
        if(err){
            done(err);
        }
    });
}

function search(q){

    var URL = "http://%s/search?q=%s";
    var query = '';

    if(q.args[0]){
        query = q.args.join(' ')
    }

    getIP(function(ip){
        var url;
        if(query){
            url = util.format(URL, ip, querystring.escape(query));
        }else{
            url = 'http://' + ip;
        }
        open(url);
        process.exit(0);
    })
}

exports.search = search;
