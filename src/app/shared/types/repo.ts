import { Repo, RepoResponse } from './interfaces';

/** Модель репозитория, используемая для представления данных репозитория.
 * Преобразует данные ответа от API GitHub в объект с типизированными полями. */
export class RepoModel implements Repo {
  private _id: number;
  private _name: string;
  private _language: string | null = null;
  private _pushedAt: Date;
  private _archived: boolean | null = null;
  private _homepage: string | null = null;

  constructor(response: RepoResponse) {
    if (!response.id) {
      throw new Error('Expect id in Repo response');
    }
    this._id = response.id;

    if (!response.name) {
      throw new Error('Expect name in Repo response');
    }
    this._name = response.name;

    if (response.language) {
      this._language = response.language;      
    }

    if (!response.pushed_at) {
      throw new Error('Expect pushedAt in Repo response');
    }
    this._pushedAt = response.pushed_at;

    if (response.archived) {
      this._archived = response.archived;
    }

    if (response.homepage) {
      this._homepage = response.homepage;
    }
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get language() {
    return this._language;
  }

  get pushedAt() {
    return this._pushedAt;
  }

  get archived() {
    return this._archived;
  }

  get homepage() {
    return this._homepage;
  }
}
