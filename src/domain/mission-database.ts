/**
 * Database Schema, Migrations & Local Repository Interface (TIP-005 / FIX-BE01, FIX-BE02, FIX-BE03)
 *
 * Thiết kế schema cơ sở dữ liệu và interface lưu trữ cho Mission Runs, Commands, Reports.
 * Tuân thủ hợp đồng tại src/domain/mission-contract.ts.
 *
 * FIX-BE01: Lưu trữ owner_session_id cùng bản ghi run và report.
 * FIX-BE02: Lưu tiến độ / snapshot đầy đủ sau mỗi command.
 * FIX-BE03: Hỗ trợ transaction / atomic updates trong bộ nhớ, kiểm tra kết quả lưu.
 */

import {
  MissionRunConfig,
  MissionProgress,
  MissionCommand,
  RunResult,
  ValidationError
} from './mission-contract';

export const SQL_SCHEMA_V1 = `
-- Migration 001_initial_mission_schema.sql

CREATE TABLE IF NOT EXISTS mission_runs (
    run_id VARCHAR(64) PRIMARY KEY,
    owner_session_id VARCHAR(128) NOT NULL,
    mission_id VARCHAR(64) NOT NULL,
    mission_type VARCHAR(32) NOT NULL,
    rules_version VARCHAR(32) NOT NULL,
    content_version VARCHAR(32) NOT NULL,
    revision INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL,
    initial_budget_credits DOUBLE PRECISION,
    remaining_budget_credits DOUBLE PRECISION,
    duration_limit_seconds DOUBLE PRECISION,
    elapsed_time_seconds DOUBLE PRECISION NOT NULL DEFAULT 0,
    progress_json TEXT NOT NULL,
    config_json TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mission_commands (
    command_id VARCHAR(64) PRIMARY KEY,
    run_id VARCHAR(64) NOT NULL REFERENCES mission_runs(run_id) ON DELETE CASCADE,
    expected_revision INTEGER,
    command_type VARCHAR(64) NOT NULL,
    payload_json TEXT NOT NULL,
    result_json TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mission_reports (
    run_id VARCHAR(64) PRIMARY KEY REFERENCES mission_runs(run_id) ON DELETE CASCADE,
    owner_session_id VARCHAR(128) NOT NULL,
    mission_id VARCHAR(64) NOT NULL,
    mission_type VARCHAR(32) NOT NULL,
    status VARCHAR(32) NOT NULL,
    is_threshold_met BOOLEAN NOT NULL,
    score DOUBLE PRECISION,
    remaining_budget DOUBLE PRECISION,
    elapsed_time_seconds DOUBLE PRECISION NOT NULL,
    reasons_json TEXT NOT NULL,
    summary TEXT NOT NULL,
    report_json TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_mission_runs_owner ON mission_runs(owner_session_id);
CREATE INDEX IF NOT EXISTS idx_mission_commands_run_id ON mission_commands(run_id);
`;

export interface StoredRunRecord {
  ownerSessionId: string;
  progress: MissionProgress;
  config: MissionRunConfig;
}

export interface StoredReportRecord {
  ownerSessionId: string;
  report: RunResult;
}

export interface IMissionStorageRepository {
  saveRun(ownerSessionId: string, progress: MissionProgress, config: MissionRunConfig): Promise<boolean>;
  getRun(runId: string): Promise<StoredRunRecord | null>;
  recordCommand(command: MissionCommand, result: { success: boolean; error?: ValidationError }): Promise<boolean>;
  getRecordedCommand(commandId: string): Promise<{ command: MissionCommand; result: { success: boolean; error?: ValidationError } } | null>;
  getRecordedCommandsForRun(runId: string): Promise<Array<{ command: MissionCommand; result: { success: boolean; error?: ValidationError } }>>;
  saveReport(ownerSessionId: string, report: RunResult): Promise<boolean>;
  getReport(runId: string): Promise<StoredReportRecord | null>;
  
  /**
   * Cập nhật nguyên tử tiến độ run và ghi vết command trong một bước (FIX-BE03)
   */
  atomicUpdateRunAndCommand(
    ownerSessionId: string,
    progress: MissionProgress,
    config: MissionRunConfig,
    command: MissionCommand,
    commandResult: { success: boolean; error?: ValidationError },
    finalReport?: RunResult
  ): Promise<boolean>;
}

/**
 * In-Memory Database Adapter phục vụ test và chạy cục bộ không cần driver ngoài
 */
export class InMemoryMissionStorageRepository implements IMissionStorageRepository {
  private runs = new Map<string, StoredRunRecord>();
  private commands = new Map<string, { command: MissionCommand; result: { success: boolean; error?: ValidationError } }>();
  private reports = new Map<string, StoredReportRecord>();
  private simulateFailure = false;

  public setSimulateFailure(fail: boolean): void {
    this.simulateFailure = fail;
  }

  async saveRun(ownerSessionId: string, progress: MissionProgress, config: MissionRunConfig): Promise<boolean> {
    if (this.simulateFailure) return false;
    this.runs.set(progress.runId, {
      ownerSessionId,
      progress: JSON.parse(JSON.stringify(progress)),
      config: JSON.parse(JSON.stringify(config))
    });
    return true;
  }

  async getRun(runId: string): Promise<StoredRunRecord | null> {
    const item = this.runs.get(runId);
    if (!item) return null;
    return JSON.parse(JSON.stringify(item));
  }

  async recordCommand(command: MissionCommand, result: { success: boolean; error?: ValidationError }): Promise<boolean> {
    if (this.simulateFailure) return false;
    this.commands.set(command.commandId, {
      command: JSON.parse(JSON.stringify(command)),
      result: JSON.parse(JSON.stringify(result))
    });
    return true;
  }

  async getRecordedCommand(commandId: string): Promise<{ command: MissionCommand; result: { success: boolean; error?: ValidationError } } | null> {
    const item = this.commands.get(commandId);
    if (!item) return null;
    return JSON.parse(JSON.stringify(item));
  }

  async getRecordedCommandsForRun(runId: string): Promise<Array<{ command: MissionCommand; result: { success: boolean; error?: ValidationError } }>> {
    const list: Array<{ command: MissionCommand; result: { success: boolean; error?: ValidationError } }> = [];
    for (const entry of this.commands.values()) {
      if (entry.command.runId === runId) {
        list.push(JSON.parse(JSON.stringify(entry)));
      }
    }
    // Sắp xếp theo timestamp nếu có
    list.sort((a, b) => (a.command.timestamp || 0) - (b.command.timestamp || 0));
    return list;
  }

  async saveReport(ownerSessionId: string, report: RunResult): Promise<boolean> {
    if (this.simulateFailure) return false;
    this.reports.set(report.runId, {
      ownerSessionId,
      report: JSON.parse(JSON.stringify(report))
    });
    return true;
  }

  async getReport(runId: string): Promise<StoredReportRecord | null> {
    const item = this.reports.get(runId);
    if (!item) return null;
    return JSON.parse(JSON.stringify(item));
  }

  async atomicUpdateRunAndCommand(
    ownerSessionId: string,
    progress: MissionProgress,
    config: MissionRunConfig,
    command: MissionCommand,
    commandResult: { success: boolean; error?: ValidationError },
    finalReport?: RunResult
  ): Promise<boolean> {
    if (this.simulateFailure) return false;

    // Snapshot hiện tại để rollback nếu có lỗi
    const prevRun = this.runs.get(progress.runId);
    const prevCommand = this.commands.get(command.commandId);
    const prevReport = this.reports.get(progress.runId);

    try {
      this.runs.set(progress.runId, {
        ownerSessionId,
        progress: JSON.parse(JSON.stringify(progress)),
        config: JSON.parse(JSON.stringify(config))
      });
      this.commands.set(command.commandId, {
        command: JSON.parse(JSON.stringify(command)),
        result: JSON.parse(JSON.stringify(commandResult))
      });
      if (finalReport) {
        this.reports.set(progress.runId, {
          ownerSessionId,
          report: JSON.parse(JSON.stringify(finalReport))
        });
      }
      return true;
    } catch (e) {
      // Rollback
      if (prevRun) this.runs.set(progress.runId, prevRun); else this.runs.delete(progress.runId);
      if (prevCommand) this.commands.set(command.commandId, prevCommand); else this.commands.delete(command.commandId);
      if (prevReport) this.reports.set(progress.runId, prevReport); else this.reports.delete(progress.runId);
      return false;
    }
  }

  public clear(): void {
    this.runs.clear();
    this.commands.clear();
    this.reports.clear();
  }
}
