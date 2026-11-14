/**
 * Official NASA DART Sources Registry (FE14)
 * Provides verified links to official NASA mission documentation and studies.
 */

import { SupportedLang, getTexts } from './i18n';

export interface DartSourceReference {
  id: string;
  url: string;
  labelKey: string;
  dateStr: string;
}

export const DART_OFFICIAL_SOURCES: DartSourceReference[] = [
  {
    id: 'dart_overview',
    url: 'https://science.nasa.gov/mission/dart/',
    labelKey: 'dartSourceOverview',
    dateStr: 'NASA Science'
  },
  {
    id: 'dart_results_2022',
    url: 'https://www.nasa.gov/news-release/nasa-confirms-dart-mission-impact-changed-asteroids-motion-in-space/',
    labelKey: 'dartSourceResults2022',
    dateStr: '11/10/2022'
  },
  {
    id: 'dart_study_2024',
    url: 'https://www.nasa.gov/missions/dart/nasa-study-asteroids-orbit-shape-changed-after-dart-impact/',
    labelKey: 'dartSourceStudy2024',
    dateStr: '19/03/2024'
  }
];

export function getDartSourceByStableId(id: string): DartSourceReference | undefined {
  return DART_OFFICIAL_SOURCES.find(s => s.id === id);
}

export function renderDartSourcesHTML(lang: SupportedLang): string {
  const t = getTexts(lang);
  return DART_OFFICIAL_SOURCES.map(src => {
    const label = (t as any)[src.labelKey] || src.id;
    return `
      <div class="dart-source-item">
        <a href="${src.url}"
           target="_blank"
           rel="noopener noreferrer"
           class="dart-source-link"
           id="dart-source-${src.id}"
           aria-label="${label} (${src.dateStr})">
          <span class="source-icon" aria-hidden="true">🔗</span>
          <span class="source-label">${label}</span>
          <span class="source-ext" aria-hidden="true">↗</span>
        </a>
        <span class="dart-source-meta" aria-hidden="true">(${src.dateStr})</span>
      </div>
    `.trim();
  }).join('');
}
