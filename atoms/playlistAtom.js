// we have created the playlistAtom file, and this will be the section referring to the playlist global store.
// So ATOM is part of GLOBAL STATE MANAGEMENT RECOIL and can be compared like in redux to the SLICE(like BASKETSLICE
// in the amazon clone.). So now as general explaination of RECOIL, its a global state store where we can store
// all the piece of state that we will use throughout the app, but rather then have a big global store we will
// create SECTIONS called ATOMS and those atoms will contextual to each part of the app, like we can have
// for example PLAYLISTATOM, SONGATOM, BASKETATOM etc...

// Firdt we will import the atom function from recoil
import { atom } from "recoil";

// so in order to store the playlistId state globally we will create a playlistIdState section/slice and we will
// use the atom built=in function that will be an object with 2 keys.
// 1. KEY which refers to the playlistIdState name, its like an unique name
// 2. deafault value is an initial value...
// So now that we have created the atom we can use it in the sidebar component...see in the sidebar file on
// line
export const playlistIdState = atom({
  key: "playlistIdState",
  default: "0qVBLANTNKsI2Gh4MDst47",
});

// We want to get the playlist state now from the api to use it in the center component and create the ui...
export const playlistState = atom({
  key: "playlistState",
  default: null,
});
