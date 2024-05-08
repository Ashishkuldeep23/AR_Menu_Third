
// import React from 'react'

import { Link, useLocation, useNavigate } from "react-router-dom"
import { NotificationSingle, clearUnReadNotification, setClickedNotification, updateManyNotiToSeen, userState } from "../../Slices/userSlice"
import { Fragment, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../store"
import toast from "react-hot-toast"
import CartLeftSection from "../Cart/CartLeft"
import { toggleOpenCart } from "../../Slices/cartSlice"
// import { socket } from "../../App"
// import { useDispatch } from "react-redux"


export const Navbar = () => {

    const dispatch = useDispatch()

    const navigate = useNavigate()

    const userData = userState().userData

    const location = useLocation()

    // console.log(location);





    useEffect(() => {

        if (userData.role === "chef") {

            // console.log(location.pathname)
            // console.log(`${location.pathname}` === '/')

            navigate("/chef-page")
        }

    }, [userData])



    return (
        <div
            className=" w-full fixed top-0 z-10  bg-themeColor border-b "
        >


            <div className="md:px-[5vh] lg:px-[23vh]">



                {/* cart Section -----------> */}
                <CartLeftSection />


                <div className="w-full h-16 flex  items-center z-10 relative">
                    {/* Home div */}
                    <div className=" my-auto mr-auto ml-5 hover:scale-110 hover:cursor-pointer transition-all">
                        <Link to='/'>
                            <p
                                style={{ fontFamily: "cursive , serif" }}
                                className=" text-2xl font-bold text-white tracking-widest border-b-2"
                            >ArMenu</p>
                        </Link>
                    </div>



                    <div className="flex justify-between items-center gap-2 sm:gap-5 my-auto ml-auto mr-5">

                        {/* Ball icon, user notification div here ---> */}



                        {/* Cart icon ------->*/}
                        <div
                            className="  hover:scale-125  hover:cursor-pointer transition-all"
                            onClick={() => dispatch(toggleOpenCart(true))}
                        >
                            <i className="ri-shopping-cart-line text-white text-xl   p-1.5 rounded-full hover:border"></i>
                        </div>

                        <div className="  hover:scale-125  hover:cursor-pointer transition-all">

                            <Notification />
                        </div>

                        {/* User image div */}
                        <div className="  hover:scale-125 hover:cursor-pointer transition-all">



                            <Link to={userData.firstName ? "/profile" : "/login"}>
                                <img

                                    onError={(event) => {
                                        event.currentTarget.src = "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1700368567/ej31ylpxtamndu3trqtk.png"
                                        event.currentTarget.onerror = null;
                                    }}

                                    // onClick={()=>{userData.firstName ? "" : navigate("/login")}}
                                    className=" h-12 rounded-full border"
                                    src={userData.profilePic}
                                    alt=""

                                />
                            </Link>
                        </div>


                    </div>


                </div>



                {/* <div className=""> */}

                {
                    (userData.role === "chef" && location.pathname !== "/chef-page")
                    &&

                    <div className=" sticky top-0 left-1/2 z-5 flex  justify-center">
                        <button
                            className=" bg-sky-200/50 backdrop-blur-3xl capitalize font-bold  my-0.5  px-4 py-0.5 border  border-sky-400 text-sky-950 rounded-full "
                            onClick={() => { navigate("/chef-page") }}
                        >Goto chef Page</button>
                    </div>

                }
                {/* </div> */}

            </div>

        </div>

    )
}


function Notification() {

    const { notification, unReadNotification } = userState()

    // const dispatch = useDispatch()

    // const [navigation, setNotification] = useState<string[]>([])


    // useEffect(() => {




    //     // socket.on("chef-order-recived", (res) => {
    //     //     console.log(res)
    //     //     console.log(res.message)
    //     //     dispatch(setNotification(`${res.message}`))
    //     // })



    //     return () => {
    //         socket.disconnect();
    //     };

    // }, [])



    return (


        <Menu as="div" className="relative ml-1 ">
            <div>
                <Menu.Button
                    className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    {/* <img
                            className="h-8 w-8 rounded-full object-cover"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrbCy3v0RZ0RS8uhjD6elbAFBqQntE31uk2VoMYnPlmMkJLXQRI-gEdmsNZoZy23-NUW8&usqp=CAU"
                            alt=""
                        /> */}

                    {/* Bell icon  */}
                    <i className="ri-notification-3-line text-white text-xl px-2 py-1 rounded-full hover:border"></i>

                    {
                        unReadNotification > 0
                        &&

                        <span
                            className=" absolute -top-2 -left-2 font-bold inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs text-red-600 ring-1 ring-inset ring-gray-500/10 "
                        >{unReadNotification}</span>

                    }


                </Menu.Button>

            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    className="absolute -right-5 z-20 mt-2 w-48 origin-top-right rounded-md bg-white pt-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >

                    <div className=" z-20 relative">


                        <ul>

                            {
                                notification.length > 0
                                    ?
                                    notification.map((ele, i) => {
                                        return <SingleNotificatinUI ele={ele} key={ele.id} i={i} />
                                    })


                                    :
                                    <Menu.Item>
                                        <li

                                            className={'block px-4 py-2 text-sm text-gray-700 '}
                                        >
                                            No notification.
                                        </li>

                                    </Menu.Item>
                            }

                        </ul>


                    </div>


                </Menu.Items>
            </Transition>
        </Menu >


    )
}


const SingleNotificatinUI = ({ ele }: { ele: NotificationSingle, i?: number }) => {

    const { userData, unReadNotification } = userState()

    // // // Creating indicator values for unRead Msgs ---->
    // const [unReadNums, setUnReadNums] = useState(0)

    const navigate = useNavigate()

    const dispatch = useDispatch<AppDispatch>()


    function getNotiDate(str: string) {

        let date = new Date(str)
        // console.log(date)
        return `${date.getHours()}:${date.getMinutes()} - ${date.toDateString()} `
    }


    function singleNoticlickHandler(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
        e.preventDefault()
        e.stopPropagation()

        // // // TODO here if current order have (then send into /current-order or send into /profile page)
        // // // For that we have to create a state in redux.(and used like that)



        if (userData.role === "chef") {
            navigate("/chef-page")
        }
        else if (ele.orderId) {

            // // // navigate user to profile ----------------->

            if (userData.currentOrderArr && userData.currentOrderArr.length > 0) {

                navigate("/current-order");
            } else {
                navigate("/profile");
            }

            dispatch(setClickedNotification(ele.orderId))
        } else {
            toast.error("Order id is not attached with this notification.")
        }
    }


    useEffect(() => {


        // // // Here setting all unRead values that we ge ---->
        // setUnReadNums(unReadNotification)
        // console.log(unReadNotification)
        // console.log(0)

        if (unReadNotification > 0) {

            // // // Here clearning all unread msg nums  --->
            dispatch(updateManyNotiToSeen())
            dispatch(clearUnReadNotification())
        }


    }, [])


    return (
        <Menu.Item>
            <li

                className={`px-4 py-2 text-sm text-gray-700 relative flex flex-col border-b active:bg-red-100 ${!ele.isSeen && 'bg-emerald-100'}`}
                onClick={(e) => singleNoticlickHandler(e)}
            >
                {ele.message}
                <span className=" mx-auto text-xs">At: {getNotiDate(ele.notificationDate)}</span>

                {
                    !ele.isSeen
                    &&
                    <span className=" text-red-500 absolute right-3 font-bold">৹</span>

                }
            </li>

        </Menu.Item>
    )
}
