// WHEN WE HAVE CONFIGURED [...NEXTAUTH].JS WE HAVE CREATED A OBJECT CALLED "PAGES" WHERE WE BASICALLY spoecified
// THAT IN ORDER TO LOGIN THE USER NEED TO BE SEND TO THE "/login" PAGE/ENDPOINT.
// SO NOW WE NEED TO CUSTOMIZE THIS PAGE AND WE WILL USE THE "SERVER-SIDE-RENDER" IN ORDER TO USE ALL THE PROVIDER WE HAVE
// CREATED IN THE NEXTAUTH.JS FILE. SO BEFORE TO LOAD THE PROVIDERS INFOS ON THE BROWSER, IT NEED TO BE RENDERED ON THE SERVER SIDE AS
// NEXTJS BY DEFAULT PRE-RENDER THE HTML PAGE ON THE SERVER AND THEN LOAD THEM ON THE BROWSER(CLIENT-SIDE) ONCE ALL THE DATA
// HAS BEEN FETCHED AND EVALUATED. SEE ON LINE 18
import { getProviders, signIn } from "next-auth/react";
// destructure props from the server getServerProps
function Login({ providers }) {
  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <img src="https://links.papareact.com/9xl" className="w-52 mb-5" />
      {/* So now in order to get the values from the object array providers we want to map through it using the OBJECT.VALUES METHOD
that wiol give us just the values of the object array. IMPORTANT ALWAYS PROVIDE A KEY TO RECOGNIZE THE ELELMNT WE USE  */}
      {Object.values(providers).map((provider) => (
        <div>
          <button
            className="bg-[#18D860] text-white p-5 rounded-lg"
            key={provider.name}
            // In order to sign in when we click the button we will use the SIGNIN FUNCTION PROVIDED IN THE SERVER SIDE
            // AND PASS AS ARGUMENT THE PROVIDER.ID. Otherwise after wi signIn we need to specify the sign in options,
            // that is basically after the sign in where should I send the user.

            // If we leave the signIn fucntionality like that it will give us an issue on the website everytime the user try
            // to login in spotify ERROR: INVALID REDIRECT API. So in order to solve this issue we need to go in the dashborad
            // on spotify  website, EDIT SETTINGS, AND A REDIRECT URI, so spotify will authorize the user to get to the right
            // page. the correct redirect URI IS: "http://localhost:3000/api/auth/callback/spotify".
            // Once we add the redirect uri, then the user will be send to an AGREEMENT PAGE that will basicaly come from
            // the SCOPES we have specified in the configuartion of SPOTIFY.JS FILE that is the spotify config authorization file.
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Login;

// So this is what we will render on the server before we load and deliver it to the login page, and this is called SERVER-SIDE-RENDERING
// So we create a asynchrounous function called getServerSideProps(). in this fucntion we want firstly get back the PROVIDERS from
// nextauth.js file and to do that we need to use 2 BUILT-IN NEXTAUTH FUNCTIONS like GETPROVIDERS AND SIGNIN
// We need to import them in order to use them.
// When we fetched the providers, we need to return them in order to use them in our login page. Therefore we will return an object
// that will pass props which will include PROVIDERS. Then in order to use the providers object/props we need to pass it in the login
// component like we use to pass dinamyc data between component. In this instance we are passing data between the server bside and the
// client side. see line 9-(login({providers})) where we can destructure the props
export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
