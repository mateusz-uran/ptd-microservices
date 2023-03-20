import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import { Link, useOutletContext } from 'react-router-dom';
import TripTable from './TripTable';
import FuelTable from './FuelTable';


function CardSpecification(props) {

    const [cardId] = useOutletContext();

    useEffect(() => {
    }, [cardId])

    return (
        <div className='lg:px-5 my-2'>
            <div className='flex pb-1'>
                <Link to={`../${cardId}/add-trip`} relative="path">
                    <Button variant="outlined" sx={{ fontWeight: 'bold', marginX: 1 }}>Add Trip</Button>
                </Link>
                <Link to={`../${cardId}/add-fuel`} relative="path">
                    <Button variant="outlined" sx={{ fontWeight: 'bold', marginX: 1 }}>Add Fuel</Button>
                </Link>
            </div>
            <TripTable cardId={cardId} />
            <FuelTable cardId={cardId} />
        </div>
    );
}

export default CardSpecification;