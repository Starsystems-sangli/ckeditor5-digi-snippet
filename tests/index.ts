import { expect } from 'chai';
import { DigiSnippet as DigiSnippetDll } from '../src';
import DigiSnippet from '../src/digisnippet';

import ckeditor from './../theme/icons/ckeditor.svg';

describe( 'CKEditor5 DigiSnippet DLL', () => {
	it( 'exports DigiSnippet', () => {
		expect( DigiSnippetDll ).to.equal( DigiSnippet );
	} );
} );
