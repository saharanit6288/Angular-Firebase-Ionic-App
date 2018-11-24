import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { RestApiService } from '../rest-api.service';
import * as firebase from 'Firebase';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  classrooms: any;
  ref = firebase.database().ref('classes/');

  constructor(public api:RestApiService,
              public loadingCntrl:LoadingController) {
    
  }

  ngOnInit() {
    this.getClassrooms();
  }

  async getClassrooms(){
    const loading = await this.loadingCntrl.create(
      {
        content: 'Loading'
      });

    await loading.present();

    this.ref.on('value', resp => {
			this.classrooms= [];
      this.classrooms = snapshotToArray(resp);
      loading.dismiss();
    });
        

    // await this.api.getClassroom()
    //       .subscribe(
    //         res=> {
    //         //console.log(res);
    //         this.classrooms =res;
    //         loading.dismiss();
    //       },
    //         err => {
    //           console.log(err);
    //           loading.dismiss();
    //       });

  }
  
}

export const snapshotToArray = snapshot => {
	let returnArr = [];
	
	snapshot.forEach(childSnapshot => {
		let item=childSnapshot.val();
		item.key=childSnapshot.key;
		returnArr.push(item);
	});
	
	return returnArr;
}