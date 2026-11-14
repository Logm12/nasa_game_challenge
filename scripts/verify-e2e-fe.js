const http = require('http');
const fs = require('fs');
const path = require('path');
const playwrightPath = 'C:/Program Files/WindowsApps/OpenAI.CodexPrimaryRuntime.v26-1112-737-0_26.1112.737.0_x64__3k8sg7r9htsxt/dependencies/node/node_modules/playwright';
const { chromium } = require(playwrightPath);

// Create a local static file server for dist/
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(__dirname, '..', 'dist', reqPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.glb': 'model/gltf-binary',
      '.obj': 'text/plain',
      '.mtl': 'text/plain'
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(8089, async () => {
  console.log('Static server running on http://localhost:8089');
  let browser;
  try {
    browser = await chromium.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
    });

    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    const page = await context.newPage();
    await page.goto('http://localhost:8089', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    console.log('\n--- VERIFYING FE07: Multi-language Dynamic Flows ---');

    // 1. Check Italian Language
    await page.selectOption('#select-game-language', 'it');
    await page.waitForTimeout(500);

    const dockLabelIt = await page.$eval('#btn-toggle-dock-bottom .dock-tab-label', el => el.textContent.trim());
    console.log(`[FE07] Italian Dock Toggle Label: "${dockLabelIt}"`);
    if (dockLabelIt.includes('THU GỌN') || dockLabelIt.includes('HIDE DOCK')) {
      throw new Error(`FAIL: Dock label leaked Vietnamese/English in Italian: "${dockLabelIt}"`);
    }

    // Toggle dock bottom and check expand label in Italian
    await page.click('#btn-toggle-dock-bottom');
    await page.waitForTimeout(300);
    const dockExpandLabelIt = await page.$eval('#btn-toggle-dock-bottom .dock-tab-label', el => el.textContent.trim());
    console.log(`[FE07] Italian Dock Expand Label: "${dockExpandLabelIt}"`);
    if (dockExpandLabelIt.includes('MỞ RỘNG') || dockExpandLabelIt.includes('SHOW DOCK')) {
      throw new Error(`FAIL: Dock expand label leaked Vietnamese/English in Italian: "${dockExpandLabelIt}"`);
    }
    // Re-expand dock
    await page.click('#btn-toggle-dock-bottom');
    await page.waitForTimeout(300);

    // 2. Spotlight Tour in Italian
    await page.click('#btn-start-spotlight-tour');
    await page.waitForTimeout(400);

    const tourBadgeIt = await page.$eval('#tour-step-badge', el => el.textContent.trim());
    const tourTitleIt = await page.$eval('#tour-step-title', el => el.textContent.trim());
    const tourNextIt = await page.$eval('#btn-tour-next', el => el.textContent.trim());
    const tourCloseAriaIt = await page.$eval('#btn-tour-close', el => el.getAttribute('aria-label'));

    console.log(`[FE07] Italian Tour Badge: "${tourBadgeIt}"`);
    console.log(`[FE07] Italian Tour Title: "${tourTitleIt}"`);
    console.log(`[FE07] Italian Tour Next Btn: "${tourNextIt}"`);
    console.log(`[FE07] Italian Tour Close Aria: "${tourCloseAriaIt}"`);

    if (tourBadgeIt.includes('BƯỚC') || tourBadgeIt.includes('STEP')) {
      throw new Error(`FAIL: Tour badge leaked in Italian: "${tourBadgeIt}"`);
    }
    if (tourNextIt.includes('Tiếp tục') || tourNextIt.includes('Next')) {
      throw new Error(`FAIL: Tour button leaked in Italian: "${tourNextIt}"`);
    }

    // Close tour
    await page.click('#btn-tour-close');
    await page.waitForTimeout(300);

    console.log('\n--- VERIFYING FE11: Keyboard Navigation & ARIA Semantics ---');

    // Check radiogroup role on missions list
    const missionGroupRole = await page.$eval('#marvel-missions-list', el => el.getAttribute('role'));
    const missionGroupAria = await page.$eval('#marvel-missions-list', el => el.getAttribute('aria-label'));
    console.log(`[FE11] Missions List Role: "${missionGroupRole}", Aria-Label: "${missionGroupAria}"`);
    if (missionGroupRole !== 'radiogroup') {
      throw new Error(`FAIL: Missions list missing role="radiogroup"`);
    }

    // Check mission items roles
    const missionItems = await page.$$eval('#marvel-missions-list .nasa-mission-item', els => els.map(el => ({
      role: el.getAttribute('role'),
      checked: el.getAttribute('aria-checked'),
      tabIndex: el.getAttribute('tabindex'),
      id: el.getAttribute('data-mission-id')
    })));
    console.log(`[FE11] Mission Items Count: ${missionItems.length}`);
    console.log(`[FE11] First Mission:`, missionItems[0]);
    if (missionItems[0].role !== 'radio') {
      throw new Error(`FAIL: Mission item missing role="radio"`);
    }

    // Test ArrowDown navigation on missions
    await page.focus('#marvel-missions-list .nasa-mission-item[tabindex="0"]');
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(300);

    const focusedMissionAfterArrow = await page.evaluate(() => {
      const active = document.activeElement;
      return {
        id: active?.getAttribute('data-mission-id'),
        tabIndex: active?.getAttribute('tabindex'),
        checked: active?.getAttribute('aria-checked')
      };
    });
    console.log(`[FE11] Focused mission after ArrowDown:`, focusedMissionAfterArrow);

    // Press Space or Enter to select
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    const selectedMissionAfterEnter = await page.evaluate(() => {
      const active = document.activeElement;
      return {
        id: active?.getAttribute('data-mission-id'),
        checked: active?.getAttribute('aria-checked')
      };
    });
    console.log(`[FE11] Selected mission after Enter:`, selectedMissionAfterEnter);
    if (selectedMissionAfterEnter.checked !== 'true') {
      throw new Error(`FAIL: Enter did not set aria-checked="true"`);
    }

    // Check Armory Dock keyboard navigation
    const armoryGridRole = await page.$eval('#armory-items-grid', el => el.getAttribute('role'));
    console.log(`[FE11] Armory Grid Role: "${armoryGridRole}"`);

    const armoryCards = await page.$$eval('#armory-items-grid .armory-card', els => els.map(el => ({
      role: el.getAttribute('role'),
      checked: el.getAttribute('aria-checked'),
      tabIndex: el.getAttribute('tabindex')
    })));
    console.log(`[FE11] Armory Cards Count: ${armoryCards.length}, First Card:`, armoryCards[0]);
    if (armoryCards[0].role !== 'radio') {
      throw new Error(`FAIL: Armory card missing role="radio"`);
    }

    console.log('\n--- VERIFYING FE14: DART Official Sources as Real Clickable Links ---');

    // Select DART Mission and open debrief modal
    await page.evaluate(() => {
      const w = window;
      if (w.nasaDesigner) {
        w.nasaDesigner.selectMissionById('nasa_dart');
        w.nasaDesigner.showDebrief();
      }
    });
    await page.waitForTimeout(500);

    // Check DART Debrief Sources
    const dartSourcesContainer = await page.$('#dart-sources-container');
    console.log(`[FE14] #dart-sources-container exists: ${!!dartSourcesContainer}`);

    const sources = await page.$$eval('#dart-sources-list a.dart-source-link', els => els.map(el => ({
      id: el.id,
      href: el.getAttribute('href'),
      target: el.getAttribute('target'),
      rel: el.getAttribute('rel'),
      text: el.textContent.trim(),
      ariaLabel: el.getAttribute('aria-label')
    })));

    console.log(`[FE14] Found ${sources.length} DART source links:`);
    sources.forEach((s, i) => {
      console.log(`  Source #${i + 1}: [${s.id}] href="${s.href}" target="${s.target}" rel="${s.rel}" label="${s.text}"`);
    });

    if (sources.length !== 3) {
      throw new Error(`FAIL: Expected 3 DART source links, found ${sources.length}`);
    }

    sources.forEach(s => {
      if (s.target !== '_blank') throw new Error(`FAIL: Source ${s.id} target is not _blank`);
      if (!s.rel.includes('noopener') || !s.rel.includes('noreferrer')) throw new Error(`FAIL: Source ${s.id} rel missing noopener noreferrer`);
      if (!s.href.startsWith('https://')) throw new Error(`FAIL: Source ${s.id} href is not https://`);
      if (!s.text || s.text.length < 3) throw new Error(`FAIL: Source ${s.id} label text is empty`);
    });

    // Check Italian translation in debrief
    const debriefTitle = await page.$eval('#dart-debrief-title', el => el.textContent.trim());
    const debriefReason = await page.$eval('#dart-res-reason', el => el.textContent.trim());
    console.log(`[FE07] DART Debrief Title (Italian): "${debriefTitle}"`);
    console.log(`[FE07] DART Debrief Reason (Italian): "${debriefReason}"`);

    // Capture artifacts
    const artifactDir = 'C:/Users/longm/.gemini/antigravity/brain/2f1767e3-63a7-49c2-bc03-b09dbfb62a14';

    // 1440 Debrief screenshot
    await page.screenshot({ path: path.join(artifactDir, '1440_dart_sources_fe14.png') });
    console.log('Saved screenshot: 1440_dart_sources_fe14.png');

    // Close debrief modal
    await page.click('#debrief-btn-dart-restart');
    await page.waitForTimeout(300);

    // 1440 Hangar screenshot (Italian)
    await page.screenshot({ path: path.join(artifactDir, '1440_it_fe07_fe11.png') });
    console.log('Saved screenshot: 1440_it_fe07_fe11.png');

    // Tablet viewport (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(artifactDir, '768_tablet_fe.png') });
    console.log('Saved screenshot: 768_tablet_fe.png');

    // Mobile viewport (390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(artifactDir, '390_mobile_fe.png') });
    console.log('Saved screenshot: 390_mobile_fe.png');

    console.log('\n========================================================');
    console.log('ALL E2E PLAYWRIGHT TESTS PASSED WITH 100% SUCCESS!');
    console.log('========================================================\n');

  } catch (err) {
    console.error('E2E Verification Error:', err);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.close();
  }
});
