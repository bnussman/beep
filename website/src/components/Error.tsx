interface Props {
    error: any;
}

export function Error(props: Props) {
    return (
        <div role="alert" className="mb-4">
            <div className="px-4 py-2 font-bold text-white bg-red-500 rounded-t">
                Error
            </div>
            <div className="px-4 py-3 text-red-700 bg-red-100 border border-t-0 border-red-400 rounded-b">
                {props.error.message}
            </div>
        </div>
    );
}
