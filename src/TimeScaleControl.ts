import forwardActiveUrl from './images/forward.png';
import { getControlTexts, onLangChange } from './i18n';
import forwardInactiveUrl from './images/forward-inactive.png';


export class TimeScaleControl{
    protected setTimeScale: (scale: number) => boolean;
    protected element: HTMLElement;
    get domElement(): HTMLElement{ return this.element; }
    protected valueElement: HTMLDivElement;
    protected forwards: HTMLImageElement[] = [];
    protected text: HTMLDivElement;
    protected timeIndex: number;
    protected date: HTMLDivElement;
    static series = [1, 5, 10, 100, 1e3, 1e4, 1e5, 1e6];

    constructor(setTimeScale: (scale: number) => boolean){
        this.setTimeScale = setTimeScale;
        this.element = document.createElement('div');
        this.element.style.position = 'absolute';
        this.element.style.top = '56px';
        this.element.style.left = '8px';
        this.element.style.background = 'rgba(15, 23, 42, 0.82)';
        (this.element.style as any).backdropFilter = 'blur(12px)';
        this.element.style.border = '1px solid rgba(255, 255, 255, 0.15)';
        this.element.style.borderRadius = '6px';
        this.element.style.padding = '6px 10px';
        this.element.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.6)';
        this.element.style.color = '#e2e8f0';
        this.element.style.zIndex = '10';
        this.timeIndex = 0;
        for(let i = 0; i < TimeScaleControl.series.length; i++){
            const forward = document.createElement('img');
            forward.src = i <= this.timeIndex ? forwardActiveUrl : forwardInactiveUrl;
            forward.style.width = '15px';
            forward.style.height = '20px';
            forward.addEventListener('click', ((i) => (e: MouseEvent) => this.clickForward(i))(i));
            this.domElement.appendChild(forward);
            this.forwards.push(forward);
        }
        this.text = document.createElement('div');
        this.text.textContent = getControlTexts().timescalePrefix + '1';
        onLangChange((lang) => {
            this.text.textContent = getControlTexts(lang).timescalePrefix + TimeScaleControl.series[this.timeIndex];
        });
        this.domElement.appendChild(this.text);
        this.date = document.createElement('div');
        this.domElement.appendChild(this.date);
    }

    protected clickForward(number: number){
        if(!this.setTimeScale(TimeScaleControl.series[number]))
            return;
        for(let i = 0; i < this.forwards.length; i++)
            this.forwards[i].src = i <= number ? forwardActiveUrl : forwardInactiveUrl;
        this.text.textContent = getControlTexts().timescalePrefix + TimeScaleControl.series[number];
        this.timeIndex = number;
    }

    increment(){
        if(TimeScaleControl.series.length <= this.timeIndex + 1)
            return;
        this.clickForward(this.timeIndex + 1);
    }

    decrement(){
        if(this.timeIndex - 1 < 0)
            return;
        this.clickForward(this.timeIndex - 1);
    }

    setDate(text: string){
        this.date.innerHTML = text;
    }
}