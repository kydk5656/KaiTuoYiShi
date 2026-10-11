import type { DeepSeekAttemptDiagnostics, DeepSeekRecoverySummary } from './deepSeekRecovery';
import type { 回合Token消耗 } from '@/models/chat';

export interface StreamCallbacks {
  onDelta: (delta: string) => void;
  onDone: () => void;
  onError: (err: Error) => void;
  onFinishReason?: (reason: string) => void;
}

export type ChatMessagePayload = { role: string; content: string; prefix?: boolean };


export interface ChatCompletionRequest {
  messages: ChatMessagePayload[];
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  topA?: number;
  minP?: number;
  repetitionPenalty?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  maxContext?: number;
  signal?: AbortSignal;
  onUsage?: (usage: ChatCompletionUsage) => void;
  prefixMode?: boolean;
  prefixContent?: string;
  deepSeekRecovery?: 'auto' | 'disabled';
  onDeepSeekRecovery?: (summary: DeepSeekRecoverySummary) => void;
  onResponseDiagnostics?: (diagnostics: DeepSeekAttemptDiagnostics) => void;
}

export type ChatCompletionUsage = Partial<Omit<回合Token消耗, 'source'>> & {
  source: 'api';
};

export type CompatibleStreamTextState = {
  currentBlockIsThinking: boolean;
  sawReasoning: boolean;
};

export type UsageLike = Record<string, any>;
