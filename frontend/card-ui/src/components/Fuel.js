import React, { useEffect, useState } from 'react';
import FuelService from '../services/FuelService';
import CardService from '../services/CardService';
import { AiOutlineEdit, AiOutlineClose } from 'react-icons/ai';
import { useFormik } from 'formik';
import { cardSchema } from '../validation/schema';
import { fuelSchema } from '../validation/schema';

function Fuel({ cardId, toggleForm, theme }) {

    const [fuels, setFuels] = useState([]);
    const [fetch, setFetch] = useState(true);
    const [fuelId, setFuelId] = useState();
    const [editMode, setEditMode] = useState(false);

    const onSubmit = (values, actions) => {
        if (editMode) {
            FuelService.editFuel(fuelId, values)
                .then(
                    (response) => {
                        console.log(response);
                        retrieveFuelByCardId();
                        actions.resetForm();
                    },
                    (error) => {
                        console.log(error);
                    }
                )
        } else {
            FuelService.create(cardId, values)
                .then(
                    (response) => {
                        console.log(response);
                        retrieveFuelByCardId();
                        actions.resetForm();
                    },
                    (error) => {
                        console.log(error);
                    }
                )
        }
    }

    const { values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue } = useFormik({
        initialValues: {
            refuelingDate: '',
            refuelingLocation: '',
            vehicleCounter: '',
            refuelingAmount: ''
        },
        validationSchema: fuelSchema,
        enableReinitialize: true,
        onSubmit
    })

    const loadFuelToEdit = (id) => {
        if (toggleForm == false) {
            console.log("Toggle form first")
        } else {
            setEditMode(true);
            FuelService.singleFuel(id)
                .then(response => {
                    setFieldValue('refuelingDate', response.data.refuelingDate)
                    setFieldValue('refuelingLocation', response.data.refuelingLocation)
                    setFieldValue('vehicleCounter', response.data.vehicleCounter)
                    setFieldValue('refuelingAmount', response.data.refuelingAmount)
                    setFuelId(response.data.id);
                })
                .catch(e => {
                    console.log(e);
                })
        }
    }

    const deleteFuel = (id) => {
        FuelService.deleteFuel(id)
            .then(response => {
                console.log("deleted");
                retrieveFuelByCardId();
            })
            .catch(e => {
                console.log(e);
            })
    }

    const retrieveFuelByCardId = () => {
        CardService.getFuelFromCard(cardId)
            .then(response => {
                setFuels(response.data);
            })
            .catch(e => {
                console.log(e);
            })
    }

    useEffect(() => {
        fetch && retrieveFuelByCardId();
    }, [editMode]);

    return (
        <div className={theme ? 'dark flex flex-col mx-1 py-1 rounded items-center' : 'flex flex-col mx-1 py-1 rounded items-center'}>
            {toggleForm &&
                <div className='md:w-1/2'>
                    <form onSubmit={handleSubmit} className='bg-slate-100 dark:bg-slate-700 mb-1 rounded'>
                        <div className='md:flex md:items-center'>
                            <div className='md:py-1 md:border-r-2 dark:border-slate-900'>
                                <div className='grid grid-cols-4 gap-1 items-center px-1'>
                                    <input
                                        type={"text"}
                                        name={'refuelingDate'}
                                        placeholder={'date'}
                                        value={values.refuelingDate}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={errors.refuelingDate && touched.refuelingDate ? 'px-1 border-b-2 border-red-600 outline-0 dark:bg-slate-500 dark:text-slate-200' : 'px-1 border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300 dark:bg-slate-500 dark:text-slate-200 dark:focus:border-blue-800'}
                                    />
                                    <input
                                        type={"text"}
                                        name={'refuelingLocation'}
                                        placeholder={'location'}
                                        value={values.refuelingLocation}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={errors.refuelingLocation && touched.refuelingLocation ? 'px-1 border-b-2 border-red-600 outline-0 dark:bg-slate-500 dark:text-slate-200' : 'px-1 border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300 dark:bg-slate-500 dark:text-slate-200 dark:focus:border-blue-800'}
                                    />
                                    <input
                                        type={"number"}
                                        name={'vehicleCounter'}
                                        placeholder={'counter'}
                                        value={values.vehicleCounter}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={errors.vehicleCounter && touched.vehicleCounter ? 'px-1 border-b-2 border-red-600 outline-0 dark:bg-slate-500 dark:text-slate-200' : 'px-1 border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300 dark:bg-slate-500 dark:text-slate-200 dark:focus:border-blue-800'}
                                    />
                                    <input
                                        type={"number"}
                                        name={'refuelingAmount'}
                                        placeholder={'amount'}
                                        value={values.refuelingAmount}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={errors.refuelingAmount && touched.refuelingAmount ? 'px-1 border-b-2 border-red-600 outline-0 dark:bg-slate-500 dark:text-slate-200' : 'px-1 border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300 dark:bg-slate-500 dark:text-slate-200 dark:focus:border-blue-800'}
                                    />
                                </div>
                            </div>
                            <div className='flex m-1 rounded text-black md:flex-col md:items-center'>
                                {/* {editMode ?
                                    <button onClick={onSubmitEditedFuel} className='px-1 mb-1 bg-blue-400 dark:bg-blue-900 text-white dark:text-slate-300 rounded md:my-1 hover:bg-slate-300 dark:hover:bg-gray-600 hover:text-gray-600'>Save</button>
                                    : <button onClick={onSubmitNewFuel} className='px-1 mb-1 bg-blue-400 dark:bg-blue-900 text-white dark:text-slate-300 rounded md:my-1 hover:bg-slate-300 dark:hover:bg-gray-600 hover:text-gray-600'>Add</button>} */}
                                <button type='submit' className='px-1 mb-1 bg-blue-400 dark:bg-blue-900 text-white dark:text-slate-300 rounded md:my-1 hover:bg-slate-300 dark:hover:bg-gray-600 hover:text-gray-600'>Add</button>
                            </div>
                        </div>
                    </form>
                </div>
            }
            <div className='flex w-full overflow-x-auto justify-center'>
                <table className='w-full md:w-1/2 bg-slate-200 dark:bg-slate-700 rounded text-sm table-auto text-center'>
                    <thead className='text-gray-400'>
                        <tr className='text-slate-500 dark:text-slate-400 border-b-2 border-white dark:border-zinc-500 uppercase text-xs'>
                            <th className='px-2'>date</th>
                            <th className='px-2'>location</th>
                            <th className='px-2'>counter</th>
                            <th className='px-2'>amount</th>
                            <th className=''></th>
                        </tr>
                    </thead>
                    <tbody className='text-slate-600 dark:text-slate-300'>
                        {fuels.map((fuel, index) => (
                            <tr key={index} className='border-t-2 border-white dark:border-zinc-500 hover:bg-blue-400 dark:hover:bg-slate-900 hover:text-white dark:hover:text-gray-200'>
                                <td>{fuel.refuelingDate}</td>
                                <td>{fuel.refuelingLocation}</td>
                                <td>{fuel.vehicleCounter}</td>
                                <td>{fuel.refuelingAmount}</td>
                                <td className='bg-slate-300 dark:bg-slate-800 text-slate-600 dark:text-slate-300'>
                                    <div className='flex flex-col md:flex-row items-center md:justify-center rounded cursor-pointer py-1'>
                                        <i className='rounded p-1 hover:bg-white dark:hover:bg-gray-400 hover:text-blue-600 dark:hover:text-blue-800' onClick={() => loadFuelToEdit(fuel.id)}><AiOutlineEdit /></i>
                                        <i className='rounded p-1 hover:bg-white dark:hover:bg-gray-400 hover:text-red-600' onClick={() => deleteFuel(fuel.id)}><AiOutlineClose /></i>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Fuel;