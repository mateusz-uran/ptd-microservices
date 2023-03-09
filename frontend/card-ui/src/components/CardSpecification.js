import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableHead from '@mui/material/TableHead';
import CardService from '../services/CardService';

function CardSpecification(props) {
    const { id } = props;

    const [trips, setTrips] = useState([]);

    useEffect(() => {
        CardService.getTripFromCard(id)
            .then(response => {
                setTrips(response.data);
            })
    }, [id])

    return (
        <div className='px-5'>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" colSpan={6}>
                                Start
                            </TableCell>
                            <TableCell align="center" colSpan={5}>
                                End
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Day</TableCell>
                            <TableCell>Hour</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell>Counter</TableCell>
                            <TableCell>Day</TableCell>
                            <TableCell>Hour</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell>Counter</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {trips.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.dayStart}</TableCell>
                                <TableCell>{row.hourStart}</TableCell>
                                <TableCell>{row.locationStart}</TableCell>
                                <TableCell>{row.countryStart}</TableCell>
                                <TableCell>{row.counterStart}</TableCell>
                                <TableCell>{row.dayEnd}</TableCell>
                                <TableCell>{row.hourEnd}</TableCell>
                                <TableCell>{row.locationEnd}</TableCell>
                                <TableCell>{row.countryEnd}</TableCell>
                                <TableCell>{row.counterEnd}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default CardSpecification;