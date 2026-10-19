import React, { useState, useMemo } from 'react';
import { Flower, Difficulty } from '../types/game';
import { FLOWERS, DIFFICULTY_LABELS } from '../data/flowers';
import { FlowerIcon } from './FlowerIcon';
import { sound } from '../utils/sound';
import {
  Search,
  Volume2,
  Sparkles,
  Info,
  BookOpen,
  X
} from 'lucide-react';

interface DictionaryViewProps {
  onPracticeFlower?: (flower: Flower) => void;
}

export const DictionaryView: React.FC<DictionaryViewProps> = ({ onPracticeFlower }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedFlower, setSelectedFlower] = useState<Flower | null>(null);

  const filteredFlowers = useMemo(() => {
    return FLOWERS.filter((flower) => {
      const matchDifficulty =
        selectedDifficulty === 'all' || flower.difficulty === selectedDifficulty;

      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        flower.english.toLowerCase().includes(q) ||
        flower.korean.includes(q) ||
        flower.flowerLanguage.includes(q) ||
        flower.category.includes(q);

      return matchDifficulty && matchSearch;
    });
  }, [searchQuery, selectedDifficulty]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          꽃 단어장 & 보태니컬 도감
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          초급·중급·고급 총 46종의 꽃 영단어, 발음 기호, 꽃말, 그리고 흥미로운 식물학적 배경을 탐색해보세요.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-stone-200 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="꽃이름 검색 (예: Rose, 장미, 해바라기, 에델바이스...)"
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Difficulty Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl text-xs font-medium shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              setSelectedDifficulty('all');
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              selectedDifficulty === 'all'
                ? 'bg-white text-stone-900 shadow-xs font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            전체 ({FLOWERS.length})
          </button>
          {(['elementary', 'intermediate', 'advanced'] as Difficulty[]).map((level) => {
            const count = FLOWERS.filter((f) => f.difficulty === level).length;
            const label = DIFFICULTY_LABELS[level].label;

            return (
              <button
                key={level}
                onClick={() => {
                  sound.playClick();
                  setSelectedDifficulty(level);
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  selectedDifficulty === level
                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Flower Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFlowers.map((flower) => {
          const level = DIFFICULTY_LABELS[flower.difficulty];

          return (
            <div
              key={flower.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-sm hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Top Row: Icon + Names + Sound */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: `${flower.accentColor}15`,
                        color: flower.accentColor
                      }}
                    >
                      <FlowerIcon id={flower.id} size={28} color={flower.accentColor} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-bold text-stone-900">
                          {flower.english}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-emerald-800">
                        {flower.korean}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => sound.speakEnglish(flower.english)}
                    className="p-2 text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="원어민 발음 듣기"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>

                {/* Pronunciation & Flower Meaning */}
                <div className="space-y-1.5 text-xs">
                  <div className="text-stone-500">
                    <span className="text-stone-400">발음: </span>
                    <span className="font-mono text-stone-700">{flower.pronunciation}</span>
                  </div>
                  <div className="text-stone-700">
                    <span className="text-stone-400">꽃말: </span>
                    <span className="font-medium">{flower.flowerLanguage}</span>
                  </div>
                </div>

                {/* Botanical clue summary */}
                <p className="text-xs text-stone-600 line-clamp-2 pt-1 border-t border-stone-100">
                  {flower.hint}
                </p>
              </div>

              {/* Bottom Meta Bar */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-400 font-medium">
                  {flower.category}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                    {level.label}
                  </span>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setSelectedFlower(flower);
                    }}
                    className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline cursor-pointer"
                  >
                    상세보기
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredFlowers.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 space-y-2">
          <div className="text-stone-400">
            <BookOpen size={32} className="mx-auto mb-2 opacity-50" />
          </div>
          <div className="text-sm font-bold text-stone-800">
            검색 결과가 없습니다
          </div>
          <p className="text-xs text-stone-500">
            단어 철자나 꽃이름을 다시 확인해보세요.
          </p>
        </div>
      )}

      {/* Flower Detail Modal */}
      {selectedFlower && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedFlower(null)}
              className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner"
                style={{
                  backgroundColor: `${selectedFlower.accentColor}15`,
                  color: selectedFlower.accentColor
                }}
              >
                <FlowerIcon id={selectedFlower.id} size={36} color={selectedFlower.accentColor} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-extrabold text-stone-900">
                    {selectedFlower.english}
                  </h3>
                  <button
                    onClick={() => sound.speakEnglish(selectedFlower.english)}
                    className="p-1.5 text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                    title="발음 듣기"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>
                <div className="text-base font-bold text-emerald-800">
                  {selectedFlower.korean}
                </div>
              </div>
            </div>

            <div className="space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs sm:text-sm">
              <div>
                <span className="font-semibold text-stone-500">발음 기호 및 우리말 발음: </span>
                <span className="font-bold text-stone-900">{selectedFlower.pronunciation}</span>
              </div>
              <div>
                <span className="font-semibold text-stone-500">꽃말: </span>
                <span className="font-bold text-stone-900">{selectedFlower.flowerLanguage}</span>
              </div>
              <div>
                <span className="font-semibold text-stone-500">식물학 분류: </span>
                <span className="text-stone-800">{selectedFlower.category} ({DIFFICULTY_LABELS[selectedFlower.difficulty].label} · {DIFFICULTY_LABELS[selectedFlower.difficulty].sub})</span>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-stone-600">
              <div>
                <div className="font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                  <Info size={15} className="text-emerald-600" />
                  <span>특징 및 설명</span>
                </div>
                <p className="leading-relaxed bg-stone-50/50 p-3 rounded-xl border border-stone-100">
                  {selectedFlower.hint}
                </p>
              </div>

              <div>
                <div className="font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                  <Sparkles size={15} className="text-amber-500" />
                  <span>재미있는 식물 상식</span>
                </div>
                <p className="leading-relaxed bg-amber-50/40 p-3 rounded-xl border border-amber-100 text-stone-700">
                  {selectedFlower.funFact}
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setSelectedFlower(null)}
                className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
