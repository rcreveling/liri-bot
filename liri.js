require("dotenv").config();
// const inquirer = require("inquirer")
const fs = require('fs')
const axios = require('axios');
const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);

// var spotifyApi = new Spotify({
//     clientId: '<insert client id>',
//     clientSecret: '<insert client secret>'
// });
// axios({
//     method: "GET",
//     url: 'https://accounts.spotify.com/authorize',
//     client_id: spotify.id,
//     response_type: "token",
//     redirectUri: ""
// })
// spotify.authorizationCodeGrant().then(
//     function (data) {
//         console.log('This access token expires in ' + data.body['expires_in']);
//         console.log('The access token is ' + data.body['access_token'])
//     },
//     function (err) {
//         console.log("...Something went wrong retrieving the access token", err.message)
//     }
// )


class Show {
    constructor() {
        this.search = (searchValue) => {
            var omdbUrl = "http://www.omdbapi.com/?apiKey=trilogy&t=" + searchValue + "&type=movie"
            axios({
                method: "GET",
                url: omdbUrl,
            }).then((response) => {
                console.log(response.data)
                var title = response.data.Title
                var release = response.data.Year
                var genre = response.data.Genre
                var rating = response.data.imdbRating
                var description = response.data.Plot
                var showData = [
                    "You searched: '" + searchValue.split("+").join(" ") + "'",
                    "Results -",
                    "\n________________\n",
                    "Title: " + title,
                    "Years of Production: " + release,
                    "Genre(s): " + genre,
                    "IMDB Rating: " + rating,
                    "Show Plot: " + description,
                    "\n________________\n"
                ]
                console.log(showData.join("\n\n"))
                fs.appendFile('log.txt', showData.join(","), function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                });
            }).catch(function (error) {
                console.log(error)
            })
        }
    }


}


function spotifySearch(searchValues) {

    spotify.search({ type: 'track', query: searchValues }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        } else {
            var sc = data.tracks.items[0]
            var albumLink = sc.album.external_urls.spotify
            var albumName = sc.album.name
            var artist = sc.artists[0].name
            var song = sc.name
            var songLink = sc.external_urls.spotify

            var postedData = [
                "You searched: '" + searchValues.join(" ") + "'",
                "\n________________\n",
                "Results",
                "Artist: " + artist,
                "Album: " + albumName,
                "Track: " + song,
                "Listen on Spotify: " + songLink,
                "Album on Spotify: " + albumLink,
                "\n________________\n",
            ]
            console.log(postedData.join("\n\n"))
        }
    })

}

switch (process.argv[2]) {
    case 'concert-this':
        var userArgs = process.argv.slice(3)
        console.log(process.argv[2])
        break;
    case 'spotify-this-song':
        var userArgs = process.argv.slice(3)
        var searchValue = userArgs
        spotifySearch(searchValue)
        break;
    case 'movie-this':
        var userArgs = process.argv.slice(3)
        var searchValue = userArgs.join("+")
        console.log(process.argv[2])
        var moviethis = new Show().search(searchValue)
        break;
    case 'do-what-it-says':
        var userArgs = process.argv.slice(3)
        console.log(process.argv[2])
        doWhatitSays(process.argv[3], process.argv[4])
        break;
}


