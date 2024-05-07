// import React from 'react'

import { Navigate } from "react-router-dom"
import { setNotification, userState } from "../../Slices/userSlice"
import AllCurrentOrder from "./AllCurrentOrder"
import { useEffect } from "react"
import { notificationFormateMaker, socket } from "../../App"
import { useDispatch } from "react-redux"



export const ChefComp = () => {

  const { userData } = userState()

  const dispatch = useDispatch()



  useEffect(() => {

    // // // Chef events for ntification --------->

    // if (userData.role === "chef") {


    socket.on("chef-order-recived", (res) => {
      dispatch(setNotification(notificationFormateMaker(res)))
    })


    return () => {
      socket.disconnect();
    };

    // }

  }, [])



  // // // If user role is not chef then send him/her to home screen.
  if (userData.role !== "chef") return <Navigate to={"/"} />



  return (
    <>

      <div className=" w-full h-screen ">

        <AllCurrentOrder />

      </div>

    </>
  )
}
