import * as appSettings from '@nativescript/core/application-settings'

export function setValue(key: string, value: string): void {
    appSettings.setString(key, value)
}

export function getValue(key: string): string {
    return appSettings.getString(key)
}

export function removeValue(key: string): void {
    appSettings.remove(key)
}
