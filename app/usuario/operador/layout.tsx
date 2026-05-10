import Header from "@/components/operador/header"

export default function EmpresaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />

        <main className="flex-1">{children}</main>
      </div>
    </>
  )
}