import { Command } from '@ckeditor/ckeditor5-core';
export default class InsertDigiSnippetCommand extends Command {
    execute(...args) {
        this.editor.model.change(writer => {
            this.editor.model.insertObject(createSnippetBox(writer));
        });
    }
    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const checking = selection?.getFirstPosition();
        const allowedIn = checking ? model.schema.findAllowedParent(checking, 'snippet') : null;
        this.isEnabled = allowedIn !== null;
    }
}
function createSnippetBox(writer) {
    const snippetBox = writer.createElement('snippet');
    const snippetBlock = writer.createElement('snippetBlock');
    writer.append(snippetBlock, snippetBox);
    // There must be at least one paragraph for the description to be editable.
    // See https://github.com/ckeditor/ckeditor5/issues/1464.
    writer.appendElement('paragraph', snippetBlock);
    return snippetBox;
}
