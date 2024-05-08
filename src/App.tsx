import { HomePage } from "./Screens/HomePage"
import { Routes, Route, Link } from "react-router-dom"
import LoginScreen from "./Screens/LoginScreen"
import GoogleSuccessPage from "./components/Login/GoogleSuccessPage"
import { useEffect, useState } from "react"
import { ProductDetailScreen } from "./Screens/ProductDetailScreen"
import { useDispatch } from "react-redux"
import { AppDispatch } from "./store"
import { NotificationSingle, getOrderUpdateAndShow, getUserDataWithToken, setNotification, userState } from "./Slices/userSlice"
import Modal from "./components/Modal/Modal"
import { BillingPage } from "./Screens/BillingPage"
import { cartState, loadCartData } from "./Slices/cartSlice"
// import { ChefPage } from "./Screens/ChefPage"
import { UserPage } from "./Screens/UserPage"
import { ChefPage } from "./Screens/ChefPage"
import { CurrentOrder } from "./Screens/CurrentOrder"
import { v4 as uuid } from "uuid"
import io from 'socket.io-client';


// import useSound from 'use-sound';


import sound from "./sound/noti2.mp3";
import { addNewOrderByNoti } from "./Slices/chefSlice"
// import { AnyEvent } from "@google/model-viewer/lib/utilities"
import toast, { Toaster } from "react-hot-toast"
import { OrderSuccessPage } from "./Screens/OrderSuccessPage"


// // fn write to check only based on this ---> calling fetch user ---> in LocalHost also -->
export const gettingTokenInCookieAndLocalHost = () => {


  // // // Token var will load actual token --->
  let token: any = false;


  let checkInCookie = document.cookie
  let allCookies = checkInCookie.split(";")

  // console.log("token")


  for (let cookie of allCookies) {

    if (cookie.includes("token")) {

      let tokenArr = cookie.split("=")

      let actualToken = tokenArr[1]

      token = actualToken


      // console.log(token)


      break

    }

  }


  return token
}


// // // // Connection for socket io (providing extra info after comma to avoid CORS err)
// // // This socket io i'll use to send and recive notification ---->
// // // We can send data during connection (see the code)
export const socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
  transports: ['websocket'],
  withCredentials: true,
  reconnectionDelayMax: 10000,
  auth: {
    token: `${gettingTokenInCookieAndLocalHost()}`
  },
}); // Replace with your server URL




// // // Below fn() used to make notification format. 
// // // Making new notification in formate ---->
export function notificationFormateMaker(res: any) {
  let newNotification: NotificationSingle = {
    message: res.message || "Not Given",
    id: res.id || uuid(),
    notificationDate: res.notificationDate || Date.now(),
    orderId: res.orderId || "",
    isDeleted: res.isDeleted || false,
    isSeen: res.isSeen || false,
  }

  return newNotification
}



function App() {

  const dispatch = useDispatch<AppDispatch>()

  const { cartData } = cartState()

  const { notification } = userState()

  const [playNotiSound, setPlayNotiSound] = useState(false)


  function play() {
    let audio = new Audio(sound)
    audio.play().catch(error => console.error('Error playing the sound file:', error));
  }

  function showNewNotificationByRes(res: any) {

    // // // Add unRead messages length ------->
    // dispatch(setUnReadNotification(length))

    dispatch(setNotification(notificationFormateMaker(res)))


    // // // Show alert for new notification
    toast(`${res.message || "Message Not Given"}`,
      {
        icon: '🔔',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }
    );

  }


  // // // This useEffect is used to play the notification sound by state variable.
  useEffect(() => {
    if (notification.length > 0 && playNotiSound) {
      play()
      // setTimeout(() => {
      //   setPlayNotiSound(false)
      // }, 100)

    }
  }, [notification])


  // // // Below useEffect used in getting user data and seting cart data 
  useEffect(() => {

    // console.log("Call dispatch for home page ---->")

    // // // Calling user data if user login -->
    let checkToken = gettingTokenInCookieAndLocalHost()
    if (checkToken) {
      dispatch(getUserDataWithToken(checkToken))
    }



    // // // Load Cart data in slice --->
    let getCartDataFromLoacl = localStorage.getItem("AR_Cart")
    if (getCartDataFromLoacl) {
      dispatch(loadCartData(JSON.parse(getCartDataFromLoacl)))
    }

  }, [])


  // // // setting Cart data into backend ----------------->
  // // // If any change didect in cartData below code will add this into localHost ---->
  useEffect(() => {
    // if (cartData.length !== 0) {
    localStorage.setItem("AR_Cart", JSON.stringify(cartData))
    // }

  }, [cartData])


  // // // Socket IO connection code ---->
  // // // All Event listeners present here ------>
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server(web socket). 😊');
    });

    // // // User events ----->
    socket.on("order-received-done", (res: any) => {

      // console.log(res)

      // // now set notification should be an object --->

      // let newNotification: NotificationSingle = {
      //   message: res.message,
      //   id: res.id,
      //   notificationDate: res.notificationDate
      // }

      dispatch(setNotification(notificationFormateMaker(res)))
      // // // Add unRead messages length ------->
      // dispatch(setUnReadNotification(1))

    })

    socket.on("update-order-status-user", (res: any) => {

      // console.log(res)

      dispatch(getOrderUpdateAndShow(res.data))

      showNewNotificationByRes(res)
    })



    // // // Chef Events ------>
    socket.on("chef-order-recived", (res: any) => {


      // console.log(res)
      // console.log(res.data)

      // // // Call fn() to add data in chef 
      dispatch(addNewOrderByNoti(res.data))

      showNewNotificationByRes(res)

    })

    socket.on("update-order-status-chef", (res: any) => showNewNotificationByRes(res))



    return () => {
      socket.disconnect();
    };
  }, []);




  return (

    <div
      // // // Below onHover and state var both only user to prevent err to play notificaton ---->
      onMouseOver={() => setPlayNotiSound(true)}
    >


      {/* Component to show notification ---> */}
      <Toaster
        position="top-right"
        reverseOrder={false}
      />

      {/* Not working for now -----> */}
      {/* <button className=" relative z-50 px-5 py-1 bg-red-500  rounded mx-5 my-1">Send Message</button> */}

      {/* Above from routes will avilable for all pages ---> */}
      < Modal />


      <Routes >

        <Route
          path="/"
          element={<HomePage />}
        />


        <Route
          path="/login"
          element={<LoginScreen />}
        />


        {/* <Route
          path="/user-login/:token/newuser"
          element={<GoogleSuccessPage />}
        /> */}

        {/* Now below route using with query data --> */}

        <Route
          path="/user-login"
          element={<GoogleSuccessPage />}
        />


        <Route
          path="/product/:id"
          element={<ProductDetailScreen />}

        />


        <Route
          path="/billing"
          element={<BillingPage />}
        />


        <Route
          path="/profile"
          element={<UserPage />}
        />

        <Route
          path="/chef-page"
          element={<ChefPage />}
        />


        <Route
          path="/current-order"
          element={<CurrentOrder />}
        />


        <Route
          path="/orderSuccess"
          element={<OrderSuccessPage />}
        />

        {/* Not found Page ------> */}
        <Route
          path="*"
          element={
            <>
              <div
                style={{ height: "99vh" }}
                className=" flex flex-col justify-center items-center "
              >
                <h1 className=" text-center text-3xl text-red-500">Page not Found, Go to Home please.</h1>
                <Link to="/"><button className="border my-3 rounded text-white bg-green-500 px-2">Goto Home 🏠</button></Link>
              </div>
            </>
          }
        />



      </Routes>

    </div>

  )
}

export default App
