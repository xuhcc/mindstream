import { knownFolders, File, path as pathUtils } from '@nativescript/core/file-system/file-system'
import { ImageAsset } from '@nativescript/core/image-asset'
import { isAndroid, isIOS } from '@nativescript/core/platform'

import { ImagePicker, ImagePickerMediaType } from 'nativescript-imagepicker'
import { Mediafilepicker, FilePickerOptions } from 'nativescript-mediafilepicker'

class AndroidFilePicker extends ImagePicker {

    get mimeTypes() {
        const mimeTypes = Array.create(java.lang.String, 1) // eslint-disable-line no-undef
        mimeTypes[0] = '*/*'
        return mimeTypes
    }
}

/**
 * Resolves with the file path on success or with null if cancelled
 */
export function openFilePicker(): Promise<string | null> {
    if (isAndroid) {
        const androidFilePicker = new AndroidFilePicker({
            mode: 'single',
            mediaType: ImagePickerMediaType.Any,
            showAdvanced: true,
        })
        return androidFilePicker.authorize()
            .then(() => androidFilePicker.present())
            .then((selection: ImageAsset[]) => {
                const filePath = selection[0].android
                if (!filePath) {
                    throw new Error('Can not get file path')
                }
                return filePath
            })
            .catch((error) => {
                if (error.message === 'Image picker activity result code 0') {
                    // Picker has been cancelled
                    return null
                } else {
                    throw error
                }
            })

    } else if (isIOS) {
        const options: FilePickerOptions = {
            ios: {
                extensions: [kUTTypeText], // eslint-disable-line no-undef
                multipleSelection: false,
            },
        }
        const iosFilePicker = new Mediafilepicker()
        iosFilePicker.openFilePicker(options)
        return new Promise<string>((resolve, reject) => {
            iosFilePicker.on('getFiles', (res) => {
                const files = res.object.get('results')
                const fileUri = files[0].file
                const filePath = fileUri.slice(7, fileUri.length)
                // Copy file from temp dir to documents
                File.fromPath(filePath).readText().then((content) => {
                    const docDir = knownFolders.documents()
                    const newFilePath = pathUtils.join(docDir.path, 'todo.txt')
                    File.fromPath(newFilePath).writeText(content).then(() => {
                        console.info(`file copied from ${filePath} to ${newFilePath}`)
                        resolve(newFilePath)
                    })
                })
            })
            iosFilePicker.on('error', (res) => {
                const message = res.object.get('msg')
                reject(message)
            })
            iosFilePicker.on('cancel', () => {
                resolve(null)
            })
        })
    }
}
