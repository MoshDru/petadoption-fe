import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

  adoptionBasket: {
    adoptionBasketItems: localStorage.getItem('adoptionBasketItems')
      ? JSON.parse(localStorage.getItem('adoptionBasketItems'))
      : [],
  },
};
function reducer(state, action) {
  switch (action.type) {
    case 'ADOPTIONBASKET_ADD_ITEM':
      //add to adoption basket
      const newItem = action.payload;
      const existItem = state.adoptionBasket.adoptionBasketItems.find(
        (item) => item._id === newItem._id
      );
      const adoptionBasketItems = existItem
        ? state.adoptionBasket.adoptionBasketItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.adoptionBasket.adoptionBasketItems, newItem];
      localStorage.setItem(
        'adoptionBasketItems',
        JSON.stringify(adoptionBasketItems)
      );
      return {
        ...state,
        adoptionBasket: { ...state.adoptionBasket, adoptionBasketItems },
      };
    case 'ADOPTIONBASKET_REMOVE_ITEM': {
      const adoptionBasketItems =
        state.adoptionBasket.adoptionBasketItems.filter(
          (item) => item._id !== action.payload._id
        );
      localStorage.setItem(
        'adoptionBasketItems',
        JSON.stringify(adoptionBasketItems)
      );
      return {
        ...state,
        adoptionBasket: { ...state.adoptionBasket, adoptionBasketItems },
      };
    };

    // case 'SAVEDBASKET_ADD_ITEM':
    //   //add to adoption basket
    //   const newSavedItem = action.payload;
    //   const existSavedItem = state.adoptionBasket.adoptionBasketItems.find(
    //     (item) => item._id === newSavedItem._id
    //   );
    //   const adoptionBasketSavedItems = existSavedItem
    //     ? state.adoptionBasket.adoptionBasketSavedItems.map((item) =>
    //         item._id === existSavedItem._id ? newSavedItem : item
    //       )
    //     : [...state.adoptionBasket.adoptionBasketSavedItems, newSavedItem];
    //   localStorage.setItem(
    //     'adoptionBasketItems',
    //     JSON.stringify(adoptionBasketItems)
    //   );
    //   return {
    //     ...state,
    //     adoptionBasket: { ...state.adoptionBasket, adoptionBasketItems },
    //   };
    // case 'SAVEDBASKET_REMOVE_ITEM': {
    //   const adoptionBasketSavedItems =
    //     state.adoptionBasket.adoptionBasketSavedItems.filter(
    //       (item) => item._id !== action.payload._id
    //     );
    //   localStorage.setItem(
    //     'adoptionBasketSavedItems',
    //     JSON.stringify(adoptionBasketSavedItems)
    //   );
    //   return {
    //     ...state,
    //     adoptionBasket: { ...state.adoptionBasket, adoptionBasketSavedItems },
    //   };
    // };


    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    case 'USER_SIGNOUT':
      return { ...state, userInfo: null };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
