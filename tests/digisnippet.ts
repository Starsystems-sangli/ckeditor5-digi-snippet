import { expect } from 'chai';
import DigiSnippet from '../src/digisnippet.js';

describe('DigiSnippet', () => {
	it('should be named', () => {
		expect(DigiSnippet.pluginName).to.equal('DigiSnippet');
	});


});
