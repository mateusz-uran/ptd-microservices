import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import TripService from '../services/TripService';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

function AddTrip() {
    const navigate = useNavigate();
    const location = useLocation();
    let cardId = location.state.cardId;
    let cardNumber = location.state.cardNumber;
    const submitHandler = async () => {
        try {
            navigate(-1);
        } catch (error) {
            console.log(error);
        }
    };

    const [inputFields, setInputFields] = useState([
        {
            dayStart: '', hourStart: '', locationStart: '', countryStart: '', counterStart: '',
            dayEnd: '', hourEnd: '', locationEnd: '', countryEnd: '', counterEnd: ''
        }
    ])

    const [prevLocalization, setPrevLocalization] = useState('');
    const [prevCountry, setPrevCountry] = useState('');

    const handleFormChange = (index, event) => {
        let data = [...inputFields];
        data[index][event.target.name] = event.target.value;
        setInputFields(data);
        setPrevLocalization(data[index].locationEnd);
        setPrevCountry(data[index].countryEnd);
    }

    const addFields = () => {
        let newField = {
            dayStart: '', hourStart: '', locationStart: prevLocalization, countryStart: prevCountry, counterStart: '',
            dayEnd: '', hourEnd: '', locationEnd: '', countryEnd: '', counterEnd: ''
        }
        setInputFields([...inputFields, newField])
    }

    const removeFields = (index) => {
        let data = [...inputFields];
        data.splice(index, 1)
        setInputFields(data)
    }

    const submit = (e) => {
        e.preventDefault();
        TripService.create(cardId, inputFields).then(
            (response) => {
                navigate(-1);
            },
            (error) => {
                console.log(error);
            }
        )
    }

    useEffect(() => {
    }, [])

    return (
        <div id='tripInputWrapper'>
            <div className='tripInputUpper'>
                <div className='cardNumberColumn'>
                    <div>Card number: {cardNumber}</div>
                </div>
                <div className='buttonColumn'>
                    <label>Manage</label>
                    <div className='backButtonWrapper'>
                        <button onClick={() => submitHandler()}>back</button>
                    </div>
                </div>
            </div>
            <div className='tripInputLower'>
                <h3>Add trips</h3>
            </div>
            <div className='tripForm'>
                <form onSubmit={submit}>
                    {inputFields.map((input, index) => {
                        return (
                            <div key={index} className='inputWrapper'>
                                <div className='startInputs'>
                                    <span>START</span>
                                    <div className='inputs'>
                                        <div className='singleInput'>
                                            <label>day</label>
                                            <input
                                                name='dayStart'
                                                placeholder=''
                                                value={input.dayStart}
                                                onChange={event => handleFormChange(index, event)}
                                            />
                                        </div>
                                        <div className='singleInput'>
                                            <label>hour</label>
                                            <input
                                                name='hourStart'
                                                placeholder=''
                                                value={input.hourStart}
                                                onChange={event => handleFormChange(index, event)}
                                            />
                                        </div>
                                        <div className='singleInput'>
                                            <label>location</label>
                                            <input
                                                name='locationStart'
                                                placeholder=''
                                                value={input.locationStart}
                                                onChange={event => handleFormChange(index, event)}
                                            />
                                        </div>
                                        <div className='singleInput'>
                                            <label>country</label>
                                            <input
                                                name='countryStart'
                                                placeholder=''
                                                value={input.countryStart}
                                                onChange={event => handleFormChange(index, event)}
                                            />
                                        </div>
                                        <div className='singleInput'>
                                            <label>counter</label>
                                            <input
                                                name='counterStart'
                                                placeholder=''
                                                value={input.counterStart}
                                                onChange={event => handleFormChange(index, event)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='endInputs'>
                                    <span>END</span>
                                    <div className='inputs'>
                                        <div className='singleInput'>
                                            <label>day</label>
                                            <input
                                                name='dayEnd'
                                                placeholder=''
                                                value={input.dayEnd}
                                                onChange={event => handleFormChange(index, event)}
                                            />
                                        </div>
                                        <div className='singleInput'>
                                            <label>hour</label>
                                            <input
                                                name='hourEnd'
                                                placeholder=''
                                                value={input.hourEnd}
                                                onChange={event => handleFormChange(index, event)}
                                            />
                                        </div>
                                        <div className='singleInput'>
                                            <label>location</label>
                                            <input
                                                name='locationEnd'
                                                placeholder=''
                                                value={input.locationEnd}
                                                onChange={event => handleFormChange(index, event)}
                                            />
                                        </div>
                                        <div className='singleInput'>
                                            <label>country</label>
                                            <input
                                                name='countryEnd'
                                                placeholder=''
                                                value={input.countryEnd}
                                                onChange={event => handleFormChange(index, event)}
                                            />
                                        </div>
                                        <div className='singleInput'>
                                            <label>counter</label>
                                            <input
                                                name='counterEnd'
                                                placeholder=''
                                                value={input.counterEnd}
                                                onChange={event => handleFormChange(index, event)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='buttonWrapper'>
                                    <button type="button" onClick={() => removeFields(index)}><AiOutlineMinus /></button>
                                    <button type="button" onClick={addFields}><AiOutlinePlus /></button>
                                </div>
                            </div>
                        )
                    })}
                </form>
                <div className='submitButton'>
                    <button onClick={submit}>Submit</button>
                </div>
            </div>
        </div>
    );
}

export default AddTrip;