import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';
import { GithubService } from '../../services/github.service';
import { of } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  let githubServiceMock: jasmine.SpyObj<GithubService>;

  beforeEach(async () => {
    githubServiceMock = jasmine.createSpyObj('GithubService', ['getTotalRepos', 'getRepositories']);
  
    githubServiceMock.getTotalRepos.and.returnValue(of({ publicRepos: 42 }));
    githubServiceMock.getRepositories.and.returnValue(of([]));
  
    await TestBed.configureTestingModule({
      imports: [TableComponent, MatTableModule, MatPaginatorModule, MatProgressSpinnerModule],
      providers: [{ provide: GithubService, useValue: githubServiceMock }],
    }).compileComponents();
  
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
  });
  

  it('should load total repository count on init', () => {
    githubServiceMock.getTotalRepos.and.returnValue(of({ publicRepos: 42 }));
    component.ngOnInit();
    expect(githubServiceMock.getTotalRepos).toHaveBeenCalled();
  });

  it('should handle row click selection', () => {
    const mockRepo = { id: 1, name: 'Repo1' } as any;
    component.onRowClick(mockRepo);
    expect(component.selectedRow).toEqual(mockRepo);
    component.onRowClick(mockRepo);
    expect(component.selectedRow).toBeNull();
  });

  it('should load repositories when page changes', () => {
    githubServiceMock.getRepositories.and.returnValue(of([]));
    const pageEvent = { pageIndex: 1, pageSize: 10 } as any;
    component.onPageChange(pageEvent);
    expect(component.pageIndex).toBe(1);
    expect(component.pageSize).toBe(10);
    expect(githubServiceMock.getRepositories).toHaveBeenCalled();
  });

  it('should convert table data to CSV format', () => {
    const mockData = [
      {
        name: 'Repo1',
        language: 'JavaScript',
        lastPush: '2022-01-01',
        archived: false,
        homepage: 'https://example.com',
      },
    ];
    const csv = component['convertTableToCSV'](mockData);
    expect(csv).toContain('name,language,lastPush,archived,homepage');
    expect(csv).toContain(
      '"Repo1","JavaScript","2022-01-01",,"https://example.com"'
    );
  });

  it('should copy table data to clipboard', () => {
    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    component['copyTableToClipboard']();
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
