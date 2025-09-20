import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Orbit, Zap, Code, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="py-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in">
          <Orbit className="h-16 w-16" strokeWidth={1.5} />
          <h1 className="text-5xl font-bold tracking-tight">
            Orbe
          </h1>
        </div>
        <p className="text-xl max-w-2xl mx-auto mb-6 text-muted-foreground">
          Widgets educacionais interativos para sites e LMS
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="group">
            <Link to="/flashcards" className="flex items-center gap-2">
              Explorar widgets
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>
      
      <Separator />
      
      {/* Widgets Section */}
      <section>
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-3">Widgets</h2>
            <p className="text-muted-foreground max-w-2xl">
              Ferramentas interativas prontas para incorporar em seu site ou LMS
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="transition-all hover:shadow-md border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <CardTitle>Flashcards</CardTitle>
              </div>
              <CardDescription>
                Cartões interativos de perguntas e respostas para estudo e revisão
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Estudo</Badge>
                <Badge variant="outline">Avaliação</Badge>
                <Badge variant="outline">Interativo</Badge>
              </div>
            </CardContent>
            <CardFooter className="pt-2 flex gap-3 justify-between">
              <Button asChild variant="default" size="sm">
                <Link to="/flashcards" className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  Visualizar
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/details/flashcards" className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5" />
                  Documentação
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-dashed opacity-75 hover:opacity-100 transition-opacity">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Code className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <CardTitle>Em breve</CardTitle>
              </div>
              <CardDescription>
                Novos widgets em desenvolvimento
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Portas Lógicas</Badge>
                <Badge variant="outline">Circuitos</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Separator />
      
      {/* Tools Section */}
      <section className="pb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-6 text-center">Ferramentas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="hover:shadow-sm transition-all">
            <CardHeader>
              <CardTitle className="text-lg">Documentação</CardTitle>
              <CardDescription>Guias de integração e exemplos</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/details/flashcards" className="flex items-center justify-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Ver instruções
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-sm transition-all">
            <CardHeader>
              <CardTitle className="text-lg">Conversor</CardTitle>
              <CardDescription>Transforme JSON em Base64 e vice-versa</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link to="/converter" className="flex items-center justify-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Acessar conversor
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}