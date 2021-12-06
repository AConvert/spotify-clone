import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/Spotify";
import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";

async function refreshAccessToken(token) {
  try {
    // If there is no error then we need firstly to import the spotifyApi Provider from the spotify.js(spotifyApi). Then we need to set
    //   the access and refresh token in our spotifyApi provider
    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    //   Now we get the response and destructuring it( const {body}) and then we call the refreshAccessToken() method and then we rename
    //   the body response swapping to REFRESHEDTOKEN in order to have a more clear response.
    //   So what is happening is that we are sending to Spotify Api the ACCESSTOKEN AND REFRESHTOKEN AS YOU SEE ON LINE 9-10, by calling
    // the function below(refreshAccessToken()) we are asking to spotify to refresh the EXPIRED TOKEN(accessToken) with a new one
    //   (refresh Token). So when spotify provide a refresh token then we will ask to spotify to refresh the access token and give it
    //   back in the body response
    const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
    console.log("refreshed token is:", refreshedToken);

    //   Once spotify has refreshed the token, we need to return again the new token and pass again the main infos and keys(accessToken,
    // , refreshToken, accessTokenExpires)
    return {
      ...token,
      //   the new accessToken will be the body response that we have named refreshedToken and we get back from the spotifyApi
      accessToken: refreshedToken.access_token,
      // the refreshToken that spotify gave back it contain a value that is called ExpiresIn and has the value of 3600ms that means
      // that it will last for 1 hour. So what we do is considering the actual time and date with DATE.NOW and we sum the
      // REFRESHEDTOKEN,EXPIRES_IN * 1000, and basically the syntax in the following we set the access token expiring time = to 1 hour
      // from the 3600 returns from spotify Api
      accessTokenExpires: Date.now + refreshedToken.expires_in * 1000,
      // in this case we say, if a refreshedToken exist then we replace the refreshToken with the new one inside the refreshedToken,
      // otherwise come back to the old refresh token
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      //   AUTHORIZATION KEY is used in spotify api and allows us to get authorization to the music.
      // in order to do that we ned a login url that spotify will give us.

      // IMPORTANT WE ARE GOING TO STORE THIS KEY NOT IN THE ENV LOCAL FILE BUT WE WILL CREATE
      // A FOLDER CALLED "LIB" IN THE ROOT DIRECTORY.
      //   SO WE HAVE CREATED THE LOGIN URL IN THE CONFIG FILE OF SPOTIFY(spotify.js) AND The login process will be initiated
      // by sending the user to this URL.
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  // AND THEN WE CREATE THE SECRET KEY WITH OUR JWT_SECRET TOKEN THAT WILL ENCRIPT THE TRASMISSIONS OF INFO
  // BACK FROM SPOTIFY TO THE SERVER.
  secret: process.env.JWT_SECRET,
  //   And finally we gonna build a CUSTOM LOGIN PAGE(it's basically the page that the user see when want to
  // login). furthermoreif the user is logout then it will be send to the custom login page
  pages: {
    signIn: "/login",
  },
  // SO now that can get access to the spotify api token, if we leave it to spotify, it will give us back in the response the minimun
  // in terms of info-wise. instead we want to get more info for the user and furthermore we want to get the access token but either
  // the refresh token that will allow the user to refresh the page with the info last time the user has logged in to that page,
  // in order to do that we need to use 2 CALLBACK FUNTIONS that will allow us to  level up the info we get back from the spotify api,
  // customising it. In this callbacks function we will the first callback function which will be ASYNCHRONOUS and it will comprend JWT
  // and we decstructure it passing different props.

  // so then the 1st function refer to the behaviour it will assume the response callback when THE USER LOGIN FOR THE FIRST TIME.
  // Therefore when the user login for the first time, it will receive back the ACCESS TOKEN , ACCOUNT AND USER INFOS
  callbacks: {
    async jwt({ token, account, user }) {
      //  if is inital sign in. where you get the infos to check if there is already a signed in o not user, we can check
      // the NEXTAUTH REFRESH TOKEN ROTATION ON THE WEBSITE, TYPE WHAT MENTIONED BEFORE(nextauth refresh token rotation)
      // therefore if we have account and user

      //   ----INITAL SIGN IN ------
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          // So when we access(means login of the user)the api with the accessToken, the user get a callback that will last for 1 hour.
          //   In order to keep that info from the api longer we will specify the REFRESHTOKEN. This will allow the user to keep getting
          //   the info from the api, and we will use the milliseconds to handle the expire time, that why we use (* 1000ms)
          accessTokenExpires: account.expires_at * 1000,
        };
      }
      //   The 2nd instance we refer will be, if we want to come back to the website spotify and the ACCESSTOKEN has not yet epired
      //   from the previous login in the page than we will return the following object.
      //   In order to verify the condition mention above we do the following: if the actual time and date is less then the
      //   access token expire date then return the token as it is yet valid.

      //   ----- RETURN PREVIOUS TOKEN IF THE ACCESS TOKEN HAS NOT EXPIRED YET ----
      if (Date.now() < token.accessTokenExpires) {
        console.log("Excisting access token is valid");
        return token;
      }

      //   ----- ACCESS TOKEN HAS EXPIRED, THEN WE NEED TO REFRESH IT, THEN WE RETURN THE TOKEN OBJECT CREATED IN THE FUNCTION
      //   REFRESHACCESSTOKEN() ------

      //   if the access token has expired, then we need to update it and refresh it...
      console.log("Excisting access token has expired");
      //   In order to refresh it we crete a function that will return the refreshed token BUT now we need to create
      //   the REFRESH ACCESS TOKEN METHOD IN ORDER TO MAKE SURE THAT THIS FUNCTION WILL REFRESH OUR ACCESS TOKEN.
      //   So see in line 5 where we create this function...
      return await refreshAccessToken(token);
    },

    // Next step is to create an async SESSION FUNCTION. so basically, once we created the token we need to create a session
    // object that will specify what the user will be able to tap in the client side using the token creted and corrisponding
    // infos includes in the token
    async session({ token, session }) {
      // Here we createing the part the the user can see(session.user.accessToken) on the client side and we basically allocate
      // and connect the SERVER ACCESSTOKEN  that the user can see as it is just an http and works on the server side, but the object
      // ids to connect them in order to communicate and transfer infos between 2 parts.
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.username = token.username;
      return session;
    },
  },
});
