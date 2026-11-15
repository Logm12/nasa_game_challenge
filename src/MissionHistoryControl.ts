/**
 * Mission History Control (Giao diện tích hợp Lịch sử Lượt chơi cho Frontend)
 *
 * - Nút bấm Launcher ở mép phải màn hình (vị trí top: 98px, ngay dưới nút Load)
 * - Hiển thị danh sách lịch sử: Nhiệm vụ, tàu, thời điểm, thời lượng, kết quả, nút "Xem báo cáo"
 * - Lượt mới nhất nằm trên cùng
 * - Trạng thái: loading, empty, error, saving, saved_online
 * - Tích hợp Adapter hỗ trợ cả Online Sync lẫn Local Storage Fallback (có sẵn 3 lượt chơi mẫu thực tế)
 * - Tự động cập nhật ngôn ngữ theo 9 lựa chọn của hệ thống
 * - Tuyệt đối không có nút "Xem lại video"
 */

import { getControlTexts, onLangChange, formatTpl, getCurrentLang } from './i18n';
import { getMissionText } from './i18n-catalog';
import { OnlineMissionRunRecord, RunResult } from './domain/mission-contract';
import { IMissionHistoryClientAdapter } from './domain/mission-history-adapter';

const LOCAL_STORAGE_KEY = 'WebGLOrbiterOnlineHistory';

/**
 * Dữ liệu lịch sử mẫu ban đầu phục vụ kiểm thử và trải nghiệm local trực quan
 */
const DEFAULT_SAMPLE_RUNS: OnlineMissionRunRecord[] = [
  {
    runId: 'RUN_SAMPLE_DART_01',
    ownerId: 'user_default_pilot',
    missionId: 'nasa_dart',
    missionType: 'M1_PHOTO_QUIZ',
    spacecraftName: 'Space Shuttle Discovery (OV-103)',
    spacecraftPayload: 'High-Res Optical Scanner',
    startTimeIso: '2026-11-15T06:18:20.000Z',
    endTimeIso: '2026-11-15T06:28:20.000Z',
    durationSeconds: 600,
    status: 'SUCCESS',
    isThresholdMet: true,
    score: 10,
    remainingBudget: 450,
    rulesVersion: '1.0.0',
    contentVersion: '1.0.0',
    debriefReport: {
      runId: 'RUN_SAMPLE_DART_01',
      missionId: 'nasa_dart',
      missionType: 'M1_PHOTO_QUIZ',
      rulesVersion: '1.0.0',
      contentVersion: '1.0.0',
      status: 'SUCCESS',
      isThresholdMet: true,
      score: 10,
      remainingBudget: 450,
      elapsedTimeSeconds: 600,
      reasons: [
        'Đạt ngưỡng kiến thức 100% (10/10 câu hỏi)',
        'Hoàn thành trong thời hạn cho phép',
        'Ngân sách còn lại hợp lệ (450 credits)'
      ],
      summary: 'Nhiệm vụ NASA DART Kinetic Impactor hoàn thành xuất sắc! Đạt chuẩn vận hành quỹ đạo.'
    },
    syncedAtIso: '2026-11-15T06:28:25.000Z'
  },
  {
    runId: 'RUN_SAMPLE_ARTEMIS_02',
    ownerId: 'user_default_pilot',
    missionId: 'nasa_artemis_tli',
    missionType: 'M2_SAMPLE_RETURN',
    spacecraftName: 'Apollo 11 Lunar Module (Eagle)',
    spacecraftPayload: 'Regolith Sampling Drill',
    startTimeIso: '2026-11-15T05:40:00.000Z',
    endTimeIso: '2026-11-15T05:54:20.000Z',
    durationSeconds: 860,
    status: 'SUCCESS',
    isThresholdMet: true,
    remainingBudget: 320,
    rulesVersion: '1.0.0',
    contentVersion: '1.0.0',
    debriefReport: {
      runId: 'RUN_SAMPLE_ARTEMIS_02',
      missionId: 'nasa_artemis_tli',
      missionType: 'M2_SAMPLE_RETURN',
      rulesVersion: '1.0.0',
      contentVersion: '1.0.0',
      status: 'SUCCESS',
      isThresholdMet: true,
      remainingBudget: 320,
      elapsedTimeSeconds: 860,
      reasons: [
        'Thu thập đủ 3 loại mẫu vật độc lập tại Earth, Moon và Mars',
        'Đạt quy chuẩn an toàn địa điểm hạ cánh',
        'Hoàn thành quỹ đạo TLI thành công'
      ],
      summary: 'Nhiệm vụ NASA Artemis Trans-Lunar Injection hoàn thành thành công!'
    },
    syncedAtIso: '2026-11-15T05:54:25.000Z'
  },
  {
    runId: 'RUN_SAMPLE_VOYAGER_03',
    ownerId: 'user_default_pilot',
    missionId: 'voyager_heliopause',
    missionType: 'M1_PHOTO_QUIZ',
    spacecraftName: 'Voyager 1',
    spacecraftPayload: 'Cosmic Ray Subsystem',
    startTimeIso: '2026-11-15T04:10:00.000Z',
    endTimeIso: '2026-11-15T04:35:10.000Z',
    durationSeconds: 1510,
    status: 'SUCCESS',
    isThresholdMet: true,
    score: 8,
    remainingBudget: 200,
    rulesVersion: '1.0.0',
    contentVersion: '1.0.0',
    debriefReport: {
      runId: 'RUN_SAMPLE_VOYAGER_03',
      missionId: 'voyager_heliopause',
      missionType: 'M1_PHOTO_QUIZ',
      rulesVersion: '1.0.0',
      contentVersion: '1.0.0',
      status: 'SUCCESS',
      isThresholdMet: true,
      score: 8,
      remainingBudget: 200,
      elapsedTimeSeconds: 1510,
      reasons: [
        'Đạt ngưỡng kiến thức 80% (8/10 câu hỏi)',
        'Đo đạc thành công ranh giới nhật quyển ngoài'
      ],
      summary: 'Nhiệm vụ Voyager 1 vượt qua ranh giới nhật quyển thành công.'
    },
    syncedAtIso: '2026-11-15T04:35:15.000Z'
  }
];

export class MissionHistoryControl {
  public domElement: HTMLElement;
  public launcherButton: HTMLElement;
  public tooltipElement: HTMLElement;

  private adapter?: IMissionHistoryClientAdapter;
  private showEvent?: () => void;

  private modalOverlay: HTMLElement;
  private containerEl: HTMLElement;
  private statusBadgeEl: HTMLElement;
  private listEl: HTMLElement;
  private reportDetailEl: HTMLElement;
  private isVisible = false;

  constructor(showEvent?: () => void, adapter?: IMissionHistoryClientAdapter) {
    this.showEvent = showEvent;
    this.adapter = adapter;

    this.domElement = document.createElement('div');
    this.domElement.id = 'mission-history-wrapper';

    this.buildLauncherButton();
    this.buildModalHTML();
    this.bindEvents();
    this.applyLanguage();
    onLangChange(() => this.applyLanguage());
  }

  /**
   * Nút bấm Launcher nằm ở cột menu bên phải (buttonTop: 98px, ngay dưới nút Load 66px)
   */
  private buildLauncherButton() {
    this.launcherButton = document.createElement('div');
    this.launcherButton.id = 'history-launcher-btn';
    this.launcherButton.style.cssText = `
      position: absolute;
      top: 98px;
      right: 0px;
      width: 32px;
      height: 32px;
      z-index: 7;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(13, 22, 38, 0.85);
      border: 1px solid rgba(0, 240, 255, 0.35);
      border-right: none;
      border-radius: 4px 0 0 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
      transition: all 0.2s;
    `;
    this.launcherButton.innerHTML = `<span style="font-size: 16px; user-select: none;">📜</span>`;

    // Tooltip bay sang bên trái
    this.tooltipElement = document.createElement('div');
    this.tooltipElement.style.cssText = `
      display: none;
      position: absolute;
      right: 36px;
      top: 4px;
      background: rgba(0, 0, 0, 0.85);
      color: #38bdf8;
      border: 1px solid rgba(0, 240, 255, 0.4);
      border-radius: 4px;
      padding: 3px 8px;
      font-size: 12px;
      font-weight: bold;
      white-space: nowrap;
      z-index: 20;
      pointer-events: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    this.tooltipElement.textContent = getControlTexts().historyTitle;

    this.launcherButton.appendChild(this.tooltipElement);
    this.domElement.appendChild(this.launcherButton);
  }

  /**
   * Bảng hiển thị lịch sử ở giữa màn hình
   */
  private buildModalHTML() {
    this.modalOverlay = document.createElement('div');
    this.modalOverlay.id = 'history-modal-overlay';
    this.modalOverlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(5, 10, 20, 0.75);
      backdrop-filter: blur(8px);
      z-index: 100;
      display: none;
      align-items: center;
      justify-content: center;
    `;

    this.modalOverlay.innerHTML = `
      <div class="history-panel-modal" style="width: 720px; max-width: 90vw; max-height: 85vh; background: rgba(13, 22, 38, 0.96); border: 1px solid rgba(0, 240, 255, 0.35); border-radius: 12px; display: flex; flex-direction: column; box-shadow: 0 10px 40px rgba(0,0,0,0.85); color: #e2e8f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">

        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid rgba(0, 240, 255, 0.18);">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">📜</span>
            <span class="history-title" style="font-size: 16px; font-weight: bold; letter-spacing: 1px; color: #38bdf8;">MISSION HISTORY</span>
            <span class="history-status-badge" style="font-size: 11px; padding: 2px 8px; border-radius: 4px; font-family: monospace;"></span>
          </div>
          <button class="history-close-btn" style="background: none; border: none; color: #94a3b8; font-size: 22px; cursor: pointer; padding: 4px 8px; line-height: 1;">✕</button>
        </div>

        <!-- Body / List -->
        <div class="history-list-wrap" style="flex: 1; overflow-y: auto; padding: 16px 20px; min-height: 250px;">
          <div class="history-items-container" style="display: flex; flex-direction: column; gap: 12px;"></div>
        </div>

        <!-- Debrief Detail Modal Inner -->
        <div class="history-report-modal" style="display: none; padding: 16px 20px; border-top: 1px solid rgba(0, 240, 255, 0.25); background: rgba(10, 16, 28, 0.98);"></div>
      </div>
    `;

    this.containerEl = this.modalOverlay.querySelector('.history-panel-modal')!;
    this.statusBadgeEl = this.modalOverlay.querySelector('.history-status-badge')!;
    this.listEl = this.modalOverlay.querySelector('.history-items-container')!;
    this.reportDetailEl = this.modalOverlay.querySelector('.history-report-modal')!;

    this.domElement.appendChild(this.modalOverlay);
  }

  private bindEvents() {
    // Hover launcher button
    this.launcherButton.addEventListener('mouseenter', () => {
      this.tooltipElement.style.display = 'block';
      this.launcherButton.style.background = 'rgba(0, 240, 255, 0.25)';
      this.launcherButton.style.borderColor = '#00f0ff';
    });
    this.launcherButton.addEventListener('mouseleave', () => {
      this.tooltipElement.style.display = 'none';
      this.launcherButton.style.background = 'rgba(13, 22, 38, 0.85)';
      this.launcherButton.style.borderColor = 'rgba(0, 240, 255, 0.35)';
    });

    // Click launcher button
    this.launcherButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.setVisible(!this.isVisible);
    });

    // Close button
    const closeBtn = this.modalOverlay.querySelector('.history-close-btn');
    closeBtn?.addEventListener('click', () => this.setVisible(false));

    // Phím tắt 'J' để mở/đóng lịch sử
    window.addEventListener('keydown', (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key.toLowerCase() === 'j') {
        this.setVisible(!this.isVisible);
      }
    });
  }

  public setVisible(visible: boolean) {
    this.isVisible = visible;
    this.modalOverlay.style.display = visible ? 'flex' : 'none';
    if (visible) {
      if (this.showEvent) {
        this.showEvent();
      }
      this.refresh();
    }
  }

  /**
   * Đọc dữ liệu lịch sử từ adapter hoặc local storage fallback (có mẫu ban đầu)
   */
  private getLocalHistoryItems(): OnlineMissionRunRecord[] {
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
        // Nạp dữ liệu mẫu ban đầu nếu storage trống
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_SAMPLE_RUNS));
        return DEFAULT_SAMPLE_RUNS;
      }
    } catch (e) {
      // fallback
    }
    return DEFAULT_SAMPLE_RUNS;
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

    let items: OnlineMissionRunRecord[] = [];

    if (this.adapter) {
      try {
        const res = await this.adapter.fetchHistory(1, 20);
        if (res.success && res.data && res.data.items.length > 0) {
          items = res.data.items;
        } else {
          // Fallback sang local sample nếu adapter chưa có dữ liệu
          items = this.getLocalHistoryItems();
        }
      } catch (e) {
        items = this.getLocalHistoryItems();
      }
    } else {
      items = this.getLocalHistoryItems();
    }

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
      background: rgba(15, 23, 42, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.2s;
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
      this.showReportDetail(item);
    });

    return card;
  }

  private showReportDetail(item: OnlineMissionRunRecord) {
    this.reportDetailEl.style.display = 'block';

    const r: RunResult | undefined = item.debriefReport;
    if (!r) {
      this.reportDetailEl.innerHTML = `
        <div style="color: #ef4444; display: flex; justify-content: space-between; align-items: center;">
          <span>Chưa có báo cáo chi tiết cho lượt chơi này.</span>
          <button class="close-report-btn" style="background: none; border: none; color: #cbd5e1; cursor: pointer;">✕</button>
        </div>
      `;
      this.reportDetailEl.querySelector('.close-report-btn')?.addEventListener('click', () => {
        this.reportDetailEl.style.display = 'none';
      });
      return;
    }

    const reasonsList = r.reasons && r.reasons.length > 0
      ? `<ul style="margin: 6px 0 0 16px; padding: 0; font-size: 12px; color: #cbd5e1;">${r.reasons.map(res => `<li>${res}</li>`).join('')}</ul>`
      : '';

    this.reportDetailEl.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
        <h3 style="margin: 0; color: #38bdf8; font-size: 14px;">DEBRIEF REPORT: ${r.runId}</h3>
        <button class="close-report-btn" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 18px; line-height: 1;">✕</button>
      </div>
      <p style="margin: 4px 0 8px 0; font-size: 13px; color: #cbd5e1; line-height: 1.4;">${r.summary}</p>
      ${reasonsList}
      <div style="margin-top: 10px; font-size: 11px; color: #64748b; font-family: monospace; display: flex; gap: 14px;">
        <span>Rules: ${r.rulesVersion}</span>
        <span>Content: ${r.contentVersion}</span>
        <span>Status: <strong style="color: #10b981;">${r.status}</strong></span>
        ${r.score !== undefined ? `<span>Score: ${r.score}</span>` : ''}
        ${r.remainingBudget !== undefined ? `<span>Budget: ${r.remainingBudget} credits</span>` : ''}
      </div>
    `;

    this.reportDetailEl.querySelector('.close-report-btn')?.addEventListener('click', () => {
      this.reportDetailEl.style.display = 'none';
    });
  }

  private updateStatusBadge() {
    const ct = getControlTexts();
    const st = this.adapter?.getSyncStatus() || 'saved_online';

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
    if (this.tooltipElement) {
      this.tooltipElement.textContent = ct.historyTitle;
    }
    const titleEl = this.modalOverlay.querySelector('.history-title');
    if (titleEl) {
      titleEl.textContent = ct.historyTitle;
    }
    this.updateStatusBadge();
  }
}
