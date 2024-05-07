
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../store"
import { chefSliceData, getAllCurrentOrderData } from "../../Slices/chefSlice"
import { logOutHadler } from "../UserProfile/UserProfile"
import { LoaderCircle } from "../LoaderCircle/LoaderCircle"
import { useNavigate } from "react-router-dom"
// import toast from "react-hot-toast"
// import { OrderDataInterface } from "../../Slices/orderSlice"
import { SingleCurrentOrderForChef, SingleDummyOrder } from "./SingleCurrentOrderChef"
import { OrderDataInterface } from "../../Slices/orderSlice"

const AllCurrentOrder = () => {

    const navigate = useNavigate()

    const dispatch = useDispatch<AppDispatch>()

    const { chefOrderData, isLoading } = chefSliceData()

    const [allCurentOrder, setAllCurentOrder] = useState<OrderDataInterface[]>([])

    type filetrBTNValues = 1 | 2 | 3
    const [filterBTN, setFilterBTN] = useState<filetrBTNValues>(3)




    function filterAllOrdersAndSet(key: number): OrderDataInterface[] {

        window.scroll(0, 0)

        // if (key === filterBTN) return []

        let filetrNum = 1

        if (key === 1 || key === 2 || key === 3) {
            filetrNum = key
            setFilterBTN(key)
        }


        let filterData = chefOrderData.filter((ele) => {
            if (filetrNum === 1 && (ele.status === "RECEIVED" || ele.status === "PROCESSING")) {
                return ele
            }
            if (filetrNum === 2 && (ele.status === "ON_TABLE")) {
                return ele
            }
            if (filetrNum === 3 && (ele.status === "COMPLETED" || ele.status === "CANCELED")) {
                return ele
            }
        })

        setAllCurentOrder(filterData)
        return []
    }





    useEffect(() => {

        filterAllOrdersAndSet(1)
        // setFilterBTN(1)

    }, [chefOrderData])




    useEffect(() => {
        // // // Getting order data ------>
        dispatch(getAllCurrentOrderData())
    }, [])

    return (
        <>

            <div
                className="relative bg-slate-950 text-white flex flex-col items-center  bg-sky-200/70 min-h-screen bg-contain bg-[url('https://img.freepik.com/premium-photo/empty-wood-table-top-with-chef-cooking-restaurant-kitchen-blurred-defocused-background_688350-3953.jpg')] pb-16 sm:pt-28 "
            >

                <button
                    className=" font-semibold text-sm px-3 rounded border absolute right-2 top-2 bg-black"
                    onClick={() => { dispatch(getAllCurrentOrderData()) }}
                >↻Refresh</button>


                <LoaderCircle isLoading={isLoading} />

                <h1 className=" mt-5 text-4xl bg-slate-950 rounded px-3 text-center">Your kitchen</h1>
                <h1 className="mb-5 text-3xl bg-slate-950 rounded px-3 text-center">All currect order below</h1>

                {
                    (chefOrderData.length === 0)
                    &&
                    <h1 className=" my-5 text-xl bg-slate-950 rounded px-3 ">No current order found.(wait for order by Customer)</h1>
                }


                {/* This is Ui For chef -----> */}
                <div className="flex flex-wrap justify-center items-start gap-7">

                    {


                        (allCurentOrder.length > 0)

                            ? allCurentOrder.map((order) => <SingleCurrentOrderForChef key={order.id} ele={order} />)

                            : [null].map((ele, i) => {
                                return (
                                    <div key={i} className=" flex flex-col items-center">
                                        <p className=" text-2xl underline text-black my-1">Not Order Found (in {filterBTN === 1 ? "Current Orders" : filterBTN === 2 ? "On Table Orders" : filterBTN === 3 ? "Completed Orders" : "404"})</p>
                                        <SingleDummyOrder data={ele} i={i} key={i} />
                                    </div>
                                )
                            })
                    }

                </div>



                {/* Filter BTN ------> */}
                <div className="w-full sm:w-2/5 flex justify-between flex-wrap px-5 my-5 gap-3 text-black border border-black py-1 rounded ">

                    {
                        ["Current Orders", 'On Table Orders', 'Completed Orders'].map((ele, i) => {
                            return (
                                <button
                                    key={i}
                                    className={`  px-3 rounded font-bold w-20 ${(i + 1) === filterBTN ? "bg-green-700 text-white" : "bg-slate-200"} `}
                                    onClick={() => filterAllOrdersAndSet(i + 1)}
                                >{ele}</button>
                            )
                        })
                    }


                </div>


                {/* <div className=" mt-5 flex justify-center flex-col items-center"> */}
                <p
                    className=" border px-2 ml-auto mt-5 mr-3 rounded text-sm font-bold bg-red-500 absolute right-2 bottom-2 "
                    onClick={() => { logOutHadler(); navigate("/"); }}
                >LogOut</p>
                {/* </div> */}


            </div>

        </>
    )
}

export default AllCurrentOrder

