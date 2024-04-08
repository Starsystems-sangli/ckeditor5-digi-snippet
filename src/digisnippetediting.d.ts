import { Plugin } from '@ckeditor/ckeditor5-core';
import { Widget } from '@ckeditor/ckeditor5-widget';
import { ShiftEnter } from 'ckeditor5/src/enter';
export default class DigiSnippetEditing extends Plugin {
    private _widgetButtonViewReferences;
    static get pluginName(): "DigiSnippetEditing";
    static get requires(): readonly [typeof Widget, typeof ShiftEnter];
    init(): void;
    _defineSchema(): void;
    _defineConverters(): void;
    afterInit(): void;
}
