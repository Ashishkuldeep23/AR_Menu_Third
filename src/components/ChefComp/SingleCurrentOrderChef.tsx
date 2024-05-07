import { useEffect, useState } from "react";
import { makeDateByDbStr } from "../UserProfile/UserProfile";
import { OrderDataInterface, OrderStatusOptions } from "../../Slices/orderSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import toast from "react-hot-toast";
import { UpdateOrderChefBody, updateOrderStatusChef } from "../../Slices/chefSlice";
import { socket } from "../../App";

export function SingleCurrentOrderForChef({ ele }: { ele: OrderDataInterface }) {


    // const { chefOrderData } = chefSliceData()

    const [timeRemaining, setTimeRemaining] = useState<number>(15)


    function calculateRemainingTime(time: string) {
        // console.log(time)

        let dateAtPepare = new Date(time)

        let dateNow = new Date()

        var differenceValue = (dateAtPepare.getTime() - dateNow.getTime()) / 1000;
        differenceValue /= 60;
        let timeGotInMints = Math.round(differenceValue)

        // console.log(timeGotInMints)

        setTimeRemaining(timeGotInMints)

        // console.log(dateAtPepare)
    }


    useEffect(() => {


        // console.log(ele.preparationTime)

        if (ele.orderDate !== ele.preparationTime) {

            calculateRemainingTime(ele.preparationTime)


            if (timeRemaining > 0) {

                setInterval(() => {

                    calculateRemainingTime(ele.preparationTime)
                }, 60000)
            }

        }

    }, [timeRemaining])



    return (
        <>

            <div className={` bg-slate-800 flex flex-col rounded shadow-xl shadow-gray-600 hover:scale-110 sm:hover:-translate-y-5 transition-all`}>
                <div
                    key={ele.id}
                    className={` flex flex-col flex-wrap border rounded m-1 px-1 py-4 xxs:w-72 text-black
                        ${ele?.status === "PROCESSING" ? "bg-orange-300" : ele?.status === "ON_TABLE" ? ' bg-sky-500' : ele?.status === 'CANCELED' ? "bg-red-500" : "bg-green-500"}  
                        `}
                >
                    <div className=" flex justify-between items-start">
                        <p className=" font-bold px-1 sm:px-3 rounded">Table:{ele.tableNumber}</p>

                        <div className=" border-b flex  items-end ">
                            <span>Received At :</span>
                            <p >{makeDateByDbStr(ele.orderDate).toLocaleTimeString()}  </p>
                            {/* <p >{makeDateByDbStr(ele.orderDate).toLocaleDateString()}</p> */}
                        </div>


                    </div>

                    <div>

                        {
                            ele.orderDate !== ele.preparationTime
                            &&

                            <div>
                                {
                                    timeRemaining > 0
                                        ? <p className=" text-end capitalize font-bold">Time Remaining: {timeRemaining} mins</p>

                                        : <p className=" text-center text-sm">The time left has reached <span className=" font-bold">0.</span> Please change the status accordingly.</p>
                                }
                            </div>

                        }

                    </div>

                    {/* <p>{makeDateAndTime(ele.orderDate)}</p> */}
                    {/* <p>{makeDateAndTime(ele.preparationTime)}</p> */}
                    {/* <p>{JSON.stringify(ele.cartData)}</p> */}



                    <div className=" flex flex-col items-center  justify-center border-t mt-2">
                        <p className=" border-b text-center text-sm text-slate-200 font-semibold">Cart Data</p>
                        {
                            (ele.cartData.length > 0)

                            &&
                            <div className="bg-slate-200 rounded ">{

                                ele.cartData.map((e, i) => {
                                    return (
                                        <div
                                            key={i}
                                            className=" border-b-slate-600 border my-1 px-0.5 relative w-full overflow-hidden "
                                        >

                                            <div className=" flex justify-between flex-wrap gap-2 capitalize">
                                                <p>{e.name}</p>
                                                <p>
                                                    <span>{e.customizations.sizes[0].name || ""}</span>
                                                    {
                                                        e.customizations.crusts[0]
                                                        &&
                                                        <span >{e.customizations.crusts[0].name || ""}</span>
                                                    }

                                                </p>
                                                <p>{e.quantity}</p>
                                            </div>





                                        </div>
                                    )
                                })

                            }</div>

                        }
                    </div>

                    {
                        ele.orderDate !== ele.preparationTime
                        &&
                        <p className=" text-center">Prepared At : {makeDateByDbStr(ele.preparationTime).toLocaleTimeString()}</p>
                    }


                    <div className=" border-t flex  gap-3 items-center px-1">

                        <p className={` text-center px-2 rounded my-1 font-bold text-white
                                 ${ele?.status === "PROCESSING" ? "bg-orange-800" : ele?.status === "ON_TABLE" ? ' bg-sky-800' : 'bg-green-800'}
                                `}

                        >{ele.status}</p>

                        {/* {
                            // !forChef
                            // &&
                            <p className=" border-2 border-y-0 border-blue-400 px-2 sm:px-4 rounded">At :₹{ele.totalPrice}</p>
                        } */}

                    </div>


                    <div>
                        {
                            <UpdateUiForChef ele={ele} isBgBlack={true} />
                        }
                    </div>

                    {/* <p className=" ">{makeDateAndTime(ele.orderDate)}</p> */}
                    {/* Below update component should only show to chefs ---> */}

                </div>

            </div>
        </>
    )

}



// // // Below comp only visiable for chef --------->
export function UpdateUiForChef({ ele, isBgBlack = false }: { ele: OrderDataInterface, isBgBlack?: boolean }) {


    type UpdateOrder = {
        id: string,
        status: OrderStatusOptions,
        time?: number
    }

    const dispatch = useDispatch<AppDispatch>()

    const [updateOrder, setUpdateOrder] = useState<UpdateOrder>({ id: "", status: "RECEIVED", time: 20 })

    // // Toggle tio show upadate ui --->
    // // Now options to edit order will always visiable (Updated) ---->
    const [showOption, setShowOption] = useState(true)


    const [optionArr, setOptionArr] = useState<OrderStatusOptions[]>([])


    function clickHandler(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {

        e.stopPropagation()


        if (updateOrder.status === "RECEIVED" && updateOrder.time === 20 && showOption === true) {
            // setShowOption(!showOption)
            return toast.error("Update something please.")
        } else {
            if (showOption === true) {
                toast.success(`Updating data ( status : ${updateOrder.status} and time : ${updateOrder.time} ) successfully.`)


                let date = new Date(Date.now())

                // console.log((date))


                let date1 = new Date(date.getTime() + (+(updateOrder.time || 1) * 60 * 1000))

                // console.log(date1)

                const time = date1.toISOString()
                // console.log(time)
                // // // Now call the backend


                // console.log({ ...ele, status: updateOrder.status , time }) 
                // return

                // // // endPreparation startPreparation

                if (updateOrder.status === 'PROCESSING') {

                    let bodyData: UpdateOrderChefBody = {
                        whatUpdate: "chefStatus",
                        orderId: ele.id,
                        time: time,
                        status: updateOrder.status,
                        startPreparation: Date.now(),
                        // endPreparation: Date.now()
                    }
                    dispatch(updateOrderStatusChef(bodyData))


                    // // // Now sending notification (sending prepration time with status proccessing) ------>
                    socket.emit("update-order-status", { ...ele, status: updateOrder.status, preparationTime: time })

                }
                else if (updateOrder.status === "ON_TABLE" || updateOrder.status === 'COMPLETED' || updateOrder.status === "CANCELED") {
                    dispatch(updateOrderStatusChef({ whatUpdate: "chefStatus", orderId: ele.id, status: updateOrder.status, endPreparation: Date.now() }))


                    // // // Now sending notification ------>
                    socket.emit("update-order-status", { ...ele, status: updateOrder.status })
                }


                // // // Now sending notification ------>
                socket.emit("update-order-status", { ...ele, status: updateOrder.status })


            }
        }

        // // Do toggle thing last after all cases ---->
        setShowOption(showOption)

    }



    // // // Setting option property and option here ------>
    useEffect(() => {

        // console.log(ele)

        setUpdateOrder({ ...updateOrder, id: ele.id, status: ele.status })

        if (ele.status === "RECEIVED") {
            setOptionArr(["RECEIVED", "PROCESSING", "CANCELED"])
        }

        // // // Added completed option for select.
        if (ele.status === "PROCESSING") {
            setOptionArr(["PROCESSING", 'ON_TABLE', "COMPLETED", "CANCELED"])
        }

        // // // Added completed option for select.
        if (ele.status === "ON_TABLE") {
            setOptionArr(['ON_TABLE', "COMPLETED", "CANCELED"])
        }

        if (ele.status === "COMPLETED" || ele.status === "CANCELED") {
            setOptionArr(["COMPLETED", "CANCELED"])
        }


    }, [ele])




    return (
        <>


            <div className=" m-3 mt-0 border-t p-1 flex flex-col items-center">

                {
                    showOption
                    &&
                    <div className=" w-full relative ">

                        {/* <span
                            className=" absolute top-0 right-0 border-2 border-red-400 text-red-400 rounded px-2 font-semibold "
                            onClick={() => { setShowOption(false) }}
                        >X</span> */}

                        <div className=" flex justify-center">

                            <label htmlFor="status">Status : </label>

                            <select
                                className={`${!isBgBlack ? "bg-black" : "bg-slate-200"}  border rounded my-0.5" id="status `}
                                value={updateOrder.status}
                                onChange={(e) => { setUpdateOrder({ ...updateOrder, status: e.target.value as OrderStatusOptions }) }}
                            >
                                {
                                    optionArr.map((options, i) => {
                                        return <option
                                            key={i}
                                            // disabled={ e===updateOrder.status ? true : false}
                                            value={options}
                                            className={` 
                                            ${options === 'CANCELED'
                                                    ? 'text-red-600 font-semibold'
                                                    : options === "COMPLETED" && 'text-green-600 font-semibold'
                                                }`}
                                        >{options}</option>
                                    })
                                }

                            </select>

                        </div>

                        {
                            ele.status === "RECEIVED"
                            &&
                            <>

                                <div className=" flex justify-center">

                                    <label htmlFor="time">Time : </label>

                                    <div className="  border rounded px-1 mx-2">

                                        <button
                                            onClick={(e) => { e.stopPropagation(); (updateOrder.time || 0) > 0 && setUpdateOrder({ ...updateOrder, time: +(updateOrder.time || 0) - 5 }) }}
                                        >-5</button>

                                        <input
                                            id="time"
                                            className={`${!isBgBlack ? "bg-black" : "bg-slate-200"} border rounded mx-0.5 px-1 `}
                                            style={{ width: "30px" }}
                                            type="number"
                                            value={updateOrder.time}
                                            onChange={(e) => { e.stopPropagation(); setUpdateOrder({ ...updateOrder, time: +e.target.value }) }}
                                        />

                                        <button
                                            onClick={(e) => { e.stopPropagation(); setUpdateOrder({ ...updateOrder, time: +(updateOrder.time || 0) + 5 }) }}
                                        >+5</button>

                                    </div>

                                    {/* <input className=" bg-black" type="number" name="" id="" /> */}


                                </div>

                                <div>
                                    <p className=" text-center">+{updateOrder.time} Mins form now</p>
                                </div>

                            </>

                        }

                    </div>

                }

                {/* <div> */}
                <button

                    className={` m-1 text-white px-3 rounded text-sm font-bold capitalize ${showOption ? "bg-red-500" : "border border-red-500 text-red-500"} `}
                    onClick={(e) => { clickHandler(e) }}
                >Update</button>
                {/* </div> */}

            </div>
        </>
    )

}



export function SingleDummyOrder({ data, i }: { data: null, i: number }) {
    return (
        <div

            onClick={() => { console.log(data) }}

            className={`shadow-2xl mx-1 w-full sm:w-2/5 ${i % 2 === 0 ? "bg-orange-400" : " bg-emerald-400"} p-1.5 rounded-md`}
        >

            <h1>Not Found DATA | 404</h1>

            <div className=" flex r gap-4 justify-between flex-wrap">
                <p className=" font-bold">Table No: 9</p>
                <p>Received at: 8 PM</p>
                <p>Time Remaining: 15m</p>
            </div>

            <div className=" bg-slate-800 my-3 px-1">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus sed fuga fugiat voluptatibus enim asperiores odio et eaque natus, error voluptatem nulla ullam ducimus culpa? In ut pariatur cupiditate hic.
            </div>

            <div className=" flex flex-wrap px-6">

                <button className={`mr-10 shadow-lg  ${i % 2 === 0 ? "bg-red-600" : " bg-green-700"} text-white px-4 `}>Processing</button>

                <p>Custom Instruction</p>

            </div>

        </div>
    )
}

