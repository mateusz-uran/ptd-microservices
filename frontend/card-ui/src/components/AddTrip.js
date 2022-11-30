import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";

function AddTrip() {
    const navigate = useNavigate();
    const location = useLocation();
    let cardId = location.state.cardId;
    const submitHandler = async () => {
        try {
            navigate(-1); // Omit optional second argument
        } catch (error) {
            console.log(error);
        }
    };
    
    const [inputFields, setInputFields] = useState([
        { name: '', age: '' }
    ])

    const [prev1, setPrev1] = useState('');
    const [prev2, setPrev2] = useState('');

    const handleFormChange = (index, event) => {
        let data = [...inputFields];
        data[index][event.target.name] = event.target.value;
        setInputFields(data);
        setPrev1(data[index].name);
        setPrev2(data[index].age);
    }

    const addFields = () => {
        let newField = { name: prev1, age: prev2 }
        setInputFields([...inputFields, newField])
    }

    const removeFields = (index) => {
        let data = [...inputFields];
        data.splice(index, 1)
        setInputFields(data)
    }

    const submit = (e) => {
        e.preventDefault();
        console.log(inputFields)
    }

    useEffect(() => {
    }, [])

    return (
        <div>
            <h1>Trips</h1>
            <button onClick={() => submitHandler()}>back</button>
            <form onSubmit={submit}>
                {inputFields.map((input, index) => {
                    return (
                        <div key={index}>
                            <input
                                name='name'
                                placeholder='Name'
                                value={input.name}
                                onChange={event => handleFormChange(index, event)}
                            />
                            <input
                                name='age'
                                placeholder='Age'
                                value={input.age}
                                onChange={event => handleFormChange(index, event)}
                            />
                            <button onClick={() => removeFields(index)}>more</button>
                        </div>
                    )
                })}
            </form>
            <button onClick={addFields}>more</button>
            <button onClick={submit}>Submit</button>
        </div>
    );
}

export default AddTrip;