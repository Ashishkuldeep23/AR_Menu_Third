
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import toast from "react-hot-toast";
// import { gettingTokenInCookieAndLocalHost } from "../App";






// // // Async routes here -------->

export const fetchAllProduct = createAsyncThunk("product/fetchAllProduct", async () => {

    let option: RequestInit = {
        credentials: 'include',
        // headers: {
        //     "token": `${gettingTokenInCookieAndLocalHost()}`
        // }

    }

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/all-product`, option)
    let data = await response.json();
    return data
})



export const fetchOneProduct = createAsyncThunk("product/fetchOneProduct", async (id: string) => {
    let option: RequestInit = {
        credentials: 'include',
        // headers: {
        //     "token": `${gettingTokenInCookieAndLocalHost()}`
        // }

    }

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/one-product/${id}`, option)
    let data = await response.json();
    return data
})





export type TypeSingleCustomeArrOfObj = { name: string, additionalPrice: number }[]


export type TypeCustomizationsObj = {
    sizes: TypeSingleCustomeArrOfObj,
    crusts: TypeSingleCustomeArrOfObj
}


export type TypeSingleProduct = {

    id: string,

    name: string,

    category: string,

    price: number,

    discountPercentage: number,

    model: {
        src: string,
        iosSrc: string
    },

    review?: [],

    rating: {
        totalPerson: number,
        totalStars: number
    },

    likes: number,

    dislikes: number,

    likedUserIds: string[],

    dislikedUserIds: string[],

    // // These keys added after some code --->

    customizations?: TypeCustomizationsObj,
    isNonVeg?: boolean
    timeRequired?: string

}


const initialOneProducData: TypeSingleProduct = {
    id: '',
    name: '',
    category: '',
    price: 0,
    discountPercentage: 0,

    // model: 'https://res.cloudinary.com/dlvq8n2ca/image/upload/v1704005444/hnvnf1bfodpwdinkuccq.glb',

    model: {
        // src : "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1704005444/hnvnf1bfodpwdinkuccq.glb",
        // iosSrc : "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1704005444/hnvnf1bfodpwdinkuccq.glb"
        src: "",
        iosSrc: ""
    },

    review: [],

    rating: {
        totalPerson: 0,
        totalStars: 0
    },


    likes: 0,
    dislikes: 0,
    likedUserIds: [],
    dislikedUserIds: [],

    customizations: {
        sizes: [],
        crusts: []
    },

    isNonVeg: false,
    timeRequired: '10 min'
}


type TypeProductInitial = {
    isLoading: boolean,
    isError: boolean,
    isFullFilled: boolean,
    isForgotFullFilled: boolean,
    errMsg: string,
    allProroductData: TypeSingleProduct[],
    singleProduct: TypeSingleProduct,
    currenProduct: TypeSingleProduct,
    unFilteredAllProduct: TypeSingleProduct[],
}


const initialState: TypeProductInitial = {
    isLoading: false,
    isError: false,
    isFullFilled: false,
    isForgotFullFilled: false,
    errMsg: "",
    allProroductData: [],
    unFilteredAllProduct: [],
    singleProduct: initialOneProducData,
    currenProduct: initialOneProducData
}

const productSlice = createSlice({

    name: "product",
    initialState,
    reducers: {

        setCurentProduct: (state, action) => {

            state.singleProduct = action.payload

        },
        setAllProductArr: (state, action: PayloadAction<TypeSingleProduct[]>) => {

            state.allProroductData = action.payload


        }

    },

    extraReducers: (builder) => {
        builder
            // // // Fetc all products ----->

            .addCase(fetchAllProduct.pending, (state) => {
                state.isLoading = true
                state.isFullFilled = false
            })

            .addCase(fetchAllProduct.fulfilled, (state, action) => {

                // console.log(action.payload)

                if (action.payload.status === false) {

                    state.errMsg = action.payload.message

                    state.isError = true

                    // toast.error(`${action.payload.message} | 400`, {
                    //     position: "top-right",
                    //     autoClose: 2000,
                    //     hideProgressBar: false,
                    //     closeOnClick: true,
                    //     pauseOnHover: false,
                    //     draggable: true,
                    //     progress: undefined,
                    //     theme: "dark",
                    // })


                    toast.error(`${action.payload.message} | 400`)





                } else {
                    state.allProroductData = action.payload.data
                    state.unFilteredAllProduct = action.payload.data
                }


                // console.log(action.payload.message)

                state.isLoading = false

            })

            .addCase(fetchAllProduct.rejected, (state, action) => {

                state.errMsg = action.error.message || 'Error occured'
                state.isLoading = false
                state.isError = true


                toast.error(`${action.error.message} || Error occured.`)

            })



            .addCase(fetchOneProduct.pending, (state) => {
                state.isLoading = true
                state.isFullFilled = false
            })

            .addCase(fetchOneProduct.fulfilled, (state, action) => {

                // console.log(action.payload)

                if (action.payload.status === false) {

                    state.errMsg = action.payload.message

                    state.isError = true

                    // toast.error(`${action.payload.message} | 400`, {
                    //     position: "top-right",
                    //     autoClose: 2000,
                    //     hideProgressBar: false,
                    //     closeOnClick: true,
                    //     pauseOnHover: false,
                    //     draggable: true,
                    //     progress: undefined,
                    //     theme: "dark",
                    // })


                    toast.error(`${action.payload.message} | 400`)





                } else {

                    // // // Now set same product at two palces ---->
                    state.singleProduct = action.payload.data
                    state.currenProduct = action.payload.data

                }


                // console.log(action.payload.message)

                state.isLoading = false

            })

            .addCase(fetchOneProduct.rejected, (state, action) => {

                state.errMsg = action.error.message || 'Error occured'
                state.isLoading = false
                state.isError = true


                toast.error(`${action.error.message} || Error occured.`)

            })

    }

})





export const { setCurentProduct, setAllProductArr } = productSlice.actions

export const productState = () => useSelector((state: RootState) => state.productReducer)

export default productSlice.reducer





