import React, { useEffect, useState } from 'react';
import FuelService from '../services/FuelService';

function Fuel({ cardId, toggleFetch }) {
    
    const [fuels, setFuel] = useState([]);
    const [fetch, setFetch] = useState(toggleFetch);

    const retrieveFuelByCardId = () => {
        FuelService.getFuelFromCard(cardId)
            .then(response => {
                setFuel(response.data);
            })
            .catch(e => {
                console.log(e);
            })
    }

    useEffect(() => {
        fetch && retrieveFuelByCardId();
    }, []);

    return (
        <div>
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
                                    <button>edit</button>
                                    <button>delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Fuel;