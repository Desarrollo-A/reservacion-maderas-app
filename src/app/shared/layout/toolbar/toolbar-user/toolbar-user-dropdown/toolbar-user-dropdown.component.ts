import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PopoverRef } from '../../../../components/popover/popover-ref';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../components/change-password/change-password.component';
import { UserSessionService } from 'src/app/core/services/user-session.service';
import { UserService } from "../../../../../dashboard/user/services/user.service";
import { ProfileComponent } from "../components/profile/profile.component";

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
              private userSession: UserSessionService,
              private userService: UserService) { }

  get userName(): string {
    return this.userSession.userFirstLastName;
  }

  ngOnInit() {}

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.popoverRef.close();
      this.router.navigateByUrl('/auth/acceso');
    });
  }

  openDialogChangePassword(): void {
    this.popoverRef.close()

    this.matDialog.open(ChangePasswordComponent);
  }

  showProfile(): void {
    this.popoverRef.close()

    this.userService.getDataProfile().subscribe(user => {
      this.matDialog.open(ProfileComponent, {
        data: user,
        autoFocus: false
      });
    });
  }
}
