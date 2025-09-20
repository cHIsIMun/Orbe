import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlashCard } from './FlashCard';
import './FlashCard.css';
import type { Flashcard, WidgetConfig } from '@/types';
import { Button } from '@/components/ui/button';

// Atualizar o tipo de relatório para usar a escala de 1 a 5
interface StudyReport {
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

interface FlashCardsManagerProps {
  cards: Flashcard[];
  config?: WidgetConfig;
}

export function FlashCardsManager({ cards: initialCards, config }: FlashCardsManagerProps) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [report, setReport] = useState<StudyReport>({
    topics: {},
    totalCards: 0,
    completedCards: 0,
  });
  const [showReport, setShowReport] = useState(false);

  // Inicializar os cartões
  useEffect(() => {
    // Adicionar IDs se não existirem e inicializar o relatório
    const cardsWithIds = initialCards.map((card, index) => ({
      ...card,
      id: card.id || `card-${index}`,
    }));
    
    // Embaralhar cartões se configurado
    const finalCards = config?.shuffleCards 
      ? shuffleArray([...cardsWithIds]) 
      : cardsWithIds;
    
    setCards(finalCards);
    
    // Inicializar o relatório
    const initialReport: StudyReport = {
      topics: {},
      totalCards: finalCards.length,
      completedCards: 0
    };
    
    // Preparar tópicos no relatório
    finalCards.forEach(card => {
      if (!initialReport.topics[card.T]) {
        initialReport.topics[card.T] = {
          count: 0,
          scores: [],
          avgScore: 0
        };
      }
      initialReport.topics[card.T].count++;
    });
    
    setReport(initialReport);
  }, [initialCards, config?.shuffleCards]);

  // Função para embaralhar o array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Manipular resposta do usuário
  const handleAnswer = (score: number) => {
    if (currentIndex >= 0 && currentIndex < cards.length) {
      const currentCard = cards[currentIndex];
      
      // Atualizar o relatório
      const updatedReport = { ...report };
      const topicStats = updatedReport.topics[currentCard.T];
      
      // Adicionar pontuação e recalcular média
      topicStats.scores.push(score);
      topicStats.avgScore = topicStats.scores.reduce((sum, s) => sum + s, 0) / topicStats.scores.length;
      
      updatedReport.completedCards++;
      setReport(updatedReport);
      
      // Avançar para o próximo cartão após um breve delay
      setTimeout(() => {
        if (currentIndex < cards.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setShowReport(true);
        }
      }, 1000);
    }
  };

  // Reiniciar o estudo
  const handleRestart = () => {
    // Resetar o relatório
    const resetReport: StudyReport = {
      topics: {},
      totalCards: cards.length,
      completedCards: 0
    };
    
    // Preparar tópicos no relatório
    cards.forEach(card => {
      if (!resetReport.topics[card.T]) {
        resetReport.topics[card.T] = {
          count: 0,
          scores: [],
          avgScore: 0
        };
      }
      resetReport.topics[card.T].count++;
    });
    
    // Embaralhar cartões novamente se configurado
    if (config?.shuffleCards) {
      setCards(shuffleArray([...cards]));
    }
    
    setReport(resetReport);
    setCurrentIndex(0);
    setShowReport(false);
  };

  // Renderizar o relatório
  const renderReport = () => {
    const topicsToReview = Object.entries(report.topics)
      .map(([topic, stats]) => ({
        topic,
        ...stats,
        // Usar média de pontuação (escala 1-5) convertida para percentual (0-100%)
        accuracy: (stats.avgScore / 5) * 100
      }))
      .sort((a, b) => a.accuracy - b.accuracy);

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Relatório de Estudo
        </h2>
        
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-300">
            Cartões completados: {report.completedCards} de {report.totalCards}
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">
            Tópicos para revisão:
          </h3>
          <ul className="space-y-2">
            {topicsToReview.map(({ topic, count, avgScore, accuracy }) => (
              <li 
                key={topic} 
                className="p-3 border rounded-md bg-gray-50 dark:bg-slate-700"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-200">{topic}</span>
                  <span 
                    className={`px-2 py-1 rounded text-sm ${
                      accuracy >= 80 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : accuracy >= 50 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {accuracy.toFixed(0)}%
                  </span>
                </div>
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Pontuação média: {avgScore.toFixed(1)} / 5 | Total: {count} cartões
                </div>
                {accuracy < 70 && (
                  <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                    Recomendado revisar este tópico
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex justify-center">
          <Button onClick={handleRestart}>
            Recomeçar Estudo
          </Button>
        </div>
      </motion.div>
    );
  };

  // Se não houver cartões, exibir mensagem
  if (cards.length === 0) {
    return <div className="p-4 text-center">Nenhum cartão disponível</div>;
  }

  // Exibir relatório se todos os cartões foram respondidos
  if (showReport) {
    return renderReport();
  }

  // Exibir o cartão atual
  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {config?.title || 'Flashcards'}
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {currentIndex + 1} de {cards.length}
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <FlashCard 
            card={cards[currentIndex]} 
            onAnswer={handleAnswer} 
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}