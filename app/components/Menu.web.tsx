import { useId } from "react";
import { MenuProps } from "./Menu";

export function Menu(props: MenuProps) {
  const id = useId();

  return (
    <>
      <button style={{ all: "unset" }} popoverTarget={id}>
        {props.trigger}
      </button>
      <div popover="" popoverTargetAction="toggle" id={id}>
        {props.options.map((option, index) => (
          <button role="menuitem" key={index} onClick={option.onClick}>
            {option.title}
          </button>
        ))}
      </div>
    </>
  );
}
