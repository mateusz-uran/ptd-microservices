import React from 'react';
import PdfService from '../services/PdfService';
import axios from "axios";
import { IconButton } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

function GeneratePDF(props) {
    const { cardId, cardDone, user, setOpenBackdrop, setSnackbarInformation } = props;

    const handleClick = async () => {
        if (!cardDone) {
            setSnackbarInformation(prevState => ({
                ...prevState,
                open: true,
                type: 'warning',
                message: 'Bruuh, card must be done!'
            }))
        }

        else {
            setOpenBackdrop(true);

            await axios.get('http://localhost:8181/api/user/get/' + user)
                .then((response) => {
                    createPdf(cardId, response.data.id);
                    setOpenBackdrop(false);
                }, (error) => {
                    console.log(error);
                    setOpenBackdrop(false);
                });
        }
    }

    const createPdf = (cardId, userId) => {
        try {
            PdfService.getPdf(cardId, userId)
                .then(response => {
                    const file = new Blob([response.data], { type: "application/pdf" });
                    const fileURL = URL.createObjectURL(file);
                    const pdfWindow = window.open();
                    pdfWindow.location.href = fileURL;
                    setOpenBackdrop(false);
                }, (error) => {
                    console.log(error);
                    setOpenBackdrop(false);
                    if(error.response.status === 503) {
                        setSnackbarInformation(prevState => ({
                            ...prevState,
                            open: true,
                            type: 'warning',
                            message: error.request.statusText
                        }))
                    }
                })
        } catch (error) {
            console.log(error);
            setOpenBackdrop(false);
        }
    }

    return (
        <div>
            <IconButton edge="end" sx={{ marginX: 1 }} onClick={handleClick} >
                <PictureAsPdfIcon />
            </IconButton>
        </div>
    );
}

export default GeneratePDF;