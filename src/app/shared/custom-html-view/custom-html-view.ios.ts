import { Color } from '@nativescript/core/color';
import { HtmlView, htmlProperty } from '@nativescript/core/ui/html-view';
import { Font } from '@nativescript/core/ui/styling/font';
import {
    colorProperty,
    fontInternalProperty,
} from '@nativescript/core/ui/styling/style-properties';

import { linkColorProperty } from './custom-html-view-common';

function uiColorToHex(uiColor: UIColor): string {
    const rgba = CGColorGetComponents(uiColor.CGColor); // eslint-disable-line no-undef
    const nsColor = new Color(
        Math.round(rgba[3] * 255),
        Math.round(rgba[0] * 255),
        Math.round(rgba[1] * 255),
        Math.round(rgba[2] * 255),
    );
    return nsColor.hex;
}

export class CustomHtmlView extends HtmlView {

    private currentHtml: string;

    public initNativeView(): void {
        super.initNativeView();
        // Remove extra padding
        // https://github.com/NativeScript/NativeScript/issues/4358
        this.nativeViewProtected.textContainer.lineFragmentPadding = 0;
        // https://stackoverflow.com/questions/746670/how-to-lose-margin-padding-in-uitextview
        this.nativeViewProtected.textContainerInset = (UIEdgeInsets as any).zero; // eslint-disable-line no-undef
    }

    private withStyles() {
        let html = this.currentHtml;
        const styles = [];
        if (this.nativeViewProtected.font) {
            styles.push(`font-family: '${this.nativeViewProtected.font.fontName}';`);
            styles.push(`font-size: ${this.nativeViewProtected.font.pointSize}px;`);
        }
        if (this.nativeViewProtected.textColor) {
            styles.push(`color: ${uiColorToHex(this.nativeViewProtected.textColor)};`);
        }
        if (styles.length > 0) {
            html += `<style>body {${styles.join('')}}</style>`;
        }
        super[htmlProperty.setNative](html);
    }

    [htmlProperty.setNative](value: string) {
        this.currentHtml = value;
        this.withStyles();
    }

    [colorProperty.getDefault](): UIColor {
        return this.nativeViewProtected.textColor;
    }

    [colorProperty.setNative](value: Color | UIColor) {
        const color = value instanceof Color ? value.ios : value;
        this.nativeViewProtected.textColor = color;
        this.withStyles();
    }

    [linkColorProperty.getDefault](): UIColor {
        return this.nativeViewProtected.linkTextAttributes[NSForegroundColorAttributeName]; // eslint-disable-line no-undef
    }

    [linkColorProperty.setNative](value: Color | UIColor) {
        const color = value instanceof Color ? value.ios : value;
        const linkTextAttributes = NSDictionary.dictionaryWithObjectForKey( // eslint-disable-line no-undef
            color,
            NSForegroundColorAttributeName, // eslint-disable-line no-undef
        );
        this.nativeViewProtected.linkTextAttributes = linkTextAttributes;
    }

    [fontInternalProperty.getDefault](): UIFont {
        return this.nativeViewProtected.font;
    }

    [fontInternalProperty.setNative](value: Font | UIFont) {
        const font = value instanceof Font ? value.getUIFont(this.nativeViewProtected.font) : value;
        this.nativeViewProtected.font = font;
        this.withStyles();
    }
}
