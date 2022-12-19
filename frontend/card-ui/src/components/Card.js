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
import { FiRefreshCcw } from 'react-icons/fi';
import { IoMdArrowDropdown } from 'react-icons/io';
import { MdDarkMode, MdOutlineRefresh } from 'react-icons/md';
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

    function getCurrentMonth() {
        const current = new Date();
        return current.getMonth() + 1;
    }

    function getCurrentYear() {
        const current = new Date();
        return current.getFullYear();
    }

    const [years, setYearsDates] = useState([]);

    const [months, setMonths] = useState([
        { number: 1, name: 'jan' },
        { number: 2, name: 'feb' },
        { number: 3, name: 'mar' },
        { number: 4, name: 'apr' },
        { number: 5, name: 'may' },
        { number: 6, name: 'june' },
        { number: 7, name: 'july' },
        { number: 8, name: 'aug' },
        { number: 9, name: 'sept' },
        { number: 10, name: 'oct' },
        { number: 11, name: 'nov' },
        { number: 12, name: 'dec' },
    ])

    function fillArray(currentYear) {
        let defaultYear = 2022;
        let arrRange = currentYear - defaultYear;
        while (defaultYear <= currentYear && years.length < arrRange + 1) {
            years.push(defaultYear);
            defaultYear = defaultYear + 1;
        }
        return years;
    }

    const [calendar, setCalendar] = useState(false);
    const [tempYear, setTempYear] = useState();

    const toggleCalendar = (year) => {
        setTempYear(year);
        setCalendar(!calendar);
    }

    const changeYear = (year, month) => {
        setCurrentYear(year);
        setCurrentMonth(month);
        setCalendar(false);
    }

    const [currentYear, setCurrentYear] = useState(getCurrentYear());
    const [currentMonth, setCurrentMonth] = useState(getCurrentMonth());

    const retrieveCardByUserAndDate = () => {
        if (!localStorage.getItem('user')) {
            console.log("Cant find any user")
        } else {
            CardService.getCardByUserAndMonth(
                JSON.parse(localStorage.getItem('user')), currentYear, currentMonth)
                .then(response => {
                    setCards(response.data);
                })
                .catch(e => {
                    console.log(e);
                    setCards([]);
                })
        }
    }

    const [confirmOpen, setConfirmOpen] = useState();
    const [id, setId] = useState();
    const [cardNumber, setCardNumber] = useState();

    const handleModal = (id, number) => {
        setConfirmOpen(true);
        setId(id);
        setCardNumber(number);
    }

    const deleteCardById = (id) => {
        CardService.deleteCard(id)
            .then(response => {
                console.log(response)
                retrieveCardByUserAndDate();
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
                    retrieveCardByUserAndDate();
                    setCardReady(!cardReady);
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
        } else {
            setAddTripToggle(!addTripToggle);
        }
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
        fillArray(currentYear);
        retrieveUser();
        fetchedCards && retrieveCardByUserAndDate();
        setFetchedCards(false);
        retrieveDarkMode();
    }, [user, cardId, fetchedCards, tempYear]);

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
                title={"Are you sure?"}
                description={"All data from card " + cardNumber + " will be erased and cannot be restored."}
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
            <div className='flex flex-col md:flex-row md:h-screen'>
                <div className='flex flex-col items-center bg-gray-100 dark:bg-gray-700 pb-2 md:min-w-min'>
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
                    <div className='flex flex-col p-4 w-max'>
                        <p className='m-1 p-1 text-xs font-bold bg-blue-200 text-slate-500 dark:bg-slate-800 dark:text-slate-300 rounded'>Cards from: {currentYear}-{currentMonth}</p>
                        <div className='grid grid-cols-3 sm:grid-cols-5 md:grid-cols-3 gap-2 mx-2 border border-blue-300 dark:border-transparent rounded'>
                            {years && years.length > 0 && years.map((year, index) => (
                                <div key={index} className='flex p-1 text-sm'>
                                    <div className='relative flex justify-center w-max items-center'>
                                        <p className={`${tempYear === year ? 'bg-slate-300 dark:bg-slate-800' : 'dark:bg-slate-600'} flex items-center z-10 dark:text-slate-300 p-1 rounded`}>
                                            {year}
                                            <i onClick={() => toggleCalendar(year)}><IoMdArrowDropdown /></i>
                                        </p>
                                        <div className='absolute w-24 z-50 top-7 md:left-2 grid grid-cols-3 bg-blue-300 dark:bg-slate-900'>
                                            {tempYear === year && calendar && months.map((month, index) => (
                                                <div className='' key={index}>
                                                    <div className='flex justify-center border dark:border-slate-500 dark:text-slate-300 uppercase'>
                                                        <p className='text-xs p-0.5 hover:bg-slate-300 dark:hover:bg-slate-500 hover:cursor-pointer' onClick={() => changeYear(year, month.number)}>{month.name}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='flex flex-row items-center justify-center m-1 p-1 text-xs font-bold bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300 rounded'>
                            <i className='mx-1 p-1 hover:bg-blue-400 dark:hover:bg-slate-900 dark:bg-slate-600 hover:cursor-pointer rounded' onClick={() => retrieveCardByUserAndDate()}><FiRefreshCcw /></i>
                            <p className='mx-1'>Refresh cards</p>
                        </div>
                    </div>
                    <div className='flex md:flex-col items-center w-full overflow-x-auto border-t-2 border-slate-300 dark:border-slate-800'>
                        {cards && cards.length > 0 ?
                            cards.map((card, index) => (
                                <div key={index} className='flex content-center md:w-full justify-center'>
                                    <div className={`flex w-full m-1 rounded border-2 border-transparent ${card.done ? 'border-green-600' : ''}`}>
                                        <div className={toggleFetch && card.id === cardId ? 'flex flex-col md:flex-row md:w-full md:justify-between rounded bg-slate-200 dark:bg-slate-600 p-2 flex dark:text-gray-300 text-center items-center' : 'flex flex-col md:flex-row md:w-full md:justify-between bg-transparent rounded p-2 flex dark:text-gray-300 text-center items-center'}>
                                            <p className='w-full'>{card.number}</p>
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