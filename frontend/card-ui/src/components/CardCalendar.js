import React, { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { fillArrayWithPassedYears, fillArrayWithMonthsNumbersAndNames } from './utils';
import { OutlinedInput } from '@mui/material';

function CardCalendar({ year, setYear, month, setMonth, }) {

    let generatedMonths = fillArrayWithMonthsNumbersAndNames();
    let generatedYears = fillArrayWithPassedYears(2021);

    const [currentYear, setCurrentYear] = useState(year);

    const [currentMonth, setCurrentMonth] = useState(month);

    const handleChangeYear = (event) => {
        setCurrentYear(event.target.value);
        setYear(event.target.value);
    };

    const handleChangeMonth = (event) => {
        setCurrentMonth(event.target.value);
        setMonth(event.target.value);
    };

    useEffect(() => {
        console.log(generatedMonths);
    }, [currentYear, currentMonth])

    return (
        <div className='text-left'>
            <FormControl sx={{ marginY: 1, minWidth: 100 }} size="small">
                <InputLabel>Year</InputLabel>
                <Select
                    value={currentYear}
                    onChange={handleChangeYear}
                    input={<OutlinedInput label="Year" />}
                >
                    {generatedYears.map((name) => (
                        <MenuItem
                            key={name}
                            value={name}
                        >
                            {name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl sx={{ margin: 1, minWidth: 100 }} size="small">
                <InputLabel>Month</InputLabel>
                <Select
                    value={month}
                    onChange={handleChangeMonth}
                    input={<OutlinedInput label="Month" />}
                >
                    {generatedMonths.map((month) => (
                        <MenuItem
                            key={month.number}
                            value={month.number}
                        >
                            {month.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

export default CardCalendar;