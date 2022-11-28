import React, { useEffect, useState } from 'react';
import TripService from '../services/TripService';

function Trip({ cardId, isVisible }) {

    const [trips, setTrip] = useState([]);
    const [fetch, setFetch] = useState(isVisible);

    const retrieveTripByCardId = () => {
        TripService.getTripFromCard(cardId)
            .then(response => {
                setTrip(response.data);
            })
            .catch(e => {
                console.log(e);
            })
    }

    useEffect(() => {
        fetch && retrieveTripByCardId();
    }, []);

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th colSpan={6}>START</th>
                        <th colSpan={6}>END</th>
                        <th></th>
                    </tr>
                    <tr>
                        <th></th>
                        <th>day</th>
                        <th>hour</th>
                        <th>location</th>
                        <th>country</th>
                        <th>counter</th>
                        <th>day</th>
                        <th>hour</th>
                        <th>location</th>
                        <th>country</th>
                        <th>counter</th>
                        <th>mileage</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {trips.map((trip, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{trip.dayStart}</td>
                            <td>{trip.hourStart}</td>
                            <td>{trip.locationStart}</td>
                            <td>{trip.countryStart}</td>
                            <td>{trip.counterStart}</td>
                            <td>{trip.dayEnd}</td>
                            <td>{trip.hourEnd}</td>
                            <td>{trip.locationEnd}</td>
                            <td>{trip.countryEnd}</td>
                            <td>{trip.counterEnd}</td>
                            <td>{trip.carMileage}</td>
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

export default Trip;