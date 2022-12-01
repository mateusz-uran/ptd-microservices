import React, { useEffect, useState } from 'react';
import FuelService from '../services/FuelService';
import CardService from '../services/CardService';

function Fuel({ cardId, toggleFetch }) {

    const [fuels, setFuels] = useState([]);
    const [fetch, setFetch] = useState(toggleFetch);

    const [fuel, setFuel] = useState({
        currentDate: '',
        refuelingLocation: '',
        vehicleCounter: '',
        refuelingAmount: ''
    });

    const { currentDate, refuelingLocation, vehicleCounter, refuelingAmount } = fuel;

    const onInputChange = (e) => {
        setFuel({ ...fuel, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
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

    const onDelete = (id) => {
        FuelService.deleteFuel(id)
            .then(response => {
                console.log(response);
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
    }, []);

    return (
        <div id='fuels'>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>date</th>
                        <th>location</th>
                        <th>counter</th>
                        <th>amount</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {fuels.map((fuel, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{fuel.currentDate}</td>
                            <td>{fuel.refuelingLocation}</td>
                            <td>{fuel.vehicleCounter}</td>
                            <td>{fuel.refuelingAmount}</td>
                            <td>
                                <div>
                                    <button onClick={() => onDelete(fuel.id)}>delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='fuelFormWrapper'>
                <form onSubmit={(e) => onSubmit(e)} id='fuel-form'>
                    <div className='input'>
                        <label>date</label>
                        <input
                            type={"text"}
                            name={"currentDate"}
                            value={currentDate}
                            onChange={(e) => onInputChange(e)}
                        />
                    </div>
                    <div className='input'>
                        <label>location</label>
                        <input
                            type={"text"}
                            name={"refuelingLocation"}
                            value={refuelingLocation}
                            onChange={(e) => onInputChange(e)}
                        />
                    </div>
                    <div className='input'>
                        <label>counter</label>
                        <input
                            type={"number"}
                            name={"vehicleCounter"}
                            value={vehicleCounter}
                            onChange={(e) => onInputChange(e)}
                        />
                    </div>
                    <div className='input'>
                        <label>amount</label>
                        <input
                            type={"number"}
                            name={"refuelingAmount"}
                            value={refuelingAmount}
                            onChange={(e) => onInputChange(e)}
                        />
                    </div>
                    <button onClick={onSubmit}>Add</button>
                </form>
            </div>
        </div>
    );
}

export default Fuel;