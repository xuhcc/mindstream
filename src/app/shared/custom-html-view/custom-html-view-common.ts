import { Color } from '@nativescript/core/color';
import { Style, CssProperty } from '@nativescript/core/ui/core/properties';

export const linkColorProperty = new CssProperty<Style, Color>({
    name: 'linkColor',
    cssName: 'link-color',
    equalityComparer: Color.equals,
    valueConverter: (v) => new Color(v),
});
linkColorProperty.register(Style);
