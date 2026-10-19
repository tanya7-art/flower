import React from 'react';
import { MistakeEntry, Flower } from '../types/game';
import { FLOWERS, DIFFICULTY_LABELS } from '../data/flowers';
import { FlowerIcon } from './FlowerIcon';
import { sound } from '../utils/sound';
import {
  BookOpen,
  Volume2,
  Trash2,
  Play,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface MistakesViewProps {
  mistakes: MistakeEntry[];
  onRemoveMistake: (flowerId: string) => void;
  onClearAllMistakes: () => void;
  onStartMistakeQuiz: (flowers: Flower[]) => void;
}

export const MistakesView: React.FC<MistakesViewProps> = ({
  mistakes,
  onRemoveMistake,
  onClearAllMistakes,
  onStartMistakeQuiz
}) => {
  // Map mistake entries to full flower data
  const mistakeFlowersWithMeta = mistakes
    .map((m) => {
      const flower = FLOWERS.find((f) => f.id === m.flowerId);
      return flower ? { flower, entry: m } : null;
    })
    .filter((item): item is { flower: Flower; entry: MistakeEntry } => item !== null);

  const missedFlowersList = mistakeFlowersWithMeta.map((item) => item.flower);

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            나만의 오답노트
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            퀴즈에서 헷갈렸던 꽃이름 영어단어를 모아 집중적으로 복습해보세요.
          </p>
        </div>

        {mistakeFlowersWithMeta.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onStartMistakeQuiz(missedFlowersList);
              }}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Play size={14} fill="currentColor" />
              <span>오답 집중 퀴즈 ({missedFlowersList.length})</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                if (confirm('오답노트를 모두 비우시겠습니까?')) {
                  onClearAllMistakes();
                }
              }}
              className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
              title="오답노트 전체 비우기"
            >
              <Trash2 size={14} />
              <span>전체 삭제</span>
            </button>
          </div>
        )}
      </div>

      {mistakeFlowersWithMeta.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-900">
              오답노트가 비어있습니다!
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              틀린 문제가 없거나 모든 오답을 성공적으로 마스터하셨습니다. 새로운 난이도에 도전해보세요!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mistakeFlowersWithMeta.map(({ flower, entry }) => {
            const level = DIFFICULTY_LABELS[flower.difficulty];

            return (
              <div
                key={flower.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-inner"
                        style={{
                          backgroundColor: `${flower.accentColor}15`,
                          color: flower.accentColor
                        }}
                      >
                        <FlowerIcon id={flower.id} size={26} color={flower.accentColor} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-stone-900">
                            {flower.english}
                          </span>
                          <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            {entry.wrongCount}회 오답
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-emerald-800">
                          {flower.korean} ({level.label} · {level.sub})
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => sound.speakEnglish(flower.english)}
                      className="p-2 text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="발음 듣기"
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>

                  <div className="space-y-1 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100">
                    <div>
                      <span className="font-semibold text-stone-500">발음: </span>
                      {flower.pronunciation}
                    </div>
                    <div>
                      <span className="font-semibold text-stone-500">꽃말: </span>
                      {flower.flowerLanguage}
                    </div>
                    <div>
                      <span className="font-semibold text-stone-500">기억 힌트: </span>
                      {flower.hint}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-400 tabular-nums">
                    최근 오답: {entry.lastMissedDate}
                  </span>

                  <button
                    onClick={() => {
                      sound.playClick();
                      onRemoveMistake(flower.id);
                    }}
                    className="text-stone-500 hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    title="외웠으므로 오답노트에서 삭제"
                  >
                    <CheckCircle2 size={13} className="text-emerald-600" />
                    <span>마스터 완료 (삭제)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
