import React from 'react';
import { ActiveTab } from '../types/game';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sound } from '../utils/sound';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  playerName: string;
  onEditPlayerName: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  mistakesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  playerName,
  onEditPlayerName,
  soundEnabled,
  onToggleSound,
  mistakesCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            sound.playClick();
            onTabChange('quiz');
          }}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded"
        >
          <span className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:bg-emerald-800 transition-colors">
            꽃
          </span>
          <span className="text-lg font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0">
            FlowerVoca
          </span>
        </button>

        {/* Zone 2: Single-line Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onTabChange('quiz');
            }}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'quiz'
                ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            퀴즈 게임
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onTabChange('dictionary');
            }}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'dictionary'
                ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            꽃 도감
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onTabChange('scores');
            }}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'scores'
                ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            점수 기록
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onTabChange('mistakes');
            }}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 relative ${
              activeTab === 'mistakes'
                ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            오답노트
            {mistakesCount > 0 && (
              <span className="ml-1.5 text-[11px] font-bold text-amber-700">
                {mistakesCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleSound}
            title={soundEnabled ? '효과음 켜짐' : '효과음 음소거'}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="효과음 켜기/끄기"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="text-stone-400" />}
          </button>

          <button
            onClick={onEditPlayerName}
            title="닉네임 변경"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg border border-stone-200 transition-colors"
          >
            <Sparkles size={13} className="text-amber-600" />
            <span className="font-medium max-w-[100px] truncate">{playerName}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
