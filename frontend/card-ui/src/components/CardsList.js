import React, { useEffect, useState } from 'react';

import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import CardService from '../services/CardService';
import { getCurrentDay, getCurrentMonth, getCurrentYear } from './utils';
import { ListItemButton, ToggleButton } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, Outlet } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';

function CardsList(props) {
    const { user, mode } = props;

    const year = getCurrentYear();
    const month = getCurrentMonth();
    const day = getCurrentDay();

    const [cardsList, setCardsList] = useState([]);
    const [number, setNumber] = useState("");

    const [cardId, setCardId] = useState(0);
    const [renderCardInfoHandler, setRenderCardInfoHandler] = useState(false);

    function retrieveCardByUserAndDate() {
        CardService.getCardByUserAndMonth(user, year, month)
            .then(response => {
                setCardsList(response.data);
            });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let cardPayload = {
            number: number,
            authorUsername: user
        }
        CardService.create(cardPayload, year, month, day)
            .then(response => {
                setCardsList(cardsList => [...cardsList, response.data]);
                setNumber('');
            }, (error) => {
                console.log(error)
            })
    }

    const handleFinishCard = (id) => {
        CardService.toggleCard(id)
            .then(() => {
                toggleSelectedCard(id)
            }, (error) => {
                console.log(error);
            })
    }

    function toggleSelectedCard(id) {
        setCardsList(prevState => {
            const updatedCards = prevState.map(card => {
                if (card.id === id) {
                    return { ...card, done: !card.done };
                } else {
                    return card;
                }
            });
            return updatedCards;
        });
    }

    const handleCardInformation = (id) => {
        setCardId(id);
        localStorage.setItem('selectedCard', JSON.stringify(id));
        if (renderCardInfoHandler === true && cardId !== 0) {
            setRenderCardInfoHandler(false);
            setRenderCardInfoHandler(true);
        } else {
            setRenderCardInfoHandler(true);
        }
    }

    const handleDelete = (id) => {
        CardService.deleteCard(id)
            .then(() => {
                setCardsList(cardsList.filter(card => card.id !== id));
            })
    }

    function checkStorage() {
        let storedCardId = JSON.parse(localStorage.getItem('selectedCard'));
        if (storedCardId !== undefined && storedCardId !== null) {
            setCardId(storedCardId);
            setRenderCardInfoHandler(true);
        }
    }

    useEffect(() => {
        user && retrieveCardByUserAndDate();
        checkStorage();
    }, [])

    return (
        <div className={`flex lg:flex-row flex-col px-4 ${mode ? 'text-white' : ''}`}>
            <div className='lg:w-1/6 my-2'>
                <form>
                    <div className='flex items-center'>
                        <TextField
                            className={mode ? 'text-white' : ''}
                            id="outlined-basic"
                            label="Number"
                            value={number}
                            onChange={(event) => {
                                setNumber(event.target.value);
                            }}
                        />
                        <IconButton onClick={handleSubmit}>
                            <AddIcon className={mode ? 'text-white' : ''} />
                        </IconButton>
                    </div>
                </form>
                {cardsList && cardsList.length > 0 ? (cardsList.map((card, index) => {
                    return (
                        <div key={index}>
                            <List>
                                <Link to={`card/${card.id}`}>
                                    <ListItemButton
                                        selected={renderCardInfoHandler && cardId === card.id}
                                        onClick={() => handleCardInformation(card.id)}
                                    >
                                        <ToggleButton
                                            value="check"
                                            selected={card.done}
                                            onClick={() => handleFinishCard(card.id)}
                                            sx={{ marginX: 1 }}
                                        >
                                            <CheckIcon />
                                        </ToggleButton>
                                        <ListItemText sx={{ textTransform: 'uppercase' }} primary={card.number} />
                                        <IconButton edge="end" sx={{ marginX: 1 }}>
                                            <PictureAsPdfIcon />
                                        </IconButton>
                                        <IconButton edge="end" onClick={() => handleDelete(card.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemButton>
                                </Link>
                                <Divider sx={{ borderBottomWidth: 2 }} />
                            </List>
                        </div>
                    )
                })) :
                    (<List>
                        <ListItemButton>
                            <ListItemText>No cards found</ListItemText>
                        </ListItemButton>
                    </List>)}
            </div>
            <Divider orientation="vertical" flexItem sx={{ borderWidth: 1 }} />
            <div className='w-full'>{renderCardInfoHandler && cardId &&
                <Outlet context={[cardId]} />
            }
            </div>
        </div>
    );
}

export default CardsList;