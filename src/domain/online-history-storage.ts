/**
 * Server-Side Persistent Online History Storage Interface & Local Implementation
 *
 * Lưu trữ bền vững lịch sử ván chơi và report độc lập với tiến trình và memory ephemeral.
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  OnlineMissionRunRecord,
  OnlineHistoryPaginationQuery,
  OnlineHistoryPaginationResult
} from './mission-contract';

export interface IOnlineHistoryStorage {
  saveRunRecord(record: OnlineMissionRunRecord): Promise<boolean>;
  getRunRecord(ownerId: string, runId: string): Promise<OnlineMissionRunRecord | null>;
  listRuns(ownerId: string, query: OnlineHistoryPaginationQuery): Promise<OnlineHistoryPaginationResult>;
}

/**
 * File-based Persistent Storage cho môi trường Serverless / Local Netlify Function
 * Dữ liệu được lưu trữ phân vùng theo ownerId thành từng file JSON riêng biệt.
 */
export class FileBasedOnlineHistoryStorage implements IOnlineHistoryStorage {
  private baseDir: string;
  private simulateFailure = false;

  constructor(customBaseDir?: string) {
    this.baseDir = customBaseDir || path.resolve(process.cwd(), '.server_storage', 'online_history');
    if (!fs.existsSync(this.baseDir)) {
      try {
        fs.mkdirSync(this.baseDir, { recursive: true });
      } catch (e) {
        // thư mục sẽ được tạo khi ghi nếu cần
      }
    }
  }

  public setSimulateFailure(fail: boolean): void {
    this.simulateFailure = fail;
  }

  private getUserDir(ownerId: string): string {
    // Sanitize ownerId để tránh Path Traversal
    const safeOwnerId = ownerId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const userDir = path.join(this.baseDir, safeOwnerId);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    return userDir;
  }

  private getFilePath(ownerId: string, runId: string): string {
    const safeRunId = runId.replace(/[^a-zA-Z0-9_-]/g, '_');
    return path.join(this.getUserDir(ownerId), `${safeRunId}.json`);
  }

  async saveRunRecord(record: OnlineMissionRunRecord): Promise<boolean> {
    if (this.simulateFailure) return false;
    try {
      const filePath = this.getFilePath(record.ownerId, record.runId);
      const jsonStr = JSON.stringify(record, null, 2);
      fs.writeFileSync(filePath, jsonStr, 'utf-8');
      return true;
    } catch (e) {
      return false;
    }
  }

  async getRunRecord(ownerId: string, runId: string): Promise<OnlineMissionRunRecord | null> {
    try {
      const filePath = this.getFilePath(ownerId, runId);
      if (!fs.existsSync(filePath)) {
        return null;
      }
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  async listRuns(ownerId: string, query: OnlineHistoryPaginationQuery): Promise<OnlineHistoryPaginationResult> {
    const page = Math.max(1, query.page || 1);
    const pageSize = Math.max(1, Math.min(50, query.pageSize || 10));

    try {
      const userDir = this.getUserDir(ownerId);
      const files = fs.readdirSync(userDir).filter(f => f.endsWith('.json'));

      let records: OnlineMissionRunRecord[] = [];
      for (const file of files) {
        try {
          const content = fs.readFileSync(path.join(userDir, file), 'utf-8');
          const rec: OnlineMissionRunRecord = JSON.parse(content);
          if (query.status && rec.status !== query.status) {
            continue;
          }
          records.push(rec);
        } catch (e) {
          // Bỏ qua file lỗi cấu trúc
        }
      }

      // Sắp xếp lượt mới nhất lên trên: ưu tiên startTimeIso hoặc syncedAtIso
      records.sort((a, b) => {
        const timeA = new Date(a.startTimeIso || a.syncedAtIso).getTime();
        const timeB = new Date(b.startTimeIso || b.syncedAtIso).getTime();
        return timeB - timeA;
      });

      const totalCount = records.length;
      const totalPages = Math.ceil(totalCount / pageSize) || 1;
      const startIndex = (page - 1) * pageSize;
      const paginatedItems = records.slice(startIndex, startIndex + pageSize);

      return {
        items: paginatedItems,
        totalCount,
        page,
        pageSize,
        totalPages
      };
    } catch (e) {
      return {
        items: [],
        totalCount: 0,
        page: 1,
        pageSize,
        totalPages: 1
      };
    }
  }
}
