import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import CardService from '../services/CardService';
import { TableFooter } from '@mui/material';

function CardSpecification(props) {
    const { id } = props;

    const [trips, setTrips] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

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
                            <TableCell align="center" colSpan={5}>
                                Start
                            </TableCell>
                            <TableCell align="center" colSpan={5}>
                                End
                            </TableCell>
                        </TableRow>
                        <TableRow>
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
                        ).map((row) => (
                        <TableRow key={row.id} hover >
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
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={10} />
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={10}
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