import React from 'react';

interface Props {
    error: any;
}

export function ErrorBanner(props: Props) {
    return (
        <div role="alert" className="mb-4">
            <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                Error
            </div>
            <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                {props.error.message}
            </div>
        </div>
    );
}