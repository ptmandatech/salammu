import { FilterUstadPage } from './filter-ustad/filter-ustad.page';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { CommonService } from '../services/common.service';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-ustadmu',
  templateUrl: './ustadmu.page.html',
  styleUrls: ['./ustadmu.page.scss'],
})
export class UstadmuPage implements OnInit {

  listUstadmu:any = [];
  listUstadmuTemp:any = [];
  serverImg: any;
  loading:boolean;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public modalController: ModalController,
    private loadingService: LoadingService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.loadingService.present();
    this.serverImg = this.common.photoBaseUrl+'ustadzmu/';
    this.listUstadmu = [];
    this.listUstadmuTemp = [];
    this.getAllPediamu();
  }
  
  //Modal Filter
  filterData:any;
  async filter() {
   const modal = await this.modalController.create({
     component: FilterUstadPage,
     componentProps: {data:this.filterData},
     mode: "md",
     cssClass: 'modal-class',
     initialBreakpoint: 0.8,
     breakpoints: [0, 0.8, 1]
   });  
   modal.onDidDismiss().then(async (result) => {
    if(result.data)
    {
      this.filterData = result.data;
      this.searchFilter();
    }
   });
   return await modal.present();
 }

  async doRefresh(event) {
    this.loading = true;
    this.listUstadmu = [];
    this.listUstadmuTemp = [];
    this.loadingService.present();
    this.getAllPediamu();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  getAllPediamu() {
    this.api.get('ustadzmu').then(res => {
      this.listUstadmu = res;
      this.listUstadmuTemp = res;
      this.loadingService.dismiss();
    }, error => {
      this.loading = false;
      this.loadingService.dismiss();
    })
  }

  initializeItems(): void {
    this.listUstadmu = this.listUstadmuTemp;
  }

  searchTerm: string = '';
  searchChanged(evt) {

    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.listUstadmu = this.listUstadmu.filter(ustadzmu => {
      if (ustadzmu.name && searchTerm) {
        if (ustadzmu.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        if (ustadzmu.science_name && searchTerm) {
          if (ustadzmu.science_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
            return true;
          }
          return false;
        }
        return false;
      }
    });
  }

  searchFilter() {
    this.listUstadmu = [];
    this.listUstadmu = this.listUstadmuTemp;
    let keys = Object.keys(this.filterData);
    if(keys.length == 1) {
      this.listUstadmu = this.listUstadmu.filter((e:any) => e[keys[0]] == this.filterData[keys[0]]);
    } else if(keys.length == 2) {
      this.listUstadmu = this.listUstadmu.filter((e:any) => e[keys[0]] == this.filterData[keys[0]] && e[keys[1]] == this.filterData[keys[1]]);
    } else if(keys.length == 3) {
      this.listUstadmu = this.listUstadmu.filter((e:any) => e[keys[0]] == this.filterData[keys[0]] && e[keys[1]] == this.filterData[keys[1]] && e[keys[2]] == this.filterData[keys[2]]);
    } else if(keys.length == 4) {
      this.listUstadmu = this.listUstadmu.filter((e:any) => e[keys[0]] == this.filterData[keys[0]] && e[keys[1]] == this.filterData[keys[1]] 
      && e[keys[2]] == this.filterData[keys[2]] && e[keys[3]] == this.filterData[keys[3]] && e[keys[4]] == this.filterData[keys[4]]);
    }
  }

  detail(data) {
    const param: NavigationExtras = {
      queryParams: {
        info: JSON.stringify(data)
      }
    }
    this.router.navigate(['detail-ustad'], param);
  }

}
