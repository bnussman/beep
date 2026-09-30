export interface FooterItemLink {
  href: string;
  content: string;
}

export interface BasicFooterItem {
  href?: never;
  content: React.JSX.Element;
}

export type FooterItem = BasicFooterItem | FooterItemLink;

