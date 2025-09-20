import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, FileText, Code, AlertCircle, CheckCircle } from 'lucide-react';

export default function ConverterPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [base64Input, setBase64Input] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [base64Error, setBase64Error] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Função para converter JSON para Base64
  const jsonToBase64 = () => {
    try {
      setJsonError('');
      setSuccessMessage('');
      // Validar se é JSON válido
      const parsed = JSON.parse(jsonInput);
      
      // Converter para string JSON formatada
      const jsonString = JSON.stringify(parsed);
      
      // Codificar em UTF-8 e depois Base64
      const encoder = new TextEncoder();
      const bytes = encoder.encode(jsonString);
      
      // Converter para binary string
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      
      // Converter para Base64
      const base64 = btoa(binary);
      setBase64Output(base64);
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : 'Erro ao processar JSON');
      setBase64Output('');
    }
  };

  // Função para converter Base64 para JSON
  const base64ToJson = () => {
    try {
      setBase64Error('');
      setSuccessMessage('');
      
      if (!base64Input.trim()) {
        setBase64Error('Base64 não pode estar vazio');
        return;
      }

      // Normalizar Base64 (URL-safe para padrão)
      let normalized = base64Input.replace(/-/g, '+').replace(/_/g, '/');
      
      // Adicionar padding se necessário
      while (normalized.length % 4 !== 0) {
        normalized += '=';
      }

      // Decodificar Base64
      const binaryString = atob(normalized);
      
      // Converter para bytes
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Decodificar UTF-8
      const decoder = new TextDecoder('utf-8');
      const jsonString = decoder.decode(bytes);
      
      // Validar e formatar JSON
      const parsed = JSON.parse(jsonString);
      const formatted = JSON.stringify(parsed, null, 2);
      
      setJsonOutput(formatted);
    } catch (error) {
      setBase64Error(error instanceof Error ? error.message : 'Erro ao processar Base64');
      setJsonOutput('');
    }
  };

  // Função para copiar texto
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccessMessage('Texto copiado para a área de transferência!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch {
      // Fallback para navegadores antigos
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setSuccessMessage('Texto copiado para a área de transferência!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Exemplo de dados para flashcards
  const exampleFlashcards = [
    { Q: "Qual é a capital do Brasil?", A: "Brasília", T: "Geografia" },
    { Q: "Quem escreveu Dom Casmurro?", A: "Machado de Assis", T: "Literatura" },
    { Q: "Qual é a fórmula da água?", A: "H₂O", T: "Química" }
  ];

  const loadExample = () => {
    setJsonInput(JSON.stringify(exampleFlashcards, null, 2));
    setJsonError('');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Conversor</h1>
        <p className="text-muted-foreground">
          Converta entre JSON e Base64 para usar em widgets
        </p>
      </div>
      
      {successMessage && (
        <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-900">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="json-to-base64" className="mb-8">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="json-to-base64">JSON → Base64</TabsTrigger>
          <TabsTrigger value="base64-to-json">Base64 → JSON</TabsTrigger>
        </TabsList>
        
        <div className="mt-6 border rounded-lg">
          <TabsContent value="json-to-base64" className="p-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Dados JSON:</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={loadExample}
                  >
                    Carregar exemplo
                  </Button>
                </div>
                
                <Textarea
                  value={jsonInput}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJsonInput(e.target.value)}
                  placeholder='[{"Q": "Pergunta?", "A": "Resposta", "T": "Tópico"}]'
                  className="min-h-[200px] font-mono text-sm"
                />
                
                {jsonError && (
                  <Alert variant="destructive" className="mt-2 py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{jsonError}</AlertDescription>
                  </Alert>
                )}
              </div>
    
              <Button onClick={jsonToBase64} className="w-full">
                Converter para Base64
              </Button>
    
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Base64 resultado:</label>
                  {base64Output && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(base64Output)}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1.5" />
                      Copiar
                    </Button>
                  )}
                </div>
                
                <Textarea
                  value={base64Output}
                  readOnly
                  placeholder="O Base64 aparecerá aqui..."
                  className="min-h-[120px] font-mono text-sm bg-muted/50"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="base64-to-json" className="p-6">
            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Base64:</label>
                <Textarea
                  value={base64Input}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBase64Input(e.target.value)}
                  placeholder="Cole o Base64 aqui..."
                  className="min-h-[120px] font-mono text-sm"
                />
                
                {base64Error && (
                  <Alert variant="destructive" className="mt-2 py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{base64Error}</AlertDescription>
                  </Alert>
                )}
              </div>

              <Button onClick={base64ToJson} className="w-full">
                Converter para JSON
              </Button>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">JSON resultado:</label>
                  {jsonOutput && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(jsonOutput)}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1.5" />
                      Copiar
                    </Button>
                  )}
                </div>
                
                <Textarea
                  value={jsonOutput}
                  readOnly
                  placeholder="O JSON aparecerá aqui..."
                  className="min-h-[200px] font-mono text-sm bg-muted/50"
                />
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="rounded-lg border p-6 bg-card">
        <h2 className="text-xl font-semibold mb-4">Dicas de uso</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Base64 é uma codificação segura para transmitir dados através de URLs</li>
          <li>• Utilize o resultado do Base64 no parâmetro <code>data_b64</code> dos widgets</li>
          <li>• Lembre-se que o formato JSON deve estar correto para a conversão funcionar</li>
          <li>• Para flashcards, cada cartão precisa ter as propriedades Q (pergunta), A (resposta) e T (tópico)</li>
          <li>• Teste seus dados convertidos na <Link to="/details/flashcards" className="underline">página de demonstração</Link></li>
        </ul>
      </div>
    </div>
  );
}