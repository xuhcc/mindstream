import { Color } from '@nativescript/core/color';
import { HtmlView } from '@nativescript/core/ui/html-view';
import { Font } from '@nativescript/core/ui/styling/font';
import {
    colorProperty,
    fontSizeProperty,
    fontInternalProperty,
} from '@nativescript/core/ui/styling/style-properties';

import { linkColorProperty } from './custom-html-view-common';

export class CustomHtmlView extends HtmlView {

    public initNativeView(): void {
        super.initNativeView();
        // Allow text selection
        this.nativeViewProtected.setTextIsSelectable(true);
        // Make links clickable
        this.nativeViewProtected.setMovementMethod(android.text.method.LinkMovementMethod.getInstance());
    }

    [colorProperty.getDefault](): android.content.res.ColorStateList {
        return this.nativeViewProtected.getTextColors();
    }

    [colorProperty.setNative](value: Color | android.content.res.ColorStateList) {
        const color = value instanceof Color ? value.android : value;
        this.nativeViewProtected.setTextColor(color);
    }

    [linkColorProperty.getDefault](): android.content.res.ColorStateList {
        return this.nativeViewProtected.getLinkTextColors();
    }

    [linkColorProperty.setNative](value: Color | android.content.res.ColorStateList) {
        const color = value instanceof Color ? value.android : value;
        this.nativeViewProtected.setLinkTextColor(color);
    }

    [fontInternalProperty.getDefault](): android.graphics.Typeface {
        return this.nativeViewProtected.getTypeface();
    }

    [fontInternalProperty.setNative](value: Font | android.graphics.Typeface) {
        const font = value instanceof Font ? value.getAndroidTypeface() : value;
        this.nativeViewProtected.setTypeface(font);
    }

    [fontSizeProperty.getDefault](): {nativeSize: number} {
        return {nativeSize: this.nativeViewProtected.getTextSize()};
    }

    [fontSizeProperty.setNative](value: number | {nativeSize: number}) {
        if (typeof value === 'number') {
            this.nativeViewProtected.setTextSize(value);
        } else {
            this.nativeViewProtected.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, value.nativeSize);
        }
    }
}
