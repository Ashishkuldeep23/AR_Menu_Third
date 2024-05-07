
import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit"
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { OrderDataInterface, OrderStatusOptions } from "./orderSlice";
import { gettingTokenInCookieAndLocalHost } from "../App";
import type { PayloadAction } from '@reduxjs/toolkit'
import toast from "react-hot-toast";

// import type { PayloadAction } from "@reduxjs/toolkit"
// // // Above will use in action object , see the docs.


export const getAllCurrentOrderData = createAsyncThunk("chef/getAllCurrentData", async () => {
    let option: RequestInit = {
        credentials: 'include',
        headers: {
            "token": `${gettingTokenInCookieAndLocalHost()}`
        }

    }

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getAllCurrentOrders`, option)
    let data = await response.json();
    return data
})




export type UpdateOrderChefBody = {
    whatUpdate: 'chefStatus',
    orderId: string,
    status: OrderStatusOptions,
    time?: string,
    startPreparation?: number,
    endPreparation?: number,
}


export const updateOrderStatusChef = createAsyncThunk("chef/updateOrder", async (body: UpdateOrderChefBody) => {
    let option: RequestInit = {
        method: "POST",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            "token": `${gettingTokenInCookieAndLocalHost()}`
        },
        body: JSON.stringify(body)
    }

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/updateOrderData`, option)
    let data = await response.json();
    return data
})



interface ChefIntiData {
    isLoading: boolean,
    isError: boolean,
    isFullFilled: boolean,
    errMsg: string,
    chefOrderData: OrderDataInterface[]
    // filteredOrderData: OrderDataInterface[]
}


const initialState: ChefIntiData = {
    isLoading: false,
    isError: false,
    isFullFilled: false,
    errMsg: "",
    chefOrderData: [],
    // filteredOrderData: []
}


const chefSlice = createSlice({
    name: "chefSlice",
    initialState,
    reducers: {

        addNewOrderByNoti(state, action: PayloadAction<OrderDataInterface>) {
            state.chefOrderData.unshift(action.payload)
        }

    },


    extraReducers: (builder) => {

        builder
            .addCase(getAllCurrentOrderData.pending, (state) => {
                state.isLoading = true
                state.isFullFilled = false
            })

            .addCase(getAllCurrentOrderData.fulfilled, (state, action) => {

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
                    // state.singleProduct = action.payload.data
                    // state.currenProduct = action.payload.data


                    // alert(`${action.payload.message}`)

                    if (action.payload.data) {

                        let allCurrentOrders = action.payload.data as OrderDataInterface[]
                        state.chefOrderData = allCurrentOrders
                    }


                }


                // console.log(action.payload.message)

                state.isLoading = false

            })

            .addCase(getAllCurrentOrderData.rejected, (state, action) => {

                state.errMsg = action.error.message || 'Error occured'
                state.isLoading = false
                state.isError = true


                toast.error(`${action.error.message} || Error occured.`)

            })



            .addCase(updateOrderStatusChef.pending, (state) => {
                state.isLoading = true
                state.isFullFilled = false
            })

            .addCase(updateOrderStatusChef.fulfilled, (state, action) => {

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
                    // state.singleProduct = action.payload.data
                    // state.currenProduct = action.payload.data


                    // alert(`${action.payload.message}`)


                    // state.chefOrderData = action.payload.data


                    if (action.payload.data) {


                        let newData: OrderDataInterface = action.payload.data

                        let cCartState = current(state)



                        let findOrderIndex = cCartState.chefOrderData.findIndex((ele) => ele.id === newData.id)

                        if (findOrderIndex !== -1) {
                            if (newData.status === "RECEIVED" || newData.status === "PROCESSING") {
                                state.chefOrderData.splice(findOrderIndex, 1, newData)
                            }
                            else if (newData.status === "ON_TABLE") {
                                state.chefOrderData.splice(findOrderIndex, 1)
                            }
                            else if (newData.status === "COMPLETED" || newData.status === "CANCELED") {
                                state.chefOrderData.splice(findOrderIndex, 1, newData)
                            }
                        }

                    }


                }


                // console.log(action.payload.message)

                state.isLoading = false

            })

            .addCase(updateOrderStatusChef.rejected, (state, action) => {

                state.errMsg = action.error.message || 'Error occured'
                state.isLoading = false
                state.isError = true


                toast.error(`${action.error.message} || Error occured.`)
            })





    }

})



export const { addNewOrderByNoti } = chefSlice.actions

export const chefSliceData = () => useSelector((state: RootState) => state.chefReducer)

export default chefSlice.reducer





