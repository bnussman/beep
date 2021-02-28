import Logger from "./Logger";

/**
 * Helper function that parces any error the Beep API returns
 * This parcer for errors was introduced to allow us to parse form validation errors
 *
 * @param error error from the rest api that needs to be parsed before user sees it in Alert()
 * @returns string that will display nicely in native Alert()
 */
export function parseError(validatorError: string | any): string {  
    if ((typeof validatorError) == "string") {
        return validatorError; 
    }

    let output = "";  

    Object.keys(validatorError).forEach(function (item) {  
        output += "\n" + validatorError[item].message;  
    });  

    return output.substr(1, output.length);  
}

/**
 * Handle fetch errors 
 *
 * @param error is the native fetch error
 * @returns false so I can throw this is the isLoading setState
 */
export function handleFetchError(error: any): boolean {
    alert(parseError(error));
    return false;
}
