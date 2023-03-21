import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import CardService from '../services/CardService';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import FuelService from '../services/FuelService';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function FuelTable(props) {
    const { cardId } = props;

    const [fuels, setFuels] = useState([]);

    const [selected, setSelected] = useState(0);

    const [open, setOpen] = useState(false);

    const handleClick = (event, name) => {
        setSelected(prevState => prevState === name ? -1 : name);
    };

    const isSelected = (fuelId) => selected === fuelId;

    const handleDeleteSelectedFuels = () => {
        FuelService.deleteFuel(selected)
            .then(() => {
                setFuels(fuels.filter(fuel => fuel.id !== selected));
                // Clear the selected state to reflect the successful delete
                setSelected(-1);
            })
    }

    useEffect(() => {
        setOpen(true);
        CardService.getFuelFromCard(cardId)
            .then(response => {
                setFuels(response.data);
                setOpen(false);
            }, (error) => {
                setOpen(false);
                console.log(error);
            })
        setSelected(-1);
    }, [cardId])
    return (
        <div>
            <Backdrop
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <IconButton
                                    disabled={selected <= 0}
                                    edge="start"
                                    onClick={() => handleDeleteSelectedFuels()}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Counter</TableCell>
                            <TableCell>Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(fuels).map((row) => {
                            const isItemSelected = isSelected(row.id);
                            return (
                                <TableRow key={row.id} hover onClick={(event) => handleClick(event, row.id)} >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isItemSelected}
                                        />
                                    </TableCell>
                                    <TableCell>{row.refuelingDate}</TableCell>
                                    <TableCell>{row.refuelingLocation}</TableCell>
                                    <TableCell>{row.vehicleCounter}</TableCell>
                                    <TableCell>{row.refuelingAmount}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default FuelTable;