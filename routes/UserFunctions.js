const Feeds = require('../db/models').Feeds;

function UrlValidity(url)
{
	
}

function AddUrl(url, userid)
{
	Feeds.count({ where: { userId: userid, url: url } }).then(c =>{
			//console.log("There are " + c + " urls");
			
		if(c == 0)
		{
			var entry = Feeds.build({
				url: url,
				userId: userid
			});
			entry.save();
		}
	});	
} 

function RemoveUrl(url, userid)
{
	Feeds.findOne({ where: {userId: userid, url: url}}).then(data => {
		//console.log(data);
		data.destroy();
	});
}

function UpdateUrl(prevurl, userid, newurl)
{
	Feeds.findOne({ where: {userId: userid, url: prevurl}}).then(data =>{
		data.updateAttributes({
			url: newurl
		})
	})
}

module.exports = {
	AddUrl, RemoveUrl, UpdateUrl
};