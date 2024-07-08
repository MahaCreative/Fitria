import { router } from "@inertiajs/react";
import AgoraRTC from "agora-rtc-sdk-ng";

import React, { useEffect, useRef, useState } from "react";

function AksesWebcam() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const client = useRef(null);
    const localVideoTrack = useRef(null);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [dataImage, setDataImage] = useState(null);
    useEffect(() => {
        client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

        const startBasicCall = async () => {
            await client.current.join(
                "2bfc957f00bd463383d3b3385a9e7dbe",
                "trafic",
                "007eJxTYLA6aDrx1+YHHIZOMzLjmzdKaLu/Y1pZuzlPdMErhrPRazcrMBglpSVbmpqnGRgkpZiYGRtbGKcYJwEp00TLVPOUpFTta91pDYGMDAemlTEwQiGIz8ZQUpSYlpnMwAAAe6ogYQ==",
                null
            );
            localVideoTrack.current = await AgoraRTC.createCameraVideoTrack();
            localVideoTrack.current.play(videoRef.current);
            setIsVideoReady(true); // Set video as ready after it starts playing
            await client.current.publish([localVideoTrack.current]);
        };

        startBasicCall();

        return () => {
            if (localVideoTrack.current) {
                localVideoTrack.current.close();
            }
            if (client.current) {
                client.current.leave();
            }
        };
    }, []);
    const dataURLtoBlob = (dataURL) => {
        const parts = dataURL.split(";base64,");
        const contentType = parts[0].split(":")[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], { type: contentType });
    };
    const captureImage = async () => {
        if (isVideoReady) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageDataURL = canvas.toDataURL("image/png");
            router.post("kirim-foto", { foto: dataURLtoBlob(imageDataURL) });
        }
    };

    window.Echo.channel("trafics").listen("TakePicture", (data) => {
        captureImage();
    });
    return (
        <div>
            <h1>Teacher Camera</h1>
            <video
                ref={videoRef}
                style={{ width: "640px", height: "480px" }}
            ></video>

            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            <button onClick={captureImage}>FOOOOOOP</button>
        </div>
    );
}

export default AksesWebcam;
