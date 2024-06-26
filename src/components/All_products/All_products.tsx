
// import React from 'react'

import { useEffect, useRef, useState } from "react"
import { Single_Product } from "./Single_product"
import { fetchAllProduct, productState, setAllProductArr, setCurentProduct } from "../../Slices/productSlice"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../store"
import { useLocation } from "react-router-dom"
import { LoaderCircle } from "../LoaderCircle/LoaderCircle"
import { v4 as uuid } from 'uuid'






const All_products = () => {

    // const navgate = useNavigate()
    const allProductData = productState().allProroductData
    const unFilteredAllProduct = productState().unFilteredAllProduct

    const dispatch = useDispatch<AppDispatch>()

    const location = useLocation()

    const [allCategories, setAllCategories] = useState<string[]>([])


    // type RefType = React.MutableRefObject<React.MutableRefObject<[]>>

    const categoryRefs = useRef<any>([]);
    const productRefs = useRef<any>([]);
    const [currentCategory, setCurrentCategory] = useState('');


    const [vegFilterBtn, setVegFilterBtn] = useState(false)



    // // // Some filters -------------->

    function vegFilter() {

        if (!vegFilterBtn) {
            let newAllDataArr = allProductData.filter(item => item?.isNonVeg === false)
            dispatch(setAllProductArr(newAllDataArr))
        } else {
            dispatch(setAllProductArr(unFilteredAllProduct))
        }

        setVegFilterBtn(pre => !pre)
    }




    function categoryClickHandler(e: React.MouseEvent<HTMLParagraphElement, MouseEvent>, i: number) {
        e.stopPropagation()

        // console.log(categoryRefs)
        // console.log(productRefs)
        // console.log(e)

        // e.target.foucs()


        // console.log(productRefs.current[i])
        // productRefs.current[i].focus()
        // console.log(productRefs.current[i].getBoundingClientRect())


        let { top, } = productRefs.current[i].getBoundingClientRect()



        window.scrollTo(0, +top)

    }



    // // // Cart data arr ---------->
    // console.log(categoryRefs)

    // console.log(productRefs)

    // console.log(allProductData)


    useEffect(() => {

        // // Getting all products from backend ----->
        dispatch(fetchAllProduct())

        // getallProductData()

    }, [])


    // // // set first product ----->
    // console.log(location)
    // // // Not using now ------>
    useEffect(() => {


        // // // Below code will always redirect in product showcase page, based on default product ---->
        // // // But i don't want this (When user present on home page then only redirect into product show case page)
        if (allProductData.length > 0) {
            setCurentProduct(allProductData[0])

            // // Now navigate to product show page 
            // // TODO : Change the logic after ---->

            // // BeDefaul sending on first page ---->

            // console.log(location)
            // console.log(location.pathname)

            if (location.pathname === "/") {

                // // // Not redirecting by default for now ------>
                // navgate(`/product/${allProductData[0].id}`)

            }

        }


        // // // Category related code here ------------->
        // // // Get unique category and set it into arr ------->

        const allListOfCategory = [
            ...new Set(allProductData.map((item) => item.category))
        ]

        // console.log(allListOfCategory)

        if (allListOfCategory.length > 0) {
            setAllCategories(allListOfCategory)
        }

    }, [allProductData])




    // // // This code will see the product and change category name accordingly here ------>
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {

                // console.log(entries)
                // (entries.length > 0)
                //     &&
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Update current category based on the visible product
                        const index = productRefs.current.findIndex((ref: any) => ref === entry.target);

                        // console.log(index)
                        if (index !== -1 && categoryRefs.current[index]) {
                            setCurrentCategory(categoryRefs.current[index].innerText);
                        }
                    }
                });
            },
            { threshold: 0.5 } // Adjust threshold as needed
        );

        productRefs.current.forEach((ref: any) => {
            if (ref) {
                observer.observe(ref);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [allProductData, allCategories]);


    return (
        <>

            {/* <LoaderCircle isLoading={isLoading} isFixied={true} /> */}


            <div className=" bg-white mt-20 w-full px-1 fixed z-5 -top-4 md:px-[7vh] lg:px-[25vh]">
                <div className="border-b flex lg:justify-between items-center ">


                    <p className=" text-xl font-bold mt-auto mb-1">Categories</p>

                    <div className=" flex gap-4 ml-auto mr-4 -mt-1.5 sm:mt-0">
                        <button
                            className={`text-xs border border-black/30 rounded px-2 ${vegFilterBtn && "border-2 font-semibold text-green-400 border-green-400"} `}
                            onClick={() => { vegFilter() }}
                        >VEG</button>

                        {/* <button
                            className=" text-xs border border-black/30 rounded px-2"
                            onClick={() => { toast.error("Filter not functional now.") }}
                        >PRICE</button> */}

                    </div>
                </div>
            </div>


            <div
                // style={{ minHeight: "100vh", width: "100vw" }}
                className="relative mt-[5.5rem] bg-white py-10 text-center flex justify-center px-0 lg:px-[25vh]"
            >

                <div className=" bg-white fixed z-5 w-full lg:w-[20vh] lg:left-[25vh] flex justify-center lg:justify-start items-start gap-10 lg:gap-0 -mt-10 lg:-mt-7  lg:flex-col">

                    {/* both div is used but at different breakpoints not at same movement */}

                    {

                        allCategories.length > 0
                            ?

                            allCategories.map((cat, i) => {
                                return <p
                                    key={i}
                                    className={` hover:cursor-pointer hidden sm:inline text-lg font-semibold my-5 text-start transition-all duration-500
                                    ${cat === currentCategory && ' pl-2 rounded-s border-b-2 border-orange-500 scale-125 ml-3'}  
                                `}
                                    ref={(el) => (categoryRefs.current[i] = el)}
                                    onClick={(e) => { categoryClickHandler(e, i) }}
                                >{cat}</p>
                            })

                            :
                            <CategoryLoadingSkeleton />
                    }



                    <div className="inline sm:hidden text-lg font-semibold my-2 transition-all duration-500">
                        {currentCategory}
                    </div>

                </div>



                <div className=" relative left-0 mt-7 lg:mt-0 lg:left-[20vh] w-[95vw] lg:w-[70vw] self-end ">
                    {
                        allCategories.length > 0
                            ?

                            allCategories.map((cat, i) => {
                                return (
                                    <div
                                        key={i}
                                        // className=" mt-28 flex flex-col items-start"
                                        ref={(el) => (productRefs.current[i] = el)}
                                    >
                                        <p
                                            className=" capitalize font-semibold text-xl w-full text-start border-b border-black/20 mb-5"

                                        >
                                            <span className=" relative top-3 bg-white">{cat}</span>
                                        </p>

                                        <div className=" w-full flex flex-wrap justify-start items-center gap-5 ml-5 sm:ml-16 lg:ml-24">

                                            {
                                                allProductData.filter(item => {
                                                    return item.category === cat
                                                })

                                                    .map((ele, i) => {
                                                        return (
                                                            <Single_Product
                                                                key={i}
                                                                item={ele}
                                                            />
                                                        )
                                                    })
                                            }
                                        </div>
                                    </div>
                                )
                            })

                            :
                            <CartLoadingSkeleton />
                    }
                </div>

            </div>

        </>
    )
}

export default All_products



function CategoryLoadingSkeleton() {
    return (
        <div className="w-full py-2 flex  gap-1 flex-wrap  justify-center">
            {
                [null, null, null, null].map(() => {
                    return <p
                        key={uuid()}
                        className=" w-20 lg:w-[80%] h-7 rounded-lg border hover:scale-110 hover:shadow-xl transition duration-700 animate-pulse hover:cursor-pointer  "
                    ></p>
                })
            }

        </div>
    )
}


function CartLoadingSkeleton() {

    const isLoading = productState().isLoading

    return (
        <div className=" flex flex-wrap justify-center items-center gap-5">
            {
                [null, null, null, null, null, null, null, null, null, null].map(() => {
                    return (
                        <div
                            key={uuid()}
                            className=" relative flex flex-col justify-center items-center border bg-white  rounded mx-1 h-[40vh] w-[40vh] hover:scale-110 hover:shadow-xl hover:cursor-pointer transition-all duration-700 animate-pulse"
                        >
                            <p className=" text-2xl font-bold relative z-[2]">Getting product data.</p>
                            <LoaderCircle isLoading={isLoading} />
                        </div>
                    )
                })
            }
        </div>
    )
}

