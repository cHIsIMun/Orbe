// Define um tipo para mensagens entre iframes
export type IframeMessage = {
  type: string;
  [key: string]: unknown;
};

// Função para gerenciar comunicação entre iframe e a página que o incorpora
export function setupIframeMessaging(callback: (data: IframeMessage) => void) {
  // Escutar por mensagens da página pai
  window.addEventListener('message', (event) => {
    try {
      // Validar origem da mensagem (implementar em produção)
      // if (event.origin !== 'https://seudominio.com') return;
      
      // Processar os dados
      const data = event.data as IframeMessage;
      
      // Se os dados são válidos, chamar o callback
      if (data && typeof data === 'object') {
        callback(data);
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
    }
  });
}

// Função para enviar dados para a página pai
export function sendMessageToParent(data: IframeMessage) {
  if (window.parent !== window) {
    window.parent.postMessage(data, '*'); // Em produção, substituir '*' pelo domínio específico
  }
}

// Função para codificar dados para URL (para uso em parâmetros de iframe)
export function encodeDataForUrl<T>(data: T): string {
  const jsonString = JSON.stringify(data);
  // Garante UTF-8 correto
  const uint8Array = new TextEncoder().encode(jsonString);
  let binary = "";
  for (let i = 0; i < uint8Array.length; i++) binary += String.fromCharCode(uint8Array[i]);
  const base64 = btoa(binary);
  return `b64_${base64}`; // Mantemos prefixo, mas o decoder aceitará sem também
}

// Função para decodificar dados da URL
export function decodeDataFromUrl<T>(raw: string): T | null {
  try {
    let encodedData = raw;

    // Detectar se veio via URL já decodificada pelo navegador (espaços convertidos de +)
    // Normalização: substituir espaços por + apenas se parecer base64 sem espaços originais
    if (/^[A-Za-z0-9+/_-]+$/.test(encodedData.replace(/=+$/, '')) && encodedData.includes(' ')) {
      encodedData = encodedData.replace(/ /g, '+');
    }

    let isLikelyBase64 = false;
    if (encodedData.startsWith('b64_')) {
      encodedData = encodedData.substring(4);
      isLikelyBase64 = true;
    } else if (/^[A-Za-z0-9+/_-]+=*$/.test(encodedData)) {
      // Heurística: só considerar base64 se comprimento plausível (>20) e não contém '%'
      if (encodedData.length > 16 && !/%/.test(encodedData)) isLikelyBase64 = true;
    }

    if (!isLikelyBase64) {
      // Fallback: tentar parse direto como JSON percent-encoded
      try {
        return JSON.parse(decodeURIComponent(encodedData)) as T;
      } catch {
        // tentar como JSON puro
        return JSON.parse(encodedData) as T;
      }
    }

    // Normalizar base64 URL-safe
    encodedData = encodedData.replace(/-/g, '+').replace(/_/g, '/');
    // Padding
    if (encodedData.length % 4 !== 0) {
      encodedData = encodedData.padEnd(encodedData.length + (4 - (encodedData.length % 4)), '=');
    }

    // Decodificar para binary string
    let binaryString: string;
    try {
      binaryString = atob(encodedData);
    } catch (e) {
      console.error('Base64 inválido:', e);
      return null;
    }

    // Converter para bytes
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);

    // Primeira tentativa: UTF-8 direta
    let utf8String: string | null = null;
    try {
      utf8String = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
    } catch {
      utf8String = null;
    }

    // Heurística de detecção de mojibake (sequências com Ã, Â, �)
    const looksMojibake = (s: string) => /Ã.|Â.|�/.test(s);

    // Segunda tentativa: caso original tenha sido btoa direto de string Unicode (latin1)
    // Nesse caso cada char code <=255; precisamos apenas usar os mesmos códigos como Unicode.
    const latin1Decoded = binaryString;

    // Terceira tentativa: caso já seja UTF-8 mas foi reinterpretado como Latin1 (produz Ã©, Ã£, etc.)
    const fixMojibake = (s: string) => {
      try {
        // Converte cada code unit (Latin1) para byte e decodifica como UTF-8
        const reBytes = new Uint8Array(s.length);
        for (let i = 0; i < s.length; i++) reBytes[i] = s.charCodeAt(i) & 0xff;
        return new TextDecoder('utf-8', { fatal: false }).decode(reBytes);
      } catch {
        return s;
      }
    };

    const candidates: string[] = [];
    if (utf8String) candidates.push(utf8String);
    candidates.push(latin1Decoded);
    if (utf8String && looksMojibake(utf8String)) candidates.push(fixMojibake(utf8String));
    if (looksMojibake(latin1Decoded)) candidates.push(fixMojibake(latin1Decoded));

    // Escolher melhor candidato: menos ocorrências de "Ã" / "Â" / "�"
    const score = (s: string) => (s.match(/Ã/g)?.length || 0) + (s.match(/Â/g)?.length || 0) + (s.match(/�/g)?.length || 0);
    candidates.sort((a, b) => score(a) - score(b));

    for (const candidate of candidates) {
      try {
        return JSON.parse(candidate) as T;
      } catch {/* tenta próximo */}
    }

    console.error('Nenhum candidato de decodificação produziu JSON válido.');
    return null;
  } catch (error) {
    console.error('Erro inesperado ao decodificar dados:', error);
    return null;
  }
}

// --- IMPLEMENTAÇÃO DETERMINÍSTICA SIMPLES ---
// Recomendado para uso quando se sabe que o parâmetro é sempre Base64 puro UTF-8
export function decodeBase64Json<T>(b64: string): T {
  // Remover prefixo se existir
  if (b64.startsWith('b64_')) b64 = b64.slice(4);
  // Normalizar url-safe
  b64 = b64.replace(/-/g, '+').replace(/_/g, '/');
  // Padding
  if (b64.length % 4 !== 0) b64 = b64.padEnd(b64.length + (4 - (b64.length % 4)), '=');
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const txt = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  return JSON.parse(txt) as T;
}

// Função robusta para cross-domain que tenta múltiplas estratégias
export function decodeBase64JsonRobust<T>(raw: string): T | null {
  const attempts: string[] = [];
  
  // Estratégia 1: Como recebido
  attempts.push(raw);
  
  // Estratégia 2: Decodificar URL encoding se presente
  if (raw.includes('%')) {
    try {
      attempts.push(decodeURIComponent(raw));
    } catch { /* ignore */ }
  }
  
  // Estratégia 3: Dupla decodificação (caso tenha sido codificado duas vezes)
  if (raw.includes('%25')) {
    try {
      const once = decodeURIComponent(raw);
      attempts.push(decodeURIComponent(once));
    } catch { /* ignore */ }
  }
  
  // Estratégia 4: Corrigir + que viraram espaços
  attempts.push(raw.replace(/ /g, '+'));
  
  for (const attempt of attempts) {
    try {
      return decodeBase64Json<T>(attempt);
    } catch (e) {
      console.debug('[decodeBase64JsonRobust] Tentativa falhou:', attempt.substring(0, 50), e);
    }
  }
  
  return null;
}

// Função para extrair parâmetros da URL
export function getUrlParams(): Record<string, string> {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(window.location.search);
  
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  
  return params;
}

// Importar tipos necessários
import type { Flashcard } from '@/types';

// Função para tentar corrigir a codificação de uma string
export function tryFixEncoding(text: string): string {
  // Lista de substituições comuns para problemas de codificação
  const replacements: Record<string, string> = {
    'Ã¡': 'á',
    'Ã©': 'é',
    'Ã­': 'í',
    'Ã³': 'ó',
    'Ãº': 'ú',
    'Ã£': 'ã',
    'Ãµ': 'õ',
    'Ã¢': 'â',
    'Ãª': 'ê',
    'Ã´': 'ô',
    'Ã§': 'ç',
    'Ã‡': 'Ç',
    'Ã€': 'À',
    'Ãƒ': 'Ã'
    // Adicione mais conforme necessário
  };

  let result = text;
  
  // Aplicar substituições
  Object.entries(replacements).forEach(([broken, fixed]) => {
    result = result.replace(new RegExp(broken, 'g'), fixed);
  });
  
  return result;
}

// Função auxiliar para corrigir recursivamente a codificação em objetos
export function fixEncodingInObject<T>(obj: T): T {
  if (typeof obj === 'string') {
    return tryFixEncoding(obj) as unknown as T;
  } else if (Array.isArray(obj)) {
    return obj.map(item => fixEncodingInObject(item)) as unknown as T;
  } else if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = fixEncodingInObject((obj as Record<string, unknown>)[key]);
      }
    }
    return result as unknown as T;
  }
  return obj;
}

// Função para obter dados de flashcard da URL ou mensagem
export function getFlashcardData(): Promise<Flashcard[]> {
  // Primeiro, tentar obter dados da URL
  const params = getUrlParams();
  const debug = params.debug === '1';

  // PRIORIDADE: data_b64 (funciona cross-domain) > data (pode quebrar cross-domain)
  const raw = params.data_b64 || params.data;
  if (raw) {
    if (debug) {
      console.log('[flashcards] Raw param received:', raw.substring(0, 50) + '...');
      console.log('[flashcards] Using param:', params.data_b64 ? 'data_b64' : 'data');
    }
    
    // Usar versão robusta (funciona para data_b64 e maioria dos casos data)
    try {
      const decoded = decodeBase64JsonRobust<Flashcard[]>(raw);
      if (decoded) {
        if (debug) console.log('[flashcards] SUCCESS - Primeira pergunta:', decoded[0].Q);
        return Promise.resolve(decoded);
      }
    } catch (e) {
      if (debug) console.error('[flashcards] Falha na decodificação:', e);
    }
  }
  
  // Se não houver dados na URL, configurar ouvinte de mensagem
  return new Promise((resolve) => {
    setupIframeMessaging((data) => {
      if (data.type === 'flashcards' && Array.isArray(data.cards)) {
        resolve(data.cards as Flashcard[]);
      }
    });
    
    // Notificar a página pai que o iframe está pronto para receber dados
    sendMessageToParent({ type: 'ready', widget: 'flashcards' });
  });
}