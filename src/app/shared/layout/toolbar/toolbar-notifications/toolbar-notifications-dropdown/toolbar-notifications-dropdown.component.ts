import { Component, OnInit } from '@angular/core';
import { Notification } from '../interfaces/notification.interface';
import { DateTime } from 'luxon';
import { trackById } from '../../../../utils/track-by';

@Component({
  selector: 'vex-toolbar-notifications-dropdown',
  templateUrl: './toolbar-notifications-dropdown.component.html',
  styleUrls: ['./toolbar-notifications-dropdown.component.scss']
})
export class ToolbarNotificationsDropdownComponent implements OnInit {

  notifications: Notification[] = [
    {
      id: '1',
      label: 'Sala Carranza',
      icon: 'mat:meeting_room',
      colorClass: 'text-primary',
      datetime: DateTime.local().minus({ hour: 1 })
    },
    {
      id: '2',
      label: 'Automóvil - Nissan Sentra',
      icon: 'mat:directions_car',
      colorClass: 'text-gray',
      datetime: DateTime.local().minus({ hour: 2 })
    },
    {
      id: '3',
      label: 'Chofer - Juanito Pérez',
      icon: 'mat:face',
      colorClass: 'text-orange',
      datetime: DateTime.local().minus({ hour: 5 })
    },
    {
      id: '10',
      label: 'Inventario bajo - Coca regular 235 ml',
      icon: 'mat:inventory_2',
      colorClass: 'text-purple',
      datetime: DateTime.local().minus({ hour: 5 })
    },
    {
      id: '4',
      label: 'Sala Carranza',
      icon: 'mat:meeting_room',
      colorClass: 'text-primary',
      datetime: DateTime.local().minus({ hour: 9 }),
      read: true
    },
    {
      id: '5',
      label: 'Automóvil - Nissan Frontier',
      icon: 'mat:directions_car',
      colorClass: 'text-gray',
      datetime: DateTime.local().minus({ hour: 30 }),
      read: true
    },
    {
      id: '6',
      label: 'Chofer - Margarita Mendoza',
      icon: 'mat:face',
      colorClass: 'text-orange',
      datetime: DateTime.local().minus({ hour: 40 }),
      read: true
    }
  ];

  trackById = trackById;

  constructor() { }

  ngOnInit() {
  }

}
