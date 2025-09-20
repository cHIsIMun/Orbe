import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Flashcard } from '@/types';

interface FlashCardProps {
  card: Flashcard;
  onAnswer?: (score: number) => void;
}

export function FlashCard({ card, onAnswer }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [answered, setAnswered] = useState<number | null>(null);

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
    }
  };

  const handleAnswer = (score: number) => {
    setAnswered(score);
    if (onAnswer) {
      onAnswer(score);
    }
  };

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto">
      <motion.div
        className={cn(
          "relative w-full h-64 cursor-pointer rounded-xl shadow-lg transition-all duration-500",
          answered ? "ring-2" : "",
          answered && answered >= 4 ? "ring-green-500" : "",
          answered && answered === 3 ? "ring-yellow-500" : "",
          answered && answered <= 2 ? "ring-red-500" : ""
        )}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card (question) */}
        <div
          className={cn(
            "absolute w-full h-full p-6 rounded-xl bg-white dark:bg-slate-800 flex flex-col justify-between backface-hidden",
            isFlipped ? "opacity-0" : "opacity-100"
          )}
          onClick={handleFlip}
        >
          <div>
            <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mb-2">
              {card.T}
            </span>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Pergunta:</h3>
            <p className="mt-3 text-gray-600 dark:text-gray-200">{card.Q}</p>
          </div>
          <div className="text-center text-gray-400 dark:text-gray-500 text-sm">
            Clique para revelar a resposta
          </div>
        </div>

        {/* Back of card (answer) */}
        <div
          className={cn(
            "absolute w-full h-full p-6 rounded-xl bg-white dark:bg-slate-800 flex flex-col justify-between backface-hidden",
            isFlipped ? "opacity-100" : "opacity-0"
          )}
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div>
            <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mb-2">
              {card.T}
            </span>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Resposta:</h3>
            <p className="mt-3 text-gray-600 dark:text-gray-200">{card.A}</p>
          </div>
          
          {!answered && (
            <div className="flex flex-col mt-4">
              <p className="text-center mb-2 text-sm text-gray-600 dark:text-gray-300">
                Como você se saiu nesta questão?
              </p>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map(score => (
                  <button
                    key={score}
                    onClick={() => handleAnswer(score)}
                    className={cn(
                      "px-3 py-2 rounded transition flex flex-col items-center",
                      score <= 2 ? "bg-red-400 hover:bg-red-300 hover:cursor-pointer text-white" : "",
                      score === 3 ? "bg-yellow-400 hover:bg-yellow-300 hover:cursor-pointer text-white" : "",
                      score >= 4 ? "bg-green-400 hover:bg-green-300 hover:cursor-pointer text-white" : "",
                    )}
                    title={
                      score === 1 ? "Errei feio" :
                      score === 2 ? "Errei parcialmente" :
                      score === 3 ? "Neutro" :
                      score === 4 ? "Acertei parcialmente" :
                      "Acertei em cheio"
                    }
                  >
                    <span className="text-lg font-bold">{score}</span>
                    <span className="text-xs">
                      {score === 1 ? "Errei feio" :
                       score === 2 ? "Errei" :
                       score === 3 ? "Neutro" :
                       score === 4 ? "Acertei" :
                       "Acertei bem"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}