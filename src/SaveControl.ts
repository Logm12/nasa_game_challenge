import { MenuControl } from './MenuControl';
import { getControlTexts, onLangChange } from './i18n';
import {
    sanitizeSaveTitle,
    readRawSaveSlotList,
    validateGameState,
    safeStorageSet,
    safeStorageGet
} from './domain/save-validator';

import saveIconUrl from './images/saveIcon.png';
import trashcanUrl from './images/trashcan.png';


export class SaveControl extends MenuControl{
    protected showEvent: () => void;
    protected updateSaveDataList: () => void;

    constructor(serializeState: () => any, sendMessage: (msg: string) => void, showEvent: () => void){
        super(getControlTexts().saveTitle, saveIconUrl, {
            buttonTop: 34,
            buttonHeight: 32,
            buttonWidth: 32,
        });
        this.showEvent = showEvent;

        const inputContainer = document.createElement('div');
        inputContainer.style.border = "1px solid #7fff7f";
        inputContainer.style.margin = "5px";
        inputContainer.style.padding = "5px";
        const inputTitle = document.createElement('div');
        inputTitle.textContent = getControlTexts().saveNewLabel;
        const inputElement = document.createElement('input');
        inputElement.setAttribute('type', 'text');
        const inputButton = document.createElement('button');
        inputButton.textContent = getControlTexts().saveBtn;
        inputButton.onclick = (event) => {
            const storageRead = safeStorageGet('WebGLOrbiterSavedData');
            if (!storageRead.success) {
                sendMessage(`Lỗi đọc bộ nhớ lưu trữ: ${storageRead.error}`);
                return;
            }
            const slotValidation = readRawSaveSlotList(storageRead.data);
            if (!slotValidation.isValid) {
                sendMessage(`Không thể ghi đè vì dữ liệu lưu trữ gốc bị hỏng: ${slotValidation.errorMessage}`);
                return;
            }

            const rawState = serializeState();
            const stateValidation = validateGameState(rawState);
            if (!stateValidation.isValid) {
                sendMessage(`Lỗi lưu: ${stateValidation.errorMessage}`);
                return;
            }

            const saveData = slotValidation.data!;
            const safeTitle = sanitizeSaveTitle(inputElement.value);
            saveData.push({ title: safeTitle, state: stateValidation.data! });
            const savedOk = safeStorageSet('WebGLOrbiterSavedData', JSON.stringify(saveData));
            if (savedOk) {
                sendMessage(getControlTexts().saveSuccessMsg);
            } else {
                sendMessage('Lỗi lưu: Bộ nhớ trình duyệt đầy hoặc không thể ghi!');
            }
            this.title.style.display = 'none';
            this.visible = false;
            this.valueElement.style.display = 'none';
        };
        inputElement.onkeydown = (e) => e.stopPropagation();
        inputContainer.appendChild(inputTitle);
        inputContainer.appendChild(inputElement);
        inputContainer.appendChild(inputButton);
        this.valueElement.appendChild(inputContainer);
        onLangChange((lang) => {
            const ct = getControlTexts(lang);
            this.title.textContent = ct.saveTitle;
            inputTitle.textContent = ct.saveNewLabel;
            inputButton.textContent = ct.saveBtn;
        });

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
                elem.style.border = "1px solid #00ff00";
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
                            sendMessage('Game State Deleted!');
                        } else {
                            sendMessage('Lỗi cập nhật danh sách bản lưu!');
                        }
                        this.title.style.display = 'none';
                        this.visible = false;
                        this.valueElement.style.display = 'none';
                        event.stopPropagation();
                    }
                )(i);
                elem.appendChild(deleteElem);
                elem.onclick = ((save) =>
                    (event: MouseEvent) => {
                        const rawState = serializeState();
                        const stateValidation = validateGameState(rawState);
                        if (!stateValidation.isValid) {
                            sendMessage(`Lỗi lưu đè: ${stateValidation.errorMessage}`);
                            return;
                        }
                        save.state = stateValidation.data!;
                        const savedOk = safeStorageSet('WebGLOrbiterSavedData', JSON.stringify(saveData));
                        if (savedOk) {
                            sendMessage('Game State Saved!');
                        } else {
                            sendMessage('Lỗi lưu đè: Không thể ghi vào bộ nhớ!');
                        }
                        this.title.style.display = 'none';
                        this.visible = false;
                        this.valueElement.style.display = 'none';
                    }
                )(saveData[i]);
                saveContainer.appendChild(elem);
            }
        }
        this.valueElement.appendChild(saveContainer);
    }

    setVisible(v: boolean){
        super.setVisible.call(this, v);
        if(this.visible){
            this.showEvent();
            this.updateSaveDataList();
        }
    }
}
