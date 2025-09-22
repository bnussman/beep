import { useId, useRef } from "react";
import { MenuProps } from "./Menu";

export function Menu(props: MenuProps) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <button
        style={{ all: "unset", cursor: "pointer" }}
        popoverTarget={id}
        onContextMenu={(e) => {
          e.preventDefault();
          ref.current?.showPopover();
        }}
      >
        {props.trigger}
      </button>
      <div popover="" popoverTargetAction="toggle" id={id} ref={ref}>
        {props.options.map((option, index) => (
          <button role="menuitem" key={index} onClick={option.onClick}>
            {option.title}
          </button>
        ))}
      </div>
    </>
  );
}
