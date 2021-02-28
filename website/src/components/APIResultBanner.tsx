import React from 'react';
import { Error } from "../utils/errors";

interface Props {
    response: any;    
    setResponse: (val: any) => void;
}

function APIResultBanner(props: Props) {
    function capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return (
        <div role="alert" className="mb-4" onClick={() => props.setResponse(null)}>
            <div className={props.response.status === "success" ?
                "bg-green-500 text-white font-bold rounded-t px-4 py-2"
                :
                    props.response.status === "warning" ?
                    "bg-yellow-500 text-white font-bold rounded-t px-4 py-2"
                    :
                        "bg-red-500 text-white font-bold rounded-t px-4 py-2"
                }>
                {capitalize(props.response.status)}
            </div>
            <div className={props.response.status === "success" ?
                "border border-t-0 border-green-400 rounded-b bg-green-100 px-4 py-3 text-green-700"
                :
                    props.response.status === "warning" ?
                    "border border-t-0 border-yellow-400 rounded-b bg-yellow-100 px-4 py-3 text-yellow-700"
                    :
                        "border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700"
                }>
                <Error error={props.response.message} />
            </div>
        </div>
    );
}

export default APIResultBanner;
