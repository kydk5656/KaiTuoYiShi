import { useCallback } from 'react';
import {
  fetchModels as fetchModelsImpl,
  testConnection as testConnectionImpl,
  type ConnectionTestConfig,
  type ConnectionTestResult,
} from '@/services/ai/apiTools';
import {
  fetchComfyWorkflowCandidates as fetchComfyWorkflowCandidatesImpl,
  fetchImageGenerationModels as fetchImageGenerationModelsImpl,
  testImageGenerationConnection as testImageGenerationConnectionImpl,
  type ComfyWorkflowCandidate,
} from '@/services/ai/imageGeneration';
import {
  clearApiErrorReports as clearApiErrorReportsImpl,
  loadApiErrorReports as loadApiErrorReportsImpl,
  type ApiErrorReport,
} from '@/services/ai/apiErrorReportService';
import type { 文生图API配置 } from '@/models/settings';
import { devLog, devLogError } from '@/utils/devLog';

export type { ConnectionTestConfig, ConnectionTestResult } from '@/services/ai/apiTools';
export type { ComfyWorkflowCandidate } from '@/services/ai/imageGeneration';
export type { ApiErrorReport } from '@/services/ai/apiErrorReportService';

export interface AiToolsActions {
  fetchModels: (config: ConnectionTestConfig) => Promise<string[]>;
  testConnection: (config: ConnectionTestConfig) => Promise<ConnectionTestResult>;
  testImageGenerationConnection: (config: 文生图API配置) => Promise<string>;
  fetchImageGenerationModels: (config: 文生图API配置) => Promise<string[]>;
  fetchComfyWorkflowCandidates: (
    config: 文生图API配置,
    source: 'queue' | 'history',
  ) => Promise<ComfyWorkflowCandidate[]>;
  loadApiErrorReports: () => Promise<ApiErrorReport[]>;
  clearApiErrorReports: () => Promise<void>;
}

export function useAiTools(): AiToolsActions {
  const fetchModels = useCallback(async (config: ConnectionTestConfig) => {
    try {
      const list = await fetchModelsImpl(config);
      devLog('ui', 'ai-tools-fetch-models', { count: list.length, provider: config.provider });
      return list;
    } catch (err) {
      devLogError('ui', 'ai-tools-fetch-models-failed', err, { provider: config.provider });
      throw err;
    }
  }, []);

  const testConnection = useCallback(async (config: ConnectionTestConfig) => {
    try {
      const result = await testConnectionImpl(config);
      devLog('ui', 'ai-tools-test-connection', { ok: result.ok, provider: config.provider });
      return result;
    } catch (err) {
      devLogError('ui', 'ai-tools-test-connection-failed', err, { provider: config.provider });
      throw err;
    }
  }, []);

  const testImageGenerationConnection = useCallback(async (config: 文生图API配置) => {
    try {
      const result = await testImageGenerationConnectionImpl(config);
      devLog('ui', 'ai-tools-test-image-connection', { backend: config.backend });
      return result;
    } catch (err) {
      devLogError('ui', 'ai-tools-test-image-connection-failed', err, { backend: config.backend });
      throw err;
    }
  }, []);

  const fetchImageGenerationModels = useCallback(async (config: 文生图API配置) => {
    try {
      const list = await fetchImageGenerationModelsImpl(config);
      devLog('ui', 'ai-tools-fetch-image-models', { count: list.length, backend: config.backend });
      return list;
    } catch (err) {
      devLogError('ui', 'ai-tools-fetch-image-models-failed', err, { backend: config.backend });
      throw err;
    }
  }, []);

  const fetchComfyWorkflowCandidates = useCallback(
    async (config: 文生图API配置, source: 'queue' | 'history') => {
      try {
        const list = await fetchComfyWorkflowCandidatesImpl(config, source);
        devLog('ui', 'ai-tools-fetch-comfy-workflows', { count: list.length, source });
        return list;
      } catch (err) {
        devLogError('ui', 'ai-tools-fetch-comfy-workflows-failed', err, { source });
        throw err;
      }
    },
    [],
  );

  const loadApiErrorReports = useCallback(async () => {
    try {
      const reports = await loadApiErrorReportsImpl();
      devLog('ui', 'ai-tools-load-error-reports', { count: reports.length });
      return reports;
    } catch (err) {
      devLogError('ui', 'ai-tools-load-error-reports-failed', err);
      throw err;
    }
  }, []);

  const clearApiErrorReports = useCallback(async () => {
    try {
      await clearApiErrorReportsImpl();
      devLog('ui', 'ai-tools-clear-error-reports', {});
    } catch (err) {
      devLogError('ui', 'ai-tools-clear-error-reports-failed', err);
      throw err;
    }
  }, []);

  return {
    fetchModels,
    testConnection,
    testImageGenerationConnection,
    fetchImageGenerationModels,
    fetchComfyWorkflowCandidates,
    loadApiErrorReports,
    clearApiErrorReports,
  };
}
