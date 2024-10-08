/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* globals ClassicEditor, console, window, document */
import ClassicEditor from '../build-classic.js';

import { CS_CONFIG } from '@ckeditor/ckeditor5-cloud-services/tests/_utils/cloud-services-config.js';
import { TOKEN_URL } from '@ckeditor/ckeditor5-ckbox/tests/_utils/ckbox-config.js';

ClassicEditor
    .create(document.querySelector('#snippet-digi-snippet'), {
        cloudServices: CS_CONFIG,
        toolbar: {
            items: [
                'undo', 'redo', '|', 'heading',
                '|', 'bold', 'italic', 'code',
                '|', 'link', 'insertImage', 'insertTable', 'mediaEmbed', 'codeBlock',
                '|', 'bulletedList', 'numberedList', 'outdent', 'indent', 'digiSnippetButton'
            ]
        },
        image: {
            toolbar: [
                'imageStyle:inline', 'imageStyle:block', 'imageStyle:wrapText', '|',
                'toggleImageCaption', 'imageTextAlternative', 'ckboxImageEdit'
            ]
        },
        ui: {
            viewportOffset: {
                top: window.getViewportTopOffsetConfig()
            }
        },
        ckbox: {
            tokenUrl: TOKEN_URL,
            allowExternalImagesEditing: [/^data:/, 'origin', /ckbox/],
            forceDemoLabel: true
        }
    })
    .then(editor => {
        window.editor = editor;

        window.attachTourBalloon({
            target: window.findToolbarItem(editor.ui.view.toolbar,
                item => item.buttonView && item.buttonView.label && item.buttonView.label === 'Digi snippet'
            ),
            text: 'Content for a tooltip is displayed when a user hovers the CKEditor 5 icon.',
            editor
        });
    })
    .catch(err => {
        console.error(err.stack);
    });