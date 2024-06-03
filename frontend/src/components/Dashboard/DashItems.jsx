import React from "react";
import { TextField, Select, FormControl, MenuItem, InputLabel } from "@mui/material";
import { useFormik } from "formik";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from "axios";
import * as Yup from 'yup'
import { useState } from "react";

export const DashItems = ({ selectedItem, setSelectedItem }) => {
    const [serverError, setServerError] = useState("")

    const formik = useFormik({
        initialValues: {
            'date': dayjs(),
            'time': dayjs(),
            'address': '',
            'repeating': 0,
        },
        validationSchema: Yup.object({
            date: Yup.date().required("Required"),
            time: Yup.date().required("Required"),
            address: Yup.string(),
            repeating: Yup.number().required("Required"),
        }),
        onSubmit: (values) => {
            axios.post('http://127.0.0.1:5000/api/schedule', values)
        }
    })

    return (
        <div className="flex flex-col w-[60vw] mx-auto justify-around">
            <div className="mb-10">
                <h1 className="text-[2rem] text-center font-[500]">{selectedItem === 'Schedule' ? "Schedule a collection" : selectedItem}</h1>
            </div>
            {selectedItem == 'Schedule' && 
                <form onSubmit={formik.handleSubmit} className="schedule-form flex flex-col justify-around h-[70vh]">
                    <label>
                        Date* :
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Collection Date"
                                name="date"
                                value={formik.values.date}
                                onChange={formik.handleChange}
                            />
                        </LocalizationProvider>
                    </label>
                    {formik.errors.date && formik.touched.date ? (
                        <div className="text-red-500">formik</div>
                    ) : null}
                    <hr />
                    <label>
                        Time* :
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker name="time" label="Collection Time" value={formik.values.time} onChange={formik.handleChange} />
                        </LocalizationProvider>
                    </label>
                    {formik.errors.time && formik.touched.time ? (
                        <div className="text-red-500">{formik.errors.time}</div>
                    ) : null}
                    <hr />
                    <label>
                        Address (Leave blank to use your default address):
                        <TextField name="address" id="outlined-basic" variant="outlined" value={formik.values.address} onChange={formik.handleChange}/>
                    </label>
                    {formik.errors.address && formik.touched.address ? (
                        <div className="text-red-500">{formik.errors.address}</div>
                    ) : null}
                    <hr />
                    <label>
                        Repetition:
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-filled-label">Repeating</InputLabel>
                            <Select
                            label="Repeating"
                            id="demo-simple-select-filled"
                            name="repeating"
                            value={formik.values.repeating}
                            onChange={formik.handleChange}
                            >
                                <MenuItem value={0}>
                                    None
                                </MenuItem>
                                <MenuItem value={1}>Two times a week</MenuItem>
                                <MenuItem value={2}>Weekly</MenuItem>
                                <MenuItem value={3}>Once every 2 weeks</MenuItem>
                            </Select>
                        </FormControl>
                    </label>
                    <button className="font-serif h-9 bg-[#207855] text-white rounded-md mt-4" type="submit">Submit</button>
                </form> }
            {selectedItem == 'Achievements' &&
            <div className="achievement-cards flex justify-around">
                <div className="card rounded-md shadow-md hover:scale-110 transition duration-300 ease-in-out cursor-pointer">
                    <img src="" alt="" />
                    <h1>Card 1</h1>
                </div>
            </div>
            }
        </div>
    );
}