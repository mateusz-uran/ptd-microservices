import React, { useEffect, useState } from 'react';

import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import CardService from '../services/CardService';
import { getCurrentDay, getCurrentMonth, getCurrentYear } from './utils';
import { ListItemButton, ToggleButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import { useFormik } from 'formik';
import * as yup from "yup";
import CardCalendar from './CardCalendar';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import AlertDialog from './AlertDialog';
import CustomSnackbar from './CustomSnackbar';
import GeneratePDF from './GeneratePDF';

function CardsList(props) {
    const navigate = useNavigate();
    const { user, mode } = props;

    const [year, setYear] = useState(getCurrentYear());
    const [month, setMonth] = useState(getCurrentMonth());
    const day = getCurrentDay();

    const [cardsList, setCardsList] = useState([]);

    const [cardId, setCardId] = useState(0);
    const [renderCardInfoHandler, setRenderCardInfoHandler] = useState(false);

    const [openBackdrop, setOpenBackdrop] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState({
        cardId: 0,
        confirmation: false,
        title: '',
        subtitle: '',
        number: '',
        confirmFunction: ''
    });

    const retrieveCardByUserAndDate = () => {
        setOpenBackdrop(true);
        CardService.getCardByUserAndMonth(user, year, month)
            .then(response => {
                setCardsList(response.data);
                setOpenBackdrop(false);
            }, (error) => {
                setOpenBackdrop(false);
                console.log(error);
                setSnackbarInformation(prevState => ({
                    ...prevState,
                    open: true,
                    type: 'warning',
                    message: error.response.data.description
                }))
            });
    }

    const [snackBarInformation, setSnackbarInformation] = useState({
        open: false,
        type: '',
        message: ''
    });

    const formik = useFormik({
        initialValues: {
            number: '',
        },
        validationSchema: yup.object({
            number: yup.string().required("Cannot be empty"),
        }),
        onSubmit: (values, { resetForm }) => {
            let cardPayload = {
                number: values.number,
                authorUsername: user
            }
            CardService.create(cardPayload, year, month, day)
                .then(response => {
                    setCardsList(cardsList => [...cardsList, response.data]);
                    resetForm();
                }, (error) => {
                    console.log(error)
                    setSnackbarInformation(prevState => ({
                        ...prevState,
                        open: true,
                        type: 'warning',
                        message: error.response.data.description
                    }))
                })
        },
    });

    const handleFinishCard = (id) => {
        CardService.toggleCard(id, user)
            .then(() => {
                toggleSelectedCard(id)
            }, (error) => {
                console.log(error);
                setSnackbarInformation(prevState => ({
                    ...prevState,
                    open: true,
                    type: 'warning',
                    message: error.response.data.description
                }))
            })
    }

    const toggleSelectedCard = (id) => {
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
                setRenderCardInfoHandler(false);
                navigate(-1);
            })
    }

    const checkStorage = () => {
        let storedCardId = JSON.parse(localStorage.getItem('selectedCard'));
        if (storedCardId !== undefined && storedCardId !== null) {
            setCardId(storedCardId);
            setRenderCardInfoHandler(true);
        }
    }

    useEffect(() => {
        user && retrieveCardByUserAndDate();
        checkStorage();

    }, [year, month])

    return (
        <div className={`flex lg:flex-row flex-col px-4 ${mode ? 'text-white' : ''}`}>
            <Backdrop
                open={openBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <AlertDialog
                title={confirmOpen.title}
                subtitle={confirmOpen.subtitle}
                number={confirmOpen.number}
                open={confirmOpen.confirmation}
                selectedCardId={confirmOpen.cardId}
                setOpen={setConfirmOpen}
                onConfirm={confirmOpen.confirmFunction}
            ></AlertDialog>
            <CustomSnackbar
                open={snackBarInformation.open}
                description={snackBarInformation.message}
                severity={snackBarInformation.type}
                setOpen={setSnackbarInformation}
            />
            <div className='lg:w-1/6 my-2'>
                <form onSubmit={formik.handleSubmit}>
                    <div className='flex items-center'>
                        <TextField
                            id="number"
                            name="number"
                            label="number"
                            value={formik.values.number}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.number && Boolean(formik.errors.number)}
                            helperText={formik.touched.number && formik.errors.number}
                        />
                        <IconButton type="submit">
                            <AddIcon className={mode ? 'text-white' : ''} />
                        </IconButton>
                    </div>
                </form>

                <div className='mt-2'>
                    <CardCalendar
                        year={year}
                        setYear={setYear}
                        month={month}
                        setMonth={setMonth}
                    />
                </div>

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
                                            onClick={() =>
                                                setConfirmOpen(prevState => ({
                                                    ...prevState,
                                                    confirmation: true,
                                                    cardId: card.id,
                                                    title: card.done ? 'Undone card number: ' : 'Done card number: ',
                                                    subtitle: 'Employer will get a message.',
                                                    number: card.number,
                                                    confirmFunction: handleFinishCard
                                                }))}
                                            sx={{ marginRight: 1 }}
                                        >
                                            <CheckIcon />
                                        </ToggleButton>
                                        <ListItemText sx={{ textTransform: 'uppercase' }} primary={card.number} />
                                        <GeneratePDF
                                            cardId={cardId}
                                            cardDone={card.done}
                                            user={user}
                                            setOpenBackdrop={setOpenBackdrop}
                                            setSnackbarInformation={setSnackbarInformation}
                                        />
                                        <IconButton
                                            edge="end"
                                            onClick={() =>
                                                setConfirmOpen(prevState => ({
                                                    ...prevState,
                                                    confirmation: true,
                                                    cardId: card.id,
                                                    number: card.number,
                                                    title: 'Delete card number: ',
                                                    subtitle: 'This action cannot be undone.',
                                                    number: card.number,
                                                    confirmFunction: handleDelete
                                                }))}>
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