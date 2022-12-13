import React, { useState, useEffect } from 'react';
import { SlClose } from 'react-icons/sl';

function Alert(props) {
    const { title, description, id, open, setOpen, onConfirm, modalTheme } = props;

    return (
        <div className={modalTheme ? 'dark' : ''}>
            {open ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-1xl">
                            <div className="rounded relative flex flex-col bg-white bg-gray-100 dark:bg-slate-800">
                                <div className='flex justify-end p-2 items-center'>
                                    <button onClick={() => setOpen(false)} className='text-black dark:text-slate-300'>×</button>
                                </div>
                                <div className='flex justify-center text-red-400'>
                                    <SlClose size='3.5rem' />
                                </div>
                                {/*body*/}
                                <div className="dark:text-slate-400 p-2 flex-auto">
                                    <h3 className='my-4'>{title}</h3>
                                    <p className="text-sm mx-4">{description}</p>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end mx-4 p-6">
                                    <button
                                        className="dark:bg-slate-200 text-slate-400 dark:text-slate-400 font-bold uppercase text-sm mr-1 mb-1 px-6 py-2 rounded shadow outline-none hover:bg-slate-200 dark:hover:bg-slate-500 hover:text-slate-500 dark:hover:text-slate-200 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setOpen(false)}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="bg-red-400 text-white dark:text-slate-200 font-bold uppercase text-sm mr-1 mb-1 px-6 py-2 rounded shadow outline-none hover:bg-red-500 hover:text-slate-200 dark:hover:text-slate-100 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => {
                                            setOpen(false);
                                            onConfirm(id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </div>
    );
}

export default Alert;