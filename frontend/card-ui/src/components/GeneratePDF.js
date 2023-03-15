import React, { useEffect } from 'react';
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
        } else {

            setOpenBackdrop(true);

            let userId = 0;
            await axios.get('http://localhost:8181/api/user/get/' + user)
                .then((response) => {
                    userId = response.data.id
                }, (error) => {
                    setSnackbarInformation(prevState => ({
                        ...prevState,
                        open: true,
                        type: 'error',
                        message: error.response.data,
                    }))
                });

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
                    })
            } catch (error) {
                console.log(error);
                setOpenBackdrop(false);
            }
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