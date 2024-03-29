import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { MdDarkMode } from 'react-icons/md';
import { BsFillSunFill } from 'react-icons/bs';
import CardsList from './CardsList';
import Divider from '@mui/material/Divider';

function Home(props) {
    const [darkMode, setDarkMode] = useState(false);
    const [username, setUsername] = useState("");
    const [renderCardListHandler, setRenderCardListHandler] = useState(false);

    const handleChange = (event) => {
        setDarkMode(event.target.checked);
        localStorage.setItem('theme', JSON.stringify(event.target.checked));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setRenderCardListHandler(true);
        localStorage.setItem('username', JSON.stringify(username));
    }

    const darkTheme = createTheme(darkMode ?
        {
            palette: {
                mode: 'dark',
            },
        } : {
            palette: {
                mode: 'light',
            }
        }
    )

    function checkStorage() {
        let user = JSON.parse(localStorage.getItem('username'));
        if (user !== undefined && user !== null) {
            setUsername(user);
            setRenderCardListHandler(true);
        }
    }

    useEffect(() => {
        checkStorage();
        setDarkMode(JSON.parse(localStorage.getItem('theme')));
    }, []);

    return (
        <div className={darkMode ? 'dark bg-slate-900' : 'bg-blue-200'}>
            <ThemeProvider theme={darkTheme}>
                <div className='p-4 flex justify-between items-center'>
                    <form onSubmit={handleSubmit} className='w-1/6'>
                        <div className='flex items-center'>
                            <TextField
                                className={darkMode ? 'text-white' : ''}
                                id="outlined-basic"
                                label="Username"
                                value={username}
                                onChange={(event) => {
                                    setUsername(event.target.value);
                                    setRenderCardListHandler(false);
                                }}
                            />
                            <IconButton onClick={() => setRenderCardListHandler(true)}>
                                <PersonSearchIcon className={darkMode ? 'text-white' : ''} />
                            </IconButton>
                        </div>
                    </form>
                    <div className='flex items-center'>
                        <BsFillSunFill className={darkMode ? 'text-blue-200' : 'text-white'} />
                        <Switch
                            checked={darkMode}
                            onChange={handleChange}
                        />
                        <MdDarkMode className={darkMode ? 'text-white' : ''} />
                    </div>
                </div>
                <Divider sx={{ borderBottomWidth: 2, marginBottom: 2 }} />
                {renderCardListHandler && username &&
                    <CardsList
                        user={username}
                        mode={darkMode}
                    />}
            </ThemeProvider>
        </div>
    );
}

export default Home;