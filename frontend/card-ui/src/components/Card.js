import React, { useState, useEffect } from 'react';
import CardService from '../services/CardService';

function Card() {
    const [authorUsername, setAuthorUsername] = useState('');
    const [cards, setCards] = useState([]);
    const [error, setError] = useState('');
    const [loaded, setLoaded] = useState();

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('user', JSON.stringify(authorUsername));
        setAuthorUsername('');
    };

    const retrieveCardsByUser = () => {
        CardService.getCardByUser(JSON.parse(localStorage.getItem('user')))
            .then(response => {
                setCards(response.data);
                setLoaded(true);
            })
            .catch(e => {
                console.log(e);
                setLoaded(false);
                setError("Serwis niedostępny")
            })
    }

    useEffect(() => {
        retrieveCardsByUser();
    }, [authorUsername]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={authorUsername}
                    onChange={(e) => setAuthorUsername(e.target.value)}
                />
                <button type="submit" className="btn">
                    Search
                </button>
            </form>
            <div>
                <h3>Karty</h3>
                <ul>
                    {loaded ?
                        <div>
                            {cards &&
                                cards.map((card, index) => (
                                    <li key={index}>
                                        {card.number}
                                    </li>
                                ))}
                        </div>
                        : <div>{error}</div>}
                </ul>
            </div>

        </div>
    );
}
export default Card;