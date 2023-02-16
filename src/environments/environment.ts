// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // baseUrl: 'http://127.0.0.1:8000/',
  baseUrl: 'http://192.168.30.209:8000/',
  api: 'api/v1/',
  baseUrlCapital: 'https://prueba.gphsis.com/RHCV/index.php/WS/',
  pusher: {
    key: '4a68117c59cf332d4053',
    cluster: 'us2'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
