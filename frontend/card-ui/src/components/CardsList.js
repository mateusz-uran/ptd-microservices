import React, { useEffect, useState } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import CardService from '../services/CardService';
import { getCurrentMonth, getCurrentYear } from './utils';
import { ListItemButton } from '@mui/material';

function CardsList(props) {
    const { user } = props;
    const year = getCurrentYear();
    const month = getCurrentMonth();
    const [cardsList, setCardsList] = useState([]);

    function retrieveCardByUserAndDate() {
        CardService.getCardByUserAndMonth(user, year, month)
            .then(response => {
                setCardsList(response.data);
            });
    }

    useEffect(() => {
        retrieveCardByUserAndDate();
    }, [])

    return (
        <div className='text-white flex px-10'>
            {cardsList && cardsList.length > 0 && cardsList.map((card, index) => {
                return (
                    <div key={index}>
                        <List>
                            <ListItemButton>
                                <ListItemText primary={card.number} />
                            </ListItemButton>
                            <Divider />
                        </List>
                    </div>
                )
            })}
        </div>
    );
}

export default CardsList;