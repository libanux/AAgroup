import { Component, signal } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../../material.module';import { FeatherModule } from "angular-feather"
import { AuthService, Params_Authenticate } from 'src/app/services/auth.service';
import { environment } from 'src/enviroment/enviroment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, FeatherModule],
  templateUrl: './login.component.html',
})
export class AppLoginComponent {
  options = this.settings.getOptions();

  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  loading: boolean = false;

  constructor(private authserivece: AuthService, private settings: CoreService, private router: Router) { }


    //LOGIN FUNCTION
    login() {

      const authenticationParams: Params_Authenticate = {
        email: this.form.value.uname ?? undefined,
        password: this.form.value.password ?? undefined // Use nullish coalescing to convert null to undefined
      };
  
        this.authserivece.SIGN_IN(authenticationParams).subscribe({
          next: (response: any) => {
            if(response.user.owner_id == environment.owner_id)
              {
                console.log(response.user.owner_id)
              localStorage.setItem('TICKET', response.token),
              localStorage.setItem('admin_id', response.user._id)
              this.router.navigate(['/apps/products']).then(() => {
                window.scrollTo(0, 0);})
            }
          },
          error: (error: any) => {this.loading = false;}
        });
      
    }

  
}


