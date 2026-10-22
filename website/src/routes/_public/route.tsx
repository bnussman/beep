import { createFileRoute, Outlet } from '@tanstack/react-router'
import React from 'react'
import { Footer } from '../../components/Footer'

export const Route = createFileRoute('/_public')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <div className="flex flex-col gap-4 min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  )
}
