

// import React from 'react'

import { useEffect } from "react"
import { getUserDataWithToken, setCurrentOrderArr, userState } from "../../Slices/userSlice"
import { SingleOrder, logOutHadler } from "../UserProfile/UserProfile"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { gettingTokenInCookieAndLocalHost } from "../../App"
import { AppDispatch } from "../../store"
import { LoaderCircle } from "../LoaderCircle/LoaderCircle"


const CurrentOrderComp = () => {

    const dispatch = useDispatch<AppDispatch>()

    const navigate = useNavigate()

    const { userData, isLoading } = userState()

    const currentOrderArr = userData.currentOrderArr

    useEffect(() => {

        if (userData.orders && userData.orders?.length > 0) {

            let currentOrders = userData.orders.filter((ele) => {
                if (ele.status === "RECEIVED" || ele.status === "PROCESSING") {
                    return ele
                }
            })

            // console.log(currentOrders)

            // // // Here i'm current order arr ---->
            dispatch(setCurrentOrderArr(currentOrders))
        }
    }, [userData.orders])



    if (currentOrderArr && currentOrderArr.length <= 0) {
        return (
            <>

                <div
                    className="w-full flex flex-col items-center pt-40 bg-slate-800 text-white min-h-screen"
                >
                    <h1> Not Previous order found. || 404</h1>
                    <Link to={"/profile"}>

                        <button className=" mt-5  border rounded px-3 ">Goto Profile</button>

                    </Link>

                </div>

            </>
        )
    }


    return (
        <>

            <div
                className="w-full flex flex-col justify-center items-center bg-slate-800 text-white min-h-screen relative"
            >

                <LoaderCircle isLoading={isLoading} />

                <button
                    className=" font-semibold text-sm px-3 rounded border absolute right-2 top-2"
                    onClick={() => { dispatch(getUserDataWithToken(gettingTokenInCookieAndLocalHost())) }}
                >↻Refresh</button>

                <div
                    // className=" mt-1 w-full sm:w-4/6 min-h-80 bg-slate-900 text-white rounded border border-white flex flex-col items-center justify-center relative overflow-x-hidden overflow-y-auto  "
                    className="my-10"

                >

                    <h1 className=" text-center my-2 text-xl font-bold text-white underline">Your all Current orders</h1>


                    <div

                        style={{ minHeight: "65vh" }}
                        className="text-white  flex flex-wrap gap-5 items-center justify-center"
                    >

                        {userData.currentOrderArr?.map((ele) => {
                            return <SingleOrder key={ele.id} ele={ele} />
                        })}

                    </div>


                    <div className=" mt-5 flex justify-center flex-col items-center">
                        <p
                            className=" border px-2 rounded text-lg font-bold hover:bg-green-500 "
                            onClick={() => { navigate("/profile") }}
                        >See all orders</p>

                        <p
                            className=" border px-2 ml-auto mt-5 mr-3 rounded text-sm font-bold bg-red-500 "
                            onClick={() => { logOutHadler(); navigate("/"); }}
                        >LogOut</p>
                    </div>
                </div>

            </div>


        </>
    )
}

export default CurrentOrderComp
