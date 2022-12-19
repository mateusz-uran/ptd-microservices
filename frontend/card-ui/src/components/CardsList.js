import React, { useState, useEffect } from 'react';
import CardService from '../services/CardService';
import { toast } from 'react-toastify';
import Alert from './Alert';
import { AiOutlineDelete, AiOutlineArrowRight } from 'react-icons/ai'

function CardsList(props) {
    const { user, retrieve } = props;

    const [cards, setCards] = useState();
    const [toggleFetch, setToggleFetch] = useState(false);
    const [cardId, setCardId] = useState();
    const [cardReady, setCardReady] = useState();

    const [confirmOpen, setConfirmOpen] = useState();
    const [id, setId] = useState();
    const [cardNumber, setCardNumber] = useState();

    const handleToggleCardContent = (id, done) => {
        setCardId(id);
        setCardReady(done);
        setToggleFetch(!toggleFetch);
    }

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

    function getCurrentMonth() {
        const current = new Date();
        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return month[current.getMonth()];
    }

    function getCurrentYear() {
        const current = new Date();
        return current.getFullYear();
    }

    const retrieveCardByUserAndDate = () => {
        let year = getCurrentYear();
        let month = getCurrentMonth();
        if (!localStorage.getItem('user')) {
            console.log("Cant find any user")
        } else {
            CardService.getCardByUserAndMonth(
                JSON.parse(localStorage.getItem('user')), month, year)
                .then(response => {
                    setCards(response.data);
                })
                .catch(e => {
                    console.log(e);
                    setCards([]);
                })
        }
    }

    useEffect(() => {
        retrieveCardByUserAndDate();
    }, [retrieve])

    return (
        <div>
            <Alert
                title={"Are you sure?"}
                description={"All data from card " + cardNumber + " will be erased and cannot be restored."}
                id={id}
                open={confirmOpen}
                setOpen={setConfirmOpen}
                onConfirm={deleteCardById}
            />
            {cards && cards.length > 0 ?
                cards.map((card, index) => (
                    <div key={index} className='flex content-center md:w-full justify-center'>
                        <div className={`flex w-full m-1 rounded border-2 border-transparent ${card.done ? 'border-green-600' : ''}`}>
                            <div className={toggleFetch && card.id === cardId ? 'flex flex-col md:flex-row md:w-full md:justify-between rounded bg-slate-200 dark:bg-slate-600 p-2 flex dark:text-gray-300 text-center items-center' : 'flex flex-col md:flex-row md:w-full md:justify-between bg-transparent rounded p-2 flex dark:text-gray-300 text-center items-center'}>
                                <p>{card.number}</p>
                                <span className='flex md:ml-1'>
                                    <i onClick={() => handleToggleCardContent(card.id, card.done)} className='px-1 rounded hover:bg-blue-200 active:bg-blue-200 dark:hover:bg-slate-400 dark:active:bg-slate-400 hover:text-black active:text-black cursor-pointer'><AiOutlineArrowRight className={toggleFetch && card.id === cardId ? '-rotate-90 md:rotate-180' : 'rotate-90 md:rotate-0'} /></i>
                                    {/* <i onClick={card.done ? () => generatePdf(card.id) : undefined} className={`px-1 rounded ${card.done ? 'cursor-pointer hover:bg-blue-200 active:bg-blue-200 dark:active:bg-slate-400 hover:text-black active:text-black dark:hover:bg-slate-400' : 'cursor-not-allowed'}`}><AiFillFilePdf /></i> */}
                                    <i onClick={() => handleModal(card.id, card.number)} className='px-1 rounded hover:bg-blue-200 active:bg-blue-200 dark:hover:bg-slate-400 dark:active:bg-slate-400 hover:text-black active:text-black'><AiOutlineDelete /></i>
                                    {/* <i onClick={() => toggleCard(card.id)} className='px-1 rounded hover:bg-blue-200 active:bg-blue-200 dark:hover:bg-slate-400 dark:active:bg-slate-400 hover:text-black active:text-black cursor-pointer'>
                                        {card.done ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                                    </i> */}
                                </span>
                            </div>
                        </div>
                    </div>
                )) :
                <div className='flex content-center md:w-full justify-center'>
                    <div className='flex w-full m-1 rounded border-2 border-transparent'>
                        <div className='flex flex-col md:flex-row md:w-full md:justify-between rounded bg-slate-200 dark:bg-slate-600 p-2 flex dark:text-gray-300 text-center items-center'>
                            <p className='text-xs'>No cards found for {user}</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default CardsList;