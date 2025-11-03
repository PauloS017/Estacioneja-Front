import type React from "react"
import { Navbar } from "@/components/navbar"

export default function OperadorLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className=" text-black min-h-screen bg-background ">
            <Navbar variant="guarita"  />
            {children}
        </div>
    )
}
