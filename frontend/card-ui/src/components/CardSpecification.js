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

    const [trips, setTrips] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [selected, setSelected] = useState([]);

    const [open, setOpen] = useState(false);

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = trips.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const isSelected = (tripId) => selected.indexOf(tripId) !== -1;

    const handleDeleteSelectedTrips = () => {
        TripService.deleteManyTrips(selected)
            .then(() => {
                setTrips((prevTrips) =>
                    prevTrips.filter((trip) => !selected.includes(trip.id))
                );
                // Clear the selected state to reflect the successful delete
                setSelected([]);
            })
    }

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - trips.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        setOpen(true);
        CardService.getTripFromCard(cardId)
            .then(response => {
                setTrips(response.data);
                setOpen(false);
            }, (error) => {
                setOpen(false);
                console.log(error);
            })
        setSelected([]);
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