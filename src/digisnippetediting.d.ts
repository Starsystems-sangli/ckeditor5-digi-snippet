import { Plugin } from '@ckeditor/ckeditor5-core';
import { Widget } from '@ckeditor/ckeditor5-widget';
export default class DigiSnippetEditing extends Plugin {
    private _widgetButtonViewReferences;
    static get pluginName(): "DigiSnippetEditing";
    static get requires(): (typeof Widget)[];
    init(): void;
    _defineSchema(): void;
    _defineConverters(): void;
}
