
// import React from 'react'

import { Link, Navigate, useNavigate } from "react-router-dom"
import { userState } from "../../Slices/userSlice"
import { OrderDataInterface } from "../../Slices/orderSlice"
import { useEffect } from "react"
import toast from "react-hot-toast"



// // // This fn() will handle logOut logic ---->
export const logOutHadler = () => {

    document.cookie = 'token=;'

    setTimeout(() => {

        location.reload()
    }, 1000)

}



const UserProfile = () => {

    const { userData } = userState()

    // console.log(userData)

    // // /// "If user is not login"
    if (!userData.firstName && !userData.lastName) {
        return <Navigate to={'/'}></Navigate>
    }


    return (
        <>
            <div className="w-full flex flex-col justify-center items-center bg-slate-800 min-h-screen">
                <div className=" w-full sm:w-4/6 h-4/6 bg-slate-900 text-white rounded border border-white flex flex-col items-center justify-center relative overflow-x-hidden overflow-y-auto ">

                    <img
                        src={userData.profilePic}
                        alt="user"
                        className=" border p-0.5 rounded-full"
                    />

                    <div>
                        <p>{userData.firstName} {userData.lastName}</p>
                    </div>

                    <p>{userData.email}</p>

                    <button
                        className=" bg-red-500 px-3 my-1 rounded-full"
                        onClick={() => { logOutHadler() }}
                    >Log Out</button>

                    <button
                        className=" border px-3 rounded-full absolute top-5 right-5"
                        onClick={() => { history.back() }}
                    >🔙Back</button>


                    {
                        userData.role === "chef"
                        &&
                        <div className=" my-10">
                            <p className=" bg-green-400 px-4 rounded font-bold">You are Chef</p>
                        </div>
                    }



                </div>


                <OldOrderDataUI />
            </div>

        </>
    )
}


export default UserProfile



const OldOrderDataUI = () => {

    const { userData } = userState()


    if (userData.orders && userData.orders?.length <= 0) return <h1> Not Previous order found. || 404</h1>


    return (
        <>

            <div
                // className=" mt-1 w-full sm:w-4/6 min-h-80 bg-slate-900 text-white rounded border border-white flex flex-col items-center justify-center relative overflow-x-hidden overflow-y-auto  "
                className=" my-10"
            >

                <h1 className=" text-center my-2 text-xl font-bold text-white underline">Your all orders</h1>


                <div
                    className=" text-white flex flex-wrap items-center justify-center gap-7 sm:px-36"
                >

                    {userData.orders?.map((ele) => {
                        return <SingleOrder ele={ele} key={ele.id} shouldNavigate={true} />
                    })}

                </div>


            </div>


        </>
    )
}



export function makeDateByDbStr(str: string): Date {
    return new Date(str)
}


export const SingleOrder = ({ ele, shouldNavigate = false, forChef = false }: { ele: OrderDataInterface, shouldNavigate?: boolean, forChef?: boolean }) => {


    const navigate = useNavigate()

    const { clickedNotification, userData } = userState()


    useEffect(() => {

        // console.log(ele)


        if ((ele.status === "RECEIVED" || ele.status === "PROCESSING") && shouldNavigate) {
            // alert("Goto current order page.")

            console.log("Goto current order page.")

            navigate('/current-order')
        }

    }, [ele])

    return (
        <div className={` ${userData.role === "chef" && "border"} bg-slate-800 flex flex-col rounded shadow-xl shadow-gray-600 hover:scale-110 sm:hover:-translate-y-5 transition-all`}>
            <div
                key={ele.id}
                className={` flex flex-col flex-wrap border rounded m-1 px-1 py-4 xxs:w-72
                    ${ele.status === "PROCESSING" ? "bg-orange-700" : ele.status === "ON_TABLE" ? ' bg-sky-700' : 'bg-emerald-700'}  


                    ${ele.id === clickedNotification && "ring-4 ring-red-500"}
                `}
            >
                <div className=" flex justify-between items-start">
                    <p className=" bg-orange-400 font-semibold px-1 sm:px-3 rounded">Table:{ele.tableNumber}</p>

                    <div className=" border-b flex  items-end ">
                        <p >{makeDateByDbStr(ele.orderDate).toLocaleTimeString()} | </p>
                        <p >{makeDateByDbStr(ele.orderDate).toLocaleDateString()}</p>
                    </div>
                </div>
                {/* <p>{makeDateAndTime(ele.orderDate)}</p> */}
                {/* <p>{makeDateAndTime(ele.preparationTime)}</p> */}
                {/* <p>{JSON.stringify(ele.cartData)}</p> */}



                <div className=" flex flex-wrap justify-center border-t mt-2">
                    <p className=" border-b text-center text-sm">Cart Data</p>
                    {
                        (ele.cartData.length > 0)

                        &&

                        ele.cartData.map((e, i) => {
                            return (
                                <div
                                    key={i}
                                    className=" bg-slate-800 border my-1 px-0.5 rounded relative w-full overflow-hidden xxs:w-4/5"
                                >

                                    <span className=" absolute -top-2 -left-1 border-2 border-yellow-500 px-1 rounded-full ">{i + 1}</span>

                                    <div className=" flex  justify-evenly">

                                        <p className=" capitalize">{e.name}</p>
                                        <p className=" capitalize">{e.category}</p>
                                    </div>

                                    <div className=" flex justify-center">

                                        <p
                                            className={`text-center border-b font-bold
                                                ${!e.isNonVeg ? "text-red-200 border-b-red-200" : "text-red-600 border-b-red-600"}
                                            `}
                                        >{!e.isNonVeg ? "Veg" : "Non-Veg"} </p>

                                        {/* <p>{e.quantity} X ₹{e.price}</p>
                                        <p>₹{e.quantity * e.price}</p> */}

                                    </div>

                                    <div className=" flex flex-wrap justify-between px-2">
                                        <p className=" capitalize">⁕{e.customizations.sizes[0].name || ""}</p>
                                        {/* <p className=" capitalize">At - ₹{e.customizations.sizes[0].additionalPrice}</p> */}

                                        {
                                            e.customizations.crusts[0]
                                            &&
                                            <p className=" capitalize">⁕⁕{e.customizations.crusts[0].name || ""}</p>
                                        }

                                    </div>

                                    {/* <p>{e.quantity} X ₹{e.price}</p>
                                    <p>₹{e.quantity * e.price}</p> */}

                                    {/* <p className=" capitalize">At - ₹{e.customizations.sizes[0].additionalPrice}</p>
                                    <p className=" capitalize">At - ₹{e.customizations?.crusts[0]?.additionalPrice}</p> */}



                                    {/* Price div ---> */}


                                    {

                                        !forChef
                                        &&
                                        <div className=" px-2 text-center">
                                            <p>
                                                ₹<span>{e.price - ((e.customizations.sizes[0]?.additionalPrice || 0) + (e.customizations.crusts[0]?.additionalPrice || 0))}</span>
                                                + ₹<span>{e.customizations.sizes[0].additionalPrice}</span>
                                                + <span>{e.customizations?.crusts[0]?.additionalPrice && `₹${e.customizations?.crusts[0]?.additionalPrice}`}</span>
                                                = ₹<span>{e.price}</span>
                                            </p>
                                        </div>
                                    }


                                    {/* 
                                    {
                                        e.customizations.crusts[0]
                                        &&
                                        <div className=" flex justify-between">
                                            <p className=" capitalize">{e.customizations.crusts[0].name || ""}</p>
                                        </div>
                                    }
                                    */}


                                </div>
                            )
                        })
                    }
                </div>


                <div className=" border-t flex  justify-between items-center px-1">

                    <p className=" text-center border-2 border-y-0 border-green-400 px-4 rounded my-1 font-bold">Status : {ele.status}</p>

                    {
                        !forChef
                        &&
                        <p className=" border-2 border-y-0 border-blue-400 px-2 sm:px-4 rounded">At :₹{ele.totalPrice}</p>
                    }

                </div>

                {/* <p className=" ">{makeDateAndTime(ele.orderDate)}</p> */}
                {/* Below update component should only show to chefs ---> */}


                {
                    ele.orderDate !== ele.preparationTime
                    &&
                    <p className=" text-center">Prepared At : {makeDateByDbStr(ele.preparationTime).toLocaleTimeString()}</p>
                }


            </div>



            {
                ele.status === "ON_TABLE"
                &&
                <>
                    <div className=" m-3 mt-0 border-t p-1 flex flex-col items-center">
                        <Link to={"/"}>
                            <button
                                className=" px-3 rounded bg-green-500 border font-bold"
                                onClick={() => { toast.error("Now we can show the billing page to user and also we can update status of order(status : order done).") }}
                            >Order Done ✅</button>
                        </Link>
                    </div>
                </>
            }


        </div>
    )
}


