// import React from 'react'

import { useEffect } from "react"
import toast from "react-hot-toast"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { createBody, createOrder, orderState } from "../Slices/orderSlice"
import { v4 as uuid } from 'uuid';
import { useDispatch } from "react-redux";
// import { cartState } from "../Slices/cartSlice";
import { userState } from "../Slices/userSlice";
import { AppDispatch } from "../store";

export const OrderSuccessPage = () => {

  const query = useSearchParams()[0]

  // console.log(query.get("orderId"))

  let orderId = query.get("orderId")
  const dispatch = useDispatch<AppDispatch>()
  // const { cartData, totalPrice } = cartState()
  const { userData } = userState()
  const { isLoading } = orderState()
  const navigate = useNavigate()


  useEffect(() => {

    if (isLoading) navigate("/")

  }, [isLoading])


  useEffect(() => {

    if (orderId) {

      fetch(`${import.meta.env.VITE_BACKEND_URL}/checkPayment?orderId=${orderId}`)
        .then((res: any) => {
          res.json()
            .then((data: any) => {

              if (data.status) {
                // // // create order here ---------->

                let getDataFromLoacal = localStorage.getItem("saveCart")

                if (getDataFromLoacal) {

                  const {cartData , totalPrice } = JSON.parse(getDataFromLoacal)

                  let orderBody: createBody = {
                    id: uuid(),
                    cartData: cartData,
                    tableNumber: 5,
                    totalPrice: totalPrice,
                    userId: userData.id,
                    status: "RECEIVED"
                  }

                  dispatch(createOrder(orderBody))
                }



              } else {
                toast.error(`ERROR : ${data.message || "Error"}`)
              }

            })
        })
        .catch((err: any) => {
          toast.error(`${JSON.stringify(err) || "Error"}`)
        })
    }


  }, [orderId])

  return (
    <div className="w-full h-[100vh] flex justify-center items-center">

      <div className=" flex flex-col items-center justify-center">
        <h1 className=" text-4xl">✅</h1>
        <h2 className=" text-2xl font-bold">Order Success</h2>
        <p className=" text-base">Order Id {orderId}</p>
        <Link
          to={'/'}
          className="px-2 border rounded-md font-semibold"
        >Home</Link>
      </div>

    </div>
  )
}
