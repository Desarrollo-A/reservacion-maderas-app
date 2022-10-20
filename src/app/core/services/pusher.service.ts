import { Injectable } from '@angular/core';
import { UserSessionService } from "./user-session.service";
import { environment } from "../../../environments/environment";

declare const Pusher: any;

@Injectable({
  providedIn: 'root'
})
export class PusherService {
  pusher: any;

  constructor(private userSessionService: UserSessionService) {}

  initPusher(): void {
    // Pusher.logToConsole = true;
    this.pusher = new Pusher(environment.pusher.key, {
      cluster: environment.pusher.cluster,
      encrypted: true,
      authEndpoint: `${environment.baseUrl+environment.api}auth/pusher`,
      auth: {
        headers: {
          'Authorization': `Bearer ${this.userSessionService.token}`
        }
      }
    });
  }

  channel(channelName: string): any {
    return this.pusher.subscribe(channelName);
  }

  disconnectPusher(): void {
    this.pusher.disconnect();
  }
}
