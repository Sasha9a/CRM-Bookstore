import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'crm-root',
  templateUrl: './app.component.html',
  styleUrls: [],
})
export class AppComponent {

  constructor(private http: HttpClient) {}
}
