import type { DigiSnippet, DigiSnippetEditing, DigiSnippetUI, DigiSnippetConfig, InsertDigiSnippetCommand } from '.';
declare module '@ckeditor/ckeditor5-core' {
    interface EditorConfig {
        digisnippet?: DigiSnippetConfig;
    }
    interface PluginsMap {
        [DigiSnippet.pluginName]: DigiSnippet;
        [DigiSnippetEditing.pluginName]: DigiSnippetEditing;
        [DigiSnippetUI.pluginName]: DigiSnippetUI;
    }
    interface CommandsMap {
        insertDigiSnippet: InsertDigiSnippetCommand;
    }
}
