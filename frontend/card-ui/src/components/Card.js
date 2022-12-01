import React, { useState, useEffect } from 'react';
import CardService from '../services/CardService';
import { FaSearch } from 'react-icons/fa';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { MdOutlineDeleteForever, MdOutlinePictureAsPdf } from 'react-icons/md';
import PdfService from '../services/PdfService';

import Trip from './Trip';
import Fuel from './Fuel';
import AddCard from './AddCard';

import { useNavigate } from "react-router-dom";

function Card() {
    const [authorUsername, setAuthorUsername] = useState('');
    const [storedUser, setStoredUser] = useState('');
    const [cards, setCards] = useState([]);
    const [toggleFetch, setToggleFetch] = useState(false);
    const [cardId, setCardId] = useState();
    const [cardNumber, setCardNumber] = useState();

    const [fetchedCards, setFetchedCards] = useState(true);
    const [toggle, setToggle] = useState(false);

    const [cardDate, setCardDate] = useState('29.11.2022');
    const [cardMileage, setCardMileage] = useState('4599');
    const [cardDone, setCardDone] = useState('done');

    const navigate = useNavigate();

    const submitHandler = async () => {
        try {
            navigate("/add-trip", { state: { cardId: cardId, cardNumber: cardNumber } });
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('user', JSON.stringify(authorUsername));
        setAuthorUsername('');
        setFetchedCards(true);
        setToggleFetch(false);
    };

    const retrieveCardsByUser = () => {
        CardService.getCardByUser(JSON.parse(localStorage.getItem('user')))
            .then(response => {
                setCards(response.data);
            })
            .catch(e => {
                console.log(e);
            })
    }

    const deleteCardById = (id) => {
        CardService.deleteCard(id)
            .then(response => {
                console.log(response)
                retrieveCardsByUser();
                setToggleFetch(false);
            })
            .catch(e => {
                console.log(e);
            })
    }
    const generatePdf = (id) => {
        try {
            PdfService.getPdf(id)
                .then(response => {
                    //Create a Blob from the PDF Stream
                    const file = new Blob([response.data], { type: "application/pdf" });
                    //Build a URL from the file
                    const fileURL = URL.createObjectURL(file);
                    //Open the URL on new Window
                    const pdfWindow = window.open();
                    pdfWindow.location.href = fileURL;
                })
        } catch (error) {
            console.log(error);
        }
    }

    const retrieveUser = () => {
        const stringifiedPerson = localStorage.getItem('user');
        setStoredUser(JSON.parse(stringifiedPerson));
    }

    function getCardValues(id, number) {
        setCardId(id);
        setCardNumber(number);
    }

    function handleToggle(id, number) {
        getCardValues(id, number);
        setToggleFetch(!toggleFetch);
    }

    function toggleAddCard() {
        setToggle(!toggle);
    }

    useEffect(() => {
        fetchedCards && retrieveCardsByUser();
        retrieveUser();
        setFetchedCards(false);
    }, [authorUsername, cardId, fetchedCards]);

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
                            <button type="submit" className='searchButton'><FaSearch className='icon' /></button>
                        </div>
                    </form>
                </div>
                <div className='buttonColumn'>
                    <label>Manage</label>
                    <div className='buttonWrapper'>
                        <button onClick={() => toggleAddCard()}>Add card</button>
                        <button disabled={!toggleFetch} onClick={() => submitHandler()} className={!toggleFetch ? 'disable' : ''}>Add trip</button>
                        <button>Add fuel</button>
                    </div>
                </div>
            </div>
            <div id='content'>
                <div className='upperBar'>
                    <div className='infoUser'>
                        <h3>Cards by <span>{storedUser}</span></h3>
                    </div>
                    <div className='cardSpecification'>
                        <div className='spec'>
                            <span>Created: {toggleFetch ? cardDate : ''}</span>
                        </div>
                        <div className='spec'>
                            <span>Mileage: {toggleFetch ? cardMileage : ''}km</span>
                        </div>
                        <div className='spec'>
                            <span>Stage: {toggleFetch ? cardDone : ''}</span>
                        </div>
                    </div>
                </div>
                <div className='lowerBar'>
                    <div className='cardList'>
                        <ul>
                            <div className={toggle ? 'cardInputWrapperOn' : 'cardInputWrapperOff'}><AddCard user={storedUser} setFetchedCards={setFetchedCards} /></div>
                            {cards.map((card, index) => (
                                <div key={index} className={toggleFetch && card.id === cardId ? 'cardActive' : 'cardElement'}>
                                    <li>{card.number}</li>
                                    <span>
                                        <i onClick={() => deleteCardById(card.id)}><MdOutlineDeleteForever className='icon' /></i>
                                        <i onClick={() => generatePdf(card.id)}><MdOutlinePictureAsPdf className='icon' /></i>
                                        <i onClick={() => handleToggle(card.id, card.number)}><AiOutlineArrowRight className='icon' /></i>
                                    </span>
                                </div>
                            ))}
                        </ul>
                    </div>
                    <div className='tablesWrapper'>
                        <div className='tripWrapper'>
                            <div className={!toggleFetch ? 'move-right' : 'move-left'}>
                                {toggleFetch && <Trip cardId={cardId} toggleFetch={toggleFetch} />}
                            </div>
                        </div>
                        <div className='fuelWrapper'>
                            <div className={!toggleFetch ? 'move-right' : 'move-left'}>
                                {toggleFetch && <Fuel cardId={cardId} toggleFetch={toggleFetch} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Card;