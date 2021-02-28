import React from "react";

export function Error(props) {  
    const validatorError = props.error;
    if (!validatorError) {
        return <p>...</p>;
    }

    if ((typeof validatorError) == "string") {
        return (<p>{validatorError}</p>); 
    }

    return (
        <ul className="pl-4">
            {Object.keys(validatorError).map((item, key) => {  
                return (<li key={key} className="list-disc">{validatorError[item].message}</li>);  
            })}
        </ul>
    );
}  
