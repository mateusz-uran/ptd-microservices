import React, { useEffect, useState } from 'react';
import FuelService from '../services/FuelService';
import CardService from '../services/CardService';
import { AiOutlineEdit, AiOutlineClose } from 'react-icons/ai';

function Fuel({ cardId, toggleForm }) {

    const [fuels, setFuels] = useState([]);
    const [fetch, setFetch] = useState(true);
    const [fuelId, setFuelId] = useState();
    const [editMode, setEditMode] = useState(false);

    const [fuel, setFuel] = useState({
        currentDate: '',
        refuelingLocation: '',
        vehicleCounter: '',
        refuelingAmount: ''
    });

    const { currentDate, refuelingLocation, vehicleCounter, refuelingAmount } = fuel;

    const handleFormChange = (e) => {
        setFuel({ ...fuel, [e.target.name]: e.target.value });
    };

    const onSubmitNewFuel = (e) => {
        e.preventDefault();
        FuelService.create(cardId, fuel)
            .then(
                (response) => {
                    console.log(response);
                    retrieveFuelByCardId();
                    setFuel({
                        currentDate: '',
                        refuelingLocation: '',
                        vehicleCounter: '',
                        refuelingAmount: ''
                    })
                },
                (error) => {
                    console.log(error);
                }
            )
    }

    const onSubmitEditedFuel = (e) => {
        e.preventDefault();

    }

    const loadFuelToEdit = (id) => {
        if (toggleForm == false) {
            console.log("Toggle form first")
        } else {

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
    }, [fuelId]);

    return (
        <div className='flex flex-col mx-1 py-1 rounded items-center'>
            {toggleForm &&
                <div className='md:w-1/2'>
                    <form className='bg-slate-100 mb-1 rounded'>
                        <div className='md:flex md:items-center'>
                            <div className='md:py-1 md:border-r-2'>
                                <div className='grid grid-cols-4 gap-1 items-center px-1'>
                                    <input
                                        type={'text'}
                                        name={'currentDate'}
                                        placeholder={'date'}
                                        value={currentDate}
                                        onChange={event => handleFormChange(event)}
                                        className='px-1 border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300'
                                    />
                                    <input
                                        type={'text'}
                                        name={'refuelingLocation'}
                                        placeholder={'location'}
                                        value={refuelingLocation}
                                        onChange={event => handleFormChange(event)}
                                        className='px-1 border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300'
                                    />
                                    <input
                                        type={'number'}
                                        name={'vehicleCounter'}
                                        placeholder={'counter'}
                                        value={vehicleCounter}
                                        onChange={event => handleFormChange(event)}
                                        className='px-1 border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300'
                                    />
                                    <input
                                        type={'number'}
                                        name={'refuelingAmount'}
                                        placeholder={'amount'}
                                        value={refuelingAmount}
                                        onChange={event => handleFormChange(event)}
                                        className='px-1 border-b-2 border-transparent outline-0 focus:border-b-2 focus:border-slate-300'
                                    />
                                </div>
                            </div>
                            <div className='flex m-1 rounded text-black md:flex-col md:items-center'>
                                {editMode ?
                                    <button onClick={onSubmitEditedFuel} className='px-1 ml-1 mb-1 bg-blue-400 text-white rounded md:my-1 hover:bg-slate-300 hover:text-gray-600'>Save</button>
                                    : <button onClick={onSubmitNewFuel} className='px-1 ml-1 mb-1 bg-blue-400 text-white rounded md:my-1 hover:bg-slate-300 hover:text-gray-600'>Add</button>}
                            </div>
                        </div>
                    </form>
                </div>
            }
            <div className='flex w-full overflow-x-auto justify-center'>
                <table className='w-full md:w-1/2 bg-slate-200 rounded text-sm table-auto text-center'>
                    <thead className='text-gray-400'>
                        <tr className='text-slate-500 border-b-2 border-white uppercase text-xs'>
                            <th className='px-2'>date</th>
                            <th className='px-2'>location</th>
                            <th className='px-2'>counter</th>
                            <th className='px-2'>amount</th>
                            <th className=''></th>
                        </tr>
                    </thead>
                    <tbody className='text-slate-600'>
                        {fuels.map((fuel, index) => (
                            <tr key={index} className='border-t-2 border-white hover:bg-blue-400 hover:text-white'>
                                <td className=''>{fuel.currentDate}</td>
                                <td className=''>{fuel.refuelingLocation}</td>
                                <td className=''>{fuel.vehicleCounter}</td>
                                <td className=''>{fuel.refuelingAmount}</td>
                                <td className='bg-slate-600 text-slate-200'>
                                    <div className='flex flex-col md:flex-row items-center md:justify-center rounded cursor-pointer py-1'>
                                        <i className='rounded p-1 hover:bg-white hover:text-blue-600' onClick={() => loadFuelToEdit(fuel.id)}><AiOutlineEdit /></i>
                                        <i className='rounded p-1 hover:bg-white hover:text-red-600' onClick={() => deleteFuel(fuel.id)}><AiOutlineClose /></i>
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