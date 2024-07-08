import InputText from "@/Components/InputText";
import Layouts from "@/Layout/Layouts";
import { useForm } from "@inertiajs/react";
import React from "react";

import Swal from "sweetalert2";
export default function Login() {
    const { data, setData, post, reset, errors } = useForm({
        name: "",
        password: "",
    });
    const submit = (e) => {
        e.preventDefault();
        post(route("login"), {
            onError: () => {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Login gagal.",
                });
            },
        });
    };
    return (
        <div className="w-full h-screen flex justify-center items-center px-8 md:px-16">
            <div className="bg-white py-2 px-3 w-full md:w-1/2 lg:w-1/3 rounded-md">
                <h3 className="text-center font-bold text-slate-900 text-xl md:text-2xl lg:text-3xl my-5">
                    Login
                </h3>
                <form onSubmit={submit} className="w-full flex flex-col gap-3">
                    <InputText
                        className="w-full "
                        label={"username"}
                        name="name"
                        errors={errors.name}
                        value={data.name}
                        onChange={(e) =>
                            setData({
                                ...data,
                                [e.target.name]: e.target.value,
                            })
                        }
                    />
                    <InputText
                        className="w-full"
                        label={"Password"}
                        name="password"
                        type="password"
                        errors={errors.password}
                        value={data.password}
                        onChange={(e) =>
                            setData({
                                ...data,
                                [e.target.name]: e.target.value,
                            })
                        }
                    />
                    <button className="bg-blue-500 py-2 px-3 text-white">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
Login.layout = (page) => <Layouts children={page} title={"Login"} />;
