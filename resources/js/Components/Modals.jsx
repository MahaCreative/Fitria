import { Close } from "@mui/icons-material";
import { Modal } from "@mui/material";
import React from "react";

export default function Modals({ open, onClose, children, title }) {
    return (
        <>
            <Modal open={open} onClose={onClose}>
                <div className="w-full h-full flex justify-center items-center px-4 md:px-8 lg:px-16">
                    <div className="bg-white py-3 px-4 rmd  w-full md:w-1/2 rounded-md">
                        <div className="flex justify-between items-center">
                            <p className="capitalize font-bold text-lg text-slate-800 tracking-tighter leading-3">
                                {title}
                            </p>
                            <button
                                onClick={onClose}
                                className="text-xl font-bold leading-3 hover:bg-slate-950 hover:text-white rounded-md py-2 px-3 hover:cursor-pointer"
                            >
                                <Close color="inherit" fontSize="inherit" />
                            </button>
                        </div>
                        <div className="my-3">{children}</div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
