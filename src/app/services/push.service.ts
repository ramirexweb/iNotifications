import { Injectable, EventEmitter } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  mensajes: OSNotificationPayload[] = [
    // {
    //   title: 'Titulo de la push',
    //   body: 'Esto es el body de la push',
    //   data: new Date()
    // }
  ];

  userId: string;

  pushListener = new EventEmitter<OSNotificationPayload>();

  constructor(
    private oneSignal: OneSignal,
    private storage: Storage
  ) {
    this.cargarMensajes();
  }

  async getMensajes() {
    await this.cargarMensajes();
    return [...this.mensajes];
  }

  initConfig() {
    this.oneSignal.startInit('baae3221-b809-4914-83d5-5c252fe73ca6', '807679854341');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe((info) => {
      // do something when notification is received
      console.log('Notificacion recibida', info);

      this.notificacionRecibida( info );
    });

    this.oneSignal.handleNotificationOpened().subscribe( async (info) => {
      // do something when a notification is opened
      console.log('Notificacion abierta', info);
      await this.notificacionRecibida(info.notification);
    });

    this.oneSignal.getIds().then( info => {
      this.userId = info.userId;
      console.log(this.userId);
    });

    this.oneSignal.endInit();
  }

  async notificacionRecibida( noti: OSNotification ) {

    await this.cargarMensajes();

    const payload = noti.payload;

    const existePush = this.mensajes.find( mensaje => mensaje.notificationID === payload.notificationID);

    if ( existePush ) {
      return;
    }

    this.mensajes.unshift( payload );
    this.pushListener.emit( payload );

    await this.guardadMensajes();
  }

  guardadMensajes() {
    this.storage.set('mensajes', this.mensajes);
  }

  async cargarMensajes() {

    this.mensajes = await this.storage.get('mensajes') || [];
    return this.mensajes;
  }

  async borrarMensajes() {
    await this.storage.clear();
    this.mensajes = [];
    this.guardadMensajes();
  }
}
