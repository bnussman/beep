import React from 'react'
import { createLink } from '@tanstack/react-router'
import { Link as MUILink } from '@mui/material'
import type { LinkProps } from '@mui/material'
import type { LinkComponent } from '@tanstack/react-router'

interface MUILinkProps extends LinkProps {
  // Add any additional props you want to pass to the Link
}

const MUILinkComponent = React.forwardRef<HTMLAnchorElement, MUILinkProps>(
  (props, ref) => <MUILink ref={ref} {...props} />,
)

const CreatedLinkComponent = createLink(MUILinkComponent)

export const Link: LinkComponent<typeof MUILinkComponent> = (props) => {
  return <CreatedLinkComponent preload={'intent'} {...props} />
}
