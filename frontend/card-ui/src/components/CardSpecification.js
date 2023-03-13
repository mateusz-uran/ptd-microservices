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


function CardSpecification(props) {

    const [cardId] = useOutletContext();

    const [trips, setTrips] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [selected, setSelected] = useState([]);

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
        console.log(selected)
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
        CardService.getTripFromCard(cardId)
            .then(response => {
                setTrips(response.data);
            })
        setSelected([]);
    }, [cardId])

    return (
        <div className='lg:px-5 my-2'>
            <div className='flex pb-1'>
                <Link to={`../${cardId}/add-trip`} relative="path">
                    <Button variant="outlined" sx={{ fontWeight: 'bold' }}>Add Trip</Button>
                </Link>
            </div>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <IconButton
                                    disabled={selected.length <= 0}
                                    edge="start"
                                    onClick={() => handleDeleteSelectedTrips()}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                            <TableCell align="center" colSpan={7}>
                                Start
                            </TableCell>
                            <TableCell align="center" colSpan={5}>
                                End
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    onClick={(event) => handleSelectAllClick(event)}
                                />
                            </TableCell>
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
                        {(rowsPerPage > 0
                            ? trips.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : trips
                        ).map((row) => {
                            const isItemSelected = isSelected(row.id);
                            return (
                                <TableRow key={row.id} hover onClick={(event) => handleClick(event, row.id)} >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isItemSelected}
                                        />
                                    </TableCell>
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
                            );
                        })}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={11} />
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={11}
                                count={trips.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </div>
    );
}

export default CardSpecification;