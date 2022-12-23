import React from 'react';

function Loading(props) {
    const { description, open, modalTheme } = props;
    return (
        <div className={modalTheme ? 'dark' : ''}>
            {open ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-1xl">
                            <div className="pt-2 rounded relative flex flex-col items-center bg-white dark:bg-slate-800">
                                <div class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 dark:from-slate-400 animate-spin">
                                    <div class="h-7 w-7 rounded-full bg-white dark:bg-slate-800"></div>
                                </div>
                                {/*body*/}
                                <div className="text-slate-600 dark:text-slate-400 p-2 flex-auto">
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

export default Loading;