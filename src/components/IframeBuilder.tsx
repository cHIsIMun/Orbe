import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface IframeBuilderProps {
  widgetType: string;
}

export function IframeBuilder({ widgetType }: IframeBuilderProps) {
  const [jsonData, setJsonData] = useState('');
  const [base64Data, setBase64Data] = useState('');
  const [iframeCode, setIframeCode] = useState('');
  const [error, setError] = useState('');

  // Exemplo padrão baseado no tipo de widget
  const getDefaultData = () => {
    if (widgetType === 'flashcards') {
      return [
        { Q: "Qual é a capital do Brasil?", A: "Brasília", T: "Geografia" },
        { Q: "Quem escreveu Dom Casmurro?", A: "Machado de Assis", T: "Literatura" },
        { Q: "Qual é a fórmula da água?", A: "H₂O", T: "Química" }
      ];
    }
    return [];
  };

  const loadExample = () => {
    const example = getDefaultData();
    setJsonData(JSON.stringify(example, null, 2));
    setError('');
  };

  const generateBase64 = () => {
    try {
      setError('');
      
      if (!jsonData.trim()) {
        setError('Dados JSON não podem estar vazios');
        return;
      }

      // Validar JSON
      const parsed = JSON.parse(jsonData);
      
      // Converter para Base64
      const jsonString = JSON.stringify(parsed);
      const encoder = new TextEncoder();
      const bytes = encoder.encode(jsonString);
      
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      
      const base64 = btoa(binary);
      setBase64Data(base64);
      
      // Gerar código do iframe
      const origin = window.location.origin;
      // Usando encodeURIComponent para garantir que caracteres especiais sejam tratados corretamente
      const encodedBase64 = encodeURIComponent(base64);
      const iframe = `<iframe 
  src="${origin}/widgets/${widgetType}?data_b64=${encodedBase64}"
  width="100%" 
  height="600" 
  frameborder="0"
  title="${widgetType} widget"
></iframe>`;
      
      setIframeCode(iframe);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar JSON');
      setBase64Data('');
      setIframeCode('');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const previewUrl = base64Data 
    ? `${window.location.origin}/widgets/${widgetType}?data_b64=${encodeURIComponent(base64Data)}`
    : '';

  return (
    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6 space-y-6">
      <h3 className="text-xl font-semibold">Construtor de Iframe</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entrada de dados */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">1. Seus dados JSON:</label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={loadExample}
              className="text-xs"
            >
              Carregar exemplo
            </Button>
          </div>
          
          <Textarea
            value={jsonData}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJsonData(e.target.value)}
            placeholder={`Cole seus dados JSON aqui...`}
            className="min-h-[200px] font-mono text-sm"
          />
          
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
          
          <Button onClick={generateBase64} className="w-full">
            2. Gerar Código do Iframe
          </Button>
        </div>

        {/* Resultado */}
        <div className="space-y-4">
          {/* Base64 */}
          {base64Data && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Base64 gerado:</label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(base64Data)}
                  className="text-xs"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copiar
                </Button>
              </div>
              
              <Textarea
                value={base64Data}
                readOnly
                className="min-h-[80px] font-mono text-xs bg-white dark:bg-slate-800"
              />
            </div>
          )}

          {/* Código do iframe */}
          {iframeCode && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">3. Código para incorporar:</label>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(iframeCode)}
                    className="text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar
                  </Button>
                  {previewUrl && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-xs"
                    >
                      <Link to={previewUrl} target="_blank">
                        <Eye className="h-3 w-3 mr-1" />
                        Testar
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
              
              <Textarea
                value={iframeCode}
                readOnly
                className="min-h-[120px] font-mono text-xs bg-white dark:bg-slate-800"
              />
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      {previewUrl && (
        <div className="space-y-2">
          <label className="text-sm font-medium">4. Pré-visualização:</label>
          <div className="border border-dashed rounded-lg p-6 bg-muted/5">
            <iframe
              src={previewUrl}
              width="100%"
              height="400"
              frameBorder="0"
              className="rounded-md w-full"
              title={`${widgetType} preview`}
            />
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600 dark:text-gray-400">
        <p>💡 <strong>Dica:</strong> Cole o código gerado diretamente no seu site ou LMS!</p>
      </div>
    </div>
  );
}