// import React from 'react'

import { TypeSingleProduct } from "../../Slices/productSlice";
import { useNavigate } from "react-router-dom";
import { ModelViewer } from "../ModelViewer/ModelViewer";
import { CardDataInter, addItemInCart } from "../../Slices/cartSlice";
import { useDispatch } from "react-redux";

// import 'focus-visible';




export function removerUnderScore(name: string) {

    // // // This code will replace _ with one sapce only ----->
    return name.replace("-", " ")
}




export const Single_Product = ({ item }: { item: TypeSingleProduct }) => {

    const navigate = useNavigate()

    const dispatch = useDispatch()


    function addHandler() {


        const { id, name, category, isNonVeg } = item

        if (item.customizations) {

            let sendCartData: CardDataInter = {
                id, name, category,
                isNonVeg: isNonVeg || false,
                customizations: { sizes: [{ ...item.customizations.sizes[0] }], crusts: [] },
                quantity: 1,
                price: item.price
            }

            // console.log(sendCartData)

            dispatch(addItemInCart(sendCartData))
        }



    }


    return (


        <div
            className="border-b pb-5 "
        >

            <div
                className=" flex flex-col items-center overflow-hidden bg-white  rounded mx-1  h-[40vh] w-[40vh]"
            >
                <ModelViewer item={item} />


                <div
                    className="  px-4 mb-2 w-full hover:cursor-pointer"
                    onClick={() => {
                        navigate(`/product/${item.id}`);
                    }}
                >


                    <p className=" w-full text-start capitalize font-bold flex flex-wrap items-center gap-1.5">


                        <span
                            className={`h-3 w-3 border flex items-center justify-center ${item.isNonVeg ? " border-red-500" : " border-green-500"} `}
                        >
                            <span className={` h-1.5 w-1.5 rounded-full ${item.isNonVeg ? " bg-red-500" : " bg-green-500"}`}></span>
                        </span>

                        <span>{removerUnderScore(item.name)}</span>


                    </p>

                    <div className=" flex items-center justify-between">
                        <div>
                            <p className=" font-semibold text-xl">₹{item.price}</p>
                        </div>
                        <div>

                            <button
                                className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-600 hover:to-orange-400 text-white my-1 py-1 px-6 rounded-full shadow-md font-semibold hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"

                                onClick={(e) => { e.stopPropagation(); addHandler() }}
                            >
                                ADD
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}
