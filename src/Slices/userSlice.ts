
import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { OrderDataInterface } from "./orderSlice";
import type { PayloadAction } from '@reduxjs/toolkit'
import { gettingTokenInCookieAndLocalHost } from "../App";
import toast from "react-hot-toast";
import { setTableNumInCookie } from "../components/BillComp/BillComponent";
// import { useSelector } from "react-redux";




// // // Async routes here -------->

export const getUserDataWithToken = createAsyncThunk("user/verifyToken", async (token: string) => {

    let option: RequestInit = {
        credentials: 'include',
        headers: {
            "token": `${token}`
        }

    }

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/userDataByToken`, option)
    let data = await response.json();
    return data
})


export const updateManyNotiToSeen = createAsyncThunk("user/updateNoti", async () => {

    let option: RequestInit = {
        method: "PUT",
        credentials: 'include',
        headers: {
            "token": `${gettingTokenInCookieAndLocalHost()}`
        }

    }

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/updateManyNotiToSeen`, option)
    let data = await response.json();
    return data
})


export type TypeUserAddress = {
    id: string;
    city: string,
    street: string,
    country: string,
    pincode: string
}


export type TypeUserData = {
    // name: string;
    lastName: string;
    firstName: string;
    profilePic: string;
    role: string;
    email: string;
    id: string;
    address?: TypeUserAddress[];
    orders?: OrderDataInterface[],
    currentOrderArr?: OrderDataInterface[],
    singleCurrentOrder?: OrderDataInterface,
}


export type NotificationSingle = {
    id: string,
    message: string,
    notificationDate: string,
    isDeleted: boolean,
    orderId: string,
    isSeen: boolean
}


type TyepUserDataForSlice = {
    isLoading: boolean;
    isError: boolean;
    isSingIn: boolean;
    isLogIn: boolean;
    isFullFilled: boolean;
    isForgotFullFilled: boolean;
    errMsg: string;
    userData: TypeUserData;
    notification: NotificationSingle[];
    unReadNotification: number;
    clickedNotification: string;
}


const initialState: TyepUserDataForSlice = {
    isLoading: false,
    isError: false,
    isSingIn: false,
    isLogIn: false,
    isFullFilled: false,
    isForgotFullFilled: false,
    errMsg: "",
    userData: {
        // name: "",
        firstName: "",
        lastName: "",
        profilePic: "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1700368567/ej31ylpxtamndu3trqtk.png",
        role: "",
        email: "",
        id: "",
        address: [],
        orders: [],
        currentOrderArr: [],
    },

    // // // Some notification states ----->
    notification: [],
    unReadNotification: 0,
    clickedNotification: ""
}




const userSlice = createSlice({

    name: "user",
    initialState,
    reducers: {

        setNotification(state, action: PayloadAction<NotificationSingle>) {
            let actionData = action.payload as NotificationSingle
            state.notification.unshift(actionData)
            state.unReadNotification++
        },

        clearUnReadNotification(state) {
            state.unReadNotification = 0
        },

        setClickedNotification(state, action: PayloadAction<string>) {
            state.clickedNotification = action.payload
        },

        // // // This is used in set current order arr --->
        setCurrentOrderArr(state, action: PayloadAction<OrderDataInterface[]>) {
            // console.log(action.payload)
            // console.log("called.....")
            state.userData.currentOrderArr = action.payload
        },

        // // // Below is used in send notification ---> 
        getOrderUpdateAndShow(state, action: PayloadAction<OrderDataInterface>) {
            let newData: OrderDataInterface = action.payload

            let cCartState = current(state)

            // console.log(action.payload)

            // / // Update order arr with updated order data --->
            if (cCartState.userData.orders) {
                let findOrderIndex = cCartState.userData.orders.findIndex((ele) => ele.id === newData.id)

                if (findOrderIndex !== -1 && state.userData.orders) {
                    state.userData.orders.splice(findOrderIndex, 1, newData)
                }
            }

            // // // Now check in currrent order arr and upadate into also ----->
            if (cCartState.userData.currentOrderArr) {

                let findCurentOrderIndex = cCartState.userData.currentOrderArr.findIndex((ele) => ele.id === newData.id)

                if (findCurentOrderIndex !== -1 && state.userData.currentOrderArr) {
                    state.userData.currentOrderArr.splice(findCurentOrderIndex, 1, newData)
                }
            }

        },

    },

    extraReducers: (builder) => {
        builder

            // // // fetchUserData with token ----->

            .addCase(getUserDataWithToken.pending, (state) => {
                state.isLoading = true
                state.isFullFilled = false
            })

            .addCase(getUserDataWithToken.fulfilled, (state, action) => {

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

                    // toast.success(`${action.payload.message}`, {
                    //     position: "top-right",
                    //     autoClose: 2000,
                    //     hideProgressBar: false,
                    //     closeOnClick: true,
                    //     pauseOnHover: false,
                    //     draggable: true,
                    //     progress: undefined,
                    //     theme: "dark",
                    // })


                    // // // Set is logIn True ------->

                    state.isLogIn = true
                    state.isFullFilled = true



                    // let name = action.payload.data.name
                    // let profilePic = action.payload.data.profilePic
                    // let role = action.payload.data.role
                    // let email = action.payload.data.email

                    // let { id, name, email, profilePic, role, address, token } = action.payload.data


                    // console.log(action.payload.data)


                    let token = action.payload.token



                    // // // set Some user data (Very minior data) ------>

                    // state.userData.name = name
                    // state.userData.email = email
                    // state.userData.profilePic = profilePic
                    // state.userData.role = role
                    // state.userData.id = id

                    if (token) {

                        // // // Now only cookie of browser --->
                        // localStorage.setItem("userToken", JSON.stringify(token))


                        // // TODO : and also we can set the token in cookie of browser with expire -->

                        let exdays = 20

                        const d = new Date();
                        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 60 * 1000));
                        let expires = "expires=" + d.toUTCString();

                        document.cookie = `token=${token};${expires}; path=/;`

                    }


                    let userData = action.payload.data

                    // console.log(userData)
                    state.userData = userData


                    // // // settin notifications now --->
                    if (userData.notification && userData.notification.length > 0) {
                        // console.log(userData.notification[0].id)
                        // // // update notification arr ------->
                        state.notification = userData.notification


                        let unReadNotficationsAre = userData.notification.filter((ele: NotificationSingle) => ele.isSeen === false)

                        // // // TODO -----> check any new notification ?? if yes then show (And then update to null)-->

                        // console.log(unReadNotficationsAre)

                        state.unReadNotification = unReadNotficationsAre.length

                    }


                    // // // getting current order and setting --->
                    if (userData.orders && userData.orders.length > 0) {

                        let arrOfOrderstatus = ["RECEIVED", "PROCESSING", "ON_TABLE"]

                        let findCurrentSingleOrder = userData.orders.filter((ele: OrderDataInterface) => {
                            if (ele.currentOrder === true && arrOfOrderstatus.includes(ele.status)) return ele
                        })

                        // console.log(findCurrentSingleOrder);


                        if (findCurrentSingleOrder.length > 0) {
                            state.userData.singleCurrentOrder = findCurrentSingleOrder[0]

                            // // // Now set here table num in cookei ------>
                            // // // Consider user sit in same table ----->

                            setTableNumInCookie(1, findCurrentSingleOrder[0].tableNumber)
                        }




                    }




                    // // // set data in localStorage ------>

                    // localStorage.setItem("userData", JSON.stringify({ name, email, profilePic, role, id, address }))
                    // localStorage.setItem("isUserLogIn", JSON.stringify(true))
                }


                // console.log(action.payload.message)

                state.isLoading = false

            })

            .addCase(getUserDataWithToken.rejected, (state, action) => {

                state.errMsg = action.error.message || 'Error occured'
                state.isLoading = false
                state.isError = true


                toast.error(`${action.error.message} || Error occured.`)

            })



            .addCase(updateManyNotiToSeen.pending, (state) => {
                state.isLoading = true
                state.isFullFilled = false
            })

            .addCase(updateManyNotiToSeen.fulfilled, (state, action) => {

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

                    // toast.success(`${action.payload.message}`, {
                    //     position: "top-right",
                    //     autoClose: 2000,
                    //     hideProgressBar: false,
                    //     closeOnClick: true,
                    //     pauseOnHover: false,
                    //     draggable: true,
                    //     progress: undefined,
                    //     theme: "dark",
                    // })


                    // // // Set is logIn True ------->

                    state.isLogIn = true
                    state.isFullFilled = true



                    // console.log(action.payload)

                    state.unReadNotification = 0


                }


                // console.log(action.payload.message)

                state.isLoading = false

            })

            .addCase(updateManyNotiToSeen.rejected, (state, action) => {

                state.errMsg = action.error.message || 'Error occured'
                state.isLoading = false
                state.isError = true


                toast.error(`${action.error.message} || Error occured.`)

            })



            // // // Some extra reducers of other slices ---->
            .addCase("order/createOrder/fulfilled", (state, action: PayloadAction<any, never>) => {

                // console.log(action.payload)

                if (action.payload.created) {

                    state.userData.orders?.unshift(action.payload.data)

                    state.userData.singleCurrentOrder = action.payload.data
                }

                if (action.payload.updated) {

                    state.userData.singleCurrentOrder = action.payload.data

                    let cUserState = current(state)


                    let allOrderData = cUserState.userData.orders

                    if (allOrderData?.length && allOrderData?.length > 0) {

                        let findIndex = allOrderData.findIndex((ele) => ele.id === action.payload.data.id)

                        if (findIndex !== -1) {

                            state.userData.orders?.splice(findIndex, 1, action.payload.data)

                        }


                    }

                    // console.log(action.payload.data)
                }


            })


            // // // Update data if change ---------->
            .addCase("chef/updateOrder/fulfilled", (state, action: PayloadAction<any, never>) => {
                if (action.payload.data) {

                    let newData: OrderDataInterface = action.payload.data
                    let cCartState = current(state)
                    if (cCartState.userData.orders) {
                        let findOrderIndex = cCartState.userData.orders.findIndex((ele) => ele.id === newData.id)

                        if (findOrderIndex !== -1) {
                            if (newData.status === "RECEIVED" || newData.status === "PROCESSING") {
                                state.userData.orders && state.userData.orders.splice(findOrderIndex, 1, newData)
                            }
                            else if (newData.status === "ON_TABLE") {
                                state.userData.orders && state.userData.orders.splice(findOrderIndex, 1)
                            }

                            else if (newData.status === "CANCELED") {

                                // // This is how we can delete one field from state of redux.
                                delete state.userData.singleCurrentOrder
                            }
                        }

                    }


                }
            })


    }

})



export const { setNotification, clearUnReadNotification, setClickedNotification, setCurrentOrderArr, getOrderUpdateAndShow } = userSlice.actions

export const userState = () => useSelector((state: RootState) => state.userRedcer)

export default userSlice.reducer




