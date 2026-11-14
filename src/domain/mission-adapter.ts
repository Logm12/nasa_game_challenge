/**
 * Client Adapter & Local Mock Provider (TIP-007)
 *
 * Cung cấp client interface và mock adapter theo cùng hợp đồng API.
 * Phục vụ frontend kiểm thử giao diện mà không cần chờ triển khai máy chủ ngoài.
 * Tuyệt đối không can thiệp layout, CSS hay THREE.js.
 */

import {
  MissionRunConfig,
  MissionCommand,
  ClientMissionView,
  RunResult,
  ValidationError
} from './mission-contract';
import { MissionApiService, ApiResponse } from './mission-api';

export interface IMissionClientAdapter {
  startMission(config: MissionRunConfig): Promise<ApiResponse<ClientMissionView>>;
  submitCommand(command: MissionCommand): Promise<ApiResponse<ClientMissionView>>;
  getDebriefReport(runId: string): Promise<ApiResponse<RunResult>>;
}

/**
 * Direct Local Service Adapter kết nối trực tiếp với MissionApiService
 */
export class LocalMissionClientAdapter implements IMissionClientAdapter {
  private apiService: MissionApiService;
  private currentSessionId: string;

  constructor(apiService: MissionApiService, sessionId = 'local_player_session') {
    this.apiService = apiService;
    this.currentSessionId = sessionId;
  }

  public setSessionId(newSessionId: string): void {
    this.currentSessionId = newSessionId;
  }

  async startMission(config: MissionRunConfig): Promise<ApiResponse<ClientMissionView>> {
    return this.apiService.handleStartRun({
      sessionId: this.currentSessionId,
      payload: { config }
    });
  }

  async submitCommand(command: MissionCommand): Promise<ApiResponse<ClientMissionView>> {
    return this.apiService.handleExecuteCommand({
      sessionId: this.currentSessionId,
      payload: { command }
    });
  }

  async getDebriefReport(runId: string): Promise<ApiResponse<RunResult>> {
    return this.apiService.handleGetReport({
      sessionId: this.currentSessionId,
      payload: { runId }
    });
  }
}

/**
 * Mock Adapter độc lập có thể cấu hình trước dữ liệu giả lập cho UI Developer
 */
export class MockMissionClientAdapter implements IMissionClientAdapter {
  private mockView: ClientMissionView | null = null;
  private mockReport: RunResult | null = null;
  private failureResponse?: ValidationError;

  public setMockView(view: ClientMissionView): void {
    this.mockView = view;
  }

  public setMockReport(report: RunResult): void {
    this.mockReport = report;
  }

  public setSimulatedError(err: ValidationError): void {
    this.failureResponse = err;
  }

  async startMission(config: MissionRunConfig): Promise<ApiResponse<ClientMissionView>> {
    if (this.failureResponse) {
      return { statusCode: 400, success: false, error: this.failureResponse };
    }
    return {
      statusCode: 200,
      success: true,
      data: this.mockView || {
        runId: config.runId,
        revision: 1,
        status: 'IN_PROGRESS',
        allowedActions: ['ANSWER_QUIZ', 'COMPLETE_RUN'],
        disallowedActions: [],
        progressDisplay: { label: 'Tiến độ', value: '0%', percentage: 0 },
        isReportReady: false
      }
    };
  }

  async submitCommand(command: MissionCommand): Promise<ApiResponse<ClientMissionView>> {
    if (this.failureResponse) {
      return { statusCode: 400, success: false, error: this.failureResponse };
    }
    return {
      statusCode: 200,
      success: true,
      data: this.mockView || {
        runId: command.runId,
        revision: (command.expectedRevision ?? 1) + 1,
        status: 'IN_PROGRESS',
        allowedActions: ['COMPLETE_RUN'],
        disallowedActions: [],
        progressDisplay: { label: 'Tiến độ', value: '100%', percentage: 100 },
        isReportReady: false
      }
    };
  }

  async getDebriefReport(runId: string): Promise<ApiResponse<RunResult>> {
    if (this.failureResponse) {
      return { statusCode: 400, success: false, error: this.failureResponse };
    }
    if (!this.mockReport) {
      return { statusCode: 202, success: false, error: { code: 'RULE_VIOLATION', message: 'Chưa có report.' } };
    }
    return {
      statusCode: 200,
      success: true,
      data: this.mockReport
    };
  }
}
