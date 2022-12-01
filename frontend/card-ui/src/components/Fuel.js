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
                },
                (error) => {
                    console.log(error);
                }
            )
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
                                    <button>delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='fuelFormWrapper'>
                <form onSubmit={(e) => onSubmit(e)}>
                    <div className='input'>
                        <label>date</label>
                        <input
                            name={"currentDate"}
                            value={currentDate}
                            onChange={(e) => onInputChange(e)}
                        />
                    </div>
                    <div className='input'>
                        <label>location</label>
                        <input
                            name={"refuelingLocation"}
                            value={refuelingLocation}
                            onChange={(e) => onInputChange(e)}
                        />
                    </div>
                    <div className='input'>
                        <label>counter</label>
                        <input
                            name={"vehicleCounter"}
                            value={vehicleCounter}
                            onChange={(e) => onInputChange(e)}
                        />
                    </div>
                    <div className='input'>
                        <label>amount</label>
                        <input
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