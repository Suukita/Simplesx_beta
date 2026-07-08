import { ChefHat } from 'lucide-react';

const Header = () => {
  return (
    <header className="relative overflow-hidden border-b border-border bg-background">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-24 left-1/4 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -top-16 right-1/4 h-40 w-40 rounded-full bg-primary-glow/20 blur-3xl" />
      </div>

      <div className="container relative mx-auto flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground text-background shadow-elegant">
            <ChefHat className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              POS · 2026
            </span>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Sistema Restaurante
            </h1>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">Online</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
