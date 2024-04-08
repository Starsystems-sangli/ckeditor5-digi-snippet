import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView } from '@ckeditor/ckeditor5-ui';
import '../theme/snippet.css';
import plus from '../theme/icons/plus.svg';
export default class DigiSnippetUI extends Plugin {
    static get pluginName() {
        return 'DigiSnippetUI';
    }
    init() {
        const editor = this.editor;
        const t = editor.t;
        editor.ui.componentFactory.add('digiSnippetButton', local => {
            const command = editor.commands.get('insertDigiSnippet');
            const buttonView = new ButtonView(local);
            buttonView.set({
                label: t('Snippet'),
                withText: true,
                tooltip: true,
                class: 'snippet-btn',
                icon: plus
            });
            buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');
            buttonView.listenTo(buttonView, 'execute', () => editor.execute('insertDigiSnippet'));
            return buttonView;
        });
    }
}
