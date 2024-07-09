import InputText from "@/Components/InputText";
import { useForm } from "@inertiajs/react";
import React from "react";

export default function GantiToken() {
    const { data, setData, post, reset, errors } = useForm({
        channel: "",
        token: "",
        idToken: "",
    });
    const submit = (e) => {
        e.preventDefault();
        post(route("store-token"));
    };
    return (
        <form
            onSubmit={submit}
            className="flex w-full h-screen justify-center items-center flex-col gap-3 px-16"
        >
            <InputText
                className="w-full"
                name="idToken"
                label="ID TOKEN"
                value={data.idToken}
                onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                }
                error={errors.idToken}
            />
            <InputText
                className="w-full"
                name="channel"
                label="Channel"
                value={data.channel}
                onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                }
                error={errors.channel}
            />
            <InputText
                className="w-full"
                name="token"
                label="token"
                value={data.token}
                onChange={(e) =>
                    setData({ ...data, [e.target.name]: e.target.value })
                }
                error={errors.token}
            />
            <button className="bg-blue-500 py-2 px-3 text-white">
                Ganti Token
            </button>
        </form>
    );
}
