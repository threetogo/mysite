const https = require('https');
const fs = require('fs');
const path = require('path');
const API_KEY = process.env.MICROCMS_API_KEY;
const options = {
  hostname: 't9d264vpqv.microcms.io',
  path: '/api/v1/diary?limit=100&depth=2',
  headers: { 'X-MICROCMS-API-KEY': API_KEY }
};
https.get(options, function(res) {
  res.setEncoding('utf8');
  var data = '';
  res.on('data', function(c) { data += c; });
  res.on('end', function() {
    var posts = JSON.parse(data).contents;
    var dir = path.join('content', 'posts');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    posts.forEach(function(post) {
      var date = new Date(post.publishedAt || post.createdAt).toISOString();
      var body = post.body || '';
      var title = post.title.replace(/"/g, '\\"');
      var tags = '';
      if (post.tags && post.tags.length > 0) {
        var tagNames = post.tags.map(function(t) { return '"' + t.tags + '"'; });
        tags = 'tags = [' + tagNames.join(', ') + ']\n';
      }
      var content = '+++\ntitle = "' + title + '"\ndate = "' + date + '"\ndraft = false\n' + tags + '+++\n\n' + body + '\n';
      fs.writeFileSync(path.join(dir, post.id + '.md'), content, 'utf8');
      console.log('完了: ' + post.title);
    });
    console.log('合計 ' + posts.length + ' 件');
  });
});
