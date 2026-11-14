import { MenuControl } from './MenuControl';
import { getControlTexts, onLangChange } from './i18n';
import {
    readRawSaveSlotList,
    validateGameState,
    safeStorageSet,
    safeStorageGet
} from './domain/save-validator';

import loadIconUrl from './images/loadIcon.png';
import trashcanUrl from './images/trashcan.png';

export class LoadControl extends MenuControl{
    protected showEvent: () => void;
    protected updateSaveDataList: () => void;

    constructor(loadState: (a: any) => void, sendMessage: (msg: string) => void, showEvent: () => void){
        super(getControlTexts().loadTitle, loadIconUrl, {
            buttonTop: 34 * 2,
            buttonHeight: 32,
            buttonWidth: 32,
        });
        this.showEvent = showEvent;
        this.valueElement.style.border = "5px ridge #ff7fff";

        const saveContainer = document.createElement('div');

        this.updateSaveDataList = () => {
            while(0 < saveContainer.children.length) saveContainer.removeChild(saveContainer.children[0]);
            const storageRead = safeStorageGet('WebGLOrbiterSavedData');
            if (!storageRead.success) {
                sendMessage(`Lỗi đọc danh sách bản lưu: ${storageRead.error}`);
                return;
            }
            const slotValidation = readRawSaveSlotList(storageRead.data);
            if (!slotValidation.isValid) {
                sendMessage(`Danh sách bản lưu trong storage bị lỗi: ${slotValidation.errorMessage}`);
                return;
            }
            const saveData = slotValidation.data!;
            for(let i = 0; i < saveData.length; i++){
                const elem = document.createElement('div');
                elem.style.margin = "5px";
                elem.style.padding = "5px";
                elem.style.border = "1px solid #ff00ff";
                const labelElem = document.createElement('div');
                labelElem.textContent = saveData[i].title;
                labelElem.style.cssText = "width: 100%; margin-right: -32px; display: inline-block; text-align: overflow: auto;";
                elem.appendChild(labelElem);
                const deleteElem = document.createElement('img');
                deleteElem.setAttribute('src', trashcanUrl);
                deleteElem.style.width = '20px';
                deleteElem.onclick = ((idx) =>
                    (event: MouseEvent) => {
                        saveData.splice(idx, 1);
                        const deletedOk = safeStorageSet('WebGLOrbiterSavedData', JSON.stringify(saveData));
                        if (deletedOk) {
                            sendMessage(getControlTexts().deleteSuccessMsg);
                        } else {
                            sendMessage('Lỗi xóa bản lưu khỏi bộ nhớ!');
                        }
                        this.title.style.display = 'none';
                        this.visible = false;
                        this.valueElement.style.display = 'none';
                        event.stopPropagation();
                    }
                )(i);
                elem.appendChild(deleteElem);
                elem.onclick = ((save) =>
                    () => {
                        const stateValidation = validateGameState(save.state);
                        if (!stateValidation.isValid) {
                            sendMessage(`Bản lưu lỗi không thể tải: ${stateValidation.errorMessage}`);
                            return;
                        }
                        loadState(save.state);
                        sendMessage(getControlTexts().loadSuccessMsg);
                        this.title.style.display = 'none';
                        this.visible = false;
                        this.valueElement.style.display = 'none';
                    }
                )(saveData[i]);
                saveContainer.appendChild(elem);
            }
        }
        this.valueElement.appendChild(saveContainer);
        onLangChange((lang) => {
            this.title.textContent = getControlTexts(lang).loadTitle;
        });
    }

    setVisible(v: boolean){
        super.setVisible.call(this, v);
        if(this.visible){
            this.showEvent();
            this.updateSaveDataList();
        }
    }
}
