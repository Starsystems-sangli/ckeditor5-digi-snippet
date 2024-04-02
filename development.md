# Development
This package have highly completed things to implement and using the custom plugins.

### Required things
Make sure node version >= 18.0.0. In lower version this never work.

### For development
Change the `tsconfig.json` content as below one
```json
{
  "compilerOptions": {
    "lib": [
      "DOM",
      "DOM.Iterable"
    ],
    "noImplicitAny": true,
    "noImplicitOverride": true,
    "strict": true,
    "module": "es6",
    "target": "es2020",
    "sourceMap": true,
    "allowJs": true,
    "moduleResolution": "node",
    "typeRoots": [
      "typings",
      "node_modules/@types"
    ]
  },
  "include": [
    "./sample",
    "./src",
    "./tests",
    "./typings"
  ]
}
```

### For compile
Change the `tsconfig.json` content as below one
```json
{
	"extends": "../../tsconfig.release.json",
	"include": [
		"src",
		"../../typings"
	],
	"exclude": [
		"tests"
	]
}

```

## How to compile
1. Create the new folder like ckeditormaster.
2. Download the version 40.1.0 [ckeditor5](https://github.com/ckeditor/ckeditor5/archive/refs/tags/v40.1.0.zip).
3. Move download zip file inside the ckeditormaster folder inside.
4. Extract the zip file and move inside the folder. 
5. Run the `yarn install`
6. Copy this folder and move inside the packages. Do this after complete development.
7. Then goto to the `ckeditor5-build-classic` folder. And edit the package.json. 
8. Add this in package.json `"@ckeditor/ckeditor5-digi-snippet": "file:../ckeditor5-digi-snippet"`.
9. Then run the `yarn build` after made the changes. Refer below mentioned `ts` file for changes. Location `src/ckeditor.ts`.
10. Copy the entire folder of ckeditor5-build-classic and paste inside the digilabs. where located the ckeditor folder. Then delete that and rename this as ckeditor.
11. Copy this folder after run the `ts:build` and move inside the digilabs root folder. And then follow the point8 for change web-ui package.json.
12. Remove the `ts` files and `node_module` inside copied folder.

#### ts file
```typescript

/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import { ClassicEditor as ClassicEditorBase } from '@ckeditor/ckeditor5-editor-classic';

import { CodeBlock } from '@ckeditor/ckeditor5-code-block';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { UploadAdapter } from '@ckeditor/ckeditor5-adapter-ckfinder';
import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CKBox } from '@ckeditor/ckeditor5-ckbox';
import { CKFinder } from '@ckeditor/ckeditor5-ckfinder';
import { EasyImage } from '@ckeditor/ckeditor5-easy-image';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { AutoImage, Image, ImageCaption, ImageStyle, ImageToolbar, ImageUpload, PictureEditing } from '@ckeditor/ckeditor5-image';
import { Indent } from '@ckeditor/ckeditor5-indent';
import { Link } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
import { Table, TableToolbar } from '@ckeditor/ckeditor5-table';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';
import { CloudServices } from '@ckeditor/ckeditor5-cloud-services';
import { DigiSnippet } from "@ckeditor/ckeditor5-digi-snippet";
import { Base64UploadAdapter } from '@ckeditor/ckeditor5-upload';


export default class ClassicEditor extends ClassicEditorBase {
	public static override builtinPlugins = [
		Essentials,
		UploadAdapter,
		AutoImage,
		Autoformat,
		Base64UploadAdapter,
		Bold,
		Italic,
		CodeBlock,
		BlockQuote,
		CKBox,
		CKFinder,
		CloudServices,
		EasyImage,
		Heading,
		Image,
		ImageCaption,
		ImageStyle,
		ImageToolbar,
		ImageUpload,
		Indent,
		Link,
		List,
		MediaEmbed,
		Paragraph,
		PasteFromOffice,
		PictureEditing,
		Table,
		TableToolbar,
		TextTransformation,
		DigiSnippet
	];

	public static override defaultConfig = {
		toolbar: {
			items: [
				'undo', 'redo',
				'|', 'heading',
				'|', 'bold', 'italic',
				'|', 'link', 'uploadImage', 'insertTable', 'blockQuote', 'mediaEmbed',
				'|', 'bulletedList', 'numberedList', 'outdent', 'indent', '|', 'digiSnippetButton',
				'|', 'alignment', 'codeBlock'
			]
		},
		image: {
			toolbar: [
				'imageStyle:inline',
				'imageStyle:block',
				'imageStyle:side',
				'|',
				'toggleImageCaption',
				'imageTextAlternative'
			]
		},
		table: {
			contentToolbar: [
				'tableColumn',
				'tableRow',
				'mergeTableCells'
			]
		},
		// This value must be kept in sync with the language defined in webpack.config.js.
		language: 'en',
		digisnippet: {
			openInEditor: (val: any) => console.log(val)
		}
	};
}

```