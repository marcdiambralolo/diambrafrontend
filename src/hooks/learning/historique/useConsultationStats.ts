import { Consultation } from "@/lib/interfaces";
import { extractSecondsFromTimeSpent, formatSecondsToTime } from "@/lib/learning/functions";
import { GameStats } from "@/lib/learning/interface";
import { useMemo } from "react";

interface TimeSpentStats {
  totalSeconds: number;
  averageSeconds: number;
  maxSeconds: number;
  minSeconds: number;
  formattedTotal: string;
  formattedAverage: string;
  formattedMax: string;
  formattedMin: string;
}

export const parseTimeToSeconds = (timeStr: string): number => {
  if (!timeStr) return 0;

  if (/^\d+$/.test(timeStr)) {
    return parseInt(timeStr, 10);
  }

  const match = timeStr.match(/(\d+(?:\.\d+)?)\s*(?:sec|s)?/i);
  return match ? parseFloat(match[1]) : 0;
};

export const formatTimeFromSeconds = (seconds: number): string => {
  if (seconds < 60) return `${seconds} sec`;
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;
  if (restSeconds === 0) return `${minutes} min`;
  return `${minutes} min ${restSeconds} sec`;
};

export const timeCache = new Map<string, number>();

export const getCachedTime = (timeSpent: string | undefined): number => {
  if (!timeSpent) return 0;

  if (timeCache.has(timeSpent)) {
    return timeCache.get(timeSpent)!;
  }

  const seconds = extractSecondsFromTimeSpent(timeSpent);
  timeCache.set(timeSpent, seconds);
  return seconds;
};

export function useConsultationStats(
  consultations: Consultation[],
  apiStats?: GameStats
) {
  const timeSpentStats = useMemo((): TimeSpentStats => {
    const length = consultations.length;
    if (length === 0) {
      return {
        totalSeconds: 0,
        averageSeconds: 0,
        maxSeconds: 0,
        minSeconds: 0,
        formattedTotal: "0s",
        formattedAverage: "0s",
        formattedMax: "0s",
        formattedMin: "0s",
      };
    }

    let totalSeconds = 0;
    let maxSeconds = -Infinity;
    let minSeconds = Infinity;

    for (const c of consultations) {
      const seconds = getCachedTime(c.timeSpent);
      totalSeconds += seconds;
      if (seconds > maxSeconds) maxSeconds = seconds;
      if (seconds < minSeconds) minSeconds = seconds;
    }

    const averageSeconds = Math.round(totalSeconds / length);

    return {
      totalSeconds,
      averageSeconds,
      maxSeconds: maxSeconds === -Infinity ? 0 : maxSeconds,
      minSeconds: minSeconds === Infinity ? 0 : minSeconds,
      formattedTotal: formatSecondsToTime(totalSeconds),
      formattedAverage: formatSecondsToTime(averageSeconds),
      formattedMax: formatSecondsToTime(maxSeconds === -Infinity ? 0 : maxSeconds),
      formattedMin: formatSecondsToTime(minSeconds === Infinity ? 0 : minSeconds),
    };
  }, [consultations]);

  const participantStats = useMemo(() => {
    const uniquePlayers = new Set(
      consultations
        .map((c) => c.clientId?._id)
        .filter((id): id is string => Boolean(id))
    );

    return {
      uniquePlayers: uniquePlayers.size,
      totalConsultations: consultations.length,
      hasMultipleConsultations: uniquePlayers.size < consultations.length,
    };
  }, [consultations]);

  const advancedStats = useMemo((): GameStats | null => {
    if (!consultations.length) return null;

    const validConsultations = consultations.filter(
      (c) => parseTimeToSeconds(c.timeSpent || "") > 0
    );

    if (validConsultations.length === 0) return null;
    const totalTimeSpent = validConsultations.reduce(
      (sum, c) => sum + parseTimeToSeconds(c.timeSpent || ""),
      0
    );

    const averageTime = Math.round(totalTimeSpent / validConsultations.length);

    const fastest = validConsultations.reduce(
      (fastest, current) => {
        const currentTime = parseTimeToSeconds(current.timeSpent || "");
        return currentTime < fastest.time
          ? { time: currentTime, consultation: current }
          : fastest;
      },
      { time: Infinity, consultation: validConsultations[0] }
    );

    return {
      completedPlayers: apiStats?.completedPlayers || validConsultations.length,
      totalTimeSpent,
      averageTimeSpent: averageTime,
      fastestTime: fastest.time,
      fastestTimeFormatted: formatTimeFromSeconds(fastest.time),
    };
  }, [consultations, apiStats]);

  const rankedConsultations = useMemo(() => {
    if (!consultations.length) return [];

    const sorted = [...consultations].sort((a, b) => {
      const timeA = parseTimeToSeconds(a.timeSpent || "");
      const timeB = parseTimeToSeconds(b.timeSpent || "");

      if (timeA === 0 && timeB === 0) return 0;
      if (timeA === 0) return 1;
      if (timeB === 0) return -1;

      return timeA - timeB;
    });

    let currentRank = 1;

    return sorted.map((consultation) => {
      const time = parseTimeToSeconds(consultation.timeSpent || "");
      const hasValidTime = time > 0;

      return {
        ...consultation,
        rank: hasValidTime ? currentRank++ : null,
      };
    });
  }, [consultations]);

  return { timeSpentStats, participantStats, advancedStats, rankedConsultations };
}