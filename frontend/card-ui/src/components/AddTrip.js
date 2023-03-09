import { Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import IconButton from '@mui/material/IconButton';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';

function AddTrip(props) {
    const navigate = useNavigate();

    const [inputFields, setInputFields] = useState([
        {
            dayStart: '', hourStart: '', locationStart: '', countryStart: '', counterStart: '',
            dayEnd: '', hourEnd: '', locationEnd: '', countryEnd: '', counterEnd: ''
        }
    ]);

    const handleChangeInput = (index, event) => {
        const values = [...inputFields];
        values[index][event.target.name] = event.target.value;
        setInputFields(values);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(inputFields);
    };

    const handleAddFields = (locationEnd, countryEnd, counterEnd) => {
        setInputFields([...inputFields,
        {
            dayStart: '', hourStart: '', locationStart: '', countryStart: '', counterStart: '',
            dayEnd: '', hourEnd: '', locationEnd: locationEnd ? locationEnd : '', countryEnd: countryEnd ? countryEnd : '', counterEnd: counterEnd ? counterEnd : ''
        }
        ]);
    };

    const handleRemoveFields = (index) => {
        const values = [...inputFields];
        values.splice(index, 1);
        setInputFields(values);
    };

    useEffect(() => {
    }, [])

    return (
        <div>
            <button onClick={() => navigate(-1)}>Go back</button>
            <div className='flex justify-center'>
                <form onSubmit={handleSubmit}>
                    {inputFields.map((inputField, index) => (
                        <div key={index}>
                            <div>
                                <TextField
                                    name="dayStart"
                                    label="Day"
                                    variant="filled"
                                    value={inputField.dayStart}
                                    onChange={(event) => handleChangeInput(index, event)}
                                />
                                <TextField
                                    name="hourStart"
                                    label="Hour"
                                    variant="filled"
                                    value={inputField.hourStart}
                                    onChange={(event) => handleChangeInput(index, event)}
                                />
                                <TextField
                                    name="locationStart"
                                    label="Location"
                                    variant="filled"
                                    value={inputField.locationStart}
                                    onChange={(event) => handleChangeInput(index, event)}
                                />
                                <TextField
                                    name="countryStart"
                                    label="Country"
                                    variant="filled"
                                    value={inputField.countryStart}
                                    onChange={(event) => handleChangeInput(index, event)}
                                />
                                <TextField
                                    name="counterStart"
                                    label="Counter"
                                    variant="filled"
                                    value={inputField.counterStart}
                                    onChange={(event) => handleChangeInput(index, event)}
                                />
                            </div>
                            <div>
                                <TextField
                                    name="dayEnd"
                                    label="Day"
                                    variant="filled"
                                    value={inputField.dayEnd}
                                    onChange={(event) => handleChangeInput(index, event)}
                                />
                                <TextField
                                    name="hourEnd"
                                    label="Hour"
                                    variant="filled"
                                    value={inputField.hourEnd}
                                    onChange={(event) => handleChangeInput(index, event)}
                                />
                                <TextField
                                    name="locationEnd"
                                    label="Location"
                                    variant="filled"
                                    value={inputField.locationEnd}
                                    onChange={(event) => handleChangeInput(index, event)}
                                />
                                <TextField
                                    name="countryEnd"
                                    label="Country"
                                    variant="filled"
                                    value={inputField.countryEnd}
                                    onChange={(event) => handleChangeInput(index, event)}
                                />
                                <TextField
                                    name="counterEnd"
                                    label="Counter"
                                    variant="filled"
                                    value={inputField.counterEnd}
                                    onChange={(event) => handleChangeInput(index, event)}
                                />
                            </div>
                            <IconButton onClick={() => handleRemoveFields(index)}>
                                <RemoveIcon />
                            </IconButton>
                            <IconButton onClick={() => handleAddFields(
                                inputFields[index].locationEnd,
                                inputFields[index].countryEnd,
                                inputFields[index].counterEnd,
                                )}>
                                <AddIcon />
                            </IconButton>
                        </div>
                    ))}
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        endIcon={<SendIcon></SendIcon>}
                        onClick={handleSubmit}
                    >
                        Send
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default AddTrip;