// <===== CUSTOM HOOK ======>

// We are creating a custom hook, and we basically initialize the accessToken inside here and this will be helpfull as we will be able
// to use this custom hook throughout the app everytime we need it.

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";

function useSpotify() {
  // In order to use the spotifyApi we need to get the user credentials, therefore we will create a new spotifyApi object
  // with CLIENT_ID AND CLIENT_SECRET keys
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
  });

  const { data: session, status } = useSession();
  useEffect(() => {
    // What we do here is we check firstly if we have a session. So if we have a session but the
    // refreshAccessToken created in the NEXTAUTH file broke, means that gives us an ERROR with an errror message,
    // if we get the message and catch the error then we send manually the user to the LOGIN PAGE using the built-in function SIGNIN
    if (session) {
      if (session.error === "RefreshAccessTokenError") {
        signIn();
      }
      //   if evrything goes well with no error then we will set the ACCESSTOKEN in the SPOTIFYAPI, and that will be the user acessToken.
      // We are initalizing the accessToken in the spotify api and using this we can basically get access to the API AND MAKE REQUEST TO IT
      // spotifyApi.setAccessToken(session.user.accessToken);
      spotifyApi.setAccessToken(session.user.accessToken);
    }
  }, [session]);

  return spotifyApi;
}

export default useSpotify;
