// This file is going to contain all the stuff I need in order to use SPOTIFY API

// 1. INSTALL SPOTIFY WEB API NODE MODULE AND IMPORT IT
import SpotifyWebApi from "spotify-web-api-node";
// 2. WE NEED TO ESTABILISH SCOPES WHICH ARE PERMISSIONS THAT WE NEED TO GET AUTHARIZATION TO FROM
// THE SPOTIFY API
const scopes = [
  "user-read-email",
  "playlist-read-collaborative",
  "playlist-read-private",
  "streaming",
  "user-read-private",
  "user-library-read",
  "user-top-read",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-follow-read",
  "playlist-modify-public",
  "playlist-modify-private",
  //Join() Adds all the elements of an array into a string, separated by the specified separator string.
  // So the array with our scopes will become a unique string separate by comma
].join(",");

// Then we are going to create like a kind of ENDPOINT ROOT DOMAIN using the PARAMS VARIABLE CREATED.
// So for i.e. we will have a host domain like that: http://account.spotify.com/authorize?params=AND THEN WE HAVE ALL THE SCOPES
// LISTED ABOVE
const params = {
  scope: scopes,
};

// In order to create in that way above, we need to to query the params variable and create an OBJECT that can be used
// in any moment. So queryParams is now an object containing all the scopes.
const queryParamsString = new URLSearchParams(params);

// So now that we have the params object, we can create the LOGIN URL that we need in our [...nextauth].js file
// 1.Method
// const LOGIN_URL = `https://account.spotify.com/authorize?${queryParamsString.toString()}`;
// 2.method
const LOGIN_URL =
  "https://accounts.spotify.com/authorize?" + queryParamsString.toString();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

export default spotifyApi;
// we will export this LOGIN_URL to use it in the nextauth file
export { LOGIN_URL };
