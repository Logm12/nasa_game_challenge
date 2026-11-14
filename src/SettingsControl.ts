import settingsIconUrl from './images/settingsIcon.png';

import { getControlTexts, getTexts, onLangChange, SupportedLang } from './i18n';
import { getStoredQuality, setStoredQuality, onQualityChange, GraphicsQuality } from './QualityManager';

export function rightTitleSetSize(title: HTMLElement, icon: HTMLElement){
    const r = title.getBoundingClientRect();
    const iconRect = icon.getBoundingClientRect()
    title.style.top = (iconRect.height - r.height) + 'px';
    title.style.right = iconRect.width + 'px';
}

export class Config{
    buttonTop = 154;
    buttonWidth = 32;
    buttonHeight = 32;
}

export class Settings{
    grid_enable = false;
    sync_rotate = false;
    nlips_enable = true;
    units_km = true;
    show_label = true;
    show_marker = true;
    center_select = true;
}

export class SettingsControl{
    config = new Config();
    protected settings: Settings;
    protected element: HTMLElement;
    get domElement(): HTMLElement{ return this.element; }
    protected valueElement: HTMLDivElement;
    protected checkElements: HTMLInputElement[] = [];
    protected visible = false;

    constructor(settings: Settings, config?: Config){
        const setSize = () => {
            this.element.style.left = (window.innerWidth - this.config.buttonWidth) + 'px';
            rightTitleSetSize(title, icon);
        }

        this.settings = settings;
        if(config) this.config = config;
        this.element = document.createElement('div');
        const element = this.domElement;
        element.style.position = 'absolute';
        element.style.textAlign = 'left';
        element.style.top = this.config.buttonTop + 'px';
        element.style.left = 0 + 'px';
        element.style.zIndex = '7';
        const icon = document.createElement('img');
        icon.src = settingsIconUrl;
        icon.style.width = this.config.buttonWidth + 'px';
        icon.style.height = this.config.buttonHeight + 'px';
        element.appendChild(icon);

        const title = document.createElement('div');
        title.textContent = getControlTexts().settingsTitle;
        title.style.display = 'none';
        title.style.position = 'absolute';
        title.style.background = 'rgba(0, 0, 0, 0.5)';
        title.style.zIndex = '20';
        element.appendChild(title);

        this.valueElement = document.createElement('div');
        element.appendChild(this.valueElement);
        this.valueElement.style.display = 'none';
        this.valueElement.style.position = 'absolute';
        this.valueElement.style.background = 'rgba(0, 0, 0, 0.5)';
        this.valueElement.style.border = '3px ridge #7f3f3f';
        this.valueElement.style.padding = '3px';
        const labelElements: HTMLLabelElement[] = [];
        const names = Object.keys(this.settings);
        for(const i in names){
            const name = names[i];
            // Hide center_select from visible options
            if(name === 'center_select')
                continue;
            const lineElement = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.onclick = ((a: any, field) => (event: MouseEvent) => a[field] = !a[field])(this.settings, name);
            const id = 'settings_check_' + i;
            checkbox.setAttribute('id', id);
            lineElement.appendChild(checkbox);
            this.checkElements.push(checkbox);
            const label = document.createElement('label');
            label.setAttribute('for', id);
            label.textContent = getControlTexts().settingsLabels[Number(i)] || '';
            labelElements.push(label);
            lineElement.appendChild(label);
            lineElement.style.fontWeight = 'bold';
            lineElement.style.paddingRight = '1em';
            lineElement.style.whiteSpace = 'nowrap';
            this.valueElement.appendChild(lineElement);
        }

        const qualityRow = document.createElement('div');
        qualityRow.style.marginTop = '4px';
        qualityRow.style.borderTop = '1px solid rgba(255,255,255,0.2)';
        qualityRow.style.paddingTop = '4px';

        const qualitySelect = document.createElement('select');
        qualitySelect.id = 'settings_quality_select';
        qualitySelect.style.background = '#0a101c';
        qualitySelect.style.color = '#00f0ff';
        qualitySelect.style.border = '1px solid #00f0ff';
        qualitySelect.style.borderRadius = '3px';
        qualitySelect.style.fontSize = '11px';
        qualitySelect.style.padding = '2px 4px';
        qualitySelect.style.width = '100%';

        const updateQualityOptions = (lang?: SupportedLang) => {
            const t = getTexts(lang);
            qualitySelect.title = t.qualityTitle;
            qualitySelect.innerHTML = `
                <option value="low">${t.qualityLow}</option>
                <option value="balanced">${t.qualityBalanced}</option>
                <option value="high">${t.qualityHigh}</option>
            `;
            qualitySelect.value = getStoredQuality();
        };
        updateQualityOptions();

        qualitySelect.addEventListener('change', () => {
            setStoredQuality(qualitySelect.value as GraphicsQuality);
        });

        onQualityChange((q) => {
            qualitySelect.value = q;
        });

        qualityRow.appendChild(qualitySelect);
        this.valueElement.appendChild(qualityRow);

        onLangChange((lang) => {
            const ct = getControlTexts(lang);
            title.textContent = ct.settingsTitle;
            labelElements.forEach((lbl, idx) => {
                if (ct.settingsLabels[idx]) lbl.textContent = ct.settingsLabels[idx];
            });
            updateQualityOptions(lang);
        });

        setSize();

        // Register event handlers
        window.addEventListener('resize', setSize);
        icon.ondragstart = (event) => event.preventDefault();
        icon.onclick = (event) => {
            this.visible = !this.visible;
            if(this.visible){
                this.valueElement.style.display = 'block';
                element.style.background = 'rgba(0, 0, 0, 0.5)';
            }
            else{
                this.valueElement.style.display = 'none';
                element.style.background = 'rgba(0, 0, 0, 0)';
            }
        };
        icon.onmouseenter = (event) => {
            if(!this.visible)
                title.style.display = 'block';
            rightTitleSetSize(title, icon);
        };
        icon.onmouseleave = (event) => {
            if(!this.visible)
                title.style.display = 'none';
        };

        window.addEventListener( 'keydown', (event: KeyboardEvent) => this.onKeyDown(event), false );
    }

    setText(){
        if(!this.visible)
            return;
        this.checkElements[0].checked = this.settings.grid_enable;
        this.checkElements[1].checked = this.settings.sync_rotate;
        this.checkElements[2].checked = this.settings.nlips_enable;
        this.checkElements[3].checked = this.settings.units_km;
        this.checkElements[4].checked = this.settings.show_label;
        this.checkElements[5].checked = this.settings.show_marker;
        this.valueElement.style.marginLeft = (this.config.buttonWidth - this.valueElement.getBoundingClientRect().width) + 'px';
    }

    onKeyDown(event: KeyboardEvent){
        const char = String.fromCharCode(event.which || event.keyCode).toLowerCase();
        switch(char){
        case 'c':
            this.settings.center_select = !this.settings.center_select;
            break;

        case 'n': // toggle NLIPS
            this.settings.nlips_enable = !this.settings.nlips_enable;
            break;

        case 'g':
            this.settings.grid_enable = !this.settings.grid_enable;
            break;

        case 'h':
            this.settings.sync_rotate = !this.settings.sync_rotate;
            break;

        case 'k':
            this.settings.units_km = !this.settings.units_km;
            break;

        case 'l':
            this.settings.show_label = !this.settings.show_label;
            break;

        case 'm':
            this.settings.show_marker = !this.settings.show_marker;
            break;
        }
    }
}
