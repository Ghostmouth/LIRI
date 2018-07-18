require("dotenv").config();
var Twitter = require("twitter")
var Spotify = require("node-spotify-api")
var keys = require("./keys.js")
var request = require("request")
var fs = require("fs")



var cmdArgs = process.argv
var liriCommand = cmdArgs[2]

var liriArg = ''

for (var i = 3; i < cmdArgs.length; i++) {
	liriArg += cmdArgs[i] + ' '
}



	// twitter function
	function getTweets() {
		
		// access twitter keys
		var client = new Twitter(keys.twitter)

		// sets screenname 
		var params = {
			screen_name: "seanjen24820206"
		}

		// gets tweets

	
		client.get("statuses/user_timeline", params, function(error, tweets, response) {
			
			console.log("tweets:")
			console.log(tweets)	
			console.log(":tweets")
			if (!error) {
				for (i=0; i < tweets.length; i++) {
					//console.log(tweets[i].created_at);
					console.log(tweets[i].text)
				}
			}
			else{
				console.log(error)
			}

		})
	}

	function spotifySong(song) {

		var spotify = new Spotify(keys.spotify)

		// no song
		var songName
			if (song === '') {
			songName = 'The Sign Ace Of Base'
			} else {
			songName = song
		}


		spotify.search({ type: 'track', query: songName }, function(err, data) {
			if (err){
	            console.log('Error occurred: ' + err);
	            return;
	        }

	        var songInfo = data.tracks.items;
	        console.log("Artist(s): " + songInfo[0].artists[0].name);
	        console.log("Song Name: " + songInfo[0].name);
	        console.log("Preview Link: " + songInfo[0].preview_url);
	        console.log("Album: " + songInfo[0].album.name);
		})

	}

	function omdb(movie){

		// no movie
		var movieName
		if (movie === '') {
		movieName = 'Mr. Nobody'
		} else {
		movieName = movie
		}


		var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy"

		// send request to OMDB
		request(queryUrl, function (error, response, body) {
			if (!error && response.statusCode === 200) {
	
				console.log("Title: " + JSON.parse(body).Title);
				console.log("Release Year: " + JSON.parse(body).Year);
				console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
				console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
				console.log("Country: " + JSON.parse(body).Country);
				console.log("Language: " + JSON.parse(body).Language);
				console.log("Plot: " + JSON.parse(body).Plot);
				console.log("Actors: " + JSON.parse(body).Actors);
			}
		})

		


	}

	function doSomething() {

		fs.readFile("./random.txt", "utf8", function(error, data){
			if (!error) {
				doWhatItSaysResults = data.split(",");
				spotifySong(doWhatItSaysResults[1]);
			} else {
				console.log("Error occurred" + error);
			}
		});
	}

if (liriCommand === 'my-tweets') {
	getTweets()
} else if (liriCommand === `spotify-this-song`) {
	spotifySong(liriArg)
} else if (liriCommand === `movie-this`) {
	omdb(liriArg)
} else if (liriCommand === 'do-what-it-says') {
	doSomething()
}