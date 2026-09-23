import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService extends BaseService {

  private API_URL = 'http://localhost:5000/api/';



  getAllMasterData(): Observable<any> {
    return this.get<any>(`${this.API_URL}/master-data`);
  }

  getMasterDataByCategory(category: string): Observable<any> {
    return this.get<any>(`${this.API_URL}/master-data/${category}`);
  }
}
