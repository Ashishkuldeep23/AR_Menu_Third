

// import React from 'react'

const GoogleLogInComp = () => {



    function googleLogIn() {
        // window.open(`${import.meta.env.VITE_BACKEND_URL}/userLoginGoogle` ,  'newwin', 'height=500,width=500,left=500,top=150,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes')
        window.open(`${import.meta.env.VITE_BACKEND_URL}/google-login`, '_self')
        // window.open(`http://localhost:3000/google-login` , '_self')
    }




    return (
        <>


            <button
                className="bg-red-500 my-5 px-4 py-2 rounded  font-bold text-xl"
                onClick={() => { googleLogIn(); }}
            >Google</button>


        </>
    )
}

export default GoogleLogInComp

