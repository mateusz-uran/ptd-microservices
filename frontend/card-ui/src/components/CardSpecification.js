import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import CardService from '../services/CardService';
import { Button, TableFooter } from '@mui/material';
import { Link, useOutletContext } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import TripService from '../services/TripService';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import AlertDialog from './AlertDialog';
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