import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MenuItem } from '../interfaces/menu-item.interface';
import { trackById } from '../../../../utils/track-by';
import { PopoverRef } from '../../../../components/popover/popover-ref';

export interface OnlineStatus {
  id: 'online' | 'away' | 'dnd' | 'offline';
  label: string;
  icon: string;
  colorClass: string;
}

@Component({
  selector: 'vex-toolbar-user-dropdown',
  templateUrl: './toolbar-user-dropdown.component.html',
  styleUrls: ['./toolbar-user-dropdown.component.scss']
})
export class ToolbarUserDropdownComponent implements OnInit {

  items: MenuItem[] = [
    {
      id: '1',
      icon: 'mat:account_circle',
      label: 'Mi perfil',
      description: 'Información personal',
      colorClass: 'text-teal',
      route: '/dasboard'
    },
    {
      id: '2',
      icon: 'mat:key',
      label: 'Contraseña',
      description: 'Modificar mi contraseña',
      colorClass: 'text-cyan',
      route: '/dasboard'
    },
    {
      id: '3',
      icon: 'mat:info',
      label: 'Ayuda',
      description: 'Información sobre el sistema',
      colorClass: 'text-primary',
      route: '/dashboard'
    },
    {
      id: '4',
      icon: 'mat:list',
      label: 'Otras opciones',
      description: 'Ejemplo de otras opciones',
      colorClass: 'text-purple',
      route: '/dashboard'
    }
  ];

  trackById = trackById;

  constructor(private cd: ChangeDetectorRef,
              private popoverRef: PopoverRef<ToolbarUserDropdownComponent>) { }

  ngOnInit() {}

  close() {
    this.popoverRef.close();
  }
}
