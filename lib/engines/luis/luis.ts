import request = require('request');
// import http = require('http');
import { IApp, IAppResponse, IIntentApp } from '../../model/app';
import { IIntentLuis } from '../../model/luis-response';
import { EngineRecognizer } from '../engine';
// import { IEntity, ILuisResponse } from '../../model/luis-response';


export class LuisApp extends EngineRecognizer{

    _baseUri: string;
    _baseQueryString: any;

    constructor(app: IApp) {
        super();
        this._baseUri = `${app.appHost}/luis/v2.0/apps/${app.appId}`;
        this._baseQueryString = {
            'subscription-key': app.key,
            timezoneOffset: 0,
            verbose: true,
            q: ''
        }
    }

    // TODO: Revisar el tipo de promesa retornada { response: http.IncomingMessage; body: any; }
    public async recognice(utterance: string): Promise<IAppResponse> {
        return new Promise((resolve, reject) => {
            const queryString = this._baseQueryString;
            queryString.q = utterance;
            const options:  request.Options = {
                method: 'GET',
                uri: `${this._baseUri}`,
                qs: queryString
            };
            try {
                request(options, (error, response, body) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (response.statusCode && 
                            response.statusCode >= 200 && response.statusCode <= 299) {
                            const bodyObject = JSON.parse(body);
                            const intent: IIntentApp = {
                                name: bodyObject.topScoringIntent.intent,
                                score: bodyObject.topScoringIntent.score,
                            };
                            /* TODO: Hacer un tipo */
                            const myResponse: IAppResponse = {
                                engine: 'luis',
                                intent: intent,
                                entities: bodyObject.entities,
                                originalResponse: body,
                            };
                            resolve(myResponse);
                        } else {
                            reject({ response: response, body: body });
                        }
                    }
                });
            } catch (error) {
                reject(error)
            }
            
        }) ;
    }
}
