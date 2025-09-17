interface Option {
  title: string;
  onClick: () => void;
}

export interface MenuProps {
  /**
   * The trigger for the men
   */
  trigger: React.ReactNode;
  /**
   * Options that render in the Menu
   */
  options: Option[];
}

export const Menu = (props: MenuProps) => null;
