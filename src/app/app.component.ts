import { Component } from '@angular/core';
import { TableComponent } from './shared/components/table/table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<app-table></app-table>`,
  imports: [TableComponent],
})
export class AppComponent {}
