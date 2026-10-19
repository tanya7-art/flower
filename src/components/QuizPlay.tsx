import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Flower, Difficulty, GameMode, QuizDirection, QuizQuestion } from '../types/game';
import { DIFFICULTY_LABELS } from '../data/flowers';
import { FlowerIcon } from './FlowerIcon';
import { sound } from '../utils/sound';
import {
  Volume2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Delete,
  CheckCircle2,
  XCircle,
  Lightbulb,
  X
} from 'lucide-react';

interface QuizPlayProps {
  difficulty: Difficulty;
  mode: GameMode;
  direction: QuizDirection;
  questions: QuizQuestion[];
  onFinishQuiz: (results: {
    score: number;
    correctCount: number;
    totalQuestions: number;
    maxCombo: number;
    timeTakenSec: number;
    missedFlowerIds: string[];
  }) => void;
  onExitQuiz: () => void;
}

export const QuizPlay: React.FC<QuizPlayProps> = ({
  difficulty,
  mode,
  direction,
  questions,
  onFinishQuiz,
  onExitQuiz
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [missedFlowerIds, setMissedFlowerIds] = useState<string[]>([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Hints state
  const [usedFlowerLanguageHint, setUsedFlowerLanguageHint] = useState(false);
  const [usedLetterHint, setUsedLetterHint] = useState(false);
  const [eliminatedOptionIndices, setEliminatedOptionIndices] = useState<number[]>([]);

  // Spelling mode state
  const [spellingInput, setSpellingInput] = useState<string[]>([]);
  const [availableTiles, setAvailableTiles] = useState<{ id: string; letter: string; used: boolean }[]>([]);

  // Timer
  const [startTime] = useState<number>(() => Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const currentQ = questions[currentIndex];
  const totalQ = questions.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  // Reset question-specific states when currentIndex changes
  const initQuestion = useCallback(() => {
    setSelectedOptionIndex(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setUsedFlowerLanguageHint(false);
    setUsedLetterHint(false);
    setEliminatedOptionIndices([]);

    if (currentQ) {
      // Auto-play pronunciation in listening mode
      if (mode === 'listening') {
        setTimeout(() => {
          sound.speakEnglish(currentQ.flower.english);
        }, 300);
      }

      // Initialize spelling tiles if in spelling mode
      if (mode === 'spelling') {
        const rawLetters = currentQ.flower.english
          .toUpperCase()
          .replace(/[^A-Z]/g, '')
          .split('');

        // Shuffle letters
        const shuffled = [...rawLetters]
          .sort(() => Math.random() - 0.5)
          .map((letter, idx) => ({
            id: `${letter}-${idx}-${Math.random()}`,
            letter,
            used: false
          }));

        setAvailableTiles(shuffled);
        setSpellingInput([]);
      }
    }
  }, [currentQ, mode]);

  useEffect(() => {
    initQuestion();
  }, [currentIndex, initQuestion]);

  // Clean English target for spelling
  const cleanTargetEnglish = useMemo(() => {
    if (!currentQ) return '';
    return currentQ.flower.english.toUpperCase().replace(/[^A-Z]/g, '');
  }, [currentQ]);

  // Handle Multiple Choice selection
  const handleSelectOption = (index: number) => {
    if (isAnswered || eliminatedOptionIndices.includes(index)) return;

    setSelectedOptionIndex(index);
    setIsAnswered(true);

    const correct = index === currentQ.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      sound.playCorrect();
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((prev) => Math.max(prev, newCombo));
      setCorrectCount((prev) => prev + 1);

      // Score: 100 base + combo bonus (10 * combo)
      const points = 100 + (newCombo > 1 ? newCombo * 10 : 0);
      setScore((prev) => prev + points);

      if (newCombo >= 3) {
        sound.playCombo(newCombo);
      }
    } else {
      sound.playWrong();
      setCombo(0);
      setMissedFlowerIds((prev) => {
        if (!prev.includes(currentQ.flower.id)) {
          return [...prev, currentQ.flower.id];
        }
        return prev;
      });
    }

    // Pronounce the English word
    sound.speakEnglish(currentQ.flower.english);
  };

  // Handle Spelling tile click
  const handleTileClick = (tileId: string) => {
    if (isAnswered) return;
    sound.playClick();

    const tile = availableTiles.find((t) => t.id === tileId);
    if (!tile || tile.used) return;

    setAvailableTiles((prev) =>
      prev.map((t) => (t.id === tileId ? { ...t, used: true } : t))
    );
    setSpellingInput((prev) => [...prev, tile.letter]);
  };

  // Remove last letter in spelling input
  const handleBackspaceSpelling = () => {
    if (isAnswered || spellingInput.length === 0) return;
    sound.playClick();

    const lastLetter = spellingInput[spellingInput.length - 1];
    setSpellingInput((prev) => prev.slice(0, -1));

    // Mark the first used tile of that letter as unused
    setAvailableTiles((prev) => {
      const idx = prev.findIndex((t) => t.letter === lastLetter && t.used);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], used: false };
        return copy;
      }
      return prev;
    });
  };

  // Reset spelling tiles
  const handleResetSpelling = () => {
    if (isAnswered) return;
    sound.playClick();
    setSpellingInput([]);
    setAvailableTiles((prev) => prev.map((t) => ({ ...t, used: false })));
  };

  // Submit spelling answer
  const handleSubmitSpelling = () => {
    if (isAnswered || spellingInput.length === 0) return;

    const currentSpelling = spellingInput.join('');
    const correct = currentSpelling === cleanTargetEnglish;

    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      sound.playCorrect();
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((prev) => Math.max(prev, newCombo));
      setCorrectCount((prev) => prev + 1);
      const points = 120 + (newCombo > 1 ? newCombo * 10 : 0);
      setScore((prev) => prev + points);
    } else {
      sound.playWrong();
      setCombo(0);
      setMissedFlowerIds((prev) => {
        if (!prev.includes(currentQ.flower.id)) {
          return [...prev, currentQ.flower.id];
        }
        return prev;
      });
    }

    sound.speakEnglish(currentQ.flower.english);
  };

  // Move to next question or complete
  const handleNext = () => {
    sound.playClick();
    if (currentIndex + 1 < totalQ) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      sound.playFanfare();
      onFinishQuiz({
        score,
        correctCount,
        totalQuestions: totalQ,
        maxCombo,
        timeTakenSec: elapsedSeconds,
        missedFlowerIds
      });
    }
  };

  // 50:50 Hint
  const handleUseFiftyFifty = () => {
    if (isAnswered || eliminatedOptionIndices.length > 0) return;
    sound.playClick();

    const wrongIndices = currentQ.options
      .map((_, idx) => idx)
      .filter((idx) => idx !== currentQ.correctIndex);

    // Pick 2 random wrong options to eliminate
    const shuffledWrong = wrongIndices.sort(() => Math.random() - 0.5);
    const toEliminate = shuffledWrong.slice(0, 2);
    setEliminatedOptionIndices(toEliminate);
  };

  // First letter hint
  const handleUseLetterHint = () => {
    if (isAnswered || usedLetterHint) return;
    sound.playClick();
    setUsedLetterHint(true);
  };

  // Flower meaning hint
  const handleUseFlowerLanguageHint = () => {
    if (isAnswered || usedFlowerLanguageHint) return;
    sound.playClick();
    setUsedFlowerLanguageHint(true);
  };

  // Keyboard shortcut support (1-4 keys for multiple choice, Enter for Next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showExitConfirm) return;

      if (e.key === 'Enter' && isAnswered) {
        handleNext();
        return;
      }

      if (mode === 'multiple_choice' || mode === 'listening') {
        if (!isAnswered) {
          const num = parseInt(e.key, 10);
          if (num >= 1 && num <= 4) {
            handleSelectOption(num - 1);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, mode, showExitConfirm]);

  const levelInfo = DIFFICULTY_LABELS[difficulty];

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {/* Top HUD Status Bar */}
      <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            title="게임 종료"
          >
            <X size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                {levelInfo.label} ({levelInfo.sub})
              </span>
              <span className="text-xs text-stone-500 tabular-nums">
                문제 {currentIndex + 1} / {totalQ}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-24 sm:w-36 h-1.5 bg-stone-100 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                style={{ width: `${((currentIndex + 1) / totalQ) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Score & Combo */}
        <div className="flex items-center gap-4 sm:gap-6 text-right">
          {combo > 1 && (
            <div className="flex items-center gap-1 text-amber-600 font-bold text-xs sm:text-sm animate-pulse">
              <Sparkles size={14} />
              <span className="tabular-nums">{combo}연속 정답!</span>
            </div>
          )}
          <div>
            <div className="text-[11px] text-stone-500 font-medium">현재 점수</div>
            <div className="text-base sm:text-xl font-extrabold text-stone-900 tabular-nums">
              {score}점
            </div>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Flower Visual Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center shadow-inner transition-transform ${
              isAnswered && isCorrect ? 'scale-105' : ''
            }`}
            style={{
              backgroundColor: `${currentQ.flower.accentColor}15`,
              color: currentQ.flower.accentColor
            }}
          >
            <FlowerIcon id={currentQ.flower.id} size={48} color={currentQ.flower.accentColor} />
          </div>

          {/* Question Text */}
          <div className="space-y-1.5">
            {mode === 'listening' ? (
              <div className="space-y-2">
                <button
                  onClick={() => sound.speakEnglish(currentQ.flower.english)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-98 text-white rounded-xl font-bold text-sm shadow-xs flex items-center gap-2 mx-auto cursor-pointer transition-all"
                >
                  <Volume2 size={20} />
                  <span>발음 다시 듣기</span>
                </button>
                <p className="text-xs text-stone-500">
                  원어민 발음을 듣고 어떤 꽃인지 맞춰보세요
                </p>
              </div>
            ) : mode === 'spelling' ? (
              <div>
                <span className="text-xs font-semibold text-stone-500">다음 꽃의 올바른 영어 철자를 완성하세요</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
                  {currentQ.flower.korean}
                </h2>
              </div>
            ) : direction === 'ko_to_en' ? (
              <div>
                <span className="text-xs font-semibold text-stone-500">다음 꽃이름의 영어 단어는 무엇일까요?</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
                  {currentQ.flower.korean}
                </h2>
              </div>
            ) : (
              <div>
                <span className="text-xs font-semibold text-stone-500">다음 영어 단어에 해당하는 우리말 꽃은?</span>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                    {currentQ.flower.english}
                  </h2>
                  <button
                    onClick={() => sound.speakEnglish(currentQ.flower.english)}
                    className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                    title="발음 듣기"
                  >
                    <Volume2 size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hints Bar (Only before answering) */}
        {!isAnswered && mode !== 'listening' && (
          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-stone-400 flex items-center gap-1 font-medium">
              <Lightbulb size={13} /> 힌트:
            </span>

            <button
              onClick={handleUseFlowerLanguageHint}
              disabled={usedFlowerLanguageHint}
              className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                usedFlowerLanguageHint
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {usedFlowerLanguageHint ? `꽃말: ${currentQ.flower.flowerLanguage}` : '꽃말 힌트'}
            </button>

            <button
              onClick={handleUseLetterHint}
              disabled={usedLetterHint}
              className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                usedLetterHint
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {usedLetterHint
                ? `첫 글자 [${currentQ.flower.english[0]}] / ${cleanTargetEnglish.length}글자`
                : '첫 글자 힌트'}
            </button>

            {mode === 'multiple_choice' && (
              <button
                onClick={handleUseFiftyFifty}
                disabled={eliminatedOptionIndices.length > 0}
                className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                  eliminatedOptionIndices.length > 0
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                50:50 오답제거
              </button>
            )}
          </div>
        )}

        {/* Mode-Specific Interaction Area */}
        {mode === 'spelling' ? (
          /* SPELLING SCRAMBLE MODE */
          <div className="space-y-6 pt-2">
            {/* Assembled letters slots */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 min-h-[52px] p-3 bg-stone-50 rounded-xl border border-stone-200">
              {Array.from({ length: cleanTargetEnglish.length }).map((_, idx) => {
                const char = spellingInput[idx];
                return (
                  <div
                    key={idx}
                    className={`w-9 h-11 sm:w-11 sm:h-13 rounded-lg border-2 flex items-center justify-center font-bold text-lg sm:text-xl transition-all ${
                      char
                        ? isAnswered
                          ? isCorrect
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                            : 'border-rose-500 bg-rose-50 text-rose-800'
                          : 'border-stone-400 bg-white text-stone-900 shadow-xs'
                        : 'border-dashed border-stone-300 bg-transparent text-stone-300'
                    }`}
                  >
                    {char || ''}
                  </div>
                );
              })}
            </div>

            {/* Available letter tiles */}
            {!isAnswered ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {availableTiles.map((tile) => (
                    <button
                      key={tile.id}
                      onClick={() => handleTileClick(tile.id)}
                      disabled={tile.used}
                      className={`w-11 h-12 sm:w-12 sm:h-13 rounded-xl font-extrabold text-base sm:text-lg border transition-all cursor-pointer ${
                        tile.used
                          ? 'opacity-25 bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed'
                          : 'bg-white border-stone-300 text-stone-900 shadow-xs hover:border-emerald-600 hover:-translate-y-0.5 active:translate-y-0'
                      }`}
                    >
                      {tile.letter}
                    </button>
                  ))}
                </div>

                {/* Spelling Control Buttons */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={handleBackspaceSpelling}
                    disabled={spellingInput.length === 0}
                    className="px-4 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    <Delete size={15} />
                    <span>지우기</span>
                  </button>
                  <button
                    onClick={handleResetSpelling}
                    disabled={spellingInput.length === 0}
                    className="px-4 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    <RotateCcw size={15} />
                    <span>초기화</span>
                  </button>
                  <button
                    onClick={handleSubmitSpelling}
                    disabled={spellingInput.length !== cleanTargetEnglish.length}
                    className="px-6 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-40"
                  >
                    <CheckCircle2 size={15} />
                    <span>정답 제출</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          /* MULTIPLE CHOICE / LISTENING MODE */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOptionIndex === idx;
              const isCorrectOpt = idx === currentQ.correctIndex;
              const isEliminated = eliminatedOptionIndices.includes(idx);

              let buttonStyle = 'border-stone-200 bg-stone-50/70 hover:bg-stone-100 text-stone-800';

              if (isEliminated) {
                buttonStyle = 'opacity-25 pointer-events-none border-stone-200 bg-stone-100';
              } else if (isAnswered) {
                if (isCorrectOpt) {
                  buttonStyle = 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/30';
                } else if (isSelected && !isCorrectOpt) {
                  buttonStyle = 'border-rose-500 bg-rose-50 text-rose-900';
                } else {
                  buttonStyle = 'opacity-50 border-stone-200 bg-stone-50';
                }
              }

              // Display label depending on quiz direction
              const label =
                direction === 'ko_to_en' || mode === 'listening'
                  ? opt.english
                  : opt.korean;

              const subLabel =
                direction === 'ko_to_en' || mode === 'listening'
                  ? opt.pronunciation.split(' ')[1] || '' // Korean pronunciation guide
                  : opt.english;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered || isEliminated}
                  className={`p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${buttonStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-white border border-stone-200 text-stone-500 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-sm sm:text-base font-bold text-stone-900">
                        {label}
                      </div>
                      {subLabel && (
                        <div className="text-xs text-stone-500">
                          {subLabel}
                        </div>
                      )}
                    </div>
                  </div>

                  {isAnswered && (
                    <div>
                      {isCorrectOpt && <CheckCircle2 size={18} className="text-emerald-600" />}
                      {isSelected && !isCorrectOpt && <XCircle size={18} className="text-rose-500" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Answer Explanation & Educational Card (Appears after answer) */}
        {isAnswered && (
          <div className="mt-6 p-4 sm:p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-3 animate-in fade-in duration-300">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {isCorrect ? '정답입니다!' : '아쉽네요!'}
                  </span>
                  <span className="text-sm font-bold text-stone-900">
                    {currentQ.flower.english} = {currentQ.flower.korean}
                  </span>
                </div>
                <div className="text-xs text-stone-500 mt-1 flex items-center gap-2">
                  <span>발음: {currentQ.flower.pronunciation}</span>
                  <button
                    onClick={() => sound.speakEnglish(currentQ.flower.english)}
                    className="text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 size={13} /> 듣기
                  </button>
                </div>
              </div>

              {/* Next Question Button */}
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs flex items-center gap-2 cursor-pointer shrink-0 transition-all"
              >
                <span>{currentIndex + 1 < totalQ ? '다음 문제' : '결과 보기'}</span>
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="pt-2 border-t border-stone-200/80 text-xs text-stone-600 space-y-1">
              <div>
                <span className="font-semibold text-stone-700">꽃말: </span>
                {currentQ.flower.flowerLanguage}
              </div>
              <div>
                <span className="font-semibold text-stone-700">식물 정보: </span>
                {currentQ.flower.hint}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Exit confirmation modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-stone-900">
              게임을 중단하시겠습니까?
            </h3>
            <p className="text-xs text-stone-600">
              현재까지 진행된 퀴즈 점수는 저장되지 않고 메인 화면으로 돌아갑니다.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              >
                계속 풀기
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onExitQuiz();
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
              >
                게임 종료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
