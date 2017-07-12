var FeedParser = require('feedparser');
var request = require('request'); // feed
var http = require('http');
var  fs = require('fs');
var path = require('path');

function display(url)
{
 
  //var req = request('http://feeds.bbci.co.uk/news/world/rss.xml')
  var req = request(url);
  var feedparser = new FeedParser();

  req.on('error', done);

  req.on('response', function (res) {
    var stream = this; 

    if (res.statusCode !== 200) {
      this.emit('error', new Error('Bad status code'));
    }
    else {
      stream.pipe(feedparser);
    }
  });


  feedparser.on('error', done);


  feedparser.on('readable', function () {
    var stream = this; 
    var meta = this.meta; 
    var item;
    while (item = stream.read()) {
      console.log(item.title);
     }
  });


function done(err) {
  if (err) {
    console.log(err, err.stack);
    return process.exit(1);
  }
}

}

module.exports = display;