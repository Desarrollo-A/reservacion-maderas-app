import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestPackageService } from 'src/app/core/services/request-package.service';
import { fadeInUp400ms } from 'src/app/shared/animations/fade-in-up.animation';
import { StarRatingComponent } from 'src/app/shared/components/star-rating/star-rating.component';
import { FormErrors } from 'src/app/shared/utils/form-error';

@Component({
  selector: 'app-received-package',
  templateUrl: './received-package.component.html',
  styleUrls: ['./received-package.component.scss'],
  animations: [
    fadeInUp400ms
  ]
})
export class ReceivedPackageComponent implements OnInit {
  @ViewChild('starRatingComponent')
  public starRatingComponent: StarRatingComponent;

  form: FormGroup;
  formErrors: FormErrors;
  codePackage: {code: string} = {code: ''};
  requestId: number;

  constructor(private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
              private requestPackageService: RequestPackageService,
              private router: Router) {}
  
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(dataParams => {
      this.requestId = dataParams.id;
      this.findByRequestId(this.requestId);
    });

    this.form = this.fb.group({
      comment: [null, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]]
    });

    this.formErrors = new FormErrors(this.form);
  }

  save(): void{
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const score = this.starRatingComponent.rating;
    const {comment} = this.form.getRawValue();
    
    this.requestPackageService.insertRequestPackageScore(this.requestId, score, comment).subscribe(() =>{
        this.router.navigateByUrl('/paqueteria/calificacion');
    });
  }

  private findByRequestId(requestId: number): void{
    this.requestPackageService.showCodePackage(requestId).subscribe(dataRequestPackage => {
      this.codePackage.code = dataRequestPackage.code;
    });
  }
}
