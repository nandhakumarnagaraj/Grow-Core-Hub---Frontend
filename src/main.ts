import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';

(async () => {
  try {
    await bootstrapApplication(App, appConfig);
    console.log('Application bootstrapped successfully!');
  } catch (err) {
    console.error('Bootstrap failed:', err);
  }
})();
