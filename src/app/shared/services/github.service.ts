import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Repo, RepoResponse, TotalRepo } from '../types/interfaces';
import { RepoModel } from '../types/repo';
import { TotalRepoModel } from '../types/totalRepo';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private baseUrl = 'https://api.github.com/orgs/microsoft/repos';
  private orgUrl = 'https://api.github.com/orgs/microsoft';
  private readonly storageKey = 'github_repos';

  /** Получает общее количество репозиториев */
  getTotalRepos(signal?: AbortSignal): Observable<TotalRepo> {
    return from(fetch(this.orgUrl, { signal }).then((response) => response.json())).pipe(
      map((totalRepoResponse) => new TotalRepoModel(totalRepoResponse)),
      catchError(() => of({ publicRepos: 0 } as TotalRepo)) // Если ошибка, возвращаем 0
    );
  }

  /** Получает репозитории с API или из sessionStorage */
  getRepositories(page: number, perPage: number, signal?: AbortSignal): Observable<Repo[]> {
    return from(fetch(`${this.baseUrl}?page=${page}&per_page=${perPage}`, { signal })
      .then((response) => response.json())
    ).pipe(
      map((response) => response.map((repo: RepoResponse) => new RepoModel(repo))),
      tap((repos) => this.saveReposToStorage(repos)),
      catchError(() => this.getReposFromStorage())
    );
  }

  /** Сохраняет репозитории в sessionStorage */
  private saveReposToStorage(repos: Repo[]) {
    sessionStorage.setItem(this.storageKey, JSON.stringify(repos));
  }

  /** Получает репозитории из sessionStorage */
  private getReposFromStorage(): Observable<Repo[]> {
    const data = sessionStorage.getItem(this.storageKey);
    return of(data ? JSON.parse(data) : []);
  }
}
