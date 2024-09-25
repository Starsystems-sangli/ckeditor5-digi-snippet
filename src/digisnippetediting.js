// CKEditor 
import { Plugin } from '@ckeditor/ckeditor5-core';
import { Widget, toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget';
import { ShiftEnter } from 'ckeditor5/src/enter';
import { ButtonView } from 'ckeditor5/src/ui';
import { createElement } from 'ckeditor5/src/utils';
import snippet from '../theme/icons/snippet.svg';
import snippetdelete from '../theme/icons/snippetdelete.svg';
// Snippet Plugin components
import InsertSnippetCommand from './Insertdigisnippetcommand';
import { getLeadingWhiteSpaces } from './utils';
export default class DigiSnippetEditing extends Plugin {
    constructor() {
        super(...arguments);
        this._widgetButtonViewReferences = new Set();
    }
    static get pluginName() {
        return 'DigiSnippetEditing';
    }
    static get requires() {
        return [Widget, ShiftEnter];
    }
    init() {
        this._defineSchema();
        this._defineConverters();
        this.editor.commands.add('insertDigiSnippet', new InsertSnippetCommand(this.editor));
    }
    _defineSchema() {
        const schema = this.editor.model.schema;
        schema.register('snippet', {
            inheritAllFrom: '$blockObject',
        });
        schema.register('snippetBlock', {
            allowIn: 'snippet',
            allowWhere: '$block',
            allowChildren: '$text',
            isBlock: true,
            isLimit: true,
            allowAttributes: ['language', 'class', 'classes', 'title']
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
            view: (modelElement, writer) => {
                const viewWriter = writer.writer;
                let domContentWrapper;
                let state;
                let props;
                const editor = this.editor;
                const { t } = editor.locale;
                if (this.editor.config.get('digisnippet.isReadOnly')) {
                    // Note: You use a more specialized createEditableElement() method here.
                    const editMode = false;
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
                                renderContent({ domElement: domContentWrapper, editor, state, props, editMode });
                                view.change(writer => {
                                    writer.setAttribute('disabled', 'true', tryBtnContentWrapper);
                                });
                                const _modelElement = state.getRawHtmlValue();
                                let code = "";
                                for (let child of _modelElement.getChildren()) {
                                    for (let content of child.getChildren()) {
                                        if (content?.name === "softBreak") {
                                            code += "\n";
                                        }
                                        else {
                                            if (content?.data) {
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
                        renderContent({ editor, domElement, state, props, editMode });
                        viewWriter.setCustomProperty('rawHtmlApi', rawHtmlApi, viewContainer);
                        viewWriter.setCustomProperty('rawHtml', true, viewContainer);
                    });
                    const try_section = viewWriter.createContainerElement('div', { class: 'snippet-try d-flex align-items-center justify-content-between' }, [
                        tryContentWrapper, tryBtnContentWrapper
                    ]);
                    const viewContainer = viewWriter.createContainerElement('section', {
                        class: 'snippet-box flex-column-reverse',
                        label: 'snippet widget',
                    }, [try_section]);
                    return viewContainer;
                }
                else {
                    // Note: You use a more specialized createEditableElement() method here.
                    // const div = viewWriter.createEditableElement('div', { class: 'snippet-box' });
                    const viewContainer = viewWriter.createContainerElement('section', {
                        class: 'snippet-box flex-column-reverse create-mode',
                        label: 'snippet widget',
                    });
                    const div = viewWriter.createRawElement('div', {
                        class: 'snippet-delete-section'
                    }, function (domElement) {
                        domContentWrapper = domElement;
                        const editMode = true;
                        state = {
                            getRawHtmlValue: () => modelElement
                        };
                        const rawHtmlApi = {
                            deleteSnippet() {
                                renderContent({ editor, domElement, state, props, editMode });
                                try {
                                    const child_node = viewContainer.getChild(0);
                                    viewWriter.remove(child_node);
                                    viewWriter.remove(div);
                                    const _modelElement = state.getRawHtmlValue();
                                    viewContainer._setAttribute('class', 'snippet-box d-none');
                                    _modelElement._removeChildren(0, 1);
                                    // _modelElement._remove();
                                    editor.model.change(writer => {
                                        writer.remove(_modelElement);
                                    });
                                }
                                catch (error) {
                                    console.log(error);
                                }
                                // editor.focus();
                            },
                        };
                        props = {
                            onOpenClick() { },
                            onDeleteClick() {
                                rawHtmlApi.deleteSnippet();
                            }
                        };
                        renderContent({ editor, domElement, state, props, editMode });
                    });
                    viewWriter.insert(viewWriter.createPositionAt(viewContainer, 0), div);
                    return toWidget(viewContainer, viewWriter, {
                        label: t('HTML snippet'),
                        hasSelectionHandle: true
                    });
                }
            }
        });
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
                return writer.writer.createContainerElement('div', { class: 'snippet-block' });
            }
        });
        conversion.for('editingDowncast').elementToElement({
            model: 'snippetBlock',
            view: (modelElement, writer) => {
                const viewWriter = writer.writer;
                // Note: You use a more specialized createEditableElement() method here.
                const div = viewWriter.createEditableElement('div', { class: 'snippet-block' });
                return toWidgetEditable(div, viewWriter);
            }
        });
        function renderContent({ editor, domElement, state, props, editMode }) {
            domElement.textContent = '';
            const domDocument = domElement.ownerDocument;
            domElement.prepend(createDomButtonsWrapper({ editor, domDocument, state, props, editMode }));
        }
        function createDomButtonsWrapper({ editor, domDocument, state, props, editMode }) {
            const domButtonsWrapper = createElement(domDocument, 'div', {
                class: editMode ? 'raw-html-embed_delete_buttons-wrapper' : 'raw-html-embed__buttons-wrapper'
            });
            if (!editMode) {
                const button_hide = editor.config.get('digisnippet.button.hide');
                if (!button_hide) {
                    const saveButtonView = createUIButton(editor, 'save', props.onOpenClick);
                    domButtonsWrapper.append(saveButtonView.element);
                    widgetButtonViewReferences.add(saveButtonView);
                }
            }
            else {
                const deleteButton = createDeleteButton(editor, props?.onDeleteClick);
                domButtonsWrapper.append(deleteButton.element);
                widgetButtonViewReferences.add(deleteButton);
            }
            return domButtonsWrapper;
        }
        function createDeleteButton(editor, onClick) {
            const { t } = editor.locale;
            const buttonView = new ButtonView(editor.locale);
            buttonView.set({
                class: `raw-html-embed__delete-button`,
                label: t('Delete'),
                icon: snippetdelete,
                tooltip: true,
                tooltipPosition: editor.locale.uiLanguageDirection === 'rtl' ? 'e' : 'w'
            });
            buttonView.render();
            if (onClick) {
                buttonView.on('execute', onClick);
            }
            return buttonView;
        }
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
                icon: snippet,
                withText: true,
                tooltip: true,
                tooltipPosition: editor.locale.uiLanguageDirection === 'rtl' ? 'e' : 'w'
            });
            buttonView.render();
            buttonView.on('execute', onClick);
            return buttonView;
        }
    }
    afterInit() {
        const editor = this.editor;
        this.listenTo(editor.editing.view.document, 'enter', (evt, data) => {
            const positionParent = editor.model.document.selection.getLastPosition().parent;
            if (!positionParent.is('element', 'snippetBlock')) {
                return;
            }
            breakLineOnEnter(editor);
            data.preventDefault();
            evt.stop();
        }, { context: 'div' });
    }
}
function breakLineOnEnter(editor) {
    const model = editor.model;
    const modelDoc = model.document;
    const lastSelectionPosition = modelDoc.selection.getLastPosition();
    const node = lastSelectionPosition.nodeBefore || lastSelectionPosition.textNode;
    let leadingWhiteSpaces;
    // Figure out the indentation (white space chars) at the beginning of the line.
    if (node && node.is('$text')) {
        leadingWhiteSpaces = getLeadingWhiteSpaces(node);
    }
    // Keeping everything in a change block for a single undo step.
    editor.model.change((writer) => {
        editor.execute('shiftEnter');
        // If the line before being broken in two had some indentation, let's retain it
        // in the new line.
        if (leadingWhiteSpaces) {
            writer.insertText(leadingWhiteSpaces, modelDoc.selection.anchor);
        }
    });
}
