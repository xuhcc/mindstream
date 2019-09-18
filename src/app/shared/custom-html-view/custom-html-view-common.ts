import { Color } from 'tns-core-modules/color';
import { Style, CssProperty } from 'tns-core-modules/ui/core/properties';

export const linkColorProperty = new CssProperty<Style, Color>({
    name: 'linkColor',
    cssName: 'link-color',
    equalityComparer: Color.equals,
    valueConverter: (v) => new Color(v),
});
linkColorProperty.register(Style);
