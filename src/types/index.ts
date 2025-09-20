// Tipo para os flashcards
export interface Flashcard {
  Q: string; // Pergunta
  A: string; // Resposta
  T: string; // Tópico
  id?: string; // ID único opcional (será gerado se não fornecido)
}

// Tipo para o relatório de estudo
export interface StudyReport {
  topics: {
    [topic: string]: {
      count: number;
      scores: number[];
      avgScore: number;
    };
  };
  totalCards: number;
  completedCards: number;
}

// Tipo para configuração do widget
export interface WidgetConfig {
  title?: string;
  theme?: 'light' | 'dark' | 'auto';
  shuffleCards?: boolean;
}