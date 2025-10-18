import { useId, useRef } from "react";
import { MenuProps } from "./Menu";

export function Menu(props: MenuProps) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  const renderOption = (
    option: MenuProps["options"][number],
  ): React.ReactNode => {
    if (option.type === "submenu") {
      return option.options?.map(renderOption);
    }
    return (
      <button key={option.title} role="menuitem" onClick={option.onClick}>
        {option.title}
      </button>
    );
  };

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
        {props.options
          .filter((option) => option.show === undefined || option.show)
          .map(renderOption)}
      </div>
    </>
  );
}
