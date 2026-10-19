import React from 'react';
import { Difficulty, GameMode, QuizDirection } from '../types/game';
import { DIFFICULTY_LABELS, FLOWERS } from '../data/flowers';
import { Play, Volume2, SpellCheck, CheckCircle2, Trophy, Flame } from 'lucide-react';
import { sound } from '../utils/sound';

interface DifficultySelectorProps {
  selectedDifficulty: Difficulty;
  onSelectDifficulty: (d: Difficulty) => void;
  selectedMode: GameMode;
  onSelectMode: (m: GameMode) => void;
  quizDirection: QuizDirection;
  onSelectDirection: (dir: QuizDirection) => void;
  questionCount: number;
  onSelectQuestionCount: (c: number) => void;
  onStartQuiz: () => void;
  bestScores: Record<Difficulty, { score: number; accuracy: number; date: string } | null>;
  playerName: string;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  selectedDifficulty,
  onSelectDifficulty,
  selectedMode,
  onSelectMode,
  quizDirection,
  onSelectDirection,
  questionCount,
  onSelectQuestionCount,
  onStartQuiz,
  bestScores,
  playerName
}) => {
  const currentFlowers = FLOWERS.filter((f) => f.difficulty === selectedDifficulty);
  const best = bestScores[selectedDifficulty];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 sm:py-6">
      {/* Hero Welcome Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <Flame size={14} className="text-emerald-600" />
          <span>{playerName}님의 꽃이름 영어 단어 마스터</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
          꽃이름 영어단어 맞추기 게임
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto">
          초등 기초 어휘부터 고등 심화 보태니컬 단어까지, 3단계 난이도로 꽃이름 영단어와 철자, 발음, 꽃말을 완벽하게 학습해보세요.
        </p>
      </div>

      {/* Step 1: Difficulty Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-wide text-stone-700">
            01. 난이도 선택
          </h2>
          <span className="text-xs text-stone-500">
            현재 레벨 총 {currentFlowers.length}단어
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['elementary', 'intermediate', 'advanced'] as Difficulty[]).map((level) => {
            const info = DIFFICULTY_LABELS[level];
            const isSelected = selectedDifficulty === level;
            const levelBest = bestScores[level];

            return (
              <button
                key={level}
                onClick={() => {
                  sound.playClick();
                  onSelectDifficulty(level);
                }}
                className={`p-5 rounded-2xl text-left border-2 transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'border-emerald-600 bg-white shadow-md ring-2 ring-emerald-500/20'
                    : 'border-stone-200 bg-stone-50/70 hover:bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-stone-900">
                      {info.label}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                      {info.sub}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <CheckCircle2 size={14} />
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 mb-3 min-h-[36px] line-clamp-2">
                  {info.desc}
                </p>

                <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs text-stone-500">
                  <span>{info.grade}</span>
                  {levelBest ? (
                    <span className="font-semibold text-emerald-700 tabular-nums">
                      최고 {levelBest.score}점
                    </span>
                  ) : (
                    <span className="text-stone-400">도전 전</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Game Mode & Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-2xl border border-stone-200 shadow-xs">
        {/* Game Mode */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-stone-700">
            02. 게임 모드
          </label>
          <div className="space-y-2">
            <button
              onClick={() => {
                sound.playClick();
                onSelectMode('multiple_choice');
              }}
              className={`w-full p-3 rounded-xl border flex items-center gap-3 text-left transition-colors cursor-pointer ${
                selectedMode === 'multiple_choice'
                  ? 'border-emerald-600 bg-emerald-50/50 text-stone-900 font-medium'
                  : 'border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-stone-900">4지선다 퀴즈</div>
                <div className="text-xs text-stone-500">꽃이름과 알맞은 영단어 또는 우리말 선택</div>
              </div>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onSelectMode('spelling');
              }}
              className={`w-full p-3 rounded-xl border flex items-center gap-3 text-left transition-colors cursor-pointer ${
                selectedMode === 'spelling'
                  ? 'border-emerald-600 bg-emerald-50/50 text-stone-900 font-medium'
                  : 'border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <SpellCheck size={18} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-stone-900">철자 맞추기 (스펠링 완성)</div>
                <div className="text-xs text-stone-500">흩어진 알파벳 블록을 조합하여 철자 마스터</div>
              </div>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onSelectMode('listening');
              }}
              className={`w-full p-3 rounded-xl border flex items-center gap-3 text-left transition-colors cursor-pointer ${
                selectedMode === 'listening'
                  ? 'border-emerald-600 bg-emerald-50/50 text-stone-900 font-medium'
                  : 'border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Volume2 size={18} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-stone-900">발음 듣기 퀴즈</div>
                <div className="text-xs text-stone-500">원어민 발음을 듣고 정확한 꽃이름 맞추기</div>
              </div>
            </button>
          </div>
        </div>

        {/* Quiz Direction & Question Count */}
        <div className="space-y-5">
          {selectedMode === 'multiple_choice' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700">
                문제 방향
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    sound.playClick();
                    onSelectDirection('ko_to_en');
                  }}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors ${
                    quizDirection === 'ko_to_en'
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  한글 보고 영어 고르기
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    onSelectDirection('en_to_ko');
                  }}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors ${
                    quizDirection === 'en_to_ko'
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  영어 보고 한글 고르기
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-stone-700">
                문항 수 선택
              </label>
              <span className="text-xs text-stone-500 tabular-nums">
                {questionCount}문제
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, currentFlowers.length].map((count) => (
                <button
                  key={count}
                  onClick={() => {
                    sound.playClick();
                    onSelectQuestionCount(count);
                  }}
                  className={`py-2 text-xs font-medium rounded-lg border transition-colors tabular-nums ${
                    questionCount === count
                      ? 'bg-emerald-700 text-white border-emerald-700 font-semibold'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {count === currentFlowers.length ? `전체 (${count})` : `${count}문제`}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Level Status */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-stone-700">
              <Trophy size={15} className="text-amber-500" />
              <span>{DIFFICULTY_LABELS[selectedDifficulty].label} 최고 기록</span>
            </div>
            <span className="font-bold text-stone-900 tabular-nums">
              {best ? `${best.score}점 (${best.accuracy}% 정답률)` : '기록 없음'}
            </span>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={() => {
            sound.playClick();
            onStartQuiz();
          }}
          className="w-full sm:w-auto px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold text-base rounded-xl shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <Play size={18} fill="currentColor" />
          <span>{DIFFICULTY_LABELS[selectedDifficulty].label} 퀴즈 시작하기</span>
        </button>
      </div>
    </div>
  );
};
