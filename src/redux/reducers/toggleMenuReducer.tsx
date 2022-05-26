import { IS_TOGGLE_MENU } from '../types';

const initialState = {
  is_toggleMenu: false,
};

export const toggleMenuReducer = (state  = initialState, action: any) => {
    // console.log("reducers state",action.payload);
  switch (action.type) {
    case IS_TOGGLE_MENU:
      return {
        ...state,
        is_toggleMenu: action.payload,
      };
    default:
      return state;
  }
};
