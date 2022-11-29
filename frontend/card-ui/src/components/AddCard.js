import React, { useState, useEffect } from 'react';
import CardService from '../services/CardService';

function AddCard({ user, setFetchedCards }) {

    // const [fetch, setFetch] = useState(fetchedCards);

    const [card, setCard] = useState({
        number: '',
        authorUsername: ''
    });

    const { number } = card;

    const onInputChange = (e) => {
        setCard({ ...card, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        card.authorUsername = user;
        CardService.create(card).then(
            (response) => {
                console.log(response);
                setFetchedCards(true);
                e.target.reset();
                setCard('');
            },
            (error) => {
                console.log(error);
            }
        )
    }

    useEffect(() => {
    }, []);

    return (
        <div className='cardInput'>
            <form onSubmit={(e) => onSubmit(e)}>
                <input
                    type={"text"}
                    name={"number"}
                    defaultValue={number || ''}
                    onChange={(e) => onInputChange(e)}
                />
                <button type={"submit"}>
                    ADD
                </button>
            </form>
        </div>
    );
}

export default AddCard;