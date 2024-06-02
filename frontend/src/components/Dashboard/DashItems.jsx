import React from "react";
import { TextField } from "@mui/material";
import { useFormik } from "formik";

export const DashItems = ({ selectedItem, setSelectedItem }) => {
    const formik = useFormik({
        initialValues: {
            'date': '',
            'time': '',
            'address': '',
            'description': '',
        },
        onSubmit: (values) => {
            
        }
    })

    return (
        <div className="flex flex-col w-[60vw] m-auto justify-around">
            <div>
                <h1 className="text-[2rem] text-center font-serif">{selectedItem === 'Schedule' ? "Schedule a collection" : selectedItem}</h1>
            </div>
            {selectedItem == 'Schedule' && 
                <form className="schedule-form flex flex-col justify-around h-[70vh]">
                    <label>
                        Date:
                        <input type="date" name="date" />
                    </label>
                    <hr />
                    <label>
                        Time:
                        <input type="time" name="time" />
                    </label>
                    <hr />
                    <label>
                        Address (Leave blank to use your default address):
                        <TextField id="outlined-basic" variant="outlined" name="address" value={formik.values.address} onChange={formik.handleChange}/>
                    </label>
                    <hr />
                    <label>
                        Description:
                        <TextField id="outlined-basic" variant="outlined" name="Description" value={formik.values.Description} onChange={formik.handleChange}/>
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