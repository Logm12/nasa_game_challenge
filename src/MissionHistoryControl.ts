/**
 * Mission History Control (Giao diện tích hợp tối thiểu cho Frontend)
 *
 * Hiển thị danh sách lịch sử lượt chơi:
 * - Nhiệm vụ, tàu, thời điểm, thời lượng, kết quả, nút "Xem báo cáo"
 * - Lượt mới nhất nằm trên
 * - Các trạng thái: loading, empty, error, saving, saved_online
 * - Tuyệt đối không có nút "Xem lại video"
 * - Tự động cập nhật ngôn ngữ khi thay đổi trong Settings
 */

import { getControlTexts, onLangChange, formatTpl, getCurrentLang } from './i18n';
import { getMissionText } from './i18n-catalog';
import { OnlineMissionRunRecord, RunResult, OnlineSyncStatus } from './domain/mission-contract';
import { IMissionHistoryClientAdapter } from './domain/mission-history-adapter';

export class MissionHistoryControl {
  public domElement: HTMLElement;
  private adapter: IMissionHistoryClientAdapter;
  private containerEl: HTMLElement;
  private statusBadgeEl: HTMLElement;
  private listEl: HTMLElement;
  private modalEl: HTMLElement;
  private isVisible = false;

  constructor(adapter: IMissionHistoryClientAdapter) {
    this.adapter = adapter;
    this.domElement = document.createElement('div');
    this.domElement.id = 'mission-history-root';
    this.domElement.className = 'mission-history-root';
    this.domElement.style.display = 'none';

    this.buildHTML();
    this.bindEvents();
    this.applyLanguage();
    onLangChange(() => this.applyLanguage());
  }

  private buildHTML() {
    this.domElement.innerHTML = `
      <div class="history-panel-overlay" id="history-overlay" style="position: fixed; inset: 0; background: rgba(5, 10, 20, 0.75); backdrop-filter: blur(8px); z-index: 100; display: flex; align-items: center; justify-content: center;">
        <div class="history-panel-modal" style="width: 720px; max-width: 90vw; max-height: 85vh; background: rgba(13, 22, 38, 0.95); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 12px; display: flex; flex-direction: column; box-shadow: 0 10px 40px rgba(0,0,0,0.8); color: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid rgba(0, 240, 255, 0.15);">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 20px;">📜</span>
              <span class="history-title" style="font-size: 16px; font-weight: bold; letter-spacing: 1px; color: #38bdf8;">MISSION HISTORY</span>
              <span class="history-status-badge" style="font-size: 11px; padding: 2px 8px; border-radius: 4px; font-family: monospace;"></span>
            </div>
            <button class="history-close-btn" style="background: none; border: none; color: #94a3b8; font-size: 20px; cursor: pointer; padding: 4px 8px;">✕</button>
          </div>

          <!-- Body / List -->
          <div class="history-list-wrap" style="flex: 1; overflow-y: auto; padding: 16px 20px; min-height: 250px;">
            <div class="history-items-container" style="display: flex; flex-direction: column; gap: 12px;"></div>
          </div>

          <!-- Debrief Detail Modal Inner -->
          <div class="history-report-modal" style="display: none; padding: 16px 20px; border-top: 1px solid rgba(0, 240, 255, 0.2); background: rgba(10, 16, 28, 0.98);"></div>
        </div>
      </div>
    `;

    document.body.appendChild(this.domElement);

    this.containerEl = this.domElement.querySelector('.history-panel-modal')!;
    this.statusBadgeEl = this.domElement.querySelector('.history-status-badge')!;
    this.listEl = this.domElement.querySelector('.history-items-container')!;
    this.modalEl = this.domElement.querySelector('.history-report-modal')!;
  }

  private bindEvents() {
    const closeBtn = this.domElement.querySelector('.history-close-btn');
    closeBtn?.addEventListener('click', () => this.setVisible(false));
  }

  public setVisible(visible: boolean) {
    this.isVisible = visible;
    this.domElement.style.display = visible ? 'block' : 'none';
    if (visible) {
      this.refresh();
    }
  }

  public async refresh() {
    const ct = getControlTexts();
    this.updateStatusBadge();

    // Hiển thị trạng thái đang tải
    this.listEl.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #94a3b8;">
        <span>⏳</span> ${ct.historyLoading}
      </div>
    `;

    const res = await this.adapter.fetchHistory(1, 20);
    if (!res.success) {
      this.listEl.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #ef4444;">
          <p>⚠️ ${ct.historyError}: ${res.error?.message || ''}</p>
          <button class="retry-fetch-btn" style="margin-top: 10px; background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; color: #fca5a5; padding: 6px 16px; border-radius: 4px; cursor: pointer;">${ct.historyRetry}</button>
        </div>
      `;
      this.listEl.querySelector('.retry-fetch-btn')?.addEventListener('click', () => this.refresh());
      return;
    }

    const items = res.data?.items || [];
    if (items.length === 0) {
      this.listEl.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #64748b;">
          <span>🛸</span> <p>${ct.historyEmpty}</p>
        </div>
      `;
      return;
    }

    // Render danh sách: Lượt mới nhất nằm trên
    this.listEl.innerHTML = '';
    items.forEach((item) => {
      const card = this.renderItemCard(item);
      this.listEl.appendChild(card);
    });
  }

  private renderItemCard(item: OnlineMissionRunRecord): HTMLElement {
    const ct = getControlTexts();
    const currentLang = getCurrentLang();
    const locMission = getMissionText(item.missionId, currentLang);
    const missionTitle = locMission ? locMission.title : item.missionId;

    let statusColor = '#38bdf8';
    let statusText = item.status;
    if (item.status === 'SUCCESS') {
      statusColor = '#10b981';
      statusText = 'SUCCESS';
    } else if (item.status === 'FAILURE') {
      statusColor = '#ef4444';
      statusText = 'FAILURE';
    } else if (item.status === 'UNRESOLVED') {
      statusColor = '#f59e0b';
      statusText = 'UNRESOLVED';
    }

    const minutes = Math.floor(item.durationSeconds / 60);
    const seconds = Math.floor(item.durationSeconds % 60);
    const durationStr = `${minutes}m ${seconds}s`;
    const formattedDate = new Date(item.startTimeIso).toLocaleString();

    const card = document.createElement('div');
    card.style.cssText = `
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: border-color 0.2s;
    `;

    card.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-weight: 600; color: #f8fafc; font-size: 14px;">${missionTitle}</span>
          <span style="font-size: 11px; padding: 1px 6px; border-radius: 4px; background: ${statusColor}22; color: ${statusColor}; border: 1px solid ${statusColor}55; font-weight: bold;">${statusText}</span>
        </div>
        <div style="display: flex; gap: 14px; font-size: 12px; color: #94a3b8; font-family: monospace;">
          <span>🚀 ${item.spacecraftName}</span>
          <span>⏱ ${durationStr}</span>
          <span>📅 ${formattedDate}</span>
        </div>
      </div>
      <div>
        <button class="view-report-btn" data-runid="${item.runId}" style="background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.4); color: #38bdf8; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s;">
          ${ct.historyViewReport}
        </button>
      </div>
    `;

    card.querySelector('.view-report-btn')?.addEventListener('click', () => {
      this.showReportDetail(item.runId);
    });

    return card;
  }

  private async showReportDetail(runId: string) {
    this.modalEl.style.display = 'block';
    this.modalEl.innerHTML = `<div style="text-align: center; color: #94a3b8;">Đang tải chi tiết báo cáo...</div>`;

    const res = await this.adapter.fetchReport(runId);
    if (!res.success || !res.data) {
      this.modalEl.innerHTML = `
        <div style="color: #ef4444; display: flex; justify-content: space-between; align-items: center;">
          <span>Không thể tải báo cáo: ${res.error?.message || ''}</span>
          <button class="close-report-btn" style="background: none; border: none; color: #cbd5e1; cursor: pointer;">✕</button>
        </div>
      `;
      this.modalEl.querySelector('.close-report-btn')?.addEventListener('click', () => {
        this.modalEl.style.display = 'none';
      });
      return;
    }

    const r = res.data;
    this.modalEl.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
        <h3 style="margin: 0; color: #38bdf8; font-size: 14px;">DEBRIEF REPORT: ${r.runId}</h3>
        <button class="close-report-btn" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 16px;">✕</button>
      </div>
      <p style="margin: 4px 0 8px 0; font-size: 13px; color: #cbd5e1;">${r.summary}</p>
      <div style="font-size: 11px; color: #64748b; font-family: monospace; display: flex; gap: 12px;">
        <span>Rules: ${r.rulesVersion}</span>
        <span>Content: ${r.contentVersion}</span>
        <span>Status: ${r.status}</span>
        ${r.score !== undefined ? `<span>Score: ${r.score}</span>` : ''}
      </div>
    `;

    this.modalEl.querySelector('.close-report-btn')?.addEventListener('click', () => {
      this.modalEl.style.display = 'none';
    });
  }

  private updateStatusBadge() {
    const ct = getControlTexts();
    const st = this.adapter.getSyncStatus();

    if (st === 'saving') {
      this.statusBadgeEl.textContent = ct.historySaving;
      this.statusBadgeEl.style.cssText = 'background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid #38bdf8;';
    } else if (st === 'saved_online') {
      this.statusBadgeEl.textContent = ct.historySavedOnline;
      this.statusBadgeEl.style.cssText = 'background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid #10b981;';
    } else if (st === 'error') {
      this.statusBadgeEl.textContent = ct.historySaveFailed;
      this.statusBadgeEl.style.cssText = 'background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid #ef4444;';
    } else {
      this.statusBadgeEl.textContent = '';
      this.statusBadgeEl.style.cssText = '';
    }
  }

  public applyLanguage() {
    const ct = getControlTexts();
    const titleEl = this.domElement.querySelector('.history-title');
    if (titleEl) titleEl.textContent = ct.historyTitle;
    this.updateStatusBadge();
  }
}
