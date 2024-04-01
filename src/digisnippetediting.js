// CKEditor 
import { Plugin } from '@ckeditor/ckeditor5-core';
import { Widget, toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget';
import { ButtonView } from 'ckeditor5/src/ui';
import { createElement } from 'ckeditor5/src/utils';
// Snippet Plugin components
import InsertSnippetCommand from './Insertdigisnippetcommand';
export default class DigiSnippetEditing extends Plugin {
    constructor() {
        super(...arguments);
        this._widgetButtonViewReferences = new Set();
    }
    static get pluginName() {
        return 'DigiSnippetEditing';
    }
    static get requires() {
        return [Widget];
    }
    init() {
        this._defineSchema();
        this._defineConverters();
        this.editor.commands.add('insertDigiSnippet', new InsertSnippetCommand(this.editor));
    }
    _defineSchema() {
        const schema = this.editor.model.schema;
        schema.register('snippet', {
            inheritAllFrom: '$blockObject'
        });
        schema.register('snippetBlock', {
            isLimit: true,
            allowIn: 'snippet',
            allowContentOf: '$root'
        });
        schema.addChildCheck((context, childDefinition) => {
            if (context.endsWith('snippetBlock') && childDefinition.name == 'snippet') {
                return false;
            }
        });
    }
    _defineConverters() {
        const conversion = this.editor.conversion;
        const widgetButtonViewReferences = this._widgetButtonViewReferences;
        const view = this.editor.editing.view;
        // Section box
        conversion.for("upcast").elementToElement({
            model: 'snippet',
            view: {
                name: 'section',
                classes: 'snippet-box'
            }
        });
        conversion.for("dataDowncast").elementToElement({
            model: 'snippet',
            view: {
                name: 'section',
                classes: 'snippet-box'
            }
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'snippet',
            view: (modelElement, { writer: viewWriter }) => {
                const section = viewWriter.createContainerElement('section', { class: 'snippet-box' });
                return toWidget(section, viewWriter, { label: 'snippet box widget' });
            }
        });
        function renderContent({ editor, domElement, state, props }) {
            domElement.textContent = '';
            const domDocument = domElement.ownerDocument;
            domElement.prepend(createDomButtonsWrapper({ editor, domDocument, state, props }));
        }
        function createDomButtonsWrapper({ editor, domDocument, state, props }) {
            const domButtonsWrapper = createElement(domDocument, 'div', {
                class: 'raw-html-embed__buttons-wrapper'
            });
            const button_hide = editor.config.get('digisnippet.button.hide');
            if (!button_hide) {
                const saveButtonView = createUIButton(editor, 'save', props.onOpenClick);
                domButtonsWrapper.append(saveButtonView.element);
                widgetButtonViewReferences.add(saveButtonView);
            }
            return domButtonsWrapper;
        }
        // Code block
        conversion.for("upcast").elementToElement({
            model: 'snippetBlock',
            view: {
                name: 'div',
                classes: 'snippet-block'
            }
        });
        conversion.for("dataDowncast").elementToElement({
            model: 'snippetBlock',
            view: (modelElement, writer) => {
                return writer.writer.createContainerElement('div', { class: 'snippet-block disabled' });
            }
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'snippetBlock',
            view: (modelElement, writer) => {
                const viewWriter = writer.writer;
                let domContentWrapper;
                let state;
                let props;
                if (this.editor.config.get('snippet.isReadOnly')) {
                    const editor = this.editor;
                    // Note: You use a more specialized createEditableElement() method here.
                    const tryContentWrapper = viewWriter.createRawElement('div', { class: 'snippet-try-text' }, function (domElement) {
                        domElement.innerHTML = editor.config.get('digisnippet.tryText') || "Try it yourself";
                    });
                    const tryBtnContentWrapper = viewWriter.createRawElement('div', { class: 'snippet-try-div' }, function (domElement) {
                        domContentWrapper = domElement;
                        state = {
                            getRawHtmlValue: () => modelElement
                        };
                        const rawHtmlApi = {
                            openInEditor() {
                                renderContent({ domElement: domContentWrapper, editor, state, props });
                                view.change(writer => {
                                    writer.setAttribute('disabled', 'true', tryBtnContentWrapper);
                                });
                                const _modelElement = state.getRawHtmlValue();
                                let code = "";
                                for (let child of _modelElement.getChildren()) {
                                    for (let content of child.getChildren()) {
                                        if (content.name === "softBreak") {
                                            code += "\n";
                                        }
                                        else {
                                            if (content.data) {
                                                code += content.data;
                                            }
                                        }
                                    }
                                }
                                const openInEditor = editor.config.get('digisnippet.openInEditor');
                                if (openInEditor) {
                                    openInEditor(code);
                                }
                                view.change(writer => {
                                    writer.setAttribute('disabled', 'false', tryBtnContentWrapper);
                                });
                            },
                        };
                        props = {
                            onOpenClick() {
                                rawHtmlApi.openInEditor();
                            }
                        };
                        renderContent({ editor, domElement, state, props });
                        viewWriter.setCustomProperty('rawHtmlApi', rawHtmlApi, viewContainer);
                        viewWriter.setCustomProperty('rawHtml', true, viewContainer);
                    });
                    const section = viewWriter.createContainerElement('div', { class: 'snippet-try d-flex align-items-center justify-content-between' }, [
                        tryContentWrapper, tryBtnContentWrapper
                    ]);
                    const viewContainer = viewWriter.createContainerElement('div', {
                        class: 'snippet-block flex-column-reverse',
                        label: 'snippet box widget',
                    }, [section]);
                    return viewContainer;
                }
                else {
                    // Note: You use a more specialized createEditableElement() method here.
                    const div = viewWriter.createEditableElement('div', { class: 'snippet-block' });
                    return toWidgetEditable(div, viewWriter);
                }
            }
        });
        function createUIButton(editor, type, onClick) {
            const { t } = editor.locale;
            const buttonView = new ButtonView(editor.locale);
            const button_config = editor.config.get('digisnippet.button');
            let class_name = "snippet-try-btn";
            let label = "Open in editor";
            if (button_config) {
                label = editor.config.get('digisnippet.button.text') || label;
                class_name = editor.config.get('digisnippet.button.class') || class_name;
            }
            buttonView.set({
                class: `raw-html-embed__${type}-button ${class_name}`,
                label: t(label),
                withText: true,
                tooltip: true,
                tooltipPosition: editor.locale.uiLanguageDirection === 'rtl' ? 'e' : 'w'
            });
            buttonView.render();
            buttonView.on('execute', onClick);
            return buttonView;
        }
    }
}
