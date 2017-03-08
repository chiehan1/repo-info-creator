var glob = require('glob');
var fs = require('fs');
var Path = require('path');
var naturalSort = require('javascript-natural-sort');

var repos = ['jiangkangyur', 'degekangyur', 'degetengyur', 'mipam', 'gorampa', 'gampopa', '8thkarmapa', 'tsongkhapa'];

fs.writeFileSync('./repoInfos.txt', , 'utf8');

function createRepoInfo(repo) {
  var result = {repoName: repo};

  var routes = glob.sync('./' + repo + '/' + repo + '*/*.xml')
    .sort(naturalSort);

  var totalFileN = routes.length;
  result.totalFileN = totalFileN;

  var lastVol = '';
  var volFileN = 0;
  var volN = 0;

  routes.forEach(function(route, i) {
    var vol = /\/([^/]+?$)/.exec(Path.dirname(route))[1];

    if (vol !== lastVol) {
      volN ++;

      if (0 !== i) {
        result += volFileN + ' files\n\n';
        volFileN = 0;
      }

      volN ++;
      result += vol + '\n\n';
      lastVol = vol;
    }

    var fileName = Path.basename(route);

    result += fileName + '\n';
    volFileN ++;

    if (i === lastIndex) {
      result += volFileN + ' files\n\n';
      result += volN + ' volumns\n\n';
    }
  });
}