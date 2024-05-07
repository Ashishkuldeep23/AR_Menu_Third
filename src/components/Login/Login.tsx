// import React from 'react'

import GoogleLogInComp from "./GoogleLogin"

// import LogInByGoogle from "./logInByGoogle"

const Login = () => {




  return (
    <>

      <div className="w-full h-dvh flex flex-col justify-center items-center bg-black">


        <div className=" sm:w-2/5 h-1/2 bg-black text-white rounded border border-white flex flex-col items-center justify-center ">

          <p className=" text-2xl text-center underline font-bold">LogIn with your Google account</p>

            <GoogleLogInComp />
     
        </div>


      </div>

    </>
  )
}

export default Login