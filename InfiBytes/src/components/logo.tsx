import { Orbit } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-headline">
      <Orbit className="h-6 w-6 text-primary" />
      <span className="text-lg font-semibold text-foreground group-data-[collapsible=icon]:hidden">
        eBhutanza
      </span>
    </div>
  );
}
