import { TotalRepo, TotalRepoResponse } from "./interfaces";

/** Модель колличества репозиториев, используемая для представления данных о колличестве репозиториев.
 * Преобразует данные ответа от API GitHub в объект с типизированным полем. */
export class TotalRepoModel implements TotalRepo {
  private _publicRepos: number;

  constructor(response: TotalRepoResponse) {
    if (!response.public_repos) {
      throw new Error('Expect publicRepos in TotalRepo response');
    }
    this._publicRepos = response.public_repos;
  }

  get publicRepos() {
    return this._publicRepos;
  }
}