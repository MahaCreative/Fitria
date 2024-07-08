import InputText from "@/Components/InputText";
import { useForm } from "@inertiajs/react";
import React from "react";
import Swal from "sweetalert2";

export default function FormDurasi({ durasi, onClose }) {
    const { data, setData, post, reset, errors } = useForm({
        lampu_merah: durasi.lampu_merah,
        lampu_kuning: durasi.lampu_kuning,
        lampu_hijau: durasi.lampu_hijau,
    });

    const submitHandler = (e) => {
        e.preventDefault();
        post(route("update-durasi"), {
            onSuccess: () => {
                onClose();
                reset();
                Swal.fire({
                    icon: "success",
                    title: "Sukses",
                    text: "Berhasil mengupdate durasi nyala dari setiap lampu ",
                });
            },
            onCancel: () => {
                Swal.fire({
                    icon: "error",
                    title: "Ooops...",
                    text: "gagal mengupdate durasi nyala dari setiap lampu ",
                });
            },
        });
    };
    return (
        <form
            onSubmit={submitHandler}
            className="flex flex-col gap-3 items-center w-full"
        >
            <InputText
                className="w-full"
                type="number"
                label={"Durasi Lampu Merah (Dtk)"}
                name="lampu_merah"
                value={data.lampu_merah}
                errors={errors.lampu_merah}
                onChange={(e) => setData("lampu_merah", e.target.value)}
            />
            <InputText
                className="w-full"
                type="number"
                label={"Durasi Lampu Merah (Dtk)"}
                name="lampu_kuning"
                value={data.lampu_kuning}
                errors={errors.lampu_kuning}
                onChange={(e) => setData("lampu_kuning", e.target.value)}
            />
            <InputText
                className="w-full"
                type="number"
                label={"Durasi Lampu Merah (Dtk)"}
                name="lampu_hijau"
                value={data.lampu_hijau}
                errors={errors.lampu_hijau}
                onChange={(e) => setData("lampu_hijau", e.target.value)}
            />
            <div className="flex gap-3">
                <button className="bg-green-500 py-2 px-3 rounded-md text-white">
                    Update Durasi Lampu
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-red-500 py-2 px-3 rounded-md text-white"
                >
                    Batal
                </button>
            </div>
        </form>
    );
}
