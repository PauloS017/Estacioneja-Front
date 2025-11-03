import { Navbar } from "@/components/navbar"
import React from "react"

// Este layout envolve Home, Sobre, FAQ, etc.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}

    </>
  )
}