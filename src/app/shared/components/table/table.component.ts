import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { GithubService } from '../../services/github.service';
import { from } from 'rxjs';
import type { Repo } from '../../types/interfaces';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
  ],
  providers: [DatePipe],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  /** Текущий индекс страницы */
  pageIndex = 0;
  /** Количество записей страницы */
  pageSize = 10;
  /** Выбранная строка в таблице */
  selectedRow: Repo | null = null;

  /** Колонки, отображаемые в таблице */
  protected readonly displayedColumns: string[] = [
    'name',
    'language',
    'lastPush',
    'archived',
    'homepage',
  ];
  /** Источник данных для таблицы */
  protected readonly dataSource = new MatTableDataSource<Repo>();

  /** Общее количество репозиториев */
  protected totalRepos = 0;

  /** Флаг загрузки данных */
  protected loading = false;

  /** Сервис для работы с GitHub API */
  private readonly gitService = inject(GithubService);

  /** AbortController для отмены запросов */
  private abortController: AbortController | null = null;

  ngOnInit() {
    this.loadTotalRepos();
    const channel = new BroadcastChannel('github-sync');
    channel.onmessage = (event) => {
      if (event.data?.repos) {
        this.dataSource.data = event.data.repos;
        this.pageIndex = event.data.pageIndex;
        this.pageSize = event.data.pageSize;
        this.selectedRow = event.data.selectedRow;
      }
    };
  }

  /** Обрабатывает клик по строке таблицы. */
  onRowClick(row: Repo) {
    this.selectedRow = this.selectedRow?.id === row.id ? null : row;
    this.syncDataWithOtherTabs();
  }

  /** Обрабатывает смену страницы в пагинации. */
  onPageChange(e: PageEvent) {
    if (!this.loading) {
      this.pageSize = e.pageSize;
      this.pageIndex = e.pageIndex;
      this.loadRepos();
    }
  }

  /** Загружает общее количество репозиториев. */
  private loadTotalRepos() {
    if (this.abortController) {
      this.abortController.abort();
    }

    this.abortController = new AbortController();

    this.gitService.getTotalRepos(this.abortController.signal).subscribe({
      next: (res) => {
        this.totalRepos = res.publicRepos;
        this.loadRepos();
      },
      error: (error) => {
        if (error.name !== 'AbortError') {
          console.error('Error fetching total count:', error);
        }
      },
    });
  }

  /** Загружает репозитории с GitHub API. */
  private loadRepos() {
    if (this.abortController) {
      this.abortController.abort();
    }

    this.abortController = new AbortController();

    this.loading = true;
    this.gitService
      .getRepositories(
        this.pageIndex,
        this.pageSize,
        this.abortController.signal
      )
      .subscribe({
        next: (res) => {
          this.dataSource.data = res.map(
            ({ id, name, language, pushedAt, archived, homepage }) => ({
              id,
              name,
              language,
              pushedAt,
              archived,
              homepage,
            })
          );
          this.syncDataWithOtherTabs();
        },
        error: (error) => {
          if (error.name !== 'AbortError') {
            console.error('Error fetching repositories:', error);
          }
        },
        complete: () => (this.loading = false),
      });
  }

  /** Синхронизирует данные между вкладками браузера. */
  private syncDataWithOtherTabs() {
    const channel = new BroadcastChannel('github-sync');
    channel.postMessage({
      repos: this.dataSource.data,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      selectedRow: this.selectedRow,
    });
  }

  /** Обрабатывает нажатие клавиш для копирования данных (Alt + C или Cmd + C). */
  @HostListener('document:keydown', ['$event'])
  private onAltC(event: KeyboardEvent) {
    if ((event.metaKey || event.altKey) && event.key === 'c') {
      this.copyTableToClipboard();
    }
  }

  /** Копирует данные таблицы в буфер обмена. */
  private copyTableToClipboard() {
    from(
      navigator.clipboard.writeText(
        this.convertTableToCSV(this.dataSource.data)
      )
    ).subscribe();
  }

  /** Конвертирует данные таблицы в формат CSV. */
  private convertTableToCSV(data: any[]): string {
    const header = this.displayedColumns.join(',');
    const rows = data.map((row) =>
      this.displayedColumns
        .map((col) => (row[col] ? `"${row[col]}"` : ''))
        .join(',')
    );
    return [header, ...rows].join('\n');
  }
}
