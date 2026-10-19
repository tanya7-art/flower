import React, { useState } from 'react';
import { ScoreRecord, Difficulty } from '../types/game';
import { DIFFICULTY_LABELS } from '../data/flowers';
import { sound } from '../utils/sound';
import {
  Trophy,
  Calendar,
  Flame,
  Clock,
  Trash2,
  Download,
  Filter,
  Play
} from 'lucide-react';

interface ScoreBoardViewProps {
  records: ScoreRecord[];
  onClearRecords: () => void;
  onStartQuiz: (difficulty: Difficulty) => void;
}

export const ScoreBoardView: React.FC<ScoreBoardViewProps> = ({
  records,
  onClearRecords,
  onStartQuiz
}) => {
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredRecords = filterDifficulty === 'all'
    ? records
    : records.filter((r) => r.difficulty === filterDifficulty);

  // Compute best scores
  const bestScores: Record<Difficulty, ScoreRecord | null> = {
    elementary: null,
    intermediate: null,
    advanced: null
  };

  records.forEach((r) => {
    if (!bestScores[r.difficulty] || r.score > bestScores[r.difficulty]!.score) {
      bestScores[r.difficulty] = r;
    }
  });

  // Compute stats
  const totalGames = records.length;
  const totalQuestions = records.reduce((acc, r) => acc + r.totalQuestions, 0);
  const totalCorrect = records.reduce((acc, r) => acc + r.correctCount, 0);
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const globalMaxCombo = records.reduce((max, r) => Math.max(max, r.maxCombo), 0);

  const handleExportJSON = () => {
    sound.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `flower_quiz_scores_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            점수 기록 및 랭킹
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            난이도별 역대 최고 점수와 플레이 기록을 확인하세요.
          </p>
        </div>

        {records.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="점수 기록 JSON 다운로드"
            >
              <Download size={14} />
              <span>기록 백업</span>
            </button>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 size={14} />
              <span>초기화</span>
            </button>
          </div>
        )}
      </div>

      {/* Best Scores per Difficulty Cards */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-stone-700">
          난이도별 최고 기록
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['elementary', 'intermediate', 'advanced'] as Difficulty[]).map((level) => {
            const info = DIFFICULTY_LABELS[level];
            const best = bestScores[level];

            return (
              <div
                key={level}
                className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-stone-900">
                        {info.label}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {info.sub}
                      </span>
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5">
                      {info.grade}
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Trophy size={18} />
                  </div>
                </div>

                {best ? (
                  <div className="space-y-2">
                    <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 tabular-nums">
                      {best.score}
                      <span className="text-sm font-normal text-stone-500 ml-1">점</span>
                    </div>
                    <div className="text-xs text-stone-600 flex items-center justify-between pt-1 border-t border-stone-100">
                      <span>정답률 {best.accuracy}%</span>
                      <span className="tabular-nums text-stone-400">{best.formattedDate}</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-2 text-center text-xs text-stone-400">
                    아직 도전 기록이 없습니다.
                  </div>
                )}

                <button
                  onClick={() => {
                    sound.playClick();
                    onStartQuiz(level);
                  }}
                  className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play size={13} fill="currentColor" />
                  <span>{info.label} 퀴즈 도전하기</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Aggregate Statistics */}
      {records.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
          <div>
            <div className="text-[11px] text-stone-500 font-medium">총 플레이 횟수</div>
            <div className="text-xl font-extrabold text-stone-900 tabular-nums">
              {totalGames}회
            </div>
          </div>
          <div>
            <div className="text-[11px] text-stone-500 font-medium">누적 풀이 문제</div>
            <div className="text-xl font-extrabold text-stone-900 tabular-nums">
              {totalQuestions}개
            </div>
          </div>
          <div>
            <div className="text-[11px] text-stone-500 font-medium">평균 정답률</div>
            <div className="text-xl font-extrabold text-emerald-700 tabular-nums">
              {overallAccuracy}%
            </div>
          </div>
          <div>
            <div className="text-[11px] text-stone-500 font-medium">역대 최장 연속 정답</div>
            <div className="text-xl font-extrabold text-amber-600 tabular-nums">
              {globalMaxCombo}회
            </div>
          </div>
        </div>
      )}

      {/* History Records Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-stone-800">
              상세 플레이 기록 ({filteredRecords.length})
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => {
                sound.playClick();
                setFilterDifficulty('all');
              }}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filterDifficulty === 'all'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setFilterDifficulty('elementary');
              }}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filterDifficulty === 'elementary'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              초급
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setFilterDifficulty('intermediate');
              }}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filterDifficulty === 'intermediate'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              중급
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setFilterDifficulty('advanced');
              }}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filterDifficulty === 'advanced'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              고급
            </button>
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <Trophy size={24} />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-stone-800">기록된 점수가 없습니다</div>
              <p className="text-xs text-stone-500">
                꽃이름 퀴즈를 풀고 나면 여기에 상세한 점수와 통계가 자동으로 기록됩니다.
              </p>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onStartQuiz('elementary');
              }}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors inline-flex items-center gap-1.5"
            >
              <Play size={14} fill="currentColor" />
              <span>초급 퀴즈 시작하기</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-semibold">
                  <tr>
                    <th className="py-3 px-4">일시</th>
                    <th className="py-3 px-4">플레이어</th>
                    <th className="py-3 px-4">난이도</th>
                    <th className="py-3 px-4">모드</th>
                    <th className="py-3 px-4 text-right">점수</th>
                    <th className="py-3 px-4 text-right">정답수</th>
                    <th className="py-3 px-4 text-right">정답률</th>
                    <th className="py-3 px-4 text-right">연속 정답</th>
                    <th className="py-3 px-4 text-right">소요시간</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredRecords.map((record) => {
                    const level = DIFFICULTY_LABELS[record.difficulty];
                    const modeLabel =
                      record.mode === 'spelling'
                        ? '철자'
                        : record.mode === 'listening'
                        ? '듣기'
                        : '4지선다';

                    return (
                      <tr key={record.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap text-stone-500 tabular-nums">
                          {record.formattedDate}
                        </td>
                        <td className="py-3 px-4 font-medium text-stone-900 whitespace-nowrap">
                          {record.playerName}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-semibold text-stone-800">
                            {level.label}
                          </span>
                          <span className="text-[11px] text-stone-400 ml-1">
                            ({level.sub})
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-stone-600">
                          {modeLabel}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-stone-900 tabular-nums">
                          {record.score}점
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-stone-700">
                          {record.correctCount} / {record.totalQuestions}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold text-emerald-700 tabular-nums">
                          {record.accuracy}%
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-amber-600 font-semibold">
                          {record.maxCombo > 0 ? `${record.maxCombo}회` : '-'}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums text-stone-500 whitespace-nowrap">
                          {record.timeTakenSec}초
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-stone-900">
              점수 기록을 모두 삭제하시겠습니까?
            </h3>
            <p className="text-xs text-stone-600">
              저장된 모든 퀴즈 기록과 통계가 영구적으로 삭제되며 복구할 수 없습니다.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onClearRecords();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
              >
                전체 삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
