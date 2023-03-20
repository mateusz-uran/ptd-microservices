import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Button, TextField } from '@mui/material';
import { useFormik } from "formik";
import FuelService from '../services/FuelService';

function AddFuel(props) {
    const navigate = useNavigate();
    let { cardId } = useParams();

    const formik = useFormik({
        initialValues: {
            refuelingDate: '',
            refuelingLocation: '',
            vehicleCounter: '',
            refuelingAmount: ''
        },
        validationSchema: Yup.object({
            refuelingDate: Yup.string().required("Cannot be empty"),
            refuelingLocation: Yup.string().required("Cannot be empty"),
            vehicleCounter: Yup.string().required("Cannot be empty"),
            refuelingAmount: Yup.string().required("Cannot be empty"),
        }),
        onSubmit: (values) => {
            FuelService.create(cardId, values)
                .then(() => {
                    navigate(-1);
                }, (error) => {
                    console.log(error)
                })
        },
    });

    return (
        <div>
            <div className='text-left p-2'>
                <Button variant="outlined" onClick={() => navigate(-1)} sx={{ fontWeight: 'bold' }}>Go back</Button>
            </div>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <TextField
                        name="refuelingDate"
                        label="Date"
                        value={formik.values.refuelingDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.refuelingDate && Boolean(formik.errors.refuelingDate)}
                        helperText={formik.touched.refuelingDate && formik.errors.refuelingDate}
                        sx={{ margin: 1 }}
                    />
                    <TextField
                        name="refuelingLocation"
                        label="Location"
                        value={formik.values.refuelingLocation}
                        onChange={formik.handleChange}
                        error={formik.touched.refuelingLocation && Boolean(formik.errors.refuelingLocation)}
                        helperText={formik.touched.refuelingLocation && formik.errors.refuelingLocation}
                        sx={{ margin: 1 }}
                    />
                    <TextField
                        name="vehicleCounter"
                        label="Counter"
                        value={formik.values.vehicleCounter}
                        onChange={formik.handleChange}
                        error={formik.touched.vehicleCounter && Boolean(formik.errors.vehicleCounter)}
                        helperText={formik.touched.vehicleCounter && formik.errors.vehicleCounter}
                        sx={{ margin: 1 }}
                    />
                    <TextField
                        name="refuelingAmount"
                        label="Amount"
                        value={formik.values.refuelingAmount}
                        onChange={formik.handleChange}
                        error={formik.touched.refuelingAmount && Boolean(formik.errors.refuelingAmount)}
                        helperText={formik.touched.refuelingAmount && formik.errors.refuelingAmount}
                        sx={{ margin: 1 }}
                    />
                </div>
                <div className='text-right p-2'>
                    <Button type="submit" variant='contained' sx={{ marginRight: 1, fontWeight: 'bold' }}>Submit</Button>
                </div>
            </form>
        </div>
    );
}

export default AddFuel;