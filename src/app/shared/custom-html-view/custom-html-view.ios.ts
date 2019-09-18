import { Color } from 'tns-core-modules/color';
import { HtmlView } from 'tns-core-modules/ui/html-view';
import { Font } from 'tns-core-modules/ui/styling/font';
import {
    colorProperty,
    fontInternalProperty,
} from 'tns-core-modules/ui/styling/style-properties';

import { linkColorProperty } from './custom-html-view-common';

export class CustomHtmlView extends HtmlView {

    public initNativeView(): void {
        super.initNativeView();
        // Remove extra padding
        // https://github.com/NativeScript/NativeScript/issues/4358
        this.nativeViewProtected.textContainer.lineFragmentPadding = 0;
    }

    [colorProperty.setNative](value: Color) {
        this.nativeViewProtected.textColor = value.ios;
    }

    [linkColorProperty.setNative](value: Color) {
        const linkTextAttributes = NSDictionary.dictionaryWithObjectForKey( // eslint-disable-line no-undef
            value.ios,
            NSForegroundColorAttributeName, // eslint-disable-line no-undef
        );
        this.nativeViewProtected.linkTextAttributes = linkTextAttributes;
    }

    [fontInternalProperty.setNative](value: Font) {
        const font = value.getUIFont(this.nativeViewProtected.font);
        this.nativeViewProtected.font = font;
    }
}
