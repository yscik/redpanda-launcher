import {radio} from "../app/radio";
radio.$on('click', () => state.folder = null);

export const state = {folder: null};