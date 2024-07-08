// ReceiverComponent.js
import React, { useEffect, useRef } from "react";

const ReceiverComponent = ({ stream }) => {
    const videoRef = useRef(null);

    // useEffect(() => {
    //     if (stream) {
    //         videoRef.current.srcObject = stream;
    //     }
    // }, [stream]);

    return (
        <div className="flex gap-3 justify-between items-start">
            <div>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{ width: "100%" }}
                />
            </div>
            <div className="w-1/3 bg-red-500"></div>
        </div>
    );
};

export default ReceiverComponent;
