
// import React from 'react'

import { Fragment, useState, } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { CardDataInter, addItemInCart, cartState, removeItemsInCart, toggleOpenCart } from '../../Slices/cartSlice'
import { useDispatch } from 'react-redux'
import { gettingTokenInCookieAndLocalHost } from '../../App'
import toast from 'react-hot-toast'
import { userState } from '../../Slices/userSlice'



// // // Here declearing Razorpay is presnt with any after attaching script tag in head of html ------------>
declare global {
    interface Window {
        Razorpay: any;
    }
}





function CartLeftSection() {

    // const [openCart, setOpenCart] = useState(true)

    const { openCart, cartData, totalPrice } = cartState()

    const { userData: { firstName, lastName, email } } = userState()

    const dispatch = useDispatch()

    const setOpenCart = (newVal?: boolean) => (dispatch(toggleOpenCart(newVal ? newVal : !openCart)))

    const themeMode = false


    const [isLoading, setIsLoading] = useState(false)


    async function checkOutHandler() {

        // console.log(totalPrice)

        if (isLoading) return

        setIsLoading(true)

        try {


            let apiKey = null;

            let getKey = await fetch(`${import.meta.env.VITE_BACKEND_URL}/getApiKey`,
                {
                    headers: {
                        'token': gettingTokenInCookieAndLocalHost()
                    }
                })

            let keyData = await getKey.json()

            // console.log({ keyData })

            if (!keyData.status) return toast.error(`${keyData.message} | ERROR`)

            if (keyData.status) {
                apiKey = keyData.key
            }


            // // // Now set data in localHost ------>
            localStorage.setItem('saveCart', JSON.stringify({ cartData, totalPrice }))




            const checkouRequest = await fetch(`${import.meta.env.VITE_BACKEND_URL}/checkout`,
                {
                    body: JSON.stringify({ amount: totalPrice }),
                    method: "POST",
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        "token": `${gettingTokenInCookieAndLocalHost()}`
                    }
                })


            let checkouData = await checkouRequest.json()

            // console.log(data)

            if (!checkouData.status) return toast.error(`${checkouData.message} | ERROR`)


            // // // RazorPay checkOut handler here ------------------>

            const options = {
                key: apiKey,
                amount: checkouData.order.amount,
                currency: "INR",
                name: "Ar Menu",
                description: "Test payment for Ar menu Mern App.",
                image: "https://res.cloudinary.com/dlvq8n2ca/image/upload/v1701708322/jual47jntd2lpkgx8mfx.png",
                order_id: checkouData.order.id,
                callback_url: `${import.meta.env.VITE_BACKEND_URL}/verifyPayment`,
                prefill: {
                    name: `${firstName} ${lastName}`,
                    email: `${email}`,
                    contact: "9000090000"
                },
                theme: {
                    "color": "#474747"
                },
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.open()


        }
        catch (err) {
            toast.error(JSON.stringify(err))
        }
        finally {
            setIsLoading(false)
        }

    }





    return (
        <div
        >
            <Transition.Root show={openCart} as={Fragment}>
                <Dialog as="div" className="relative z-40" onClose={setOpenCart}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-40 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >

                            {/* Belw div  used to show filter in mobile or less then leptop */}
                            <Dialog.Panel className={` z-50 relative ml-auto px-1 flex h-full  sm:w-full  sm:max-w-xs  flex-col overflow-y-auto  py-4 pb-12 shadow-xl ${!themeMode ? "bg-white text-gray-600 " : 'bg-black text-gray-300 '} `}>

                                <div className="flex items-center justify-between px-4">

                                    <div>

                                        <h2 className="text-xl  font-bold ">Your Cart</h2>
                                        {
                                            cartData.length > 0
                                            &&
                                            <h4 className=' font-semibold text-xs text-black/50'>{cartData.length} Items</h4>

                                        }
                                    </div>

                                    {/* First btn is not used ------->  */}
                                    <button
                                        type="button"
                                        className=' sr-only'
                                    >
                                        <span className="sr-only">Close menu</span>
                                        <XMarkIcon className="h-6 w-6 " aria-hidden="true" />

                                    </button>

                                    <button
                                        type="button"
                                        className="flex h-6 w-6 items-center justify-center rounded-full !border-0"
                                        onClick={() => setOpenCart(false)}
                                    >
                                        <span className="sr-only">Close menu</span>
                                        <XMarkIcon className="h-6 w-6 " aria-hidden="true" />

                                    </button>
                                </div>


                                {/* Actual card will place here --------> */}

                                {
                                    cartData.length > 0
                                        ?

                                        <div className=' flex flex-col mt-7'>

                                            {
                                                cartData.map((ele, i) => {
                                                    return <SingleCartItem key={i} cardItem={ele} />
                                                })
                                            }

                                            <button
                                                className=' mx-auto mt-5 bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-600 hover:to-orange-400 text-white my-1 py-3 px-7 rounded-full shadow-md font-semibold hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50'
                                                onClick={() => checkOutHandler()}
                                            >Place Order • ₹{totalPrice}</button>

                                        </div>

                                        :

                                        <div className=' flex flex-col items-center mt-10 mx-2 sm:mx-5 lg:mx-7'>

                                            <img src="https://www.freshmenu.com/pages/menu/images/ghost1.1.svg" alt="Empty" />

                                            <h3 className=' text-center text-xl font-semibold'>Your cart is empty.</h3>

                                            <h4
                                                className=' text-sm text-center'
                                            >Add some delicious food items.</h4>

                                            <button
                                                className=' mt-5 bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-600 hover:to-orange-400 text-white my-1 py-1 px-6 rounded shadow-md font-semibold hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50'
                                                onClick={() => setOpenCart(false)}
                                            >Browse Food</button>
                                        </div>
                                }

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>



        </div >
    )
}

export default CartLeftSection






function SingleCartItem({ cardItem }: { cardItem: CardDataInter }) {


    const dispatch = useDispatch()



    const decreaseQuaOfItem = () => {

        if (cardItem.quantity > 1) {

            dispatch(addItemInCart({ ...cardItem, quantity: - 1 }))
        } else {
            dispatch(removeItemsInCart(cardItem))
        }


    }

    const increaseQuaOfItem = () => {
        dispatch(addItemInCart({ ...cardItem, quantity: 1 }))
    }



    return (
        <>

            <div
                className=' w-full flex items-start justify-around sm:justify-start flex-wrap gap-1.5 px-1 mb-5 mx-auto'
            >

                <div className='  w-[10%] '>

                    <div
                        className={`h-4 w-4 border flex items-center justify-center ${cardItem.isNonVeg ? " border-red-500" : " border-green-500"} `}
                    >

                        <span className={`h-2 w-2 rounded-full ${cardItem.isNonVeg ? " bg-red-500" : " bg-green-500"}`}></span>

                    </div>

                </div>


                <div className='w-[60%] text-start  -mt-1.5 '>
                    <p className=' capitalize'>
                        {cardItem.name}
                    </p>
                    <p
                        className=''
                    >₹{cardItem.price * cardItem.quantity}</p>
                </div>

                <div className='w-[45%] sm:w-[25%]'>

                    <div className='border mx-1 px-2 py-1 rounded-full flex justify-between '>
                        <span
                            className=' font-bold hover:scale-125 active:scale-75 hover:cursor-pointer'
                            onClick={() => { decreaseQuaOfItem() }}
                        >-</span>
                        <span>{cardItem.quantity}</span>
                        <span
                            className=' font-bold hover:scale-125 active:scale-75 hover:cursor-pointer'
                            onClick={() => { increaseQuaOfItem() }}
                        >+</span>
                    </div>


                    {
                        cardItem.quantity > 1
                        &&
                        <div>
                            <span className=' text-center text-xs'> ₹{cardItem.price} / Item</span>
                        </div>
                    }

                </div>

            </div >


        </>
    )
}



