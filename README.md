# GitHub Repositories Viewer

## Описание проекта

Этот проект представляет собой веб-приложение, которое отображает список репозиториев компании Microsoft с использованием GitHub REST API. Приложение реализовано на Angular 19.1.0.

![app_screenshot](https://github.com/SurPrizoV/git-repos/blob/main/public/assets/screenshot.png?raw=true)

## Функциональность

Отображение таблицы с репозиториями Microsoft.  
Автоматическое наполнение таблицы при загрузке страницы.  
Постраничный вывод с возможностью изменения размера страницы(10, 50, 100 элементов).  

Столбцы таблицы: 

Наименование репозитория.  
Используемый язык программирования.  
Дата/время последнего push.  
Признак архивности.  
Ссылка на домашнюю страницу проекта.  

Интерактивность таблицы: 

Выделение строки при наведении курсора.  
Выделение строки при клике.  

Расположение и оформление: 

Таблица с кнопками расположена по центру страницы.  
Стилизация страницы для приятного UI/UX.  

Обработка запросов к серверу: 

Блокировка элементов управления во время запроса.  
Отмена запроса с помощью AbortController.  
Отображение индикатора загрузки во время выполнения запроса.  

Синхронизация данных между вкладками: 

 Если данные загружены в одной вкладке, они автоматически отобразятся в другой без повторного запроса.  

Оффлайн-режим: 

Если интернет-соединение пропало, но страница обновилась, последние загруженные данные сохраняются и отображаются.  

Копирование данных: 

По нажатию ALT + C содержимое таблицы копируется в буфер обмена в CSV-подобном формате.  

## Используемые технологии

Angular 19.1.0  
TypeScript  
RxJS  
Angular Material  
Docker  
Jasmine/Karma  

## Установка и запуск

Локальный запуск

```bash
#Клонировать репозиторий:
git clone https://github.com/SurPrizoV/git-repos
cd ./git-repos

#Установить зависимости:
npm install

#Запустить приложение:
npm run start

Открыть в браузере: http://localhost:4200
```

Запуск в Docker

```bash
#Собрать Docker-образ:
docker build -t git-repos .

#Запустить контейнер:
docker run -d -p 8080:80 git-repos

Открыть в браузере: http://localhost:8080
```

## Тестирование

Для запуска unit-тестов:

```bash
npm run test
```

## Деплой

Приложение задеплоено и доступно по [ссылке.](https://git-repos-one.vercel.app)
