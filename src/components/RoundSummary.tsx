import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Difficulty, GameMode, Flower } from '../types/game';
import { DIFFICULTY_LABELS, FLOWERS } from '../data/flowers';
import { FlowerIcon } from './FlowerIcon';
import { sound } from '../utils/sound';
import {
  Trophy,
  RotateCcw,
  BookOpen,
  Volume2,
  CheckCircle2,
  XCircle,
  Share2,
  ListOrdered
} from 'lucide-react';

interface RoundSummaryProps {
  difficulty: Difficulty;
  mode: GameMode;
  score: number;
  correctCount: number;
  totalQuestions: number;
  maxCombo: number;
  timeTakenSec: number;
  missedFlowerIds: string[];
  playerName: string;
  onPlayAgain: () => void;
  onGoToScores: () => void;
  onGoToMistakes: () => void;
}

export const RoundSummary: React.FC<RoundSummaryProps> = ({
  difficulty,
  mode,
  score,
  correctCount,
  totalQuestions,
  maxCombo,
  timeTakenSec,
  missedFlowerIds,
  playerName,
  onPlayAgain,
  onGoToScores,
  onGoToMistakes
}) => {
  const accuracy = Math.round((correctCount / totalQuestions) * 100);
  const levelInfo = DIFFICULTY_LABELS[difficulty];

  useEffect(() => {
    if (accuracy >= 80) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // safe
      }
    }
  }, [accuracy]);

  const minutes = Math.floor(timeTakenSec / 60);
  const seconds = timeTakenSec % 60;
  const timeFormatted = `${minutes > 0 ? `${minutes}분 ` : ''}${seconds}초`;

  // Get flower objects for missed ones
  const missedFlowers = FLOWERS.filter((f) => missedFlowerIds.includes(f.id));

  // Determine feedback tier
  let titleFeedback = '참 잘했어요!';
  let descFeedback = '꾸준히 연습하면 꽃이름 영단어를 완벽하게 마스터할 수 있어요.';
  if (accuracy === 100) {
    titleFeedback = '완벽한 만점! 꽃 박사님!';
    descFeedback = `${levelInfo.label} 단계의 모든 꽃이름 영어 단어를 완벽하게 맞추셨습니다!`;
  } else if (accuracy >= 80) {
    titleFeedback = '훌륭한 실력이에요!';
    descFeedback = `높은 정답률로 ${levelInfo.label} 어휘를 잘 숙지하고 계시네요.`;
  } else if (accuracy >= 50) {
    titleFeedback = '좋은 도전이었어요!';
    descFeedback = '틀린 단어들을 오답노트에서 확인하고 다시 한번 연습해보세요.';
  }

  const handleShare = async () => {
    sound.playClick();
    const shareText = `[플라워 보카] ${playerName}님이 ${levelInfo.label}(${levelInfo.sub}) 퀴즈에서 ${score}점(정답률 ${accuracy}%)을 기록했습니다! 🌸`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      alert('결과가 클립보드에 복사되었습니다!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Top Victory Card */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 text-center space-y-6 shadow-sm">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
          <Trophy size={36} />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {levelInfo.label} · {levelInfo.sub} 완료
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {titleFeedback}
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto">
            {descFeedback}
          </p>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div className="text-[11px] text-stone-500 font-medium">최종 점수</div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 tabular-nums">
              {score}점
            </div>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div className="text-[11px] text-stone-500 font-medium">정답률</div>
            <div className="text-xl sm:text-2xl font-extrabold text-stone-900 tabular-nums">
              {accuracy}%
            </div>
            <div className="text-[10px] text-stone-500 tabular-nums">
              {correctCount} / {totalQuestions} 정답
            </div>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div className="text-[11px] text-stone-500 font-medium">최대 연속</div>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-600 tabular-nums">
              {maxCombo}회
            </div>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div className="text-[11px] text-stone-500 font-medium">소요 시간</div>
            <div className="text-xl sm:text-2xl font-extrabold text-stone-900 tabular-nums">
              {timeFormatted}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              sound.playClick();
              onPlayAgain();
            }}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>다시 풀기</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onGoToScores();
            }}
            className="w-full sm:w-auto px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ListOrdered size={16} />
            <span>점수 기록 확인</span>
          </button>

          <button
            onClick={handleShare}
            className="w-full sm:w-auto px-4 py-3 border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            title="결과 복사하기"
          >
            <Share2 size={16} />
            <span>공유</span>
          </button>
        </div>
      </div>

      {/* Missed Flowers Review Section (if any) */}
      {missedFlowers.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle size={18} className="text-rose-500" />
              <h3 className="text-sm font-bold text-stone-900">
                이번 라운드에서 틀린 단어 ({missedFlowers.length}개)
              </h3>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onGoToMistakes();
              }}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <BookOpen size={13} />
              <span>오답노트 전체 보기</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {missedFlowers.map((flower) => (
              <div
                key={flower.id}
                className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${flower.accentColor}15`,
                      color: flower.accentColor
                    }}
                  >
                    <FlowerIcon id={flower.id} size={22} color={flower.accentColor} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">
                      {flower.english} = {flower.korean}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {flower.flowerLanguage}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => sound.speakEnglish(flower.english)}
                  className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="발음 듣기"
                >
                  <Volume2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
