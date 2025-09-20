import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Orbit, Menu, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Início', path: '/' },
    { name: 'Conversor', path: '/converter' },
    { name: 'Documentação', path: '/details/flashcards' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b sticky top-0 z-40 bg-background">
        <div className="flex items-center justify-between h-16 px-25">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-all">
              <Orbit className="h-6 w-6" strokeWidth={1.5} />
              <span className="text-xl font-semibold tracking-tight">Orbe</span>
            </Link>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center gap-6 ml-6">
              {navItems.map((item) => (
                <Button 
                  key={item.path} 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate(item.path)}
                  className={location.pathname === item.path ? "font-medium" : "text-muted-foreground"}
                >
                  {item.name}
                </Button>
              ))}
            </nav>
          </div>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-6">
                {navItems.map((item) => (
                  <Button 
                    key={item.path} 
                    variant="ghost" 
                    onClick={() => navigate(item.path)}
                    className="justify-start"
                  >
                    {item.name}
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      
      <main className="flex-1 py-8 px-4">
        <Outlet />
      </main>
      
      <footer className="border-t py-6 bg-background">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-25 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Orbe. Feito com muito café.</p>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <a href="https://github.com" target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}