import { Color } from 'tns-core-modules/color';
import { HtmlView } from 'tns-core-modules/ui/html-view';
import { Font } from 'tns-core-modules/ui/styling/font';
import {
    colorProperty,
    fontSizeProperty,
    fontInternalProperty,
} from 'tns-core-modules/ui/styling/style-properties';

import { linkColorProperty } from './custom-html-view-common';

export class CustomHtmlView extends HtmlView {

    [colorProperty.setNative](value: Color) {
        this.nativeViewProtected.setTextColor(value.android);
    }

    [linkColorProperty.setNative](value: Color) {
        this.nativeViewProtected.setLinkTextColor(value.android);
    }

    [fontInternalProperty.setNative](value: Font) {
        this.nativeViewProtected.setTypeface(value.getAndroidTypeface());
    }

    [fontSizeProperty.setNative](value: number) {
        this.nativeViewProtected.setTextSize(value);
    }
}
