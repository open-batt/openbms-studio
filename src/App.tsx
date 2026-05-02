import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-2xl font-semibold">OpenBMS Studio</h1>
      <p className="text-muted-foreground mt-2">Ready.</p>
      <Button>Test Button</Button>
    </div>
  )
}