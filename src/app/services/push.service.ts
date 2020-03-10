import { Injectable } from '@angular/core';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  constructor(
    private oneSignal: OneSignal
  ) { }

  initConfig() {
    this.oneSignal.startInit('baae3221-b809-4914-83d5-5c252fe73ca6', '807679854341');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

    this.oneSignal.handleNotificationReceived().subscribe((info) => {
      // do something when notification is received
      console.log('Notificacion recibida', info);
    });

    this.oneSignal.handleNotificationOpened().subscribe((info) => {
      // do something when a notification is opened
      console.log('Notificacion abierta', info);
    });

    this.oneSignal.endInit();
  }
}
