const https = require('https');
const fs = require('fs');
const path = require('path');
const API_KEY = process.env.MICROCMS_API_KEY;
const options = {
  hostname: 't9d264vpqv.microcms.io',
  path: '/api/v1/note?limit=10',
  headers: { 'X-MICROCMS-API-KEY': API_KEY }
};
https.get(options, function(res) {
  res.setEncoding('utf8');
  var data = '';
  res.on('data', function(c) { data += c; });
  res.on('end', function() {
    var pages = JSON.parse(data).contents;
    pages.forEach(function(page) {
      var body = page.body || '';
      var title = page.title;
      var content = '+++\ntitle = "' + title + '"\n+++\n\n' + body + '\n';
      var filename = title + '.md';
      fs.writeFileSync(path.join('content', filename), content, 'utf8');
      console.log('完了: ' + title);
    });
    console.log('合計 ' + pages.length + ' 件');
  });
});
