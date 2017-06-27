# WeatherApp

This is an app written for a job interview.

## Purpose

Main purpose of this app is to:
- Type in a city (list provided by Google SearchBox)
- Once validated, query OpenWeather api to retrieve weather forecast
    for the next 5 days
- Present all data in a not too ugly UI

It uses RxJS, node, some 3rd api (cf `package.json` for the list)

## Installation

Once downloaded:
- Go into the main directory
- Fire
```bash
npm i
```

- ```bash
chmod 755 build.sh
```

- Execute
```bash
./build.sh
```

- You may have to manually create `/build/js` directories if not present.
<br>Could be part of the script but that the role of the CI after all isn't it?

## Launch
In your favorite browser, launch `index.html` from main directory

## Unit Tests
Some UT are also there. Just
```bash
npm test
```
in your console.
