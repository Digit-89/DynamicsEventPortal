import { environment } from './../../environments/environment';
import { HttpHelper } from '../helpers/HttpHelper';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, share, map, catchError } from 'rxjs/operators';
import { LabelsModel } from '../models/LabelsModel';

@Injectable()
export class LabelsService {

    private static readonly labelsEndpoint: string = 'api/labels';
    private apiCall$: Observable<LabelsModel>;

    labelsModel: LabelsModel;

    constructor(private http: HttpHelper) {
        this.apiCall$ = this.http.get<LabelsModel>(`${environment.baseUrl}${LabelsService.labelsEndpoint}/get/`).pipe(
            tap(labelsModel => {
                this.labelsModel = labelsModel;
                if(labelsModel && labelsModel.labels && labelsModel.labels["RefreshPaage"]){
                    this.http.refreshPage = labelsModel.labels["RefreshPage"];
                }
            }),
            catchError((err, caught) => {
                this.labelsModel = {
                    labels: {},
                    isJapanese: false
                };
                return of(this.labelsModel);
            }),
            share());
    }

    public getLabelsModel(): Observable<LabelsModel> {
        if (this.labelsModel !== undefined) {
            return of(this.labelsModel);
        } else {
            return this.apiCall$;
        }
    }

    public translateLabel(key: string, defaultValue?: string): Observable<string> {
        return this.getLabelsModel().pipe(map(labelsModel => {
            if (labelsModel.labels[key] !== undefined) {
                return labelsModel.labels[key];
            } else {
                return defaultValue !== undefined ? defaultValue : key;
            }
        }));
    }

    public labelsLoaded(): boolean {
        return this.labelsModel !== undefined;
    }
}
