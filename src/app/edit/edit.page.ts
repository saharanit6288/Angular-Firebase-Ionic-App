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
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  ref = firebase.database().ref('classes/');
  classroomForm: FormGroup;
  students: FormArray;

  constructor(public api:RestApiService,
    public loadingCntrl:LoadingController,
    public route: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder
  ) { 
    this.getClassroom(this.route.snapshot.paramMap.get('id'));
    this.classroomForm = this.formBuilder.group(
      {
        'class_name': [null,Validators.required],
        'students': this.formBuilder.array([])
      }
    );

  }

  ngOnInit() {
  }

  async getClassroom(id){
    const loading = await this.loadingCntrl.create(
      {
        content: 'Loading'
      });

    await loading.present();
	
	firebase.database().ref('classes/'+id).on('value', resp=>{
      let info=snapshotToEditObject(resp);
	  this.classroomForm.controls['class_name'].setValue(info.class_name);
	  let controlArray = <FormArray>this.classroomForm.controls['students'];
	  for(let i=0;i<info.students.length;i++)
	  {
		controlArray.push(this.formBuilder.group({student_name:''}));
		controlArray.controls[i].get('student_name').setValue(info.students[i].student_name);
	  }

      loading.dismiss();
    })

    // await this.api.getClassroomById(id)
          // .subscribe(res=>
            // {
              // this.classroomForm.controls['class_name'].setValue(res.class_name);
              // let controlArray = <FormArray>this.classroomForm.controls['students'];
              // res.students.foreach(
                // std=>
                // {
                  // controlArray.push(this.formBuilder.group(
                    // {
                      // student_name:''
                    // }
                  // ))
                // }
              // );
              // for(let i=0;i<res.students.length;i++)
              // {
                // controlArray.controls[i].get('student_name').setValue(res.students[i].student_name);
              // }
              // //console.log(this.classroomForm);
              // loading.dismiss();
            // },
            // err=>
            // {
              // console.log(err);
              // loading.dismiss();
            // }
          // );

        }

  createStudent(): FormGroup {
    return this.formBuilder.group({
      student_name: ''
    });

  }

  deleteStudent(index) {
    this.students = this.classroomForm.get('students') as FormArray;
    this.students.removeAt(index);
  }

  addBlankStudent(): void {
    this.students = this.classroomForm.get('students') as FormArray;
    this.students.push(this.createStudent());
  }

  async updateClassroom(){
	let newInfo=firebase.database().ref('classes/'+this.route.snapshot.paramMap.get('id')).update(this.classroomForm.value);
	this.router.navigate(['/detail/'+this.route.snapshot.paramMap.get('id')]);
	
    // await this.api.updateClassroom(this.route.snapshot.paramMap.get('id'),this.classroomForm.value)
          // .subscribe(res=>
            // {
              // let id=res['id'];
              // this.router.navigate(['/detail',JSON.stringify(id)]);
            // },
            // err=>
            // {
              // console.log(err);
            // }
          // )
  }

}

export const snapshotToEditObject = snapshot => {
  let item = snapshot.val();
  item.key=snapshot.key;
  return item;
};
