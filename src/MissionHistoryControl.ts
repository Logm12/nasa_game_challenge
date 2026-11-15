/**
 * Mission History Control (Giao diện tích hợp Lịch sử Lượt chơi cho Frontend)
 *
 * - Nút bấm Launcher ở mép phải màn hình (vị trí top: 98px, ngay dưới nút Load)
 * - Hiển thị danh sách lịch sử: Nhiệm vụ, tàu, thời điểm, thời lượng, kết quả, nút "Xem báo cáo"
 * - Lượt mới nhất nằm trên cùng
 * - Trạng thái: loading, empty, error, saving, saved_online
 * - Tích hợp Adapter hỗ trợ cả Online Sync lẫn Local Storage Fallback (có sẵn 3 lượt chơi mẫu thực tế)
 * - Tự động đồng bộ lại toàn bộ ngôn ngữ của History khi chuyển sang các ngôn ngữ khác nhau trong 9 ngôn ngữ
 * - Tuyệt đối không có nút "Xem lại video"
 */

import {
  getControlTexts,
  onLangChange,
  getCurrentLang,
  SupportedLang,
  LANG_BCP47
} from './i18n';
import { getMissionText } from './i18n-catalog';
import { OnlineMissionRunRecord, RunResult } from './domain/mission-contract';
import { IMissionHistoryClientAdapter } from './domain/mission-history-adapter';

const LOCAL_STORAGE_KEY = 'WebGLOrbiterOnlineHistory';

/**
 * Nhãn giao diện cho Debrief Report theo 9 ngôn ngữ
 */
interface DebriefI18nLabels {
  noReport: string;
  rulesLabel: string;
  contentLabel: string;
  statusLabel: string;
  scoreLabel: string;
  budgetLabel: string;
  creditsUnit: string;
}

const DEBRIEF_LABELS: Record<SupportedLang, DebriefI18nLabels> = {
  en_us: {
    noReport: 'No detailed debrief report available for this mission run.',
    rulesLabel: 'Rules',
    contentLabel: 'Content',
    statusLabel: 'Status',
    scoreLabel: 'Score',
    budgetLabel: 'Budget',
    creditsUnit: 'credits'
  },
  vi: {
    noReport: 'Chưa có báo cáo chi tiết cho lượt chơi này.',
    rulesLabel: 'Quy tắc',
    contentLabel: 'Nội dung',
    statusLabel: 'Trạng thái',
    scoreLabel: 'Điểm',
    budgetLabel: 'Ngân sách',
    creditsUnit: 'tín dụng'
  },
  en_uk: {
    noReport: 'No detailed debrief report available for this mission run.',
    rulesLabel: 'Rules',
    contentLabel: 'Content',
    statusLabel: 'Status',
    scoreLabel: 'Score',
    budgetLabel: 'Budget',
    creditsUnit: 'credits'
  },
  ja: {
    noReport: 'このミッション実行の詳細レポートはありません。',
    rulesLabel: 'ルール',
    contentLabel: 'コンテンツ',
    statusLabel: 'ステータス',
    scoreLabel: 'スコア',
    budgetLabel: '予算',
    creditsUnit: 'クレジット'
  },
  ko: {
    noReport: '이 미션 실행에 대한 세부 보고서가 없습니다.',
    rulesLabel: '규칙',
    contentLabel: '콘텐츠',
    statusLabel: '상태',
    scoreLabel: '점수',
    budgetLabel: '예산',
    creditsUnit: '크레딧'
  },
  fr: {
    noReport: 'Aucun rapport détaillé disponible pour cette mission.',
    rulesLabel: 'Règles',
    contentLabel: 'Contenu',
    statusLabel: 'Statut',
    scoreLabel: 'Score',
    budgetLabel: 'Budget',
    creditsUnit: 'crédits'
  },
  de: {
    noReport: 'Kein detaillierter Nachbesprechungsbericht für diesen Missionsdurchlauf verfügbar.',
    rulesLabel: 'Regeln',
    contentLabel: 'Inhalt',
    statusLabel: 'Status',
    scoreLabel: 'Punktzahl',
    budgetLabel: 'Budget',
    creditsUnit: 'Credits'
  },
  it: {
    noReport: 'Nessun report dettagliato disponibile per questa missione.',
    rulesLabel: 'Regole',
    contentLabel: 'Contenuto',
    statusLabel: 'Stato',
    scoreLabel: 'Punteggio',
    budgetLabel: 'Budget',
    creditsUnit: 'crediti'
  },
  es: {
    noReport: 'No hay informe detallado disponible para esta misión.',
    rulesLabel: 'Reglas',
    contentLabel: 'Contenido',
    statusLabel: 'Estado',
    scoreLabel: 'Puntuación',
    budgetLabel: 'Presupuesto',
    creditsUnit: 'créditos'
  }
};

/**
 * Bản dịch debrief mẫu ban đầu theo 9 ngôn ngữ
 */
interface SampleRunLocalizedDebrief {
  summary: string;
  reasons: string[];
}

const SAMPLE_DEBRIEF_I18N: Record<string, Record<SupportedLang, SampleRunLocalizedDebrief>> = {
  RUN_SAMPLE_DART_01: {
    en_us: {
      summary: 'NASA DART Kinetic Impactor mission completed with distinction! Met orbital operational criteria.',
      reasons: ['Knowledge quiz threshold 100% (10/10 questions)', 'Completed within designated mission duration', 'Remaining budget valid (450 credits)']
    },
    en_uk: {
      summary: 'NASA DART Kinetic Impactor mission completed with distinction! Met orbital operational criteria.',
      reasons: ['Knowledge quiz threshold 100% (10/10 questions)', 'Completed within designated mission duration', 'Remaining budget valid (450 credits)']
    },
    vi: {
      summary: 'Nhiệm vụ NASA DART Kinetic Impactor hoàn thành xuất sắc! Đạt chuẩn vận hành quỹ đạo.',
      reasons: ['Đạt ngưỡng kiến thức 100% (10/10 câu hỏi)', 'Hoàn thành trong thời hạn cho phép', 'Ngân sách còn lại hợp lệ (450 credits)']
    },
    ja: {
      summary: 'NASA DART キネティック・インパクターミッションを優秀な成績で完了！軌道運用基準を達成しました。',
      reasons: ['知識クイズ基準 100% (10/10問正解)', '指定ミッション制限時間内に完了', '残存予算が有効 (450 クレジット)']
    },
    ko: {
      summary: 'NASA DART 키네틱 임팩터 미션을 훌륭하게 완수했습니다! 궤도 운영 기준을 달성했습니다.',
      reasons: ['지식 퀴즈 기준 100% 달성 (10/10 문제)', '지정된 미션 제한 시간 내 완료', '유효한 잔여 예산 (450 크레딧)']
    },
    fr: {
      summary: 'Mission NASA DART Kinetic Impactor accomplie avec succès ! Critères opérationnels orbitaux atteints.',
      reasons: ['Seuil de connaissances à 100% (10/10 questions)', 'Terminé dans le délai imparti', 'Budget restant valide (450 crédits)']
    },
    de: {
      summary: 'NASA DART Kinetic Impactor Mission mit Auszeichnung abgeschlossen! Orbitale Betriebskriterien erfüllt.',
      reasons: ['Wissensquiz-Schwelle 100% (10/10 Fragen)', 'Innerhalb des Zeitlimits abgeschlossen', 'Gültiges Restbudget (450 Credits)']
    },
    it: {
      summary: 'Missione NASA DART Kinetic Impactor completata con successo! Criteri operativi orbitali soddisfatti.',
      reasons: ['Soglia quiz di conoscenza al 100% (10/10 domande)', 'Completata entro la durata prevista', 'Budget residuo valido (450 crediti)']
    },
    es: {
      summary: '¡Misión NASA DART Kinetic Impactor completada con distinción! Criterios operativos orbitales cumplidos.',
      reasons: ['Umbral de conocimientos del 100% (10/10 preguntas)', 'Completado dentro del tiempo previsto', 'Presupuesto restante válido (450 créditos)']
    }
  },
  RUN_SAMPLE_ARTEMIS_02: {
    en_us: {
      summary: 'NASA Artemis Trans-Lunar Injection mission completed successfully!',
      reasons: ['Collected 3 distinct sample types at Earth, Moon, and Mars', 'Met landing site safety criteria', 'Trans-Lunar Injection trajectory achieved']
    },
    en_uk: {
      summary: 'NASA Artemis Trans-Lunar Injection mission completed successfully!',
      reasons: ['Collected 3 distinct sample types at Earth, Moon, and Mars', 'Met landing site safety criteria', 'Trans-Lunar Injection trajectory achieved']
    },
    vi: {
      summary: 'Nhiệm vụ NASA Artemis Trans-Lunar Injection hoàn thành thành công!',
      reasons: ['Thu thập đủ 3 loại mẫu vật độc lập tại Earth, Moon và Mars', 'Đạt quy chuẩn an toàn địa điểm hạ cánh', 'Hoàn thành quỹ đạo TLI thành công']
    },
    ja: {
      summary: 'NASA アルテミス月遷移軌道投入（TLI）ミッションに成功しました！',
      reasons: ['地球・月・火星で3種類の独立したサンプルを採取', '着陸地点の安全基準をクリア', 'TLI軌道投入を成功裏に完了']
    },
    ko: {
      summary: 'NASA 아르테미스 달 전이 궤도(TLI) 미션을 성공적으로 완료했습니다!',
      reasons: ['지구, 달, 화성에서 3가지 고유 샘플 채취', '착륙 지점 안전 기준 충족', 'TLI 궤도 진입 성공']
    },
    fr: {
      summary: 'Mission NASA Artemis Trans-Lunar Injection réussie avec succès !',
      reasons: ['3 types d\'échantillons distincts collectés sur Terre, la Lune et Mars', 'Critères de sécurité du site d\'atterrissage validés', 'Trajectoire TLI accomplie']
    },
    de: {
      summary: 'NASA Artemis Trans-Lunar Injection Mission erfolgreich abgeschlossen!',
      reasons: ['3 verschiedene Probentypen von Erde, Mond und Mars gesammelt', 'Sicherheitskriterien des Landeplatzes erfüllt', 'TLI-Bahn erfolgreich erreicht']
    },
    it: {
      summary: 'Missione NASA Artemis Trans-Lunar Injection completata con successo!',
      reasons: ['Raccolti 3 diversi tipi di campioni su Terra, Luna e Marte', 'Criteri di sicurezza del sito di atterraggio superati', 'Traiettoria TLI completata con successo']
    },
    es: {
      summary: '¡Misión NASA Artemis Trans-Lunar Injection completada con éxito!',
      reasons: ['Recogidos 3 tipos de muestras distintas en la Tierra, la Luna y Marte', 'Cumplidos los criterios de seguridad del sitio de aterrizaje', 'Trayectoria TLI completada con éxito']
    }
  },
  RUN_SAMPLE_VOYAGER_03: {
    en_us: {
      summary: 'Voyager 1 heliopause crossing mission completed successfully.',
      reasons: ['Knowledge quiz threshold 80% (8/10 questions)', 'Outer heliosphere boundary successfully mapped']
    },
    en_uk: {
      summary: 'Voyager 1 heliopause crossing mission completed successfully.',
      reasons: ['Knowledge quiz threshold 80% (8/10 questions)', 'Outer heliosphere boundary successfully mapped']
    },
    vi: {
      summary: 'Nhiệm vụ Voyager 1 vượt qua ranh giới nhật quyển thành công.',
      reasons: ['Đạt ngưỡng kiến thức 80% (8/10 câu hỏi)', 'Đo đạc thành công ranh giới nhật quyển ngoài']
    },
    ja: {
      summary: 'ボイジャー1号のヘリオポーズ通過ミッションに成功しました。',
      reasons: ['知識クイズ基準 80% (8/10問正解)', '太陽圏境界面の観測に成功']
    },
    ko: {
      summary: '보이저 1호 헬리오포즈 통과 미션을 성공적으로 완수했습니다.',
      reasons: ['지식 퀴즈 기준 80% 달성 (8/10 문제)', '태양권 경계 영역 관측 성공']
    },
    fr: {
      summary: 'Mission de franchissement de l\'héliopause par Voyager 1 réussie.',
      reasons: ['Seuil de connaissances à 80% (8/10 questions)', 'Cartographie réussie de la frontière de l\'héliosphère']
    },
    de: {
      summary: 'Voyager 1 Heliopause-Überquerungsmission erfolgreich abgeschlossen.',
      reasons: ['Wissensquiz-Schwelle 80% (8/10 Fragen)', 'Äußere Grenze der Heliosphäre erfolgreich kartiert']
    },
    it: {
      summary: 'Missione di attraversamento dell\'eliopausa di Voyager 1 completata con successo.',
      reasons: ['Soglia quiz di conoscenza all\'80% (8/10 domande)', 'Mappatura riuscita del confine esterno dell\'eliosfera']
    },
    es: {
      summary: 'Misión de cruce de la heliopausa de la Voyager 1 completada con éxito.',
      reasons: ['Umbral de conocimientos del 80% (8/10 preguntas)', 'Frontera de la heliosfera exterior cartografiada con éxito']
    }
  }
};

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

  private cachedItems: OnlineMissionRunRecord[] = [];
  private activeDetailItem?: OnlineMissionRunRecord;
  private lastRenderedLang?: SupportedLang;
  private isListEmpty = false;

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

    this.cachedItems = items;
    this.lastRenderedLang = getCurrentLang();
    this.renderList(this.cachedItems);
  }

  private renderList(items: OnlineMissionRunRecord[]) {
    if (items.length === 0) {
      this.isListEmpty = true;
      this.renderEmptyState();
      return;
    }

    this.isListEmpty = false;
    // Render danh sách: Lượt mới nhất nằm trên
    this.listEl.innerHTML = '';
    items.forEach((item) => {
      const card = this.renderItemCard(item);
      this.listEl.appendChild(card);
    });
  }

  private renderEmptyState() {
    const ct = getControlTexts();
    this.listEl.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #64748b;">
        <span>🛸</span> <p>${ct.historyEmpty}</p>
      </div>
    `;
  }

  private renderItemCard(item: OnlineMissionRunRecord): HTMLElement {
    const currentLang = getCurrentLang();
    const ct = getControlTexts(currentLang);
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
    const bcpLocale = LANG_BCP47[currentLang] || 'en-US';
    const formattedDate = new Date(item.startTimeIso).toLocaleString(bcpLocale);

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
      this.activeDetailItem = item;
      this.showReportDetail(item);
    });

    return card;
  }

  private showReportDetail(item: OnlineMissionRunRecord) {
    this.reportDetailEl.style.display = 'block';
    this.activeDetailItem = item;

    const currentLang = getCurrentLang();
    const labels = DEBRIEF_LABELS[currentLang] || DEBRIEF_LABELS.en_us;

    const r: RunResult | undefined = item.debriefReport;
    if (!r) {
      this.reportDetailEl.innerHTML = `
        <div style="color: #ef4444; display: flex; justify-content: space-between; align-items: center;">
          <span>${labels.noReport}</span>
          <button class="close-report-btn" style="background: none; border: none; color: #cbd5e1; cursor: pointer;">✕</button>
        </div>
      `;
      this.reportDetailEl.querySelector('.close-report-btn')?.addEventListener('click', () => {
        this.reportDetailEl.style.display = 'none';
        this.activeDetailItem = undefined;
      });
      return;
    }

    // Bản địa hóa summary & reasons cho sample runs nếu có
    const localizedSample = SAMPLE_DEBRIEF_I18N[item.runId]?.[currentLang];
    const displaySummary = localizedSample ? localizedSample.summary : r.summary;
    const displayReasons = localizedSample ? localizedSample.reasons : r.reasons;

    const reasonsList = displayReasons && displayReasons.length > 0
      ? `<ul style="margin: 6px 0 0 16px; padding: 0; font-size: 12px; color: #cbd5e1;">${displayReasons.map(res => `<li>${res}</li>`).join('')}</ul>`
      : '';

    this.reportDetailEl.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
        <h3 style="margin: 0; color: #38bdf8; font-size: 14px;">DEBRIEF REPORT: ${r.runId}</h3>
        <button class="close-report-btn" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 18px; line-height: 1;">✕</button>
      </div>
      <p style="margin: 4px 0 8px 0; font-size: 13px; color: #cbd5e1; line-height: 1.4;">${displaySummary}</p>
      ${reasonsList}
      <div style="margin-top: 10px; font-size: 11px; color: #64748b; font-family: monospace; display: flex; gap: 14px;">
        <span>${labels.rulesLabel}: ${r.rulesVersion}</span>
        <span>${labels.contentLabel}: ${r.contentVersion}</span>
        <span>${labels.statusLabel}: <strong style="color: #10b981;">${r.status}</strong></span>
        ${r.score !== undefined ? `<span>${labels.scoreLabel}: ${r.score}</span>` : ''}
        ${r.remainingBudget !== undefined ? `<span>${labels.budgetLabel}: ${r.remainingBudget} ${labels.creditsUnit}</span>` : ''}
      </div>
    `;

    this.reportDetailEl.querySelector('.close-report-btn')?.addEventListener('click', () => {
      this.reportDetailEl.style.display = 'none';
      this.activeDetailItem = undefined;
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

  /**
   * Đồng bộ lại toàn bộ ngôn ngữ của History UI khi chuyển đổi ngôn ngữ
   */
  public applyLanguage() {
    const currentLang = getCurrentLang();
    const isLangChanged = this.lastRenderedLang !== currentLang;
    this.lastRenderedLang = currentLang;

    const ct = getControlTexts(currentLang);
    if (this.tooltipElement) {
      this.tooltipElement.textContent = ct.historyTitle;
    }
    const titleEl = this.modalOverlay.querySelector('.history-title');
    if (titleEl) {
      titleEl.textContent = ct.historyTitle;
    }
    this.updateStatusBadge();

    // Chỉ đồng bộ lại nội dung history khi chuyển sang các ngôn ngữ khác nhau
    if (isLangChanged) {
      if (this.cachedItems && this.cachedItems.length > 0) {
        this.renderList(this.cachedItems);
      } else if (this.isListEmpty) {
        this.renderEmptyState();
      }

      if (this.activeDetailItem && this.reportDetailEl.style.display !== 'none') {
        this.showReportDetail(this.activeDetailItem);
      }
    }
  }
}
