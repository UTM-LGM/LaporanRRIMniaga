import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { user } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  user: user = {} as user;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.resetForm();
  }

  //form? = nullable, call reset function if form is not null)
  resetForm(form?: NgForm) {
    if (form != null)
      form.reset();
    this.user = {
      UserName: '',
      Password: '',
      Email: '',
      FirstName: '',
      LastName: '',
      DealerID: 2,
      username: '',
      UserId: 0,
      userId: 0
    }
  }

  OnSubmit(form: NgForm) {
    this.userService.registerUser(form.value)
      .subscribe((data: any) => {
        if (data.Succeeded == true) {
          this.resetForm(form);
          this.toastr.success('User registration successful');
        }
        else
          this.toastr.error(data.Errors[0]);
      });
  }
}
