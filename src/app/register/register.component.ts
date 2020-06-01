import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Employee } from '../shared/employee';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  tempCheckUser: any;
  tempEmp: Employee;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: AuthenticationService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      empId: ['', Validators.required],
      empName: ['', Validators.required],
      empEmail: ['', Validators.required],
      empPassword: ['', [Validators.required, Validators.minLength(6)]],
      empMobileNo: ['', [Validators.required, Validators.minLength(10)]],
      empMagicWord: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.tempEmp = new Employee(this.form.value.empId, this.form.value.empName, this.form.value.empEmail,
      this.form.value.empPassword, this.form.value.empMobileNo, this.form.value.empMagicWord);

      // var user1 = this.service.registerEmp(this.tempEmp);
      // user1.subscribe((data) => {
      //   console.log(data)
      //   alert("Register Successfully for Employee Id" + data.empId)
      //   this.router.navigate(['/login'])
      //   alert("Now LogIn using your EmpId and Password")
      // })

    var checkUser = this.service.existingUserCheck(this.tempEmp)
    checkUser.subscribe((checkUserdata) => {
      
    if (checkUserdata.empId == this.tempEmp.empId) {
      alert("User Id already Exist  Try Again...")
      this.router.navigate(['/login'])
    }
    else
     {
      var user1 = this.service.registerEmp(this.tempEmp);
      user1.subscribe((data) => {
        console.log(data)
        alert("Register Successfully for Employee Id" + data.empId)
        this.router.navigate(['/login'])
      })
     }
    })

  }
}


