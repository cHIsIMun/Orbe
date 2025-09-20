import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FlashCardsManager } from '@/widgets/flashcards/FlashCardsManager';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { Flashcard, WidgetConfig } from '@/types';

// Exemplo de dados padrão para demonstração
const exampleCards: Flashcard[] = [
  {
    Q: "Qual é a capital do Brasil?",
    A: "Brasília",
    T: "Geografia"
  },
  {
    Q: "Quem escreveu Dom Casmurro?",
    A: "Machado de Assis",
    T: "Literatura"
  },
  {
    Q: "Qual é a fórmula da água?",
    A: "H₂O",
    T: "Química"
  },
  {
    Q: "Qual o principal alimento dos pandas?",
    A: "Bambu",
    T: "Biologia"
  },
  {
    Q: "Em que ano o homem pisou na Lua pela primeira vez?",
    A: "1969",
    T: "História"
  }
];

export default function FlashCardsPage() {
  const [searchParams] = useSearchParams();
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [config, setConfig] = useState<WidgetConfig>({
    title: "Flashcards",
    theme: "auto",
    shuffleCards: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obter dados do parâmetro de URL 'data'
        const dataParam = searchParams.get('data');
        
        if (!dataParam) {
          // Se não houver dados, usar exemplo
          setCards(exampleCards);
          return;
        }
        
        // Verificar se o parâmetro é uma URL
        if (dataParam.startsWith('http')) {
          // Buscar dados da URL
          const response = await fetch(dataParam);
          if (!response.ok) {
            throw new Error(`Falha ao carregar dados: ${response.statusText}`);
          }
          const data = await response.json();
          setCards(data);
          
        } else {
          // Tentar decodificar como Base64
          try {
            const decodedData = atob(dataParam);
            const parsedData = JSON.parse(decodedData);
            setCards(parsedData);
          } catch {
            throw new Error('Formato de dados inválido. Use JSON codificado em Base64 ou URL válida.');
          }
        }
        
        // Verificar configurações
        const configParam = searchParams.get('config');
        if (configParam) {
          try {
            const parsedConfig = JSON.parse(atob(configParam));
            setConfig({
              ...config,
              ...parsedConfig
            });
          } catch {
            console.warn('Formato de configuração inválido. Usando padrões.');
          }
        }
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocorreu um erro ao carregar os dados');
        setCards(exampleCards); // Fallback para os dados de exemplo
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [searchParams, config]);

  // Detectar se estamos em um iframe
  const isInIframe = window.self !== window.top;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin border-2 border-primary border-t-transparent rounded-full"></div>
          <p className="text-muted-foreground">Carregando flashcards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div>
              <p className="font-medium">Erro ao carregar flashcards</p>
              <p className="mt-1 text-sm">{error}</p>
              <p className="mt-2 text-sm">Usando dados de exemplo para demonstração</p>
            </div>
          </AlertDescription>
        </Alert>
        
        <div className="bg-card border rounded-lg p-6">
          <FlashCardsManager cards={cards} config={config} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {!isInIframe && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Flashcards</h1>
          <p className="text-muted-foreground">Cartões interativos para estudo e revisão</p>
        </div>
      )}
      
      <div className="bg-card border rounded-lg p-6 overflow-hidden">
        <FlashCardsManager cards={cards} config={config} />
      </div>
      
      {!isInIframe && cards === exampleCards && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-medium mb-3">Documentação</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Saiba como incorporar os flashcards em seu site ou sistema LMS.
            </p>
            <Button variant="outline" asChild size="sm" className="w-full">
              <Link to="/details/flashcards">Ver documentação</Link>
            </Button>
          </div>
          
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-medium mb-3">Testar com exemplos</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Experimente diferentes métodos de passagem de dados.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link to="/flashcards?data_b64=W3siUSI6IlF1YWwgw6kgYSBjYXBpdGFsIGRvIEJyYXNpbD8iLCJBIjoiQnJhc8OtbGlhIiwiVCI6Ikdlb2dyYWZpYSJ9LHsiUSI6IlF1ZW0gZXNjcmV2ZXUgRG9tIENhc211cnJvPyIsIkEiOiJNYWNoYWRvIGRlIEFzc2lzIiwiVCI6IkxpdGVyYXR1cmEifSx7IlEiOiJRdWFsIMOpIGEgZsOzcm11bGEgZGEgw6FndWE/IiwiQSI6IkjigILCslMiLCJUIjoiUXXDrW1pY2EifV0=">
                  Via data_b64
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link to="/converter">
                  Converter JSON
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}