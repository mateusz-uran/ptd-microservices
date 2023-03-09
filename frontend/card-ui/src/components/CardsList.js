import React, { useEffect, useState } from 'react';

import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import CardService from '../services/CardService';
import { getCurrentDay, getCurrentMonth, getCurrentYear } from './utils';
import { ListItemButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CardSpecification from './CardSpecification';

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

    const handleCardInformation = (id) => {
        setCardId(id);
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

    useEffect(() => {
        retrieveCardByUserAndDate();
    }, [])

    return (
        <div className={`flex flex-row px-4 ${mode ? 'text-white' : ''}`}>
            <div>
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
                {cardsList && cardsList.length > 0 && cardsList.map((card, index) => {
                    return (
                        <div key={index}>
                            <List>
                                <ListItemButton
                                    selected={renderCardInfoHandler && cardId === card.id}
                                    onClick={() => handleCardInformation(card.id)}
                                >
                                    <ListItemText primary={card.number} />
                                    <IconButton edge="end" onClick={() => handleDelete(card.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemButton>
                                <Divider sx={{ borderBottomWidth: 2 }} />
                            </List>
                        </div>
                    )
                })}
            </div>
            <div className='w-full'>{renderCardInfoHandler &&
                <CardSpecification id={cardId} />
            }
            </div>
        </div>
    );
}

export default CardsList;