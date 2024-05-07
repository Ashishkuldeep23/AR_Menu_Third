
import { configureStore } from "@reduxjs/toolkit"

import userRedcer from './Slices/userSlice'
import productReducer from './Slices/productSlice'
import modalReducer from './Slices/ModalSlice'
import cartReducer from './Slices/cartSlice'
import orderReducer from "./Slices/orderSlice"
import chefReducer from "./Slices/chefSlice"


export const store = configureStore({

    reducer: {
        userRedcer,
        productReducer,
        modalReducer,
        cartReducer,
        orderReducer,
        chefReducer
    },

    // // // This will solve err in modal code (Sending JSX in action and use that jsx as value of state)
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),

})





export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

