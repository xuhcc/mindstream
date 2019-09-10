import { ImageAsset } from 'tns-core-modules/image-asset';
import { isAndroid, isIOS } from 'tns-core-modules/platform';

import { ImagePicker, ImagePickerMediaType } from 'nativescript-imagepicker';
import { Mediafilepicker, FilePickerOptions } from 'nativescript-mediafilepicker';

class AndroidFilePicker extends ImagePicker {

    get mimeTypes() {
        const mimeTypes = Array.create(java.lang.String, 1); // eslint-disable-line no-undef
        mimeTypes[0] = '*/*';
        return mimeTypes;
    }
}

export function openFilePicker(): Promise<string> {
    if (isAndroid) {
        const imagePicker = new AndroidFilePicker({
            mode: 'single',
            mediaType: ImagePickerMediaType.Any,
            showAdvanced: true,
        });
        return imagePicker.authorize()
            .then(() => imagePicker.present())
            .then((selection: ImageAsset[]) => selection[0].android);

    } else if (isIOS) {
        const options: FilePickerOptions = {
            ios: {
                extensions: [kUTTypeText], // eslint-disable-line no-undef
                multipleSelection: false,
            },
        };
        const iosFilePicker = new Mediafilepicker();
        iosFilePicker.openFilePicker(options);
        return new Promise<string>((resolve, reject) => {
            iosFilePicker.on('getFiles', (res) => {
                const files = res.object.get('results');
                const fileUri = files[0].file;
                const filePath = fileUri.slice(7, fileUri.length);
                resolve(filePath);
            });
            iosFilePicker.on('error', (res) => {
                const message = res.object.get('msg');
                reject(message);
            });
            iosFilePicker.on('cancel', (res) => {
                const message = res.object.get('msg');
                reject(message);
            });
        });
    }
}
