import { ScoreRecord, MistakeEntry, Difficulty } from '../types/game';

const SCORE_RECORDS_KEY = 'flower_vocab_quiz_scores_v1';
const MISTAKES_KEY = 'flower_vocab_quiz_mistakes_v1';
const PLAYER_NAME_KEY = 'flower_vocab_player_name_v1';

export function getPlayerName(): string {
  return localStorage.getItem(PLAYER_NAME_KEY) || '꽃마루';
}

export function setPlayerName(name: string): void {
  localStorage.setItem(PLAYER_NAME_KEY, name.trim() || '꽃마루');
}

export function getScoreRecords(): ScoreRecord[] {
  try {
    const raw = localStorage.getItem(SCORE_RECORDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveScoreRecord(record: ScoreRecord): void {
  try {
    const current = getScoreRecords();
    const updated = [record, ...current].slice(0, 100); // keep recent 100
    localStorage.setItem(SCORE_RECORDS_KEY, JSON.stringify(updated));
  } catch {
    // Storage quota or error safe
  }
}

export function clearScoreRecords(): void {
  localStorage.removeItem(SCORE_RECORDS_KEY);
}

export function getBestScores(): Record<Difficulty, { score: number; accuracy: number; date: string } | null> {
  const records = getScoreRecords();
  const res: Record<Difficulty, { score: number; accuracy: number; date: string } | null> = {
    elementary: null,
    intermediate: null,
    advanced: null
  };

  for (const r of records) {
    const currentBest = res[r.difficulty];
    if (!currentBest || r.score > currentBest.score) {
      res[r.difficulty] = {
        score: r.score,
        accuracy: r.accuracy,
        date: r.formattedDate
      };
    }
  }

  return res;
}

export function getMistakes(): MistakeEntry[] {
  try {
    const raw = localStorage.getItem(MISTAKES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordMistake(flowerId: string): void {
  try {
    const mistakes = getMistakes();
    const existingIndex = mistakes.findIndex((m) => m.flowerId === flowerId);
    const nowStr = new Date().toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    if (existingIndex >= 0) {
      mistakes[existingIndex].wrongCount += 1;
      mistakes[existingIndex].lastMissedDate = nowStr;
    } else {
      mistakes.push({
        flowerId,
        wrongCount: 1,
        lastMissedDate: nowStr
      });
    }

    // Sort by wrongCount descending
    mistakes.sort((a, b) => b.wrongCount - a.wrongCount);
    localStorage.setItem(MISTAKES_KEY, JSON.stringify(mistakes));
  } catch {
    // safe
  }
}

export function removeMistake(flowerId: string): void {
  try {
    const mistakes = getMistakes().filter((m) => m.flowerId !== flowerId);
    localStorage.setItem(MISTAKES_KEY, JSON.stringify(mistakes));
  } catch {
    // safe
  }
}

export function clearAllMistakes(): void {
  localStorage.removeItem(MISTAKES_KEY);
}
