import Layouts from "@/Layout/Layouts";
import AgoraRTC from "agora-rtc-sdk-ng";

import React, { useCallback, useEffect, useRef, useState } from "react";

import { router } from "@inertiajs/react";
import Swal from "sweetalert2";
import Modals from "@/Components/Modals";
import FormDurasi from "./FormDurasi";
import DataTable from "react-data-table-component";
import InputText from "@/Components/InputText";
import { debounce, TextField } from "@mui/material";
import moment from "moment";
export default function Dashboard(props) {
    const token = props.token;
    const status = props.status;
    const durasi = props.durasi;
    const pelanggaran = props.pelanggaran;
    const totalPelangganTerbaru = props.totalPelangganTerbaru;
    const totalPelanggaranBulanTerbaru = props.totalPelanggaranBulanTerbaru;
    const totalPelanggaranTahunTerbaru = props.totalPelanggaranTahunTerbaru;
    const [params, setParams] = useState({ search: "", bulan: "", tahun: "" });
    const videoRef = useRef(null);
    const client = useRef(null);
    const [modalDurasi, setModalDurasi] = useState(false);
    const [modalFoto, setModalFoto] = useState(false);
    const [model, setModel] = useState();
    useEffect(() => {
        client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

        const startBasicCall = async () => {
            await client.current.join(
                token.idToken,
                token.channel,
                token.token,
                null
            );
            client.current.on("user-published", async (user, mediaType) => {
                await client.current.subscribe(user, mediaType);
                if (mediaType === "video") {
                    const remoteVideoTrack = user.videoTrack;
                    remoteVideoTrack.play(videoRef.current);
                }
            });
        };

        startBasicCall();

        return () => {
            client.current.leave();
        };
    }, []);

    const updateStatus = (status) => {
        router.post(
            route("update-status"),
            { status: status },
            {
                onSuccess: () => {
                    Swal.fire({
                        icon: "success",
                        title: "Sukses",
                        text: "Berhasil mengupdate status menjadi " + status,
                    });
                },
            }
        );
    };

    const columns = [
        {
            name: "#",
            selector: (row, index) => index + 1,
            width: "60px",
        },
        {
            name: "Tanggal Pelanggaran",
            selector: (row, index) => row.tanggal,
        },
        {
            name: "Jumlah Pelanggaran",
            selector: (row, index) => row.jumlah,
        },
        {
            name: "Aksi",
            selector: (row, index) => (
                <button
                    onClick={() => showFoto(row)}
                    className="bg-blue-500 hover:bg-blue-800 transition-all duration-300 ease-in-out text-white capitalize py-2 px-4"
                >
                    Lihat Foto Pelanggaran
                </button>
            ),
        },
    ];

    const reload = useCallback(
        debounce((query) => {
            router.get(route("dashboard"), query, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 150),
        []
    );
    useEffect(() => reload(params), [params]);
    const showFoto = (row) => {
        setModalFoto(true);
        setModel(row);
    };
    console.log("====================================");
    console.log(model);
    console.log("====================================");
    return (
        <div className="w-full px-4 md:px-8 l:px-16">
            <Modals
                title={"Atur Durasi Lampu"}
                open={modalDurasi}
                onClose={() => setModalDurasi(false)}
            >
                <FormDurasi
                    onClose={() => setModalDurasi(false)}
                    durasi={durasi}
                />
            </Modals>
            <Modals
                title={"Pelanggaran " + model?.tanggal}
                open={modalFoto}
                onClose={() => {
                    setModalFoto(false);
                    setModel();
                }}
            >
                <div className="grid grid-cols-3 gap-2 max-h-[80%] overflow-y-auto">
                    {model &&
                        model?.foto.map((item, key) => (
                            <a href={"/storage/" + item.foto} target="_blank">
                                <img
                                    src={"/storage/" + item.foto}
                                    alt=""
                                    className="h-[200px] object-cover"
                                    key={key}
                                />
                                <p className="text-xs">
                                    {moment(item.created_at).format("HH:MM:SS")}
                                </p>
                            </a>
                        ))}
                </div>
            </Modals>
            <div className="flex flex-col md:flex-row justify-between items-start gap-1">
                <div className="w-full rounded-md overflow-hidden">
                    <video ref={videoRef} autoPlay></video>
                    {/* <Webcam ref={videoRef} autoPlay /> */}
                    <div className="my-3 flex gap-3 items-center px-3">
                        <button
                            onClick={() =>
                                updateStatus(
                                    status.status == "nyala" ? "mati" : "nyala"
                                )
                            }
                            className={`${
                                status.status == "nyala"
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-red-500 hover:bg-red-600"
                            } py-2 px-3 rounded-md text-white flex gap-3 items-center duration-300 ease-in-out transition-all`}
                        >
                            <div
                                className={`${
                                    status.status == "nyala"
                                        ? "bg-red-500"
                                        : "bg-green-500"
                                } w-5 h-5 rounded-full `}
                            ></div>
                            <p>
                                {status.status == "nyala" ? "Menyala" : "Mati"}
                            </p>
                        </button>
                        <button
                            onClick={() => setModalDurasi(true)}
                            className="bg-blue-500 py-2 px-3 rounded-md text-white"
                        >
                            Atur Durasi Lampu
                        </button>
                    </div>
                </div>
                <div className="w-full bg-white h-[500px] py-2 px-3 rounded-md overflow-y-auto">
                    <div className="flex items-center justify-end gap-3 my-3">
                        <InputText
                            onChange={(e) =>
                                setParams({ ...params, search: e.target.value })
                            }
                            label={""}
                            type="date"
                        />
                        <TextField
                            onChange={(e) =>
                                setParams({ ...params, bulan: e.target.value })
                            }
                            id="outlined-select-currency-native"
                            select
                            label="Bulan"
                            defaultValue=""
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value={""}>Pilih Bulan</option>
                            <option value="1">Januari</option>
                            <option value="2">Februari</option>
                            <option value="3">Maret</option>
                            <option value="4">April</option>
                            <option value="5">Mei</option>
                            <option value="6">Juni</option>
                            <option value="7">Juli</option>
                            <option value="8">Agustus</option>
                            <option value="9">September</option>
                            <option value="10">Oktober</option>
                            <option value="11">November</option>
                            <option value="12">Desember</option>
                        </TextField>
                        <InputText
                            onChange={(e) =>
                                setParams({ ...params, tahun: e.target.value })
                            }
                            label={"Tahun"}
                        />
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                        <h3 className="my-3 font-bold text-xl text-center">
                            Data Jumlah Pelanggaran
                        </h3>
                        <DataTable data={pelanggaran.data} columns={columns} />
                    </div>
                </div>
            </div>
        </div>
    );
}

Dashboard.layout = (page) => <Layouts children={page} />;
