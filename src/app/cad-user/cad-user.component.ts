import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import {MatRadioModule} from '@angular/material/radio';
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { firstValueFrom } from "rxjs";
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User, UserRoles } from "../users/user";
import { UsersService } from "../users/users.service";


@Component({
  templateUrl: 'cad-user.component.html',
  standalone: true,
  styleUrls: ['../screen.css'],
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatCardModule,
    DatePipe,
    MatRadioModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ]
})
export class CadUserComponent {
  public isLoading = true;
  public isPasswordVisible = false
  
  userForm = new FormGroup({
    userId: new FormControl<string | null>(null),
    name: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    username: new FormControl<string>('', Validators.required),
    password: new FormControl<string>(""),
    profile: new FormControl<string>("", Validators.required)
  })

  users: User[] = []

  get password(): FormControl<string> {
    return this.userForm.get('password') as FormControl<string>
  }

  get name(): FormControl<string> {
    return this.userForm.get('name') as FormControl<string>
  }
  
  get username(): FormControl<string> {
    return this.userForm.get('username') as FormControl<string>
  }

  get profile(): FormControl<string> {
    return this.userForm.get('profile') as FormControl<string>
  }

  get userId(): FormControl<string> {
    return this.userForm.get('userId') as FormControl<string>
  }

  constructor(
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  private async getUser(userId: string) {
    const user = await firstValueFrom(this.usersService.getUser(userId))
    
    if (user)
      this.setFormValue(user);
  }

  private setFormValue(user: User) {
    this.userForm.reset({
      userId: user.userId,
      name: user.name,
      username: user.username,
      password: user.password,
      profile: user.profile
      //isActive: user.isActive == 'S'
    });

    this.isLoading = false;
  }

  private async updateUser(value: User) {
    let response = await firstValueFrom(this.usersService.updateUser(value as User))
    
    if (response)
      this.router.navigate([`users/${response.userId}`], {onSameUrlNavigation: "reload"});
  }

  private async createUser(value: User) {
    let user = await firstValueFrom(this.usersService.createUser(value));

    if (user)
      this.router.navigate([`users/${user.userId}`], {onSameUrlNavigation: "reload"});
  }

  private async saveUser() {
    const value = this.userForm.value;

    if (value.userId)
      this.updateUser({
        //isActive: value.isActive ? 'S' : 'N',
        userId: value.userId,
        name: value.name,
        username: value.username,
        profile: value.profile,
      } as User);
    else {
      if (!value.password || (value.password && value.password?.length == 0)) {
        this.password.setErrors({required: true});
      } else
        this.createUser({
          //isActive: value.isActive ? 'S' : 'N',
          name: value.name,
          username: value.username,
          password: value.password,
          profile: value.profile,
        } as User);
    }
  }

  async deleteUser() {
    if (this.userId.value) {
      await firstValueFrom(this.usersService.deleteUser(this.userId.value))
      this.back();
    }
  }

  back() {
    this.router.navigate(['/users'])
  }

  onSubmit(ev: SubmitEvent) {
    ev.preventDefault();
    
    if (this.userForm.valid)
      Promise.resolve(this.saveUser())
    else
      this.userForm.markAllAsTouched()
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramAsMap => {
      const id = paramAsMap.get('id');

      if (id) {
        if (id === 'add')
          this.setFormValue({
            userId: null,
            name: '',
            password: '',
            username: '',
            profile: UserRoles.agt,
            //isActive: 'N'
          })
        else
          this.getUser(id);
      }
    });
  }

}