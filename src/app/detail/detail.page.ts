import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { RestApiService } from '../rest-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as firebase from 'Firebase';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  classroom: any = {};

  constructor(public api:RestApiService,
              public loadingCntrl:LoadingController,
              public alertCntrl:AlertController,
              public route: ActivatedRoute,
              public router: Router) { 
    
  }

  ngOnInit() {
    this.getClassroom();
  }

  async getClassroom(){
    const loading = await this.loadingCntrl.create(
      {
        content: 'Loading'
      });

    await loading.present();

    firebase.database().ref('classes/'+this.route.snapshot.paramMap.get('id')).on('value', resp=>{
      this.classroom = snapshotToDetailsObject(resp);
      loading.dismiss();
    });

    // await this.api.getClassroomById(this.route.snapshot.paramMap.get('id'))
    //       .subscribe(
    //         res=> {
    //         //console.log(res);
    //         this.classroom =res;
    //         loading.dismiss();
    //       },
    //         err => {
    //           console.log(err);
    //           loading.dismiss();
    //       });
  }

  async delete(id){
    const alert=await this.alertCntrl.create({
			header: 'Confirm',
			message: 'Are u sure want to delete?',
			buttons: [
				{
					text: 'No',
					role: 'cancel',
					cssClass: 'secondary',
					handler: (blah) => {
						console.log('cancel');
					}
				},
				{
					text: 'Yes',
					handler: () => {
						firebase.database().ref('classes/'+id).remove();
						this.router.navigate(['/list']);
					}
				}
			]
		});
		
		await alert.present();

    

    // const loading = await this.loadingCntrl.create(
    //   {
    //     content: 'Deleting'
    //   });

    // await loading.present();
   

    // loading.dismiss();

    // await this.api.deleteClassroom(id)
    //       .subscribe(
    //         res=> {
    //         //console.log(res);
    //         loading.dismiss();
    //         //this.location.back();
    //       },
    //         err => {
    //           console.log(err);
    //           loading.dismiss();
    //       });

  }

}

export const snapshotToDetailsObject = snapshot => {
  let item = snapshot.val();
  item.key=snapshot.key;
  return item;
};
