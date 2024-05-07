import './style.css'
import { Fragment, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { AppDispatch } from "../../store"
import { TypeCustomizationsObj, TypeSingleProduct, fetchAllProduct, fetchOneProduct, productState } from "../../Slices/productSlice"
import { removerUnderScore } from "../All_products/Single_product"
import { ModelViewer } from "../ModelViewer/ModelViewer"
// import QRCodeGenerator from "../QrGenerator/QrGenerator"      // // Not using this component for now.

import { setChildrenModal, setOpenMoadl } from "../../Slices/ModalSlice"
import { CardDataInter, addItemInCart, cartState, setItemsClicked } from "../../Slices/cartSlice"
import { v4 as uuid } from 'uuid';
import { CartData, ConfirmOrderWithTable, DummyCartUI } from '../BillComp/BillComponent'
import { LoaderCircle } from '../LoaderCircle/LoaderCircle'
import toast from 'react-hot-toast'
import { setClickedNotification, userState } from '../../Slices/userSlice'
import { makeDateByDbStr } from '../UserProfile/UserProfile'
import { OrderStatusOptions } from '../../Slices/orderSlice'
import { socket } from '../../App'
import { UpdateOrderChefBody, updateOrderStatusChef } from '../../Slices/chefSlice'



const ProductDetail = () => {

    // const navigate = useNavigate()

    const item = productState().currenProduct

    const isLoading = productState().isLoading

    const { cartData } = cartState()

    const params = useParams()

    const dispatch = useDispatch<AppDispatch>()


    // // // This var is only used to show when used click to add into cart -->
    const [showSizingPart, setShowSizingPart] = useState(false)


    // // // cart variables starts here --->
    const [choossenCustomizations, setChoossenCustomizations] = useState<TypeCustomizationsObj>({ sizes: [], crusts: [] })


    type SelectedType = {
        sizes: number, crusts: number
    }

    const [selectedIndex, setSelectedIndex] = useState<SelectedType>({ sizes: 0, crusts: -1 })

    const [totalPriceOfItem, setTotalPriceOfItem] = useState(item.price)

    const [quantityOfProduct, setQuantityOfProduct] = useState<number>(1)


    function customizeClickHandler(key: string, name: string, additionalPrice: number, i: number) {

        // console.log(key, name, additionalPrice)

        // // // Set choossenCustomizations OBJ after click read --->
        setChoossenCustomizations({ ...choossenCustomizations, [key]: [{ name: name, additionalPrice: additionalPrice }] })

        // selectedIndex


        // // // Here set Index Number according to fiels click ---->

        setSelectedIndex({ ...selectedIndex, [key]: i })

        // if (key === "sizes") {
        //     setSelectedIndex({ ...selectedIndex, sizes: i })
        // }

        // if (key === "crusts") {
        //     setSelectedIndex({ ...selectedIndex, crusts: i })

        // }

    }



    function addToCartHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {

        e.stopPropagation()


        // console.log(choossenCustomizations)



        if (choossenCustomizations.sizes.length === 0 && choossenCustomizations.crusts.length === 0) {

            return toast.error("Choose something first ---->")
        }



        const { id, name, category, isNonVeg } = item

        let sendCartData: CardDataInter = { id, name, category, isNonVeg: isNonVeg || false, customizations: choossenCustomizations, quantity: quantityOfProduct, price: totalPriceOfItem }

        console.log(sendCartData)

        dispatch(addItemInCart(sendCartData))


        // // // BACK TO NORMAL ( cart states ) ---->
        // setChoossenCustomizations()

        const nameOfSize = item.customizations?.sizes[0]?.name || ''
        const additionalPriceOfSize = item.customizations?.sizes[0]?.additionalPrice || 0


        if (nameOfSize || additionalPriceOfSize) {

            setChoossenCustomizations({ sizes: [{ name: nameOfSize, additionalPrice: additionalPriceOfSize }], crusts: [] })

        }

        // // // These value used for this component only -------------------->
        setSelectedIndex({ sizes: 0, crusts: -1 })
        setTotalPriceOfItem(item.price)
        setQuantityOfProduct(1)

    }



    function addHandlerNew() {


        const { id, name, category, isNonVeg } = item

        if (item.customizations) {

            let sendCartData: CardDataInter = {
                id, name, category,
                isNonVeg: isNonVeg || false,
                customizations: { sizes: [{ ...item.customizations.sizes[0] }], crusts: [] },
                quantity: 1,
                price: item.price
            }

            console.log(sendCartData)

            dispatch(addItemInCart(sendCartData))
        }



    }




    function cartItemsNameFormate(name: string) {

        return <><span className=" text-xl font-medium font-serif">{name[0]}</span><span>{name.substring(1)}</span></>

    }



    // // // Below fn used to show modal with cart value and select table no. ------>
    // // // Below fn used in two componentes thats why present in parent comp --->
    function onClickHandlerSendKitchen() {

        // // This var will hold innerHTMl structure --->
        let innerHTML;

        if (cartData.length <= 0) {
            innerHTML = <DummyCartUI withModal={true} />
        }

        // // // Model actual UI ---->
        else {
            innerHTML = <div>
                <CartData removeSingleItem={true} showBilling={false} />
                <ConfirmOrderWithTable />
            </div>
        }

        dispatch(setOpenMoadl(true))
        dispatch(setChildrenModal(innerHTML))
    }


    // // Update total price of item ---->
    useEffect(() => {

        if (choossenCustomizations.sizes.length !== 0 || choossenCustomizations.crusts.length !== 0) {
            // toast.error()

            // if(choossenCustomizations.sizes.length > 0){

            //     let add = choossenCustomizations?.sizes[0]?.additionalPrice

            //     setTotalPriceOfItem(item?.price + +(add) + +choossenCustomizations?.crusts[0]?.additionalPrice || 0)
            // }

            // if(choossenCustomizations.crusts.length > 0){

            //     let add = choossenCustomizations?.crusts[0]?.additionalPrice

            //     setTotalPriceOfItem(item?.price + +(add) + +choossenCustomizations?.sizes[0]?.additionalPrice || 0)
            // }



            let allAdditionalPrice = 0;

            for (let key in choossenCustomizations) {
                // console.log(key)

                let value = choossenCustomizations[key as keyof TypeCustomizationsObj]

                if (value.length > 0) {
                    allAdditionalPrice += +value[0]?.additionalPrice
                }

            }

            // console.log(allAdditionalPrice)

            setTotalPriceOfItem(item.price + +allAdditionalPrice)

        }

    }, [choossenCustomizations])



    // // // set the new price on refresh -->
    useEffect(() => {
        // console.log(item)


        // // // Updating Price ---->
        if (item.customizations?.sizes[0]) {
            setTotalPriceOfItem(item.customizations?.sizes[0].additionalPrice + item.price)
        } else {
            setTotalPriceOfItem(item.price)
        }



        if (item?.customizations?.sizes.length !== 0 && item?.customizations?.crusts.length !== 0) {

            // // // Update choosenCat obj --->
            const nameOfSize = item.customizations?.sizes[0]?.name || ''

            const additionalPriceOfSize = item.customizations?.sizes[0]?.additionalPrice || 0


            if (nameOfSize || additionalPriceOfSize) {

                // setChoossenCustomizations({ ...choossenCustomizations, sizes: [{ name: nameOfSize, additionalPrice: additionalPriceOfSize }] })


                setChoossenCustomizations({ crusts: [], sizes: [{ name: nameOfSize, additionalPrice: additionalPriceOfSize }] })


                // //  update index also ---->
                setSelectedIndex({ sizes: 0, crusts: -1 })
            }

        } else {

            setChoossenCustomizations({ sizes: [], crusts: [] })
        }


    }, [item])



    // // // On page refresh code --->
    useEffect(() => {

        const { id } = params


        // console.log("LOG", item)
        // console.log("LOG", id)


        if (id) {
            // console.log(id)

            // // Get single food -->
            dispatch(fetchOneProduct(id))

            // // Get all foods -->
            dispatch(fetchAllProduct())

        } else {
            toast.error("ID not getting from url bar.")
        }



        // // // Scroll window ---->
        window.scroll(0, 0)



    }, [])




    return (
        <>

            {/** Loading component ---->  */}
            <LoaderCircle isLoading={isLoading} />

            {/* <p className=' text-4xl'>{item.timeRequired && item.timeRequired}</p> */}

            <div className="flex flex-col justify-center items-center text-center rounded mx-1 my-5 pb-24">

                {/* md is breakpoint for leptop and mobile ----> */}
                <div className=" mt-20 border rounded flex justify-between items-center flex-col md:flex-row w-full md:w-4/5">

                    <ModelViewer item={item} />

                    <div className=" w-full md:w-1/4 flex items-center justify-center flex-col-reverse md:flex-col">


                        {/* Generate qr --> Not using now, */}
                        {/* <div className="my-4 py-4 border-t md:border-b md:border-t-0 ">

                            <p className=" mb-1.5">Scan QR👇</p>

                            <QRCodeGenerator />

                        </div> */}


                        {/* Curent order info div ----> */}
                        <CurrentSigleOrderDiv />


                        {/* Main UI with details (Option div) --> */}
                        <div className="w-full md:h-60  md:overflow-y-scroll">


                            {/* Here give the toggel UI (Var) */}
                            {
                                !showSizingPart

                                    ?

                                    // // // Default this will visiable --->
                                    <div>

                                        {/* Starts div --> */}
                                        <div>
                                            <p className=" my-1 text-xs shadow-lg inline-flex px-1 py-0.5 rounded-md">⭐⭐⭐⭐⭐</p>
                                        </div>

                                        {/* Discription div --> */}
                                        <div >

                                            {/* item name div with all styles  */}

                                            <NameWithLeftRight />


                                            {/* <Link to={`/product/${item.id}`}> */}
                                            {/* <button
                                        className="border my-1 px-4 rounded font-bold text-white bg-blue-600 hover:bg-blue-400"
                                            >Product details</button> */}
                                            {/* </Link> */}
                                            {/* <p style={{ lineBreak: "anywhere" }} >{item.description}</p> */}


                                            {/* Pice div */}
                                            <div>

                                                <p
                                                    className="bg-orange-400 inline-flex gap-0.5 px-4 py-1 rounded shadow-md text-white border font-bold  font-serif hover:scale-x-125 hover:scale-y-110 hover:cursor-pointer transition-all"
                                                    onClick={() => {
                                                        addHandlerNew()

                                                        // Now using now --------->
                                                        // setShowSizingPart(!showSizingPart)
                                                    }}
                                                >
                                                    {/* <span className=" text-xs">₹</span>
                                                    {totalPriceOfItem || '000'} ADD */}


                                                    <span className=" text-xs">₹</span>
                                                    <span>{totalPriceOfItem || '000'} {" "}</span>
                                                    <span> ADD</span>
                                                </p>

                                            </div>

                                            {/* <p>Some details</p> */}

                                        </div>

                                    </div>

                                    :

                                    // // // Once user click add then show the option and all --->
                                    <div className=" relative w-full px-2 my-3  bg-gray-200 text-start">

                                        <button
                                            className=" absolute -top-6 left-0 border-2 bg-white mt-1 p-1 rounded-full"
                                            onClick={() => { setShowSizingPart(!showSizingPart) }}
                                        >🔙</button>


                                        {/* <p>Selected option : {JSON.stringify(choossenCustomizations)}</p> */}
                                        <p className=" text-center  font-semibold capitalize"><span>{choossenCustomizations?.sizes[0]?.name}</span>/<span>{choossenCustomizations?.crusts[0]?.name}</span> </p>
                                        <p className="font-semibold text-center">Total Pric of item : ₹{totalPriceOfItem}</p>


                                        {
                                            item.customizations
                                            &&
                                            Object.keys(item?.customizations).map((ele) => {
                                                return <div key={uuid()} className=" my-2  rounded w-full  bg-white shadow-md shadow-gray-700">

                                                    {/* Heading --> */}
                                                    <p className=" px-1 flex flex-col border-b-2 border-gray-200 relative">
                                                        <span className="text-xl capitalize">{ele}</span>
                                                        {/* <span className="text-xs capitalize">Select one</span> */}


                                                        {

                                                            ele === "sizes"
                                                                ?

                                                                choossenCustomizations?.sizes?.length <= 0
                                                                &&
                                                                <span className="text-xs capitalize">Select one</span>

                                                                // <span className=" absolute right-2 bottom-2 capitalize">{choossenCustomizations?.sizes[0]?.name}</span>

                                                                :
                                                                choossenCustomizations?.crusts?.length <= 0
                                                                &&
                                                                <span className="text-xs capitalize">Select one</span>

                                                        }


                                                        {

                                                            ele === "sizes"
                                                                ?

                                                                <span className=" absolute right-2 bottom-0 capitalize">{choossenCustomizations?.sizes[0]?.name}</span>

                                                                :
                                                                <span className="absolute right-2 bottom-0 ">
                                                                    <span className=" capitalize">{choossenCustomizations?.crusts[0]?.name}</span>

                                                                    {
                                                                        choossenCustomizations?.crusts[0]?.name
                                                                        &&
                                                                        <span
                                                                            // // // remove crusts (Back to normal here ) --->
                                                                            onClick={(e) => { e.stopPropagation(); setSelectedIndex({ ...selectedIndex, crusts: -1 }); setChoossenCustomizations({ ...choossenCustomizations, crusts: [] }) }}
                                                                            className=" ml-3 px-1 rounded font-bold text-white bg-red-500 hover:bg-red-300"
                                                                        >X</span>
                                                                    }

                                                                </span>

                                                        }


                                                    </p>

                                                    {/* Alll Avilable option will shown here --> */}
                                                    <div className=" px-10 flex justify-evenly">
                                                        {/* Options map on given arr */}

                                                        {

                                                            item?.customizations
                                                                &&

                                                                item?.customizations[ele as keyof TypeCustomizationsObj].length > 0
                                                                ?
                                                                item?.customizations[ele as keyof TypeCustomizationsObj].map((el, i) => {
                                                                    return <div
                                                                        key={uuid()}
                                                                        className={` text-center ${ele === "sizes" ? (i === selectedIndex.sizes) && "text-orange-400" : (i === selectedIndex.crusts) && "text-orange-400"}  `}
                                                                        onClick={() => { customizeClickHandler(ele, el.name, el.additionalPrice, i) }}
                                                                    >
                                                                        <p className="capitalize px-0.5">{el.name || "Regular"}</p>
                                                                        <p
                                                                            className=" font-serif  font-bold"
                                                                        >
                                                                            <span
                                                                                className=" text-sm"
                                                                            >{(ele === 'sizes') && '₹'}</span>
                                                                            {
                                                                                (ele === 'sizes') ? (item.price + el.additionalPrice) : `+${el.additionalPrice}` || 99
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                })

                                                                :
                                                                <>
                                                                    {/* I'm dummy data */}

                                                                    <div>
                                                                        <p className="px-0.5">DRegular</p>
                                                                        <p className=" font-serif  font-bold"> <span className=" text-sm">₹</span>99</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="px-0.5">DMedium</p>
                                                                        <p className=" font-serif  font-bold"> <span className=" text-sm">₹</span>199</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="px-0.5">DLarge</p>
                                                                        <p className=" font-serif  font-bold"> <span className=" text-sm">₹</span>299</p>
                                                                    </div>
                                                                </>


                                                        }



                                                    </div>

                                                </div>
                                            })

                                        }


                                        {/* Add to cart main button */}

                                        <div className=" bg-white px-1 py-1.5 mt-4 rounded flex justify-around items-start">
                                            <div className=" bg-orange-200 w-20 mx-0.5 rounded flex justify-around font-bold">
                                                <span
                                                    className="text-red-500  rounded px-0.5 active:bg-red-500 active:text-black hover:cursor-pointer"
                                                    onClick={() => { quantityOfProduct > 1 && setQuantityOfProduct(quantityOfProduct - 1) }}

                                                >-</span>
                                                <span>{quantityOfProduct}</span>
                                                <span
                                                    className="text-red-500 rounded px-0.5 active:bg-red-500 active:text-black hover:cursor-pointer"
                                                    onClick={() => setQuantityOfProduct(quantityOfProduct + 1)}
                                                >+</span>

                                            </div>

                                            <div>

                                                <button
                                                    className=" bg-orange-400 text-white mx-0.5 font-serif font-semibold px-2 rounded "
                                                    onClick={(e) => { addToCartHandler(e) }}
                                                >Add to Table ₹{totalPriceOfItem * quantityOfProduct}</button>
                                            </div>
                                        </div>

                                    </div>
                            }
                        </div>

                    </div>


                </div>


                {/* Footer of page details */}
                <div className=" w-full py-1.5 bg-slate-100 fixed bottom-0 flex justify-center">


                    <div className=" w-full md:w-2/4 relative">

                        {/* Gas logo ----> */}
                        <GasLogoFooter className=' hidden' />


                        {/* Cart items name  */}
                        <ShowCartItemInFooter
                            cartData={cartData}
                            onClickHandlerSendKitchen={onClickHandlerSendKitchen}
                            cartItemsNameFormate={cartItemsNameFormate}
                            dispatch={dispatch}
                            className='hidden'
                        />


                        {/* Send order with bill div */}
                        <SendOrderToKitenBtnFooter onClickHandlerSendKitchen={onClickHandlerSendKitchen} setShowSizingPart={setShowSizingPart} />

                    </div>


                </div>


            </div>


        </>
    )
}

export default ProductDetail



function NameWithLeftRight() {

    const dispatch = useDispatch<AppDispatch>()

    const navigate = useNavigate()

    const item = productState().currenProduct

    const allProductData = productState().allProroductData

    const [sameCatProducts, setSameCatProducts] = useState<TypeSingleProduct[]>([])




    useEffect(() => {

        if (item.name) {

            let sameCatProduct = allProductData.filter((ele) => { return ele.category === item.category })

            // console.log(sameCatProduct)

            if (sameCatProduct.length > 0) {

                setSameCatProducts(sameCatProduct)
            }

        }


    }, [allProductData, item])



    return (

        <>

            <div className="flex justify-center items-center flex-wrap flex-row md:flex-col my-2">


                {

                    sameCatProducts.map((ele) => {
                        return (
                            <Fragment key={ele.id}>{

                                (item.name === ele.name)
                                    ?
                                    <p
                                        className={` animate__animated  animate__bounce  md:my-2 px-1 mx-2 uppercase text-xl font-bold   border-2 border-b-4 rounded-lg shadow-lg  hover:scale-110 transition-all ${!item?.isNonVeg ? "border-green-400 " : "border-red-600 "} hover:cursor-pointer `}
                                    >{removerUnderScore(item.name)}</p>
                                    :
                                    <p
                                        key={ele.id}
                                        className="font-bold uppercase px-2 hover:cursor-pointer hover:border rounded"
                                        onClick={() => { dispatch(fetchOneProduct(ele.id)); navigate(`/product/${ele.id}`) }}
                                    >{ele.name || "item"}</p>


                            }</Fragment>
                        )
                    })
                }


                {/* <p className="font-bold uppercase">Dummy</p> */}
            </div>
        </>

    )

}



function SendToKitchenBtnWilLogic({ className, onClickHandlerSendKitchen }: { className?: string, onClickHandlerSendKitchen: Function }) {


    const dispatch = useDispatch<AppDispatch>()

    const { cartData } = cartState()


    return (
        <>


            <button
                className={`my-1 border border-black px-1 rounded text-center font-bold relative ${className}`}
                onClick={() => {
                    // // Show the modal 
                    onClickHandlerSendKitchen();

                    // // Set the click item to -1 (default)
                    dispatch(setItemsClicked(-1));

                }}
            >

                {
                    cartData.length > 0
                    &&
                    <span className=" bg-red-500 px-0.5 font-semibold text-white absolute rounded-full -top-2 -left-3">{cartData.length}</span>
                }
                <span className=' relative z-10'>Send Order to Kitchen</span>
            </button>
        </>
    )
}


function CurrentSigleOrderDiv() {

    const { userData } = userState()

    const navigate = useNavigate()

    const dispatch = useDispatch<AppDispatch>()



    function currentSingleOrderClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>, orderId?: string) {

        e.stopPropagation()

        if (orderId) {
            if (userData.currentOrderArr && userData.currentOrderArr.length > 0) {

                navigate("/current-order");
            } else {
                navigate("/profile");
            }

            dispatch(setClickedNotification(orderId))
        }

    }




    useEffect(() => {

        // console.log(userData.singleCurrentOrder)

        let timeInStr = userData.singleCurrentOrder?.startPreparation

        let status = userData.singleCurrentOrder?.status

        if (userData.singleCurrentOrder && timeInStr && (status !== "CANCELED")) {

            let dateAtPepare = new Date(timeInStr)

            let dateNow = new Date()

            var differenceValue = (dateNow.getTime() - dateAtPepare.getTime()) / 1000;
            differenceValue /= (60 * 60);
            let timeGotInHours = Math.round(differenceValue)


            let oneDayHours = 24

            if (timeGotInHours > oneDayHours) {

                // alert("disptch to cancel order.")

                // alert("Give notification to cancel.")

                let bodyData: UpdateOrderChefBody = {
                    whatUpdate: "chefStatus",
                    orderId: userData.singleCurrentOrder?.id,
                    // time: time,
                    status: "CANCELED",
                    // startPreparation: Date.now(),
                    endPreparation: Date.now()
                }
                dispatch(updateOrderStatusChef(bodyData))


                socket.emit("update-order-status", { ...userData.singleCurrentOrder, status: 'CANCELED', preparationTime: userData.singleCurrentOrder.preparationTime })

                // console.log(1)

            }


            // console.log(dateAtPepare , dateNow)
            // console.log(timeGotInHours)
        }




    }, [userData.singleCurrentOrder])




    return (
        <div className="my-4 py-4 border-t md:border-b md:border-t-0 hover:cursor-pointer mx-1 md:h-60  md:overflow-y-scroll">


            {
                userData.singleCurrentOrder
                &&
                <div
                    className=' w-full bg-slate-200 py-2 rounded'
                    onClick={(e) => { currentSingleOrderClick(e, userData.singleCurrentOrder?.id) }}
                >

                    <StatusProgressShowToUser status={userData.singleCurrentOrder?.status} />

                    <p className={`border rounded font-semibold border-red-500 inline px-2 ${userData.singleCurrentOrder?.status === "PROCESSING" ? "border-orange-300" : userData.singleCurrentOrder?.status === "ON_TABLE" ? ' border-sky-500' : userData.singleCurrentOrder?.status === 'CANCELED' ? "border-red-500" : "border-green-500"}  `}>{userData.singleCurrentOrder.status}</p>

                    {/* Data.now isLessThen  display below */}
                    {/* <p>{userData.singleCurrentOrder.preparationTime}</p> */}
                    <p>
                        <span>{makeDateByDbStr(userData.singleCurrentOrder.preparationTime).toLocaleDateString()}</span> | {" "}
                        <span>{makeDateByDbStr(userData.singleCurrentOrder.preparationTime).toLocaleTimeString()}</span>
                    </p>
                    <>
                        {
                            userData.singleCurrentOrder.cartData.map((ele, i) => {
                                return <div key={i}
                                    className={`capitalize border-b-2 border-slate-100 flex justify-center items-center flex-wrap px-2 gap-2 leading-5
                                        ${i === 0 && "border-t-2"}
                                    `}
                                >
                                    {/* <p>{JSON.stringify(ele)}</p> */}
                                    <p><span>{i + 1}.</span> <span>{ele.name}</span> <span>({ele.category})</span></p>
                                    <p>{ele.customizations?.sizes[0]?.name || ''}</p>
                                    <p>{ele.customizations?.crusts[0]?.name || ""}</p>
                                </div>
                            })
                        }
                    </>

                </div>

            }

        </div>
    )
}



function SendOrderToKitenBtnFooter(
    {
        onClickHandlerSendKitchen,
        setShowSizingPart
    }:
        {
            onClickHandlerSendKitchen: Function,
            setShowSizingPart: React.Dispatch<React.SetStateAction<boolean>>
        }
) {
    return (
        <div >

            {/* <SendToKitchenBtnWilLogic onClickHandlerSendKitchen={onClickHandlerSendKitchen} /> */}

            <div className="flex justify-around items-center flex-wrap md:justify-center">


                <SendToKitchenBtnWilLogic className='hidden' onClickHandlerSendKitchen={onClickHandlerSendKitchen} />

                {/* here create a menu btn component with all logics ---> */}
                <MenuWithLogic setShowSizingPart={setShowSizingPart} />

            </div>

        </div>
    )
}



function StatusProgressShowToUser({ status = 'RECEIVED' }: { status: OrderStatusOptions }) {

    const [currentStatusNum, setCurrentStatusNum] = useState(-1)

    useEffect(() => {

        switch (status) {
            case 'RECEIVED':
                setCurrentStatusNum(0)
                break;

            case 'PROCESSING':
                setCurrentStatusNum(1)
                break;

            case 'ON_TABLE':
                setCurrentStatusNum(2)
                break;

            case 'COMPLETED':
                setCurrentStatusNum(4)
                break;

            case 'CANCELED':
                setCurrentStatusNum(5)
                break;

            default:
                break;
        }


        // setCurrentStatusNum(status)

    }, [status])



    return (

        <div className=' px-1 -z-5 flex justify-center'>
            <div className=' w-11/12 h-0.5 border border-zinc-400 relative flex justify-between items-center mb-5 mt-3'>

                {
                    ["RECEIVED", "PROCESSING", "ON_TABLE", "COMPLETED"].map((ele, i) => {
                        return (
                            <div
                                key={i}
                                // style={{left : `${(i+1) * 25}%`}}
                                className={`w-5 h-5 rounded-full  flex items-center justify-center  px-4 relative 
                                    ${i == 0 ? " -translate-x-2" : `${i === 3 ? "translate-x-2" : ""}`}
                                    ${currentStatusNum >= i ? 'bg-green-500' : " border bg-zinc-400 border-zinc-400"}
                                `}
                            >
                                <span className=' font-semibold text-white'> {i + 1}</span>

                                <span
                                    className={` absolute -top-6 border-b  rounded text-white font-semibold -left-[150%] px-1
                                        ${currentStatusNum === i ? 'inline bg-green-500' : "hidden bg-green-100"}

                                        ${i === 0 ? "-left-[10%]" : `${i === 3 ? "left-[10%]" : "-left-[150%]"}`}

                                    `}
                                >{ele}</span>

                            </div>
                        )
                    })
                }

            </div>
        </div>


    )
}


// // Menu Will modal code ---->
function MenuWithLogic({ setShowSizingPart }: { setShowSizingPart: React.Dispatch<React.SetStateAction<boolean>> }) {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const allProductData = productState().allProroductData
    const item = productState().currenProduct


    // // // This fn hold everything about Model (Logic , Menu UI).
    function menuClickHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {

        e.stopPropagation();


        // // // Group products by category ---->
        const groupByData: any = {}

        for (let item of allProductData) {
            // console.log(item)

            if (!groupByData[item.category]) {
                groupByData[item.category] = [item]
            } else {
                groupByData[item.category].push(item)
            }

        }

        // console.log(groupByData)

        // // // category click handler ---->
        function categoryClickHandler(category: string) {

            // console.log(category)



            for (let key in groupByData) {


                if (category === key) {

                    // console.log(groupByData[key][0])


                    // // // Now set state of current product/dispatch the product  and also navigate to page ---->

                    let firstProductIdOfCategory = groupByData[key][0].id

                    dispatch(fetchOneProduct(firstProductIdOfCategory))

                    navigate(`/product/${firstProductIdOfCategory}`)

                    dispatch(setOpenMoadl(false))

                    break

                }


            }


        }


        // // // Model actual UI ---->
        let innerHTML = <div>

            <ul>

                {
                    Object.keys(groupByData).map((ele, i) => {
                        return (
                            <li
                                key={i}
                                className={`capitalize font-bold flex justify-between items-center my-5 text-xl ${(item.category === ele) && 'text-yellow-400'}`}
                                onClick={() => { categoryClickHandler(ele); setShowSizingPart(false) }}
                            >
                                <span className="px-2 w-full text-center" >{ele}</span>
                                <span>{groupByData[ele].length}</span>
                            </li>
                        )
                    })
                }

            </ul>

        </div>

        dispatch(setOpenMoadl(true))
        dispatch(setChildrenModal(innerHTML))

    }


    return (
        <>
            <button
                onClick={(e) => { menuClickHandler(e) }}
                className="rounded bg-yellow-400 px-1 uppercase font-semibold text-md mx-1 flex"
            >

                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/d7752c772004441a8bad2226356a475f69d2366b290b52382113297bf4ada2de?"
                    className="aspect-[0.91] object-contain object-center w-full overflow-hidden max-w-[20px]"
                />

                MENU CARD
            </button>
        </>
    )

}



function GasLogoFooter({
    className
}: {
    className?: string,
}) {
    return (
        <div className={`gas_box absolute right-2 -top-1.5  scale-75 -z-10 ${className} `}>
            <div className="group">
                <div className="overlap-group">
                    <div className="rectangle" />
                    <div className="div" />
                    <div className="rectangle-2" />
                    <div className="rectangle-3" />
                    <img className="vector" alt="Vector" src="/images/vector-1.svg" />
                </div>
            </div>
        </div>
    )
}



function ShowCartItemInFooter({
    className,
    cartData,
    onClickHandlerSendKitchen,
    cartItemsNameFormate,
    dispatch
}: {
    className?: string,
    cartData: CardDataInter[],
    onClickHandlerSendKitchen: Function,
    cartItemsNameFormate: any,
    dispatch: any

}) {

    return (
        <div className={`flex overflow-y-auto w-10/12 sm:w-11/12 ${className} `}>

            {
                cartData.length > 0
                    ?
                    <>

                        {
                            cartData.map((ele, i) => {
                                return <p
                                    className=" mx-0.5 border border-black rounded capitalize px-1.5 hover:cursor-pointer"
                                    key={uuid()}
                                    style={{ whiteSpace: "nowrap" }}
                                    onClick={() => { onClickHandlerSendKitchen(); dispatch(setItemsClicked(i)) }}
                                >{cartItemsNameFormate(ele.name)}</p>
                            })
                        }

                    </>
                    :
                    // Below p tag is used to prevent ui only (if no cart items present then pevent the ui)
                    <p
                        className="  w-11/12 h-8 mx-0.5 rounded capitalize px-1.5 hover:cursor-pointer"
                    ></p>
            }

        </div>
    )
}

