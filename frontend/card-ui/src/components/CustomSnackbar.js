import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import React from 'react';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CustomSnackbar(props) {
    const { description, open, setOpen, severity } = props;

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(prevState => ({
            ...prevState,
            open: false,
            message: ''
        }))
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
        >
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {description}
            </Alert>
        </Snackbar>
    );
}

export default CustomSnackbar;