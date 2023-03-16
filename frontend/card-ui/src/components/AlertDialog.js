import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog(props) {
    const { title, subtitle, number, open, selectedCardId, setOpen, onConfirm } = props;

    return (
        <div>
            <Dialog
                open={open}
                onClose={() =>
                    setOpen(prevState => ({
                        ...prevState,
                        confirmation: false,
                        cardId: 0
                    }))}
            >
                <DialogTitle>{title + number}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {subtitle}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={() =>
                            setOpen(prevState => ({
                                ...prevState,
                                confirmation: false,
                                cardId: 0
                            }))}
                    >
                        No
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setOpen(prevState => ({
                                ...prevState,
                                confirmation: false,
                                cardId: selectedCardId
                            }))
                            onConfirm(selectedCardId);
                        }}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}