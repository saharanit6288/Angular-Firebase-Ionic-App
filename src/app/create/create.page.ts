import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { RestApiService } from '../rest-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, 
        FormGroupDirective, 
        FormBuilder, 
        FormGroup, 
        NgForm, 
        Validators, 
        FormArray } from '@angular/forms';
import * as firebase from 'Firebase';
        

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  ref = firebase.database().ref('classes/');
  classroomForm: FormGroup;
  students: FormArray;
  

  constructor(public api:RestApiService,
    public loadingCntrl:LoadingController,
    public route: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder
  ) { 
    this.classroomForm = this.formBuilder.group(
      {
        'class_name': [null,Validators.required],
        'students': this.formBuilder.array([])
      }
    );
  }

  

  ngOnInit() {
  }

  createStudent(): FormGroup {
    return this.formBuilder.group({
      student_name: ''
    });

  }

  deleteStudent(control, index) {
    control.removeAt(index);
  }

  addBlankStudent(): void {
    this.students = this.classroomForm.get('students') as FormArray;
    this.students.push(this.createStudent());
  }

  async saveClassroom(){
    let newInfo=firebase.database().ref('classes/').push();
		
    newInfo.set(this.classroomForm.value);

    this.router.navigate(['/detail/'+newInfo.key]);
    
    // await this.api.postClassroom(this.classroomForm.value)
    //       .subscribe(res=>
    //         {
    //           let id=res['id'];
    //           this.router.navigate(['/detail/'+id]);
    //         },
    //         err=>
    //         {
    //           console.log(err);
    //         }
    //       )
  }

}
