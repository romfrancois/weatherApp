This is an app written for a job interview.

Main purpose of this app is to:
- Type in a city (list provided by Google SearchBox)
- Once validated, query OpenWeather api to retrieve weather forecast
    for the next 5 days
- Present all data in a not too ugly UI

It uses RxJS, node, some 3rd api (cf `package.json` for the list)

Once downloaded:
- Go into the main directory
- Fire `npm i`
- `chmod 755 build.sh`
- Execute `./build.sh` script
- In your favorite browser, launch `index.html` from main directory

Some UT are also there. Just `npm test` in your console.

You may have to manually create `/build/js` diretories if not present.
Could be part of the script but that the role of the CI after all isn't it?
