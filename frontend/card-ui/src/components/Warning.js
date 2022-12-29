import React from 'react';
import { AiFillWarning } from 'react-icons/ai';

function Warning(props) {
    const { description, open, modalTheme } = props;
    return (
        <div className={modalTheme ? 'dark' : ''}>
            {open ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-1xl">
                            <div className="rounded relative flex flex-col bg-white bg-gray-100 dark:bg-slate-800">
                                <div className='flex justify-center text-yellow-400'>
                                    <AiFillWarning size='4.5rem' />
                                </div>
                                {/*body*/}
                                <div className="dark:text-slate-400 p-2 flex-auto">
                                    <p className="text-lm mx-4">{description}</p>
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

export default Warning;