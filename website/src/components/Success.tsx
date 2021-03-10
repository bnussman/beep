import React from 'react';

interface Props {
    message: any;
}

export function Success(props: Props) {
    return (
        <div role="alert" className="mb-4">
            <div className="px-4 py-2 font-bold text-white bg-green-500 rounded-t">
                Success
            </div>
            <div className="px-4 py-3 text-green-700 bg-green-100 border border-t-0 border-green-400 rounded-b">
                {props.message}
            </div>
        </div>
    );
}
