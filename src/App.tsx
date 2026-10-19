/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Difficulty,
  GameMode,
  QuizDirection,
  QuizQuestion,
  Flower,
  ActiveTab,
  ScoreRecord,
  MistakeEntry
} from './types/game';
import { FLOWERS } from './data/flowers';
import { Header } from './components/Header';
import { DifficultySelector } from './components/DifficultySelector';
import { QuizPlay } from './components/QuizPlay';
import { RoundSummary } from './components/RoundSummary';
import { ScoreBoardView } from './components/ScoreBoardView';
import { DictionaryView } from './components/DictionaryView';
import { MistakesView } from './components/MistakesView';
import { sound } from './utils/sound';
import {
  getPlayerName,
  setPlayerName as persistPlayerName,
  getScoreRecords,
  saveScoreRecord,
  clearScoreRecords,
  getBestScores,
  getMistakes,
  recordMistake,
  removeMistake,
  clearAllMistakes
} from './utils/storage';
import { Edit3, Check, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('quiz');
  const [gameState, setGameState] = useState<'MENU' | 'PLAYING' | 'SUMMARY'>('MENU');

  // Quiz Configurations
  const [difficulty, setDifficulty] = useState<Difficulty>('elementary');
  const [mode, setMode] = useState<GameMode>('multiple_choice');
  const [direction, setDirection] = useState<QuizDirection>('ko_to_en');
  const [questionCount, setQuestionCount] = useState<number>(10);

  // Active quiz session
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [roundResults, setRoundResults] = useState<{
    score: number;
    correctCount: number;
    totalQuestions: number;
    maxCombo: number;
    timeTakenSec: number;
    missedFlowerIds: string[];
  } | null>(null);

  // Persistent user state
  const [playerName, setPlayerNameState] = useState<string>(() => getPlayerName());
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => sound.isEnabled());
  const [scoreRecords, setScoreRecords] = useState<ScoreRecord[]>(() => getScoreRecords());
  const [mistakes, setMistakes] = useState<MistakeEntry[]>(() => getMistakes());

  // Reload storage state when needed
  const refreshStorage = useCallback(() => {
    setScoreRecords(getScoreRecords());
    setMistakes(getMistakes());
  }, []);

  const handleToggleSound = () => {
    const updated = sound.toggleSound();
    setSoundEnabled(updated);
  };

  const handleSavePlayerName = () => {
    const trimmed = tempName.trim();
    if (trimmed) {
      persistPlayerName(trimmed);
      setPlayerNameState(trimmed);
    }
    setIsEditingName(false);
  };

  // Helper to generate questions
  const generateQuestions = (
    targetDifficulty: Difficulty,
    targetMode: GameMode,
    targetDirection: QuizDirection,
    count: number,
    customFlowerPool?: Flower[]
  ): QuizQuestion[] => {
    const pool = customFlowerPool || FLOWERS.filter((f) => f.difficulty === targetDifficulty);
    const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
    const selectedFlowers = shuffledPool.slice(0, Math.min(count, shuffledPool.length));

    // Full flowers list for picking distractors
    const allFlowers = FLOWERS;

    return selectedFlowers.map((flower) => {
      // Pick 3 distractors
      const otherFlowers = allFlowers.filter((f) => f.id !== flower.id);
      // Prefer same difficulty distractors if possible
      const sameDiffOthers = otherFlowers.filter((f) => f.difficulty === flower.difficulty);
      const distractorPool = sameDiffOthers.length >= 3 ? sameDiffOthers : otherFlowers;

      const shuffledDistractors = [...distractorPool]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [...shuffledDistractors, flower].sort(() => Math.random() - 0.5);
      const correctIndex = options.findIndex((o) => o.id === flower.id);

      return {
        flower,
        options,
        correctIndex,
        direction: targetDirection
      };
    });
  };

  // Start regular quiz
  const handleStartQuiz = (difficultyOverride?: Difficulty) => {
    const diff = difficultyOverride || difficulty;
    if (difficultyOverride) {
      setDifficulty(difficultyOverride);
    }

    const questions = generateQuestions(diff, mode, direction, questionCount);
    setCurrentQuestions(questions);
    setGameState('PLAYING');
    setActiveTab('quiz');
  };

  // Start targeted quiz for mistakes
  const handleStartMistakeQuiz = (missedFlowers: Flower[]) => {
    if (missedFlowers.length === 0) return;

    const questions = generateQuestions(
      difficulty,
      'multiple_choice',
      'ko_to_en',
      missedFlowers.length,
      missedFlowers
    );
    setCurrentQuestions(questions);
    setGameState('PLAYING');
    setActiveTab('quiz');
  };

  // Finish quiz & record scores
  const handleFinishQuiz = (results: {
    score: number;
    correctCount: number;
    totalQuestions: number;
    maxCombo: number;
    timeTakenSec: number;
    missedFlowerIds: string[];
  }) => {
    setRoundResults(results);

    // Record mistakes
    results.missedFlowerIds.forEach((id) => {
      recordMistake(id);
    });

    // Save score record
    const now = new Date();
    const formattedDate = now.toLocaleDateString('ko-KR', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newRecord: ScoreRecord = {
      id: `score-${Date.now()}-${Math.random()}`,
      playerName,
      date: now.toISOString(),
      formattedDate,
      difficulty,
      mode,
      score: results.score,
      maxCombo: results.maxCombo,
      correctCount: results.correctCount,
      totalQuestions: results.totalQuestions,
      accuracy: Math.round((results.correctCount / results.totalQuestions) * 100),
      timeTakenSec: results.timeTakenSec,
      missedFlowerIds: results.missedFlowerIds
    };

    saveScoreRecord(newRecord);
    refreshStorage();
    setGameState('SUMMARY');
  };

  // Remove single mistake
  const handleRemoveMistake = (flowerId: string) => {
    removeMistake(flowerId);
    refreshStorage();
  };

  // Clear all mistakes
  const handleClearAllMistakes = () => {
    clearAllMistakes();
    refreshStorage();
  };

  // Clear score records
  const handleClearRecords = () => {
    clearScoreRecords();
    refreshStorage();
  };

  const bestScores = getBestScores();

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 font-sans antialiased flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'quiz') {
            setGameState('MENU');
          }
        }}
        playerName={playerName}
        onEditPlayerName={() => {
          setTempName(playerName);
          setIsEditingName(true);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        mistakesCount={mistakes.length}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pb-12">
        {/* Tab 1: Quiz Experience */}
        {activeTab === 'quiz' && (
          <>
            {gameState === 'MENU' && (
              <DifficultySelector
                selectedDifficulty={difficulty}
                onSelectDifficulty={setDifficulty}
                selectedMode={mode}
                onSelectMode={setMode}
                quizDirection={direction}
                onSelectDirection={setDirection}
                questionCount={questionCount}
                onSelectQuestionCount={setQuestionCount}
                onStartQuiz={() => handleStartQuiz()}
                bestScores={bestScores}
                playerName={playerName}
              />
            )}

            {gameState === 'PLAYING' && currentQuestions.length > 0 && (
              <QuizPlay
                difficulty={difficulty}
                mode={mode}
                direction={direction}
                questions={currentQuestions}
                onFinishQuiz={handleFinishQuiz}
                onExitQuiz={() => setGameState('MENU')}
              />
            )}

            {gameState === 'SUMMARY' && roundResults && (
              <RoundSummary
                difficulty={difficulty}
                mode={mode}
                score={roundResults.score}
                correctCount={roundResults.correctCount}
                totalQuestions={roundResults.totalQuestions}
                maxCombo={roundResults.maxCombo}
                timeTakenSec={roundResults.timeTakenSec}
                missedFlowerIds={roundResults.missedFlowerIds}
                playerName={playerName}
                onPlayAgain={() => handleStartQuiz()}
                onGoToScores={() => {
                  setGameState('MENU');
                  setActiveTab('scores');
                }}
                onGoToMistakes={() => {
                  setGameState('MENU');
                  setActiveTab('mistakes');
                }}
              />
            )}
          </>
        )}

        {/* Tab 2: Botanical Dictionary */}
        {activeTab === 'dictionary' && <DictionaryView />}

        {/* Tab 3: Score Records & Leaderboard */}
        {activeTab === 'scores' && (
          <ScoreBoardView
            records={scoreRecords}
            onClearRecords={handleClearRecords}
            onStartQuiz={(level) => {
              setDifficulty(level);
              setActiveTab('quiz');
              handleStartQuiz(level);
            }}
          />
        )}

        {/* Tab 4: Mistakes Notebook */}
        {activeTab === 'mistakes' && (
          <MistakesView
            mistakes={mistakes}
            onRemoveMistake={handleRemoveMistake}
            onClearAllMistakes={handleClearAllMistakes}
            onStartMistakeQuiz={handleStartMistakeQuiz}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            플라워 보카 · 초등·중등·고등 꽃이름 영어단어 학습 게임
          </span>
          <div className="flex items-center gap-4 text-stone-400">
            <span>초급 15단어</span>
            <span>·</span>
            <span>중급 15단어</span>
            <span>·</span>
            <span>고급 16단어</span>
          </div>
        </div>
      </footer>

      {/* Edit Player Name Modal */}
      {isEditingName && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Edit3 size={18} className="text-emerald-600" />
              <span>플레이어 닉네임 설정</span>
            </h3>
            <p className="text-xs text-stone-600">
              점수 기록과 랭킹에 표시될 닉네임을 입력해주세요.
            </p>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              maxLength={15}
              placeholder="예: 꽃마루, 보태니컬러"
              autoFocus
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSavePlayerName();
              }}
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditingName(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleSavePlayerName}
                disabled={!tempName.trim()}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>저장하기</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
