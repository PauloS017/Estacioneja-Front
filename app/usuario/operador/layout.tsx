"use client"

import React from 'react' // 1. Importe o useState

export default function OperadorLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <>{children}</>
    )
}