import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog(props) {
    const { title, open, cardToDelete, setOpen, onConfirm } = props;

    return (
        <div>
            <Dialog
                open={open}
                onClose={() =>
                    setOpen(prevState => ({
                        ...prevState,
                        confirmation: false,
                        cardIdToDelete: 0
                    }))}
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        This actions cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={() =>
                            setOpen(prevState => ({
                                ...prevState,
                                confirmation: false,
                                cardIdToDelete: 0
                            }))}
                    >
                        No
                    </Button>
                    <Button
                        variant="contained"
                        // onClick={() => {
                        //     setOpen({ cardIdToDelete: cardToDelete, confirmation: false });
                        //     onConfirm(cardToDelete);
                        // }}
                        onClick={() => {
                            setOpen(prevState => ({
                                ...prevState,
                                confirmation: false,
                                cardIdToDelete: cardToDelete
                            }))
                            onConfirm(cardToDelete);
                        }}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}