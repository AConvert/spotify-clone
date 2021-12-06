// <---------------- NEXT MIDDLEWARE --------------------->

// We are creating the middleware, using the NEXT MIDDLEWARE COMPONENT. So basically the middleware works
// amid USER REQUEST and CLIENT BROWSER. So what it does is:
// - Catch and evaluate the user request
// - Check if the user is authenticated or not through a TOKEN(JWT TOKEN), IF NOT send the user to the logout page

// 1.import 2 helper function that we gonna use in our middleware
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // the middleware can check the body request through the token, but unless we specify the token secret everyone was be able to
  // check the token which isn't good has the token is unique for each user and it need to keep secret as i can contain
  // important data about the user. So to avoid this we pass either the JWT SECRET KEY.
  // This is the behaviour to check if the TOKEN EXIST IF THE USER IS LOGGED IN
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;
  // So now we gonna allow the request if the following is true...
  // 1. If token exists... OR
  // 2. If its a request for next-auth session & provider fetching
  // So we basically check if the request pathname is a request for authentication or if its a token that already exists
  if (pathname.includes("/api/auth") || token) {
    // if conditions are TRUE then let the request IN, using the helper function NEXTRESPONSE.NEXT()
    return NextResponse.next();
  }

  //If the condition above are FALSE then redirect the req to login page if they dont have token AND are requesting a protected route
  // We say if there isnt token and the pathname is different from the login page(is a request for example an UNPROTECTED REQUEST)
  if (!token && pathname !== "/login") {
    //   then we use the nextResponse helper function to redirect the user to the login page
    return NextResponse.redirect("/login");
  }
}

// RESULT OF USING NEXT MIDDLEWARE:
// I wwent to the website and I logout. when I logged in it sent me to the website beacuse the middleware evaluated my token
// and seen that exist. otherwise I have tryed to send the user to another page changing the endpoint (localhost:3000/playlist) and
// because the middleware NEXT SENT ME TO THE LOGIN PAGE AGAIN BECAUSE it has checked that page doesnt exists, so it kep sending me
// to LOCALHOST:3000/LOGIN. This is the power of NEXT MIDDLEWARE, it allows the website to check if the user is authenticated or has an
// existing token before to send him to the website.
// SO NOW THE WE HAVE THE AUTHENTICATION SETTLE WE CAN CONTINUE TO COMPLETE THE REST OF THE WEBSITE, we are going to create the
// CENETER PART OF THE WEBSITE WHERE WE PLAY THE MUSIC.
