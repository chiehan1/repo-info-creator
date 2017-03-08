var glob = require('glob');
var fs = require('fs');
var Path = require('path');
var naturalSort = require('javascript-natural-sort');

var repos = ['jiangkangyur', 'degekangyur', 'degetengyur', 'mipam', 'gorampa', 'gampopa', '8thkarmapa', 'tsongkhapa'];
var repoInfos = repos.map(createRepoInfo);
var result = editRepoInfos(repoInfos);
fs.writeFileSync('./repoInfos.txt', result, 'utf8');

function editRepoInfos(repoInfos) {
  var text = [], appendix = [];

  repoInfos.forEach(function(repoInfo) {
    var repoName = repoInfo.repoName, volInfos = repoInfo.vols;
    text.push(repoName);
    text.push('  總計 ' + repoInfo.totalVolN + ' 函，' + repoInfo.totalFileN + ' 個檔案。');

    appendix.push(repoName + '各函檔案明細');
    for (var volName in volInfos) {
      var volInfo = volInfos[volName], volFileN = volInfo.volFileN;
      appendix.push('  ' + volName + ' 資料夾，總計 '+ volFileN + ' 個檔案，檔案名稱：');

      var oneLineFiles = [];
      volInfo.volFiles.forEach(function(fileName, i) {
        oneLineFiles.push(fileName);

        var fileOrder = i + 1;
        if (0 === fileOrder % 3 || fileOrder === volFileN) {
          appendix.push('    ' + oneLineFiles.join('  '));
          oneLineFiles = [];
        }
      });
    }
  });

  return text.concat(appendix).join('\n');
}

function createRepoInfo(repo) {
  var result = {repoName: repo};
  var vols = {};

  var routes = glob.sync('../../' + repo + '/' + repo + '*/*.xml')
    .sort(naturalSort);

  var totalFileN = routes.length;
  result.totalFileN = totalFileN;

  var volN = 0;

  routes.forEach(function(route) {
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