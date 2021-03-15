import clsx from "clsx";

export function Card(props: { className?: string, children: any }) {
    return (
        <div className={clsx("p-4 overflow-hidden border border-gray-200 sm:rounded-lg dark:bg-gray-800 dark:text-white dark:border-black", props.className)}>
            {props.children}
        </div>
    )
};
