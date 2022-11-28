import React, { useState, useEffect } from 'react';
import CardService from '../services/CardService';
import { FaSearch } from 'react-icons/fa';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { MdOutlineDeleteForever, MdOutlinePictureAsPdf } from 'react-icons/md';

import Trip from './Trip';

function Card() {
    const [authorUsername, setAuthorUsername] = useState('');
    const [cards, setCards] = useState([]);
    const [error, setError] = useState('');
    const [loaded, setLoaded] = useState();
    const [slide, setSlide] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [cardId, setCardId] = useState();


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

    function toggleCardNumber(number) {
        setCardNumber(number);
    }

    function toggleCardId(id) {
        setCardId(id);
    }

    function handleToggle(id, number) {
        toggleCardId(id);
        toggleCardNumber(number);
        setIsVisible(!isVisible);
        setSlide(!slide)
        if (number != null && number === cardNumber) {
            setSlide(!slide);
        } else {
            setSlide(false);
            setSlide(true);
        }
    }

    useEffect(() => {
        retrieveCardsByUser();
    }, [authorUsername, cardId]);

    return (
        <div className='wrapper'>
            <div id='navbar'>
                <div className='formColumn'>
                    <form onSubmit={handleSubmit}>
                        <label>Username</label>
                        <div className='inputWrapper'>
                            <input
                                type="text"
                                value={authorUsername}
                                onChange={(e) => setAuthorUsername(e.target.value)}
                            />
                            <button type="submit"><FaSearch /></button>
                        </div>
                    </form>
                </div>
                <div className='buttonColumn'>
                    <label>Manage</label>
                    <div className='buttonWrapper'>
                        <button>Add card</button>
                        <button>Add trip</button>
                        <button>Add fuel</button>
                    </div>
                </div>
            </div>
            <div id='content'>
                <div className='upperBar'>
                    <h3>Cards</h3>
                </div>
                <div className='lowerBar'>
                    <div className='cardList'>
                        <ul>
                            {cards.map((card, index) => (
                                <div key={index} className={slide && card.number === cardNumber ? 'cardActive' : 'cardElement'}>
                                    <li>{card.number}</li>
                                    <span>
                                        <MdOutlineDeleteForever className='icon' />
                                        <MdOutlinePictureAsPdf className='icon' />
                                        <i onClick={() => handleToggle(card.id, card.number)}><AiOutlineArrowRight className='icon' /></i>
                                    </span>
                                </div>
                            ))}
                        </ul>
                    </div>
                    <div className='tablesWrapper'>
                        <div className='tripWrapper'>
                            <div className={!slide ? 'move-right' : 'move-left'}>
                                {isVisible && <Trip cardId={cardId} isVisible={isVisible}/>}
                            </div>
                        </div>
                        <div className='fuelWrapper'>
                            <div className={!slide ? 'move-right' : 'move-left'}>
                                {/* {isVisible && <Fuel />} */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Card;