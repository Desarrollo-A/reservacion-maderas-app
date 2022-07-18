import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PopoverRef } from '../../../../components/popover/popover-ref';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../components/change-password/change-password.component';
import { UserSessionService } from 'src/app/core/services/user-session.service';

@Component({
  selector: 'vex-toolbar-user-dropdown',
  templateUrl: './toolbar-user-dropdown.component.html',
  styleUrls: ['./toolbar-user-dropdown.component.scss']
})
export class ToolbarUserDropdownComponent implements OnInit {
  constructor(private cd: ChangeDetectorRef,
              private router: Router,
              private authService: AuthService,
              private popoverRef: PopoverRef<ToolbarUserDropdownComponent>,
              private matDialog: MatDialog,
              private userSession: UserSessionService) { }


  get userName(): string {
    return this.userSession.userFirstLastName;
  }

  ngOnInit() {}

  logout() {
    this.authService.logout().subscribe(() => {
      this.popoverRef.close();
      this.router.navigateByUrl('/acceso');
    });
  }

  openDialogChangePassword(): void {
    this.matDialog.open(ChangePasswordComponent).afterClosed().subscribe((isPasswordChanged) => {
      if (isPasswordChanged) {
        this.popoverRef.close();
      }
    });
  }
}
