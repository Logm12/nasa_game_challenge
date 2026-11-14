/**
 * Online Mission History Client Adapter
 *
 * Cung cấp client interface cho Frontend tích hợp giao diện lịch sử ván chơi:
 * - Trạng thái: loading, empty, error, saving, saved_online
 * - Lấy danh sách lịch sử có phân trang, lượt mới nhất trên đầu
 * - Xem chi tiết debrief report theo runId
 * - Retry khi gặp sự cố mạng hoặc lưu trữ mà không làm mất dữ liệu trên màn hình
 */

import {
  OnlineMissionRunRecord,
  OnlineSyncPayload,
  OnlineHistoryPaginationQuery,
  OnlineHistoryPaginationResult,
  RunResult,
  OnlineSyncStatus
} from './mission-contract';
import { OnlineHistoryService, ServiceResponse } from './online-history-service';

export interface IMissionHistoryClientAdapter {
  getSyncStatus(): OnlineSyncStatus;
  getLastError(): string | null;
  getHistoryItems(): OnlineMissionRunRecord[];
  syncRunOnline(payload: OnlineSyncPayload): Promise<ServiceResponse<OnlineMissionRunRecord>>;
  fetchHistory(page?: number, pageSize?: number): Promise<ServiceResponse<OnlineHistoryPaginationResult>>;
  fetchReport(runId: string): Promise<ServiceResponse<RunResult>>;
  retryLastSync(): Promise<ServiceResponse<OnlineMissionRunRecord> | null>;
}

export class OnlineMissionHistoryClientAdapter implements IMissionHistoryClientAdapter {
  private service: OnlineHistoryService;
  private authToken: string;
  private syncStatus: OnlineSyncStatus = 'idle';
  private lastError: string | null = null;
  private lastFailedPayload: OnlineSyncPayload | null = null;
  private historyItems: OnlineMissionRunRecord[] = [];

  constructor(service: OnlineHistoryService, authToken = 'Bearer user_default_pilot') {
    this.service = service;
    this.authToken = authToken;
  }

  public setAuthToken(token: string): void {
    this.authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  }

  public getSyncStatus(): OnlineSyncStatus {
    return this.syncStatus;
  }

  public getLastError(): string | null {
    return this.lastError;
  }

  public getHistoryItems(): OnlineMissionRunRecord[] {
    return [...this.historyItems];
  }

  /**
   * Lưu ván chơi lên server online
   */
  public async syncRunOnline(payload: OnlineSyncPayload): Promise<ServiceResponse<OnlineMissionRunRecord>> {
    this.syncStatus = 'saving';
    this.lastError = null;

    try {
      const res = await this.service.handleSyncRun(this.authToken, payload);
      if (res.success && res.data) {
        this.syncStatus = 'saved_online';
        this.lastFailedPayload = null;

        // Cập nhật danh sách local nếu chưa có
        const existsIndex = this.historyItems.findIndex(i => i.runId === res.data!.runId);
        if (existsIndex >= 0) {
          this.historyItems[existsIndex] = res.data;
        } else {
          // Lượt mới nhất nằm trên
          this.historyItems.unshift(res.data);
        }
        return res;
      } else {
        this.syncStatus = 'error';
        this.lastError = res.error?.message || 'Lỗi không xác định khi lưu online.';
        this.lastFailedPayload = payload;
        return res;
      }
    } catch (err) {
      this.syncStatus = 'error';
      this.lastError = (err as any)?.message || 'Lỗi mạng hoặc không thể kết nối tới server.';
      this.lastFailedPayload = payload;
      return {
        statusCode: 500,
        success: false,
        error: { code: 'NETWORK_ERROR', message: this.lastError! }
      };
    }
  }

  /**
   * Thử lại lần lưu thất bại gần nhất
   */
  public async retryLastSync(): Promise<ServiceResponse<OnlineMissionRunRecord> | null> {
    if (!this.lastFailedPayload) {
      return null;
    }
    return this.syncRunOnline(this.lastFailedPayload);
  }

  /**
   * Lấy danh sách lịch sử ván chơi
   */
  public async fetchHistory(page = 1, pageSize = 10): Promise<ServiceResponse<OnlineHistoryPaginationResult>> {
    try {
      const res = await this.service.handleListHistory(this.authToken, { page, pageSize });
      if (res.success && res.data) {
        this.historyItems = res.data.items;
        this.lastError = null;
      } else {
        this.lastError = res.error?.message || 'Lỗi tải danh sách lịch sử.';
      }
      return res;
    } catch (err) {
      this.lastError = (err as any)?.message || 'Lỗi mạng khi tải lịch sử.';
      return {
        statusCode: 500,
        success: false,
        error: { code: 'NETWORK_ERROR', message: this.lastError }
      };
    }
  }

  /**
   * Lấy chi tiết báo cáo lượt chơi theo runId
   */
  public async fetchReport(runId: string): Promise<ServiceResponse<RunResult>> {
    try {
      return await this.service.handleGetReport(this.authToken, runId);
    } catch (err) {
      return {
        statusCode: 500,
        success: false,
        error: { code: 'NETWORK_ERROR', message: (err as any)?.message || 'Lỗi mạng khi tải report.' }
      };
    }
  }
}
