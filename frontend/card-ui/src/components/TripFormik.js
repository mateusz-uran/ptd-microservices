import React, { useState, useEffect } from 'react';
import TripService from '../services/TripService';
import CardService from '../services/CardService';
import { Formik, Field, Form, ErrorMessage, FieldArray } from 'formik';
import { trips } from '../validation/schema';
import { AiOutlinePlus, AiOutlineMinus, AiOutlineEdit, AiOutlineClose } from 'react-icons/ai';
import { toast } from 'react-toastify';
import Alert from './Alert';

function TripFormik(props) {
    const { cardId, cardReady, toggleForm, theme } = props;

    const [fetch, setFetch] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [fetchedTrips, setFetchedTrips] = useState([]);
    const [trip, setTrip] = useState({
        dayStart: '', hourStart: '', locationStart: '', countryStart: '', counterStart: '',
        dayEnd: '', hourEnd: '', locationEnd: '', countryEnd: '', counterEnd: ''
    });

    let initialValues = {}
    if (!editMode) {
        initialValues = {
            inputFields: [{
                dayStart: '', hourStart: '', locationStart: '', countryStart: '', counterStart: '',
                dayEnd: '', hourEnd: '', locationEnd: '', countryEnd: '', counterEnd: ''
            }]
        }
    } else {
        if (trip && trip != null) {
            initialValues = {
                inputFields: [{
                    dayStart: trip.dayStart, hourStart: trip.hourStart, locationStart: trip.locationStart, countryStart: trip.countryStart, counterStart: trip.counterStart,
                    dayEnd: trip.dayEnd, hourEnd: trip.hourEnd, locationEnd: trip.locationEnd, countryEnd: trip.countryEnd, counterEnd: trip.counterEnd
                }]
            }
        } else { console.log("Trip value is empty.") }
    }

    const onSubmitNewTrip = (values, actions) => {
        TripService.create(cardId, values.inputFields).then(
            (response) => {
                retrieveTripByCardId();
                actions.resetForm();
            },
            (error) => {
                console.log(error);
            }
        )
    }

    const onSubmitEditedTrip = (values, actions) => {
        TripService.editTrip(trip.id, values.inputFields[0]).then(
            (response) => {
                retrieveTripByCardId();
                actions.resetForm();
                setEditMode(false);
            },
            (error) => {
                console.log(error);
            }
        )
    }

    const loadTripToEdit = (id) => {
        if (toggleForm === false) {
            toast.warning("Toggle add form first.")
        } else {
            setEditMode(true);
            TripService.retrieveSingle(id)
                .then(response => {
                    setTrip(response.data);
                    setEditMode(true);
                })
                .catch(e => {
                    console.log(e);
                })
        }
    }

    const [confirmOpen, setConfirmOpen] = useState();
    const [id, setId] = useState();

    const handleModal = (id) => {
        setConfirmOpen(true);
        setId(id);
    }

    const deleteTrip = (id) => {
        TripService.deleteTrip(id)
            .then(response => {
                retrieveTripByCardId();
            })
            .catch(e => {
                console.log(e);
            })
    }

    const retrieveTripByCardId = () => {
        CardService.getTripFromCard(cardId)
            .then(response => {
                setFetchedTrips(response.data);
            })
            .catch(e => {
                console.log(e);
            })
    }

    useEffect(() => {
        fetch && retrieveTripByCardId();
    }, [editMode]);

    return (
        <div className={theme ? 'dark flex flex-col mx-1 py-1 rounded' : 'flex flex-col mx-1 py-1 rounded'}>
            <Alert
                title={"Are you sure?"}
                description={"This process cannot be undone."}
                id={id}
                open={confirmOpen}
                setOpen={setConfirmOpen}
                onConfirm={deleteTrip}
                modalTheme={theme}
            />
            <div className={cardReady ? 'opacity-60' : ''}>
                {toggleForm && !cardReady &&
                    <Formik
                        initialValues={initialValues}
                        validationSchema={trips}
                        onSubmit={editMode ? onSubmitEditedTrip : onSubmitNewTrip}
                        enableReinitialize={true}
                    >
                        {({ values, errors, touched }) => (
                            <Form>
                                <FieldArray
                                    name='inputFields'
                                    render={arrayHelpers => {
                                        return (
                                            <div>
                                                {values.inputFields && values.inputFields.length > 0
                                                    ? values.inputFields.map((input, index) => (
                                                        <div key={index} className='bg-slate-100 dark:bg-slate-700 mb-2'>
                                                            <div className='md:flex'>
                                                                <div className='md:py-1 md:border-r-2 dark:border-slate-900'>
                                                                    <div className='flex flex-col'>
                                                                        <ErrorMessage
                                                                            name={`inputFields.${index}.dayStart`}
                                                                            component='span'
                                                                            className='text-red-600 text-xs font-light' />
                                                                        <ErrorMessage
                                                                            name={`inputFields.${index}.hourStart`}
                                                                            component='span'
                                                                            className='text-red-600 text-xs font-light' />
                                                                        <ErrorMessage
                                                                            name={`inputFields.${index}.locationStart`}
                                                                            component='span'
                                                                            className='text-red-600 text-xs font-light' />
                                                                        <ErrorMessage
                                                                            name={`inputFields.${index}.countryStart`}
                                                                            component='span'
                                                                            className='text-red-600 text-xs font-light' />
                                                                        <ErrorMessage
                                                                            name={`inputFields.${index}.counterStart`}
                                                                            component='span'
                                                                            className='text-red-600 text-xs font-light' />
                                                                    </div>
                                                                    <label className='text-sm text-gray-400 uppercase'>start</label>
                                                                    <div className='grid grid-cols-2 gap-2 items-center px-1 sm:grid-cols-5'>
                                                                        <Field
                                                                            placeholder='day'
                                                                            name={`inputFields.${index}.dayStart`}
                                                                            className={
                                                                                errors &&
                                                                                    errors.inputFields &&
                                                                                    errors.inputFields[index] &&
                                                                                    errors.inputFields[index].dayStart &&
                                                                                    touched &&
                                                                                    touched.inputFields &&
                                                                                    touched.inputFields[index] &&
                                                                                    touched.inputFields[index].dayStart ?
                                                                                    'px-1 border-b-2 border-red-600 outline-0 dark:bg-slate-500 dark:text-slate-200' :
                                                                                    'border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300 dark:bg-slate-500 dark:text-slate-200 dark:focus:border-blue-800'
                                                                            }
                                                                        />
                                                                        <Field
                                                                            placeholder='hour'
                                                                            name={`inputFields.${index}.hourStart`}
                                                                            className={
                                                                                errors &&
                                                                                    errors.inputFields &&
                                                                                    errors.inputFields[index] &&
                                                                                    errors.inputFields[index].hourStart &&
                                                                                    touched &&
                                                                                    touched.inputFields &&
                                                                                    touched.inputFields[index] &&
                                                                                    touched.inputFields[index].hourStart ?
                                                                                    'px-1 border-b-2 border-red-600 outline-0 dark:bg-slate-500 dark:text-slate-200' :
                                                                                    'border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300 dark:bg-slate-500 dark:text-slate-200 dark:focus:border-blue-800'
                                                                            }
                                                                        />
                                                                        <Field
                                                                            placeholder='location'
                                                                            name={`inputFields.${index}.locationStart`}
                                                                            className={
                                                                                errors &&
                                                                                    errors.inputFields &&
                                                                                    errors.inputFields[index] &&
                                                                                    errors.inputFields[index].locationStart &&
                                                                                    touched &&
                                                                                    touched.inputFields &&
                                                                                    touched.inputFields[index] &&
                                                                                    touched.inputFields[index].locationStart ?
                                                                                    'px-1 border-b-2 border-red-600 outline-0 dark:bg-slate-500 dark:text-slate-200' :
                                                                                    'border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300 dark:bg-slate-500 dark:text-slate-200 dark:focus:border-blue-800'
                                                                            }
                                                                        />
                                                                        <Field
                                                                            placeholder='country'
                                                                            name={`inputFields.${index}.countryStart`}
                                                                            className={
                                                                                errors &&
                                                                                    errors.inputFields &&
                                                                                    errors.inputFields[index] &&
                                                                                    errors.inputFields[index].countryStart &&
                                                                                    touched &&
                                                                                    touched.inputFields &&
                                                                                    touched.inputFields[index] &&
                                                                                    touched.inputFields[index].countryStart ?
                                                                                    'px-1 border-b-2 border-red-600 outline-0 dark:bg-slate-500 dark:text-slate-200' :
                                                                                    'border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300 dark:bg-slate-500 dark:text-slate-200 dark:focus:border-blue-800'
                                                                            }
                                                                        />
                                                                        <Field
                                                                            placeholder='counter'
                                                                            name={`inputFields.${index}.counterStart`}
                                                                            className={
                                                                                errors &&
                                                                                    errors.inputFields &&
                                                                                    errors.inputFields[index] &&
                                                                                    errors.inputFields[index].counterStart &&
                                                                                    touched &&
                                                                                    touched.inputFields &&
                                                                                    touched.inputFields[index] &&
                                                                                    touched.inputFields[index].counterStart ?
                                                                                    'flex flex-col col-start-1 col-end-3 sm:col-start-5 sm:col-end-5 border-b-2 border-red-600 outline-0 dark:bg-slate-500 dark:text-slate-200' :
                                                                                    'flex flex-col col-start-1 col-end-3 sm:col-start-5 sm:col-end-5 border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300 dark:bg-slate-500 dark:text-slate-200 dark:focus:border-blue-800'
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className='md:py-1 md:border-r-2 dark:border-slate-900'>
                                                                    <div className='flex flex-col'>
                                                                        <ErrorMessage
                                                                            name={`inputFields.${index}.dayEnd`}
                                                                            component='span'
                                                                            className='text-red-600 text-xs font-light' />
                                                                        <ErrorMessage
                                                                            name={`inputFields.${index}.hourEnd`}
                                                                            component='span'
                                                                            className='text-red-600 text-xs font-light' />
                                                                        <ErrorMessage
                                                                            name={`inputFields.${index}.locationEnd`}
                                                                            component='span'
                                                                            className='text-red-600 text-xs font-light' />
                                                                        <ErrorMessage
                                                                            name={`inputFields.${index}.countryEnd`}
                                                                            component='span'
                                                                            className='text-red-600 text-xs font-light' />
                                                                        <ErrorMessage
                                                                            name={`inputFields.${index}.counterEnd`}
                                                                            component='span'
                                                                            className='text-red-600 text-xs font-light' />
                                                                    </div>
                                                                    <label className='text-sm text-gray-400 uppercase'>start</label>
                                                                    <div className='grid grid-cols-2 gap-2 items-center px-1 sm:grid-cols-5'>
                                                                        <Field
                                                                            placeholder='day'
                                                                            name={`inputFields.${index}.dayEnd`}
                                                                            className={
                                                                                errors &&
                                                                                    errors.inputFields &&
                                                                                    errors.inputFields[index] &&
                                                                                    errors.inputFields[index].dayEnd &&
                                                                                    touched &&
                                                                                    touched.inputFields &&
                                                                                    touched.inputFields[index] &&
                                                                                    touched.inputFields[index].dayEnd ?
                                                                                    'px-1 border-b-2 border-red-600 outline-0 dark:bg-slate-500 dark:text-slate-200' :
                                                                                    'border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300 dark:bg-slate-500 dark:text-slate-200 dark:focus:border-blue-800'
                                                                            }
                                                                        />
                                                                        <Field
                                                                            placeholder='hour'
                                                                            name={`inputFields.${index}.hourEnd`}
                                                                            className={
                                                                                errors &&
                                                                                    errors.inputFields &&
                                                                                    errors.inputFields[index] &&
                                                                                    errors.inputFields[index].hourEnd &&
                                                                                    touched &&
                                                                                    touched.inputFields &&
                                                                                    touched.inputFields[index] &&
                                                                                    touched.inputFields[index].hourEnd ?
                                                                                    'px-1 border-b-2 border-red-600 outline-0 dark:bg-slate-500 dark:text-slate-200' :
                                                                                    'border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300 dark:bg-slate-500 dark:text-slate-200 dark:focus:border-blue-800'
                                                                            }
                                                                        />
                                                                        <Field
                                                                            placeholder='location'
                                                                            name={`inputFields.${index}.locationEnd`}
                                                                            className={
                                                                                errors &&
                                                                                    errors.inputFields &&
                                                                                    errors.inputFields[index] &&
                                                                                    errors.inputFields[index].locationEnd &&
                                                                                    touched &&
                                                                                    touched.inputFields &&
                                                                                    touched.inputFields[index] &&
                                                                                    touched.inputFields[index].locationEnd ?
                                                                                    'px-1 border-b-2 border-red-600 outline-0 dark:bg-slate-500 dark:text-slate-200' :
                                                                                    'border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300 dark:bg-slate-500 dark:text-slate-200 dark:focus:border-blue-800'
                                                                            }
                                                                        />
                                                                        <Field
                                                                            placeholder='country'
                                                                            name={`inputFields.${index}.countryEnd`}
                                                                            className={
                                                                                errors &&
                                                                                    errors.inputFields &&
                                                                                    errors.inputFields[index] &&
                                                                                    errors.inputFields[index].countryEnd &&
                                                                                    touched &&
                                                                                    touched.inputFields &&
                                                                                    touched.inputFields[index] &&
                                                                                    touched.inputFields[index].countryEnd ?
                                                                                    'px-1 border-b-2 border-red-600 outline-0 dark:bg-slate-500 dark:text-slate-200' :
                                                                                    'border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300 dark:bg-slate-500 dark:text-slate-200 dark:focus:border-blue-800'
                                                                            }
                                                                        />
                                                                        <Field
                                                                            placeholder='counter'
                                                                            name={`inputFields.${index}.counterEnd`}
                                                                            className={
                                                                                errors &&
                                                                                    errors.inputFields &&
                                                                                    errors.inputFields[index] &&
                                                                                    errors.inputFields[index].counterEnd &&
                                                                                    touched &&
                                                                                    touched.inputFields &&
                                                                                    touched.inputFields[index] &&
                                                                                    touched.inputFields[index].counterEnd ?
                                                                                    'flex flex-col col-start-1 col-end-3 sm:col-start-5 sm:col-end-5 border-b-2 border-red-600 outline-0 dark:bg-slate-500 dark:text-slate-200' :
                                                                                    'flex flex-col col-start-1 col-end-3 sm:col-start-5 sm:col-end-5 border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300 dark:bg-slate-500 dark:text-slate-200 dark:focus:border-blue-800'
                                                                            }
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className={`flex m-1 rounded text-black md:flex-col md:items-center`}>
                                                                    <button
                                                                        disabled={values.inputFields.length > 1 ? false : true}
                                                                        type='button'
                                                                        onClick={() => arrayHelpers.remove(index)}
                                                                        className='px-1 rounded md:my-1 hover:bg-blue-400 dark:bg-gray-800 dark:hover:bg-blue-800 hover:text-white dark:text-white'
                                                                    ><AiOutlineMinus /></button>
                                                                    <button
                                                                        type='button'
                                                                        onClick={() => arrayHelpers.push({
                                                                            dayStart: '', hourStart: '', locationStart: values.inputFields[index].locationEnd, countryStart: values.inputFields[index].countryEnd, counterStart: values.inputFields[index].counterEnd,
                                                                            dayEnd: '', hourEnd: '', locationEnd: '', countryEnd: '', counterEnd: ''
                                                                        })}
                                                                        className='px-1 rounded md:my-1 hover:bg-blue-400 dark:bg-gray-800 dark:hover:bg-blue-800 hover:text-white dark:text-white'
                                                                    ><AiOutlinePlus /></button>
                                                                    <button
                                                                        type='submit'
                                                                        className='px-1 ml-1 mb-1 bg-blue-400 dark:bg-blue-900 text-white dark:text-slate-300 rounded md:my-1 hover:bg-slate-300 dark:hover:bg-gray-600 hover:text-gray-600'
                                                                    >Add</button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    ))
                                                    : null}
                                            </div>
                                        )
                                    }}

                                />
                            </Form>
                        )}
                    </Formik>
                }
                <div className='flex w-full overflow-x-auto'>
                    {fetchedTrips && fetchedTrips.length > 0 ?
                        <table className='w-full bg-slate-200 dark:bg-slate-700 rounded text-sm table-auto text-center'>
                            <thead className='text-gray-400'>
                                <tr className='uppercase border-b-2 border-white dark:border-zinc-500'>
                                    <th colSpan={5} className='border-r-4 border-blue-300 dark:border-blue-900'>start</th>
                                    <th colSpan={5} className=''>end</th>
                                </tr>
                                <tr className='text-slate-500 dark:text-slate-400 border-b-2 border-white dark:border-zinc-500 uppercase text-xs'>
                                    <th className='px-2'>day</th>
                                    <th className='px-2'>hour</th>
                                    <th className='px-2'>location</th>
                                    <th className='px-2'>country</th>
                                    <th className='px-2 border-r-4 border-blue-300 dark:border-blue-900'>counter</th>
                                    <th className='px-2'>day</th>
                                    <th className='px-2'>hour</th>
                                    <th className='px-2'>location</th>
                                    <th className='px-2'>country</th>
                                    <th className='px-2'>counter</th>
                                    <th className='px-2 border-l-2 border-gray-300 dark:border-gray-400'>mileage</th>
                                    <th className=''></th>
                                </tr>
                            </thead>
                            <tbody className='text-slate-600 dark:text-slate-300'>
                                {fetchedTrips.map((trip, index) => (
                                    <tr key={index} className='border-t-2 border-white dark:border-zinc-500 hover:bg-blue-400 dark:hover:bg-slate-900 hover:text-white dark:hover:text-gray-200'>
                                        <td className=''>{trip.dayStart}</td>
                                        <td className=''>{trip.hourStart}</td>
                                        <td className=''>{trip.locationStart}</td>
                                        <td className=''>{trip.countryStart}</td>
                                        <td className='border-r-4 border-blue-300 dark:border-blue-900'>{trip.counterStart}</td>
                                        <td className=''>{trip.dayEnd}</td>
                                        <td className=''>{trip.hourEnd}</td>
                                        <td className=''>{trip.locationEnd}</td>
                                        <td className=''>{trip.countryEnd}</td>
                                        <td className=''>{trip.counterEnd}</td>
                                        <td className='border-l-2 border-gray-300 dark:border-gray-400'>{trip.carMileage}</td>
                                        <td className='bg-slate-300 dark:bg-slate-800 text-slate-600 dark:text-slate-300'>
                                            <div className={`flex flex-col md:flex-row space-between md:justify-center rounded cursor-pointer py-1 ${cardReady ? 'invisible' : ''}`}>
                                                <i className='rounded p-1 hover:bg-white dark:hover:bg-gray-400 hover:text-blue-600 dark:hover:text-blue-800' onClick={() => loadTripToEdit(trip.id)}><AiOutlineEdit /></i>
                                                <i className='rounded p-1 hover:bg-white dark:hover:bg-gray-400 hover:text-red-600' onClick={() => handleModal(trip.id)}><AiOutlineClose /></i>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table> : <div className='flex justify-center w-full'><p className='text-slate-500 text-sm'>There is no trips information.</p></div>}
                </div>
            </div>
        </div>
    );
}

export default TripFormik;