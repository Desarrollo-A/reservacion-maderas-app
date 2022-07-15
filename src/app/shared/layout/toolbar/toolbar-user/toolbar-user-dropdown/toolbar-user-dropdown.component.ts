import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MenuItem } from '../interfaces/menu-item.interface';
import { trackById } from '../../../../utils/track-by';
import { PopoverRef } from '../../../../components/popover/popover-ref';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../components/change-password/change-password.component';

export interface OnlineStatus {
  id: 'online' | 'away' | 'dnd' | 'offline';
  label: string;
  icon: string;
  colorClass: string;
}

@Component({
  selector: 'vex-toolbar-user-dropdown',
  templateUrl: './toolbar-user-dropdown.component.html',
  styleUrls: ['./toolbar-user-dropdown.component.scss',]
})
export class ToolbarUserDropdownComponent implements OnInit {

  // items: MenuItem[] = [
  //   {
  //     id: '1',
  //     icon: 'mat:account_circle',
  //     label: 'Mi perfil',
  //     description: 'Información personal',
  //     colorClass: 'text-teal',
  //     route: '/dasboard'
  //   },
  //   {
  //     id: '2',
  //     icon: 'mat:key',
  //     label: 'Contraseña',
  //     description: 'Modificar mi contraseña',
  //     colorClass: 'text-cyan',
  //     route: '/dasboard'
  //   },
  //   {
  //     id: '3',
  //     icon: 'mat:info',
  //     label: 'Ayuda',
  //     description: 'Información sobre el sistema',
  //     colorClass: 'text-primary',
  //     route: '/dashboard'
  //   },
  //   {
  //     id: '4',
  //     icon: 'mat:list',
  //     label: 'Otras opciones',
  //     description: 'Ejemplo de otras opciones',
  //     colorClass: 'text-purple',
  //     route: '/dashboard'
  //   }
  // ];

  trackById = trackById;

  constructor(private cd: ChangeDetectorRef,
              private router: Router,
              private authService: AuthService,
              private popoverRef: PopoverRef<ToolbarUserDropdownComponent>,
              private matDialog: MatDialog) { }

  ngOnInit() {}

  close() {
    this.authService.logout().subscribe(() => {
      this.popoverRef.close();
      this.router.navigateByUrl('/acceso');
    });
  }

  openDialogChangePassword(): void{
    // console.log("ENTRA");
    this.matDialog.open(ChangePasswordComponent).afterClosed().subscribe((changesPassword) => 
    {
      if(changesPassword){
        this.popoverRef.close();
      }
      
    });
    
  }
}
