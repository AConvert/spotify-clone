import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  RssIcon,
} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useSpotify from "../hooks/useSpotify";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";

function Sidebar() {
  // So evrytime the user is not logged in we want to send the user to the login page so it can log in. How can we do that???

  // 1. We need to use USESESSION() HOOK in order to get access to the session state and import it, the session is what allow
  // us to see if the user has logged in or not. So we destructured the data and renamed it as session and status.

  // 2. In order to use USESESSION() we need to go to APP.JS and WRAP our app component with SESSIONPROVIDER HOC(high-order-component).
  // This HOC will allow us to PERSIST THE LOGIN STATE WHEN WE NAVIGATE THROUGH THE APP, so we can always recall the user login state.
  const { data: session, status } = useSession();

  // this piece of state keeps track of the element Id when clicked, but it store it in a local store
  // but we want to lift this state in all the app, therefore we need to use GLOBAL STATE MANAGEMENT
  // like RECOIL. So in order to use Recoil we are going to create ATOMS FOLDER and create the PLAYLISTATOM.JS
  // FILE that will be the slice/section referring to the playlist slice in the global store recoil.
  // rather then use useState() hook, we will use the USERECOIL() HOOK that will allows us to store this
  // variable at global level and we pass in this function the ATOM CREATED IN THE RECOIL/PLAYLISTATOM.JS FILE

  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  // create a playlist state to keep track of them...
  const [playlists, setPlaylists] = useState([]);

  // <==== SPOTIFY CUSTOM HOOK ===>
  const spotifyApi = useSpotify();
  // Once created the piece of state playlist, then I use useEffect to keep update them everytime the page load,
  // but this time the rendering will be based on SESSION AND SPOTIFYAPI. That means that the updated several playlist will be rendered
  // just when we have a session(user logged in) and we got access through the token to the SPOTIFYAPI. How can we get the spotifyApi
  // access???

  // WE WILL USE THE SPOTIFYAPI HOOK CREATED ABOVE AND WE NEED TO IMPORT IT
  useEffect(() => {
    // if we get the accessToken from spotifyApi custom hook
    if (spotifyApi.getAccessToken()) {
      // then we fetch data and get playlist from it
      spotifyApi.getUserPlaylists().then((data) => {
        // once we have fetched the data then we want to set the playlist in the piece of statde that we have created. So now we have
        // the playlist and we can use it in our component. Therefore we will list them in our sidebar componet below
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  // CSS TAILWIND TRICK: To hide the scrollbar with tailwind (overflow-y-scroll in sidebar.js) we need to install
  // tailwind scrollbar hide npm package(see in the bookmark) and then add thids package in our tailwind.config file
  // and in the PLUGIN OBJECT the REQUIRE PLUGIN (require('tailwind-scrollbar-hide')).
  // In order to use this prop we need finally to use it in the component we need it SCROLLBAR-HIDE, in our instance
  // see the line below
  return (
    <div className="text-gray-500 p-5 text-sm border-r border-gray-900 scrollbar-hide overflow-y-scroll h-screen">
      <div className="space-y-4">
        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => signOut()}
        >
          <p>Log out</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="w-5 h-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <SearchIcon className="w-5 h-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <LibraryIcon className="w-5 h-5" />
          <p>Your Library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="w-5 h-5" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HeartIcon className="w-5 h-5" />
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <RssIcon className="w-5 h-5" />
          <p>Your Episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {/* Render custom Playlist */}
        {playlists.map((playlist) => (
          <p
            onClick={() => setPlaylistId(playlist.id)}
            className="cursor-pointer hover:text-white"
            key={playlist.id}
          >
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
