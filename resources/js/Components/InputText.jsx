import { TextField } from "@mui/material";
import React from "react";

export default function InputText({ label, errors, ...props }) {
    return (
        <>
            <TextField
                {...props}
                id="filled-error-helper-text"
                label={label}
                errors={errors ? true : false}
                variant="filled"
            />
            {errors && <p className="text-red-500 italic text-xs">{errors}</p>}
        </>
    );
}
