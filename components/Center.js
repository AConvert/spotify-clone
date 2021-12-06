import { ChevronDownIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";

function Center() {
  const { data: session } = useSession();
  // storing playlistId globally using recoil... but rather then use useRecoilState this time, we want just to get the value of the
  // playlist we will click, and based on that we want to update the shuffle of the color of the background in useEffect. In order
  // to do that we will implement USERECOILVALUE
  const [playlistId, setPlaylistId] = useRecoilValue(playlistIdState);
  // We want to get the playlist from spotify api in order to implement them in the center part.
  // we will create an atom in recoil(playlistAtom.js) fetching now the playlistState

  // const [playlist, setPlaylist] = useRecoilState(playlistState);

  const spotifyApi = useSpotify();
  // SO now we have created an array of different colors as we want to give different color to section creted in the jsx everytime
  // we select a plylist on the sidebar.
  //  - Therefore we will use the useEffect() hook that will trigger this functionality when the page load
  // - we create a piece of state that keep track of the color changes.
  // We gonna install LODASH LIBRARY in order to shuffle the color in the COLORS ARRAY. After we have installed it we will use
  // the SHUFFLE METHOD which return an array of mixed index of the element of the array is referring to(shuffle(colors)). ANd then
  // we use the pop method to pull out everytime that trigger a different elelement form the colors array. Finally to keep track
  // and update the change of state refered to the colors we use the SETTER FUNCTION(setColor()). see line 19

  // So now that we can shuffle throughout the colors array, we wil use the COLOR STATE in the JSX COMPONENT so everitme we refresh
  // the page we get a different color ==> see SECTION LINE 48.
  // We have updated the useEffect, adding the playlistId as dependency in the callback fucntion. this make sure that we have shuffle
  // of colors just when playlistId change.
  const [color, setColor] = useState(null);
  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  // Now that we have got the playlistState useing recoil, now we need to set it when the compoonent mount, therefore we will use the
  // useEffect. THIS time we want as dependencies [spotifyApi, playlistId] as we want to set the playlistState based on specific playlist id
  // when clicked, therefpre i will import the custom hook() see on line 18..
  // We have used useeffect, and inside we have firstly fetched data playlist from spotify Api using getPlaylist() method based on the
  // PlaylistId we have clicked, and then we have got the data playlist, after that we have SET THE BODY of this playlist data as piece
  // of state of playlist and we will render it evrityme the page load because useeffect

  useEffect(() => {
    spotifyApi.getPlaylist(playlistId).then((data) => setPlaylistId(data.body));
  }, []);

  console.log(playlistId);

  // console.log(playlist);

  const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
  ];

  return (
    <div className="flex-grow">
      <header className="absolute top-5 right-5">
        <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-white">
          {/* We are using the session data created in the nextAuth file to get the user informations. So now we want to get
            the user img everytime he logs in. To do that we need to point the session and check if SESSION EXISTS SO THE USER HAS 
            LOGGED IN and then we can point USER AND IMAGE */}
          <img className="rounded-full w-10 h-10" src={session?.user.image} />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="w-5 h-5" />
        </div>
      </header>

      <section
        className={`flex items-end bg-gradient-to-b to-black ${color} h-80 text-white p-8`}
      >
        <div>
          <img src="" alt="" />
        </div>
      </section>
    </div>
  );
}

export default Center;
