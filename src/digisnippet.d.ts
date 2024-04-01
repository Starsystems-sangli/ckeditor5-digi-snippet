import { Widget } from '@ckeditor/ckeditor5-widget';
import { Plugin } from 'ckeditor5/src/core';
import DigiSnippetEditing from './digisnippetediting';
import DigiSnippetUI from './digisnippetui';
export default class DigiSnippet extends Plugin {
    static get pluginName(): "DigiSnippet";
    static get requires(): readonly [typeof DigiSnippetEditing, typeof DigiSnippetUI, typeof Widget];
}
