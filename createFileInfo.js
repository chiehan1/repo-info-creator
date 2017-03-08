var glob = require('glob');
var fs = require('fs');
var Path = require('path');
var naturalSort = require('javascript-natural-sort');

var repos = ['jiangkangyur', 'degekangyur', 'degetengyur', 'mipam', 'gorampa', 'gampopa', '8thkarmapa', 'tsongkhapa'];
var repoInfos = repos.map(createRepoInfo);
fs.writeFileSync('./repoInfos.txt', JSON.stringify(repoInfos, null, '  '), 'utf8');

function createRepoInfo(repo) {
  var result = {repoName: repo};
  var vols = {};

  var routes = glob.sync('../../' + repo + '/' + repo + '*/*.xml')
    .sort(naturalSort);

  var totalFileN = routes.length;
  result.totalFileN = totalFileN;

  var volN = 0;

  routes.forEach(function(route, i) {
    var volName = /\/([^/]+?$)/.exec(Path.dirname(route))[1];

    if (! vols[volName]) {
      volN ++;
      vols[volName] = {};
      vols[volName]['volFileN'] = 0;
      vols[volName]['volFiles'] = [];
    }

    var fileName = Path.basename(route);
    vols[volName]['volFiles'].push(fileName);
    vols[volName]['volFileN'] ++;
  });

  result.totalVolN = volN;
  result.vols = vols;

  return result;
}