import { expect } from 'chai';
import { NlpHub } from './index';
import luisMock from './engines/luis/test/luis.mock';
import * as Constants from './engines/luis/test/luis.constants.spec';
luisMock(Constants.BASE_PATH);

describe('nlp-hub', () => {
  it('can be constructed', () => {
    const sut: NlpHub = new NlpHub('lib/test/app.json');
    expect(sut).to.be.instanceof(NlpHub);
  });

  it('can be set threshold', () => {
    const sut: NlpHub = new NlpHub('lib/test/app.json');
    expect(sut.threshold).to.be.equals('0.8');
  });

  it('can be set apps', () => {
    const sut: NlpHub = new NlpHub('lib/test/app.json');
    expect(sut.apps[0].id).to.be.equals('HolaRegex');
  });

  describe('firstMatch', () => {
    describe('regex', () => {

      it('pass "Hola" and get greetings', async () => {
        const sut: NlpHub = new NlpHub('lib/test/app.json');
        const utterance: string = 'Hola';
        const responseExpected = {
          engine: 'regex',
          intent: {
            name: 'greetings',
            score: 1,
          },
          entities: [],
        };
        const response: any = await sut.firstMatch(utterance);
        expect(response).to.be.deep.equals(responseExpected);
      });

      it('pass "Comprar vuelo" and get recommender', async () => {
        const sut: NlpHub = new NlpHub('lib/test/app.json');
        const utterance: string = 'Comprar vuelo';
        const responseExpected = {
          engine: 'regex',
          intent: {
            name: 'recommender',
            score: 1,
          },
          entities: [],
        };
        const response: any = await sut.firstMatch(utterance);
        expect(response).to.be.deep.equals(responseExpected);
      });

      it('pass "QUERY_200" and get none', async () => {

        const sut: NlpHub = new NlpHub('lib/test/app.json');
        const utterance: string = 'QUERY_200';
        const responseExpected = {
          engine: 'regex',
          intent: {
            name: 'noneDialog',
            score: 1,
          },
        };
        const response: any = await sut.firstMatch(utterance);
        expect(response).to.be.deep.equals(responseExpected);
      });

    } );
  });
});
