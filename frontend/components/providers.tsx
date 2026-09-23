import { Toaster } from "@/components/ui/toast"
//capa para agregar provedores
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
}