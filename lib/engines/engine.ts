import { IAppResponse } from "../model/app";

export abstract class EngineRecognizer {
    abstract async recognice(utterance: string): Promise<IAppResponse>;
}