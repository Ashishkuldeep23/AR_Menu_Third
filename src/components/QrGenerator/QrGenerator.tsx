// import React from 'react';
import QRCode from 'qrcode.react';
import { useEffect, useState } from 'react';

const QRCodeGenerator = () => {


    const [url, setUrl] = useState("")


    useEffect(() => {
        // console.log("get url form url bar ---->")

        const locationObj = document.location

        // console.log(locationObj?.href)

        setUrl(locationObj?.href)

    }, [])

    return (<QRCode
        value={`${url}`}
        fgColor="#0766AD"
        size={150}
    />);

};

export default QRCodeGenerator;