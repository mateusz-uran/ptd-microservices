import React, { useEffect, useState } from 'react';
import CardService from '../services/CardService';
import TripService from '../services/TripService';
import { AiOutlinePlus, AiOutlineMinus, AiOutlineEdit, AiOutlineClose } from 'react-icons/ai';

function Trip({ cardId, toggleForm, theme }) {

    const [trips, setTrip] = useState([]);
    const [fetch, setFetch] = useState(true);
    const [tripId, setTripId] = useState();
    const [editMode, setEditMode] = useState(false);

    const [inputFields, setInputFields] = useState([
        {
            dayStart: '', hourStart: '', locationStart: '', countryStart: '', counterStart: '',
            dayEnd: '', hourEnd: '', locationEnd: '', countryEnd: '', counterEnd: ''
        }
    ])

    const [prevLocalization, setPrevLocalization] = useState('');
    const [prevCountry, setPrevCountry] = useState('');
    const [pervCoutner, setPrevCounter] = useState('');

    const handleFormChange = (index, event) => {
        let data = [...inputFields];
        data[index][event.target.name] = event.target.value;
        setInputFields(data);
        setPrevLocalization(data[index].locationEnd);
        setPrevCountry(data[index].countryEnd);
        setPrevCounter(data[index].counterEnd);
    }

    const addFields = () => {
        let newField = {
            dayStart: '', hourStart: '', locationStart: prevLocalization, countryStart: prevCountry, counterStart: pervCoutner,
            dayEnd: '', hourEnd: '', locationEnd: '', countryEnd: '', counterEnd: ''
        }
        setInputFields([...inputFields, newField])
    }

    const removeFields = (index) => {
        let data = [...inputFields];
        if (data.length == 1) {
            console.log("Single input row");
        } else {
            data.splice(index, 1)
            setInputFields(data)
        }
    }

    const onSubmitNewTrip = (e) => {
        e.preventDefault();
        TripService.create(cardId, inputFields).then(
            (response) => {
                console.log(response);
                retrieveTripByCardId();
                setInputFields([
                    {
                        dayStart: '', hourStart: '', locationStart: '', countryStart: '', counterStart: '',
                        dayEnd: '', hourEnd: '', locationEnd: '', countryEnd: '', counterEnd: ''
                    }
                ]);
            },
            (error) => {
                console.log(error);
            }
        )
    }

    const onSubmitEditedTrip = (e) => {
        e.preventDefault();
        let data = [...inputFields];
        TripService.editTrip(tripId, data[0]).then(
            (response) => {
                console.log(response);
                retrieveTripByCardId();
                setInputFields([
                    {
                        dayStart: '', hourStart: '', locationStart: '', countryStart: '', counterStart: '',
                        dayEnd: '', hourEnd: '', locationEnd: '', countryEnd: '', counterEnd: ''
                    }
                ]);
                setEditMode(false);
            },
            (error) => {
                console.log(error);
            }
        )
    }

    const loadTripToEdit = (id) => {
        if (toggleForm == false) {
            console.log("Toggle form first")
        } else {
            setEditMode(true);
            TripService.retrieveSingle(id)
                .then(response => {
                    let data = [...inputFields];
                    data[0] = response.data;
                    setInputFields(data);
                    setTripId(response.data.id);
                })
                .catch(e => {
                    console.log(e);
                })
        }
    }

    const deleteTrip = (id) => {
        TripService.deleteTrip(id)
            .then(response => {
                console.log("deleted")
                retrieveTripByCardId();
            })
            .catch(e => {
                console.log(e);
            })
    }

    const retrieveTripByCardId = () => {
        CardService.getTripFromCard(cardId)
            .then(response => {
                setTrip(response.data);
            })
            .catch(e => {
                console.log(e);
            })
    }
    useEffect(() => {
        fetch && retrieveTripByCardId();
    }, [tripId]);

    return (
        <div className={theme ? 'dark flex flex-col mx-1 py-1 rounded' : 'flex flex-col mx-1 py-1 rounded'}>
            {toggleForm &&
                <div>
                    {
                        inputFields.map((input, index) => {
                            return (
                                <form key={index} className='bg-slate-100 dark:bg-slate-700 mb-2'>
                                    <div className='md:flex'>
                                        <div className='md:py-1 md:border-r-2 dark:border-slate-900'>
                                            <label className='text-sm text-gray-400 uppercase'>start</label>
                                            <div className='grid grid-cols-2 gap-2 items-center px-1 sm:grid-cols-5'>
                                                <input
                                                    type={'text'}
                                                    name={'dayStart'}
                                                    placeholder={'day'}
                                                    value={input.dayStart}
                                                    onChange={event => handleFormChange(index, event)}
                                                    className='px-1 border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300 dark:bg-slate-500 dark:text-slate-200 dark:focus:border-blue-800'
                                                />
                                                <input
                                                    type={'text'}
                                                    name={'hourStart'}
                                                    placeholder={'hour'}
                                                    value={input.hourStart}
                                                    onChange={event => handleFormChange(index, event)}
                                                    className='px-1 border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300 dark:bg-slate-500 dark:text-slate-200 dark:focus:border-blue-800'
                                                />
                                                <input
                                                    type={'text'}
                                                    name={'locationStart'}
                                                    placeholder={'location'}
                                                    value={input.locationStart}
                                                    onChange={event => handleFormChange(index, event)}
                                                    className='px-1 border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300 dark:bg-slate-500 dark:text-slate-200 dark:focus:border-blue-800'
                                                />
                                                <input
                                                    type={'text'}
                                                    name={'countryStart'}
                                                    placeholder={'country'}
                                                    value={input.countryStart}
                                                    onChange={event => handleFormChange(index, event)}
                                                    className='px-1 border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300 dark:bg-slate-500 dark:text-slate-200 dark:focus:border-blue-800'
                                                />
                                                <input
                                                    type={'number'}
                                                    name={'counterStart'}
                                                    placeholder={'counter'}
                                                    value={input.counterStart}
                                                    onChange={event => handleFormChange(index, event)}
                                                    className='col-start-1 col-end-3 px-1 sm:col-start-5 sm:col-end-5 border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300 dark:bg-slate-500 dark:text-slate-200 dark:focus:border-blue-800'
                                                />
                                            </div>
                                        </div>
                                        <div className='md:py-1'>
                                            <label className='text-sm text-gray-400 uppercase'>end</label>
                                            <div className='grid grid-cols-2 gap-2 items-center px-1 sm:grid-cols-5'>
                                                <input
                                                    type={'text'}
                                                    name={'dayEnd'}
                                                    placeholder={'day'}
                                                    value={input.dayEnd}
                                                    onChange={event => handleFormChange(index, event)}
                                                    className='px-1 border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300 dark:bg-slate-500 dark:text-slate-200 dark:focus:border-blue-800'
                                                />
                                                <input
                                                    type={'text'}
                                                    name={'hourEnd'}
                                                    placeholder={'hour'}
                                                    value={input.hourEnd}
                                                    onChange={event => handleFormChange(index, event)}
                                                    className='px-1 border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300 dark:bg-slate-500 dark:text-slate-200 dark:focus:border-blue-800'
                                                />
                                                <input
                                                    type={'text'}
                                                    name={'locationEnd'}
                                                    placeholder={'location'}
                                                    value={input.locationEnd}
                                                    onChange={event => handleFormChange(index, event)}
                                                    className='px-1 border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300 dark:bg-slate-500 dark:text-slate-200 dark:focus:border-blue-800'
                                                />
                                                <input
                                                    type={'text'}
                                                    name={'countryEnd'}
                                                    placeholder={'country'}
                                                    value={input.countryEnd}
                                                    onChange={event => handleFormChange(index, event)}
                                                    className='px-1 border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300 dark:bg-slate-500 dark:text-slate-200 dark:focus:border-blue-800'
                                                />
                                                <input
                                                    type={'number'}
                                                    name={'counterEnd'}
                                                    placeholder={'counter'}
                                                    value={input.counterEnd}
                                                    onChange={event => handleFormChange(index, event)}
                                                    className='col-start-1 col-end-3 px-1 sm:col-start-5 sm:col-end-5 border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300 dark:bg-slate-500 dark:text-slate-200 dark:focus:border-blue-800'
                                                />
                                            </div>
                                        </div>
                                        <div className='flex m-1 rounded text-black md:flex-col md:items-center'>
                                            <button type='button' onClick={addFields} className='px-1 rounded md:my-1 hover:bg-blue-400 dark:bg-gray-800 dark:hover:bg-blue-800 hover:text-white dark:text-white'><AiOutlinePlus /></button>
                                            <button type='button' onClick={() => removeFields(index)} className='px-1 rounded md:my-1 hover:bg-blue-400 dark:bg-gray-800 dark:hover:bg-blue-800 hover:text-white dark:text-white'><AiOutlineMinus /></button>
                                            {editMode ?
                                                <button onClick={onSubmitEditedTrip} className='px-1 ml-1 mb-1 bg-blue-400 dark:bg-blue-900 text-white dark:text-slate-300 rounded md:my-1 hover:bg-slate-300 dark:hover:bg-gray-600 hover:text-gray-600'>Save</button>
                                                : <button onClick={onSubmitNewTrip} className='px-1 ml-1 mb-1 bg-blue-400 dark:bg-blue-900 text-white dark:text-slate-300 rounded md:my-1 hover:bg-slate-300 dark:hover:bg-gray-600 hover:text-gray-600'>Add</button>}
                                        </div>
                                    </div>
                                </form>
                            )
                        })
                    }
                </div>
            }
            <div className='flex w-full overflow-x-auto'>
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
                        {trips.map((trip, index) => (
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
                                <td className='bg-slate-300 dark:bg-slate-800 text-slate-800'>
                                    <div className='flex flex-col md:flex-row space-between md:justify-center rounded cursor-pointer py-1'>
                                        <i className='rounded p-1 hover:bg-white dark:hover:bg-gray-400 hover:text-blue-600 dark:hover:text-blue-800' onClick={() => loadTripToEdit(trip.id)}><AiOutlineEdit /></i>
                                        <i className='rounded p-1 hover:bg-white dark:hover:bg-gray-400 hover:text-red-600' onClick={() => deleteTrip(trip.id)}><AiOutlineClose /></i>
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

export default Trip;