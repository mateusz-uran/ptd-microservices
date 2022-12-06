import React, { useState, useEffect } from 'react';
import CardService from '../services/CardService';
import PdfService from '../services/PdfService';
import Trip from './Trip';
import Fuel from './Fuel';
import {
    AiOutlineArrowRight,
    AiFillFilePdf,
    AiOutlineDelete,
    AiOutlineSearch,
    AiOutlinePlus
} from 'react-icons/ai'

function Card() {
    const [user, setUser] = useState('');
    const [fetchedCards, setFetchedCards] = useState(true);
    const [storedUser, setStoredUser] = useState('');

    const [cards, setCards] = useState([]);
    const [toggleFetch, setToggleFetch] = useState(false);
    const [cardId, setCardId] = useState();
    const [addCardToggle, setAddCardToggle] = useState(true);

    const [addTripToggle, setAddTripToggle] = useState(false);
    const [addFuelToggle, setAddFuelToggle] = useState(false);

    const [card, setCard] = useState({
        number: '',
        authorUsername: ''
    });

    const { number } = card;

    const onInputChange = (e) => {
        setCard({ ...card, [e.target.name]: e.target.value });
    };

    const handleUsernameInLocalStorage = (e) => {
        e.preventDefault();
        localStorage.setItem('user', JSON.stringify(user));
        setUser('');
        setFetchedCards(true);
    };

    const retrieveUser = () => {
        setStoredUser(JSON.parse(localStorage.getItem('user')));
    }

    const onSubmit = (e) => {
        e.preventDefault();
        card.authorUsername = storedUser;
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

    const handleToggleCardContent = (id) => {
        setCardId(id);
        setToggleFetch(!toggleFetch);
    }

    const onShowCardForm = () => {
        setAddCardToggle(!addCardToggle);
    }

    const onToggleTripForm = () => {
        setAddTripToggle(!addTripToggle);
    }

    const onToggleFuelForm = () => {
        setAddFuelToggle(!addFuelToggle);
    }

    useEffect(() => {
        fetchedCards && retrieveCardsByUser();
        retrieveUser();
        setFetchedCards(false);
    }, [user, cardId, fetchedCards]);

    return (
        <div className='flex flex-col'>
            <div className='flex w-full px-2 py-4 bg-blue-200 items-center'>
                <form onSubmit={handleUsernameInLocalStorage} className='flex h-10 m-2 rounded bg-gray-200'>
                    <button className='h-full border-r border-gray-300 px-1 hover:bg-stone-100'><AiOutlineSearch /></button>
                    <input
                        type="text"
                        className="w-full bg-transparent outline-0 px-1"
                        placeholder="Username"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                    />
                </form>
                <button onClick={() => onShowCardForm()} className='flex bg-blue-300 items-center rounded px-2 text-slate-600 font-bold text-sm uppercase h-10 hover:bg-gray-500 hover:text-slate-100'>add card</button>
            </div>
            <div className='flex flex-col md:flex-row md:h-screen'>
                <div className='flex md:flex-col bg-gray-100 overflow-x-auto pb-2  md:min-w-min'>
                    <div className={addCardToggle ? 'flex hidden' : 'flex'}>
                        <form onSubmit={(e) => onSubmit(e)} className='flex md:flex-row p-1 mr-1'>
                            <input
                                type={"text"}
                                name={"number"}
                                defaultValue={number || ''}
                                onChange={(e) => onInputChange(e)}
                                className='p-1'
                            />
                            <button type={"submit"} className='p-1 m-1 hover:bg-zinc-200 rounded'>
                                <AiOutlinePlus />
                            </button>
                        </form>
                    </div>
                    <div className='flex md:flex-col items-center w-full'>
                        {cards.map((card, index) => (
                            <div key={index} className='flex content-center md:w-full justify-center'>
                                <div className={toggleFetch && card.id == cardId ? 'flex flex-col md:flex-row md:w-full md:justify-between rounded bg-slate-200 m-1 p-2 flex text-center items-center' : 'flex flex-col md:flex-row md:w-full md:justify-between bg-transparent rounded m-1 p-2 flex text-center items-center'}>
                                    <p>{card.number}</p>
                                    <span className='flex'>
                                        <i onClick={() => handleToggleCardContent(card.id)} className='px-1 rounded hover:bg-blue-200 active:bg-blue-200'><AiOutlineArrowRight className='icon rotate-90 md:rotate-0' /></i>
                                        <i onClick={() => generatePdf(card.id)} className='px-1 rounded hover:bg-blue-200 active:bg-blue-200'><AiFillFilePdf /></i>
                                        <i onClick={() => deleteCardById(card.id)} className='px-1 rounded hover:bg-blue-200 active:bg-blue-200'><AiOutlineDelete /></i>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='flex flex-col w-full'>
                    <div className='flex bg-slate-200 p-1 m-1 rounded'>
                        <button onClick={() => onToggleTripForm()} className='mx-1 bg-blue-300 px-1 rounded uppercase font-bold text-slate-100 hover:bg-slate-300 hover:text-gray-500 text-xs'>add trip</button>
                        <button onClick={() => onToggleFuelForm()} className='mx-1 bg-blue-300 px-1 rounded uppercase font-bold text-slate-100 hover:bg-slate-300 hover:text-gray-500 text-xs'>add fuel</button>
                    </div>
                    {toggleFetch && <Trip toggleForm={addTripToggle} cardId={cardId} />}
                    {toggleFetch && <Fuel toggleForm={addFuelToggle} cardId={cardId} />}
                </div>
            </div>
        </div>
    );
}
export default Card;