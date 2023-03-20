import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Divider from '@mui/material/Divider';
import CardsList from './CardsList';
import { useNavigate } from 'react-router-dom';

function Navbar(props) {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const [username, setUsername] = useState("");
    const [renderCardListHandler, setRenderCardListHandler] = useState(false);

    const handleChangeTheme = (event) => {
        setDarkMode(event.target.checked);
        localStorage.setItem('theme', JSON.stringify(event.target.checked));
    }

    const handleChangeUsername = (event) => {
        setUsername(event.target.value);
        setRenderCardListHandler(false);
        navigate("/");
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        localStorage.setItem('username', JSON.stringify(username));
        setRenderCardListHandler(true);
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
        <div className={`${darkMode ? 'dark bg-slate-700' : 'bg-blue-200'}`}>
            <ThemeProvider theme={darkTheme}>
                <div className='p-4 flex justify-between items-center'>
                    <form onSubmit={handleSubmit} className='lg:w-1/6'>
                        <div className='flex items-center'>
                            <TextField
                                className={darkMode ? 'text-white' : ''}
                                id="outlined-basic"
                                label="Username"
                                value={username}
                                onChange={handleChangeUsername}
                            />
                            <IconButton onClick={handleSubmit}>
                                <PersonSearchIcon className={darkMode ? 'text-white' : ''} />
                            </IconButton>
                        </div>
                    </form>
                    <div className='flex items-center'>
                        <WbSunnyIcon className={darkMode ? 'text-blue-200' : 'text-white'} />
                        <Switch
                            checked={darkMode}
                            onChange={handleChangeTheme}
                        />
                        <DarkModeIcon className={darkMode ? 'text-white' : ''} />
                    </div>
                </div>
                <Divider sx={{ borderBottomWidth: 2, marginBottom: 0 }} />
                {renderCardListHandler &&
                    <CardsList
                        user={username}
                        mode={darkMode}
                    />
                }
            </ThemeProvider>
        </div>
    );
}

export default Navbar;