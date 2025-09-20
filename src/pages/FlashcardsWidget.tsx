import { useEffect, useState } from 'react';
import { FlashCardsManager } from '@/widgets/flashcards/FlashCardsManager';
import type { Flashcard, WidgetConfig } from '@/types';
import { getFlashcardData, getUrlParams } from '@/lib/iframe-utils';

interface LoadedData {
  cards: Flashcard[];
  config?: WidgetConfig;
}

export default function FlashcardsWidget() {
  const [data, setData] = useState<LoadedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const params = getUrlParams();
        
        // Debug logs
        console.log('[FlashcardsWidget] URL params:', params);
        console.log('[FlashcardsWidget] Raw data param:', params.data);
        console.log('[FlashcardsWidget] Raw data_b64 param:', params.data_b64);
        
        let config: WidgetConfig | undefined;
        if (params.config) {
          try {
            // config pode estar base64 também
            const decoded = decodeURIComponent(params.config);
            config = JSON.parse(decoded);
          } catch (e) {
            console.warn('Config inválida ignorada', e);
          }
        }
        
        const cards = await getFlashcardData();
        console.log('[FlashcardsWidget] Cards recebidos:', cards);
        if (cards && cards.length > 0) {
          console.log('[FlashcardsWidget] Primeira pergunta:', cards[0].Q);
          console.log('[FlashcardsWidget] Tem mojibake:', cards[0].Q.includes('Ã'));
        }
        
        if (!cancelled) {
          if (!cards || cards.length === 0) {
            setError('Nenhum card recebido. Verifique o parâmetro data ou mensagem postMessage.');
          } else {
            setData({ cards, config });
          }
        }
      } catch {
        if (!cancelled) setError('Falha ao carregar dados do widget');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-sm text-gray-500">Carregando flashcards...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600 text-sm">{error}</div>;
  }

  if (!data) return null;

  return (
    <div className="max-w-xl mx-auto">
      <FlashCardsManager cards={data.cards} config={data.config} />
    </div>
  );
}
