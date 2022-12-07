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
import { BsFillSunFill } from 'react-icons/bs';
import { MdDarkMode } from 'react-icons/md';
import { useFormik } from 'formik';
import { cardSchema } from '../schema/CardSchema';

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

    const [darkMode, setDarkMode] = useState();

    const handleUsernameInLocalStorage = (e) => {
        e.preventDefault();
        localStorage.setItem('user', JSON.stringify(user));
        setUser('');
        setFetchedCards(true);
    };

    const retrieveUser = () => {
        setStoredUser(JSON.parse(localStorage.getItem('user')));
    }

    const onSubmit = (values, actions) => {
        values.authorUsername = storedUser;
        CardService.create(values).then(
            (response) => {
                console.log(response);
                setFetchedCards(true);
                actions.resetForm();
            },
            (error) => {
                console.log(error);
            }
        )
    }

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: {
            number: '',
            authorUsername: ''
        },
        validationSchema: cardSchema,
        onSubmit
    });

    function toggleDarkMode() {
        setDarkMode(prevDarkMode => !prevDarkMode)
        localStorage.setItem('themeMode', JSON.stringify(darkMode));
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

    const retrieveDarkMode = () => {
        if (darkMode != null && JSON.parse(localStorage.getItem('themeMode')) == false) {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }
    }

    useEffect(() => {
        fetchedCards && retrieveCardsByUser();
        retrieveUser();
        setFetchedCards(false);
        retrieveDarkMode();
    }, [user, cardId, fetchedCards]);

    return (
        <div className={`flex flex-col h-screen ${darkMode ? 'dark bg-slate-900' : ''}`}>
            <div className='flex w-full px-2 py-4 bg-blue-200 justify-between dark:bg-gray-600 items-center w-100'>
                <div className='flex items-center'>
                    <form onSubmit={handleUsernameInLocalStorage} className='flex h-10 m-2 rounded bg-gray-200'>
                        <button className='h-full border-r border-gray-300 px-1 hover:bg-stone-100 rounded'><AiOutlineSearch /></button>
                        <input
                            type="text"
                            className="w-full bg-transparent outline-0 px-1"
                            placeholder="Username"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                        />
                    </form>
                    <button onClick={() => onShowCardForm()} className='flex bg-blue-300 dark:bg-gray-800 items-center rounded px-2 text-slate-600 dark:text-slate-300 font-bold text-sm uppercase h-10 hover:bg-gray-500 dark:hover:bg-gray-400 hover:text-slate-100 dark:hover:text-slate-800'>add card</button>
                </div>
                <div className='mx-1 rounded-lg'>
                    <div onClick={darkMode ? undefined : toggleDarkMode} className={darkMode ? 'bg-gray-900 text-white p-1 rounded-t-lg' : 'text-white p-1 rounded-t-lg cursor-pointer'}><MdDarkMode /></div>
                    <div onClick={darkMode ? toggleDarkMode : undefined} className={darkMode ? 'text-white p-1 rounded-b-lg cursor-pointer' : 'text-white p-1 bg-blue-400 rounded-b-lg'}><BsFillSunFill /></div>
                </div>
            </div>
            <div className='flex flex-col md:flex-row md:h-screen overflow-x-auto'>
                <div className='flex md:flex-col bg-gray-100 dark:bg-gray-700 pb-2 md:min-w-min'>
                    <div className={addCardToggle ? 'flex hidden' : 'flex'}>
                        <form onSubmit={handleSubmit} className='flex justify-between flex-col p-1 mr-1'>
                            <div className='flex flex'>
                                <input
                                    type={"text"}
                                    name={"number"}
                                    id={"number"}
                                    value={values.number}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={errors.number && touched.number ? 'p-1 dark:bg-transparent border-b-2 border-red-600 dark:text-slate-300 dark:outline-0' : 'p-1 dark:bg-transparent dark:border-b-2 dark:border-slate-300 dark:text-slate-300 dark:outline-0'}
                                />
                                <button type="submit" className='p-1 m-1 dark:text-white dark:bg-slate-500 hover:bg-zinc-200 dark:hover:bg-slate-800 rounded'>
                                    <AiOutlinePlus />
                                </button>
                            </div>
                            <div>
                                {errors.number && touched.number && <p className='bg-transparent text-red-600 text-xs'>{errors.number}</p>}
                            </div>
                        </form>
                    </div>
                    <div className='flex md:flex-col items-center w-full overflow-x-auto'>
                        {cards.map((card, index) => (
                            <div key={index} className='flex content-center md:w-full justify-center'>
                                <div className={toggleFetch && card.id == cardId ? 'flex flex-col md:flex-row md:w-full md:justify-between rounded bg-slate-200 dark:bg-slate-600 m-1 p-2 flex dark:text-gray-300 text-center items-center' : 'flex flex-col md:flex-row md:w-full md:justify-between bg-transparent rounded m-1 p-2 flex dark:text-gray-300 text-center items-center'}>
                                    <p>{card.number}</p>
                                    <span className='flex md:ml-1'>
                                        <i onClick={() => handleToggleCardContent(card.id)} className='px-1 rounded hover:bg-blue-200 active:bg-blue-200 dark:hover:bg-slate-400 dark:active:bg-slate-400 hover:text-black active:text-black cursor-pointer'><AiOutlineArrowRight className='icon rotate-90 md:rotate-0' /></i>
                                        <i onClick={() => generatePdf(card.id)} className='px-1 rounded hover:bg-blue-200 active:bg-blue-200 dark:hover:bg-slate-400 dark:active:bg-slate-400 hover:text-black active:text-black  cursor-pointer'><AiFillFilePdf /></i>
                                        <i onClick={() => deleteCardById(card.id)} className='px-1 rounded hover:bg-blue-200 active:bg-blue-200 dark:hover:bg-slate-400 dark:active:bg-slate-400 hover:text-black active:text-black  cursor-pointer'><AiOutlineDelete /></i>
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='flex flex-col w-full dark:bg-gray-900'>
                    <div className='flex bg-slate-200 dark:bg-gray-600 p-1 m-1 rounded'>
                        <button onClick={() => onToggleTripForm()} className='mx-1 bg-blue-300 dark:bg-gray-900 px-1 rounded uppercase font-bold text-slate-100 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-blue-900 hover:text-gray-500 text-xs'>add trip</button>
                        <button onClick={() => onToggleFuelForm()} className='mx-1 bg-blue-300 dark:bg-gray-900 px-1 rounded uppercase font-bold text-slate-100 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-blue-900 hover:text-gray-500 text-xs'>add fuel</button>
                    </div>
                    <div className='m-1 bg-blue-200 dark:bg-slate-600 rounded'>{toggleFetch && <Trip toggleForm={addTripToggle} cardId={cardId} theme={darkMode} />}</div>
                    <div className='mx-1 bg-blue-200 dark:bg-slate-600 rounded'>{toggleFetch && <Fuel toggleForm={addFuelToggle} cardId={cardId} theme={darkMode} />}</div>
                </div>
            </div>
        </div>
    );
}
export default Card;