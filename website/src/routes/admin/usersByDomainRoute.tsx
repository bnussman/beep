import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/usersByDomainRoute')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/usersByDomainRoute"!</div>
}
