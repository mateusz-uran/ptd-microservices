import React, { useState, useEffect } from 'react';
import CardService from '../services/CardService';
import PdfService from '../services/PdfService';
import Fuel from './Fuel';
import TripFormik from './TripFormik';
import {
    AiOutlineArrowRight, AiFillFilePdf, AiOutlineDelete, AiOutlineSearch,
    AiOutlinePlus, AiOutlineEye, AiOutlineEyeInvisible
} from 'react-icons/ai'
import { BsFillSunFill } from 'react-icons/bs';
import { MdDarkMode } from 'react-icons/md';
import { useFormik } from 'formik';
import { cardSchema } from '../validation/schema';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Alert from './Alert';


function Card() {
    const [user, setUser] = useState('');
    const [fetchedCards, setFetchedCards] = useState(true);
    const [storedUser, setStoredUser] = useState('');

    const [cards, setCards] = useState([]);
    const [toggleFetch, setToggleFetch] = useState(false);
    const [cardId, setCardId] = useState();
    const [cardReady, setCardReady] = useState();
    const [addCardToggle, setAddCardToggle] = useState(true);

    const [addTripToggle, setAddTripToggle] = useState(false);
    const [addFuelToggle, setAddFuelToggle] = useState(false);

    const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('themeMode')));

    const handleUsernameInLocalStorage = (e) => {
        e.preventDefault();
        localStorage.setItem('user', JSON.stringify(user));
        setUser('');
        setFetchedCards(true);
        setToggleFetch(false);
    };

    const retrieveUser = () => {
        if (!localStorage.getItem('user')) {
            console.log('Local storage is empty')
        } else {
            setStoredUser(JSON.parse(localStorage.getItem('user')));
        }
    }

    const onSubmit = (values, actions) => {
        if (storedUser != null) {
            values.authorUsername = storedUser;
            CardService.create(values).then(
                (response) => {
                    console.log(response);
                    setFetchedCards(true);
                    actions.resetForm();
                },
                (error) => {
                    console.log(error);
                    toast.error(error.response.data.description);
                }
            )
        } else {
            console.log("no user available");
        }
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
        if (!localStorage.getItem('user')) {
            console.log("Cant find any user")
        } else {
            CardService.getCardByUser(JSON.parse(localStorage.getItem('user')))
                .then(response => {
                    setCards(response.data);
                })
                .catch(e => {
                    console.log(e);
                })
        }
    }

    const [confirmOpen, setConfirmOpen] = useState();
    const [id, setId] = useState();
    const [cardNumber, setCardNumber] = useState();

    const handleModal = (id, number) => {
        console.log(id);
        setConfirmOpen(true);
        setId(id);
        setCardNumber(number);
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
                toast.error(e.response.data.description);
            })
    }

    const toggleCard = (id) => {
        CardService.toggleCard(id)
            .then(
                (response) => {
                    console.log(response);
                    retrieveCardsByUser();
                    setToggleFetch(false);
                },
                (error) => {
                    console.log(error);
                    toast.error(error.response.data.description);
                }
            )
    }

    const generatePdf = (id) => {
        try {
            PdfService.getPdf(id)
                .then(response => {
                    console.log(response);
                    //Create a Blob from the PDF Stream
                    const file = new Blob([response.data], { type: "application/pdf" });
                    //Build a URL from the file
                    const fileURL = URL.createObjectURL(file);
                    //Open the URL on new Window
                    const pdfWindow = window.open();
                    pdfWindow.location.href = fileURL;
                }, (error) => {
                    console.log(error);
                })
        } catch (error) {
            console.log(error);
        }
    }

    const handleToggleCardContent = (id, done) => {
        setCardId(id);
        setCardReady(done);
        setToggleFetch(!toggleFetch);
    }

    const onShowCardForm = () => {
        setAddCardToggle(!addCardToggle);
    }

    const onToggleTripForm = () => {
        if (cardReady) {
            toast.error("Card is ready, cant edit");
        }
        setAddTripToggle(!addTripToggle);
    }

    const onToggleFuelForm = () => {
        if (cardReady) {
            toast.error("Card is ready, cant edit");
        }
        setAddFuelToggle(!addFuelToggle);
    }

    const retrieveDarkMode = () => {
        if (darkMode !== null && JSON.parse(localStorage.getItem('themeMode')) === false) {
            setDarkMode(true);
        } else {
            setDarkMode(false);
        }
    }

    useEffect(() => {
        retrieveUser();
        fetchedCards && retrieveCardsByUser();
        setFetchedCards(false);
        retrieveDarkMode();
    }, [user, cardId, fetchedCards]);

    return (
        <div className={`flex flex-col h-screen ${darkMode ? 'dark bg-slate-900' : ''}`}>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme={darkMode ? 'dark' : 'light'}
            />
            <Alert
                title={"Delete card with " + cardNumber}
                id={id}
                open={confirmOpen}
                setOpen={setConfirmOpen}
                onConfirm={deleteCardById} 
            />
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
                    {storedUser !== null && storedUser !== '' &&
                        <button onClick={() => onShowCardForm()} className='flex bg-blue-300 dark:bg-gray-800 items-center rounded px-2 text-slate-600 dark:text-slate-300 font-bold text-sm uppercase h-10 hover:bg-gray-500 dark:hover:bg-gray-400 hover:text-slate-100 dark:hover:text-slate-800'>add card</button>
                    }
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
                        {cards && cards.length > 0 ?
                            cards.map((card, index) => (
                                <div key={index} className='flex content-center md:w-full justify-center'>
                                    <div className={`flex w-full m-1 rounded border-2 border-transparent ${card.done ? 'border-green-600' : ''}`}>
                                        <div className={toggleFetch && card.id === cardId ? 'flex flex-col md:flex-row md:w-full md:justify-between rounded bg-slate-200 dark:bg-slate-600 p-2 flex dark:text-gray-300 text-center items-center' : 'flex flex-col md:flex-row md:w-full md:justify-between bg-transparent rounded p-2 flex dark:text-gray-300 text-center items-center'}>
                                            <p>{card.number}</p>
                                            <span className='flex md:ml-1'>
                                                <i onClick={() => handleToggleCardContent(card.id, card.done)} className='px-1 rounded hover:bg-blue-200 active:bg-blue-200 dark:hover:bg-slate-400 dark:active:bg-slate-400 hover:text-black active:text-black cursor-pointer'><AiOutlineArrowRight className={toggleFetch && card.id === cardId ? '-rotate-90 md:rotate-180' : 'rotate-90 md:rotate-0'} /></i>
                                                <i onClick={card.done ? () => generatePdf(card.id) : undefined} className={`px-1 rounded ${card.done ? 'cursor-pointer hover:bg-blue-200 active:bg-blue-200 dark:active:bg-slate-400 hover:text-black active:text-black dark:hover:bg-slate-400' : 'cursor-not-allowed'}`}><AiFillFilePdf /></i>
                                                <i onClick={() => handleModal(card.id, card.number)} className='px-1 rounded hover:bg-blue-200 active:bg-blue-200 dark:hover:bg-slate-400 dark:active:bg-slate-400 hover:text-black active:text-black'><AiOutlineDelete /></i>
                                                <i onClick={() => toggleCard(card.id)} className='px-1 rounded hover:bg-blue-200 active:bg-blue-200 dark:hover:bg-slate-400 dark:active:bg-slate-400 hover:text-black active:text-black cursor-pointer'>
                                                    {card.done ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                                </i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )) :
                            <div className='flex content-center md:w-full justify-center'>
                                <div className='flex w-full m-1 rounded border-2 border-transparent'>
                                    <div className='flex flex-col md:flex-row md:w-full md:justify-between rounded bg-slate-200 dark:bg-slate-600 p-2 flex dark:text-gray-300 text-center items-center'>
                                        <p className='text-xs'>No cards found for {storedUser}</p>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className='flex flex-col w-full dark:bg-gray-900'>
                    <div className='flex bg-slate-200 dark:bg-gray-600 p-1 m-1 rounded'>
                        <button onClick={toggleFetch ? () => onToggleTripForm() : undefined} className={`mx-1 bg-blue-300 dark:bg-gray-900 px-1 rounded uppercase font-bold text-slate-100 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-blue-900 hover:text-gray-500 text-xs ${!toggleFetch ? 'opacity-10 hover:cursor-not-allowed' : 'opacity-100'}`}>add trip</button>
                        <button onClick={toggleFetch ? () => onToggleFuelForm() : undefined} className={`mx-1 bg-blue-300 dark:bg-gray-900 px-1 rounded uppercase font-bold text-slate-100 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-blue-900 hover:text-gray-500 text-xs ${!toggleFetch ? 'opacity-10 hover:cursor-not-allowed' : 'opacity-100'}`}>add fuel</button>
                    </div>
                    <div className='m-1 bg-blue-200 dark:bg-slate-600 rounded'>{toggleFetch && <TripFormik toggleForm={addTripToggle} cardId={cardId} cardReady={cardReady} toggleCard={toggleCard} theme={darkMode} />}</div>
                    <div className='m-1 bg-blue-200 dark:bg-slate-600 rounded'>{toggleFetch && <Fuel toggleForm={addFuelToggle} cardId={cardId} cardReady={cardReady} toggleCard={toggleCard} theme={darkMode} />}</div>
                </div>
            </div>
        </div>
    );
}
export default Card;