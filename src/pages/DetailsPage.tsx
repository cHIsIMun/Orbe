import { Link, useParams, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { IframeBuilder } from '@/components/IframeBuilder';
import { CodeBlock } from '@/components/CodeBlock';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

export default function DetailsPage() {
  const { widgetId } = useParams();
  
  // Informações específicas para cada widget
  const widgetDetails: Record<string, {
    title: string;
    description: string;
    usage: string;
    parameters: { name: string; type: string; description: string; required: boolean }[];
    example: string;
    iframeCode: string;
  }> = {
    flashcards: {
      title: 'Widget de Flashcards',
      description: 'Cartões interativos de perguntas e respostas para estudo e revisão de conteúdo.',
      usage: 'Revisão de conceitos, vocabulário e fórmulas.',
      parameters: [
        { 
          name: 'Q', 
          type: 'string', 
          description: 'A pergunta a ser exibida no cartão', 
          required: true 
        },
        { 
          name: 'A', 
          type: 'string', 
          description: 'A resposta para a pergunta', 
          required: true 
        },
        { 
          name: 'T', 
          type: 'string', 
          description: 'O tópico ou categoria do cartão', 
          required: true 
        },
        { 
          name: 'id', 
          type: 'string', 
          description: 'Um identificador único para o cartão (opcional, será gerado automaticamente se não fornecido)', 
          required: false 
        }
      ],
      example: `[
  {
    "Q": "Qual é a capital do Brasil?",
    "A": "Brasília",
    "T": "Geografia"
  },
  {
    "Q": "Quem escreveu Dom Casmurro?",
    "A": "Machado de Assis",
    "T": "Literatura"
  },
  {
    "Q": "Qual é a fórmula da água?",
    "A": "H₂O",
    "T": "Química"
  }
]`,
      iframeCode: `<!-- Exemplo 1: Usando data_b64 (recomendado para cross-domain) -->
<iframe src="\${window.location.origin}/widgets/flashcards?data_b64=W3siUSI6IlF1YWwg4oCpIGEgY2FwaXRhbCBkbyBCcmFzaWw%2FIiwiQSI6IkJyYXPDrWxpYSIsIlQiOiJHZW9ncmFmaWEifSx7IlEiOiJRdWVtIGVzY3JldmV1IERvbSBDYXNtdXJybz8iLCJBIjoiTWFjaGFkbyBkZSBBc3NpcyIsIlQiOiJMaXRlcmF0dXJhIn0seyJRIjoiUXVhbCDDqSBhIGbDs3JtdWxhIGRhIMOhZ3VhPyIsIkEiOiJI4oCCwrJPIiwiVCI6IlF1w61taWNhIn1d" width="100%" height="600" frameborder="0"></iframe>

<!-- Exemplo 2: Usando data (pode quebrar cross-domain com acentos) -->
<iframe src="\${window.location.origin}/widgets/flashcards?data=SEU_BASE64_AQUI" width="100%" height="600" frameborder="0"></iframe>`
    }
  };

  // Se um widget específico foi selecionado
  if (widgetId && widgetDetails[widgetId]) {
    const details = widgetDetails[widgetId];
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="flex items-center gap-2">
            <Link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              Voltar
            </Link>
          </Button>
        </div>

        <div className="bg-card rounded-lg border shadow-sm">
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold tracking-tight mb-6">{details.title}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-3 space-y-6">
                <section>
                  <h2 className="text-xl font-semibold mb-3">Descrição</h2>
                  <p className="text-muted-foreground">{details.description}</p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">Uso</h2>
                  <p className="text-muted-foreground">{details.usage}</p>
                </section>
              </div>
              
              <div className="flex flex-col gap-4">
                <Button asChild size="lg" className="w-full">
                  <Link to={`/${widgetId}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                    Experimentar
                  </Link>
                </Button>
              </div>
            </div>
          
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Parâmetros</h2>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted hover:bg-muted">
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Obrigatório</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {details.parameters.map((param, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono font-medium">{param.name}</TableCell>
                        <TableCell className="font-mono">{param.type}</TableCell>
                        <TableCell>{param.description}</TableCell>
                        <TableCell>{param.required ? 'Sim' : 'Não'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Exemplo de JSON</h2>
              <CodeBlock code={details.example} language="json" title="Estrutura dos dados" />
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Código de Incorporação</h2>
              <p className="text-muted-foreground mb-4">
                Copie e cole o código abaixo para incorporar este widget em seu site:
              </p>
              <CodeBlock code={details.iframeCode} language="html" title="Código HTML para incorporar" />
              <div className="mt-4 p-3 rounded-md bg-muted/50">
                <p className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    ℹ️
                  </span>
                  <span>
                    <strong>Recomendação:</strong> Use <code className="text-xs font-mono px-1 py-0.5 bg-muted-foreground/20 rounded">data_b64</code> para preservar acentos em contextos cross-domain.
                    Substitua <code className="text-xs font-mono px-1 py-0.5 bg-muted-foreground/20 rounded">SEU_BASE64_AQUI</code> pelo seu JSON codificado em Base64.
                  </span>
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-3">Exemplo Funcionando</h2>
              <p className="text-muted-foreground mb-4">
                Teste o widget com dados de exemplo diretamente abaixo:
              </p>
              <div className="border border-dashed rounded-lg p-6 bg-muted/5">
                <iframe 
                  src={`${window.location.origin}/widgets/flashcards?data_b64=W3siUSI6IlF1YWwg4oCpIGEgY2FwaXRhbCBkbyBCcmFzaWw%2FIiwiQSI6IkJyYXPDrWxpYSIsIlQiOiJHZW9ncmFmaWEifSx7IlEiOiJRdWVtIGVzY3JldmV1IERvbSBDYXNtdXJybz8iLCJBIjoiTWFjaGFkbyBkZSBBc3NpcyIsIlQiOiJMaXRlcmF0dXJhIn0seyJRIjoiUXVhbCDDqSBhIGbDs3JtdWxhIGRhIMOhZ3VhPyIsIkEiOiJI4oCCwrJPIiwiVCI6IlF1w61taWNhIn1d`}
                  width="100%" 
                  height="500" 
                  frameBorder="0"
                  className="rounded-md w-full"
                  title="Exemplo de Flashcards"
                ></iframe>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                    💡
                  </span>
                  <strong>Base64 usado neste exemplo:</strong>
                </p>
                <div>
                  <CodeBlock 
                    code="W3siUSI6IlF1YWwg4oCpIGEgY2FwaXRhbCBkbyBCcmFzaWw/IiwiQSI6IkJyYXPDrWxpYSIsIlQiOiJHZW9ncmFmaWEifSx7IlEiOiJRdWVtIGVzY3JldmV1IERvbSBDYXNtdXJybz8iLCJBIjoiTWFjaGFkbyBkZSBBc3NpcyIsIlQiOiJMaXRlcmF0dXJhIn0seyJRIjoiUXVhbCDDqSBhIGbDs3JtdWxhIGRhIMOhZ3VhPyIsIkEiOiJI4oCCwrJPIiwiVCI6IlF1w61taWNhIn1d" 
                    language="text"
                    title="Base64 dos dados de exemplo"
                  />
                </div>
              </div>
            </section>

            <section className="mb-8">
              <IframeBuilder widgetType={widgetId} />
            </section>
            
            <div className="mt-6">
              <Button asChild>
                <Link to={`/${widgetId}`}>Experimentar Widget</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Widget não encontrado ou ID inválido - redirecionar para a página inicial
  return <Navigate to="/" replace />;
}
