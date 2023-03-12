import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { Button, Divider, TextField } from '@mui/material';
import { useFormik } from "formik";
import TripService from '../services/TripService';

function AddTripFormikUI(props) {
    const navigate = useNavigate();
    let { cardId } = useParams();

    const formik = useFormik({
        initialValues: {
            rows: [{
                dayStart: '', hourStart: '', locationStart: '', countryStart: '', counterStart: '',
                dayEnd: '', hourEnd: '', locationEnd: '', countryEnd: '', counterEnd: ''
            }]
        },
        validationSchema: Yup.object().shape({
            rows: Yup.array().of(
                Yup.object().shape({
                    dayStart: Yup.string().min(2, 'Must be longer then 2 characters').required("Day start cannot be empty"),
                    hourStart: Yup.string().required("Hour start cannot be empty"),
                    locationStart: Yup.string().required("Location start cannot be empty"),
                    countryStart: Yup.string().required("Country start cannot be empty"),
                    counterStart: Yup.number("Must be number").positive("Must be positive").integer("Must be number").required("Counter start cannot be empty"),

                    dayEnd: Yup.string().required("Day end cannot be empty"),
                    hourEnd: Yup.string().required("Hour end cannot be empty"),
                    locationEnd: Yup.string().required("Location end cannot be empty"),
                    countryEnd: Yup.string().required("Country end cannot be empty"),
                    counterEnd: Yup.number().positive("Must be positive").integer().required("Counter end cannot be empty"),
                })
            )
        }),
        onSubmit: (values) => {
            TripService.createFixed(cardId, values.rows).then(
                () => {
                    navigate(-1);
                },
                (error) => {
                    console.log(error);
                }
            )
        }
    });

    const handleAddRow = () => {
        formik.setValues({
            ...formik.values,
            rows: [...formik.values.rows,
            {
                dayStart: '', hourStart: '',
                locationStart: '', countryStart: '',
                counterStart: '',
                dayEnd: '', hourEnd: '',
                locationEnd: formik.values.rows.length ? formik.values.rows[formik.values.rows.length - 1].locationEnd : '',
                countryEnd: formik.values.rows.length ? formik.values.rows[formik.values.rows.length - 1].countryEnd : '',
                counterEnd: formik.values.rows.length ? formik.values.rows[formik.values.rows.length - 1].counterEnd : ''
            }
            ]
        });
    };

    const handleRemoveRow = (index) => {
        const rows = [...formik.values.rows];
        rows.splice(index, 1);
        formik.setValues({
            ...formik.values,
            rows: rows
        });
    };

    return (
        <div>
            <div className='text-left p-2'>
                <Button variant="outlined" onClick={() => navigate(-1)} sx={{ fontWeight: 'bold' }}>Go back</Button>
            </div>
            <form onSubmit={formik.handleSubmit}>
                {formik.values.rows.map((row, index) => (
                    <div key={index}>
                        <div className='flex flex-col'>
                            <div>
                                <p>Start</p>
                                <TextField
                                    label="Day"
                                    name={`rows.${index}.dayStart`}
                                    value={formik.values.rows[index].dayStart}
                                    onChange={formik.handleChange}
                                    error={formik.touched.rows?.[index]?.dayStart && Boolean(formik.errors.rows?.[index]?.dayStart)}
                                    helperText={formik.touched.rows?.[index]?.dayStart && formik.errors.rows?.[index]?.dayStart}
                                    sx={{ margin: 1 }}
                                />
                                <TextField
                                    label="Hour"
                                    name={`rows.${index}.hourStart`}
                                    value={formik.values.rows[index].hourStart}
                                    onChange={formik.handleChange}
                                    error={formik.touched.rows?.[index]?.hourStart && Boolean(formik.errors.rows?.[index]?.hourStart)}
                                    helperText={formik.touched.rows?.[index]?.hourStart && formik.errors.rows?.[index]?.hourStart}
                                    sx={{ margin: 1 }}
                                />
                                <TextField
                                    label="Location"
                                    name={`rows.${index}.locationStart`}
                                    value={formik.values.rows[index].locationStart}
                                    onChange={formik.handleChange}
                                    error={formik.touched.rows?.[index]?.locationStart && Boolean(formik.errors.rows?.[index]?.locationStart)}
                                    helperText={formik.touched.rows?.[index]?.locationStart && formik.errors.rows?.[index]?.locationStart}
                                    sx={{ margin: 1 }}
                                />
                                <TextField
                                    label="Country"
                                    name={`rows.${index}.countryStart`}
                                    value={formik.values.rows[index].countryStart}
                                    onChange={formik.handleChange}
                                    error={formik.touched.rows?.[index]?.countryStart && Boolean(formik.errors.rows?.[index]?.countryStart)}
                                    helperText={formik.touched.rows?.[index]?.countryStart && formik.errors.rows?.[index]?.countryStart}
                                    sx={{ margin: 1 }}
                                />
                                <TextField
                                    label="Counter"
                                    name={`rows.${index}.counterStart`}
                                    value={formik.values.rows[index].counterStart}
                                    onChange={formik.handleChange}
                                    error={formik.touched.rows?.[index]?.counterStart && Boolean(formik.errors.rows?.[index]?.counterStart)}
                                    helperText={formik.touched.rows?.[index]?.counterStart && formik.errors.rows?.[index]?.counterStart}
                                    sx={{ margin: 1 }}
                                />
                            </div>
                            <div>
                                <p>End</p>
                                <TextField
                                    label="Day"
                                    name={`rows.${index}.dayEnd`}
                                    value={formik.values.rows[index].dayEnd}
                                    onChange={formik.handleChange}
                                    error={formik.touched.rows?.[index]?.dayEnd && Boolean(formik.errors.rows?.[index]?.dayEnd)}
                                    helperText={formik.touched.rows?.[index]?.dayEnd && formik.errors.rows?.[index]?.dayEnd}
                                    sx={{ margin: 1 }}
                                />
                                <TextField
                                    label="Hour"
                                    name={`rows.${index}.hourEnd`}
                                    value={formik.values.rows[index].hourEnd}
                                    onChange={formik.handleChange}
                                    error={formik.touched.rows?.[index]?.hourEnd && Boolean(formik.errors.rows?.[index]?.hourEnd)}
                                    helperText={formik.touched.rows?.[index]?.hourEnd && formik.errors.rows?.[index]?.hourEnd}
                                    sx={{ margin: 1 }}
                                />
                                <TextField
                                    label="Location"
                                    name={`rows.${index}.locationEnd`}
                                    value={formik.values.rows[index].locationEnd}
                                    onChange={formik.handleChange}
                                    error={formik.touched.rows?.[index]?.locationEnd && Boolean(formik.errors.rows?.[index]?.locationEnd)}
                                    helperText={formik.touched.rows?.[index]?.locationEnd && formik.errors.rows?.[index]?.locationEnd}
                                    sx={{ margin: 1 }}
                                />
                                <TextField
                                    label="Country"
                                    name={`rows.${index}.countryEnd`}
                                    value={formik.values.rows[index].countryEnd}
                                    onChange={formik.handleChange}
                                    error={formik.touched.rows?.[index]?.countryEnd && Boolean(formik.errors.rows?.[index]?.countryEnd)}
                                    helperText={formik.touched.rows?.[index]?.countryEnd && formik.errors.rows?.[index]?.countryEnd}
                                    sx={{ margin: 1 }}
                                />
                                <TextField
                                    label="Counter"
                                    name={`rows.${index}.counterEnd`}
                                    value={formik.values.rows[index].counterEnd}
                                    onChange={formik.handleChange}
                                    error={formik.touched.rows?.[index]?.counterEnd && Boolean(formik.errors.rows?.[index]?.counterEnd)}
                                    helperText={formik.touched.rows?.[index]?.counterEnd && formik.errors.rows?.[index]?.counterEnd}
                                    sx={{ margin: 1 }}
                                />
                            </div>
                            <div className='text-right'>
                                <Button
                                    type="button"
                                    onClick={() => handleRemoveRow(index)}
                                    disabled={formik.values.rows.length < 2 ? true : false}
                                    variant="outlined"
                                >Remove</Button>
                            </div>
                        </div>
                        <Divider sx={{ paddingBottom: 2 }} />
                    </div>
                ))}
                <div className='text-right p-2'>
                    <Button type="submit" variant='contained' sx={{ marginRight: 1, fontWeight: 'bold' }}>Submit</Button>
                    <Button type="button" onClick={handleAddRow} variant="outlined">Add Row</Button>
                </div>
            </form>
        </div>
    );
}

export default AddTripFormikUI;