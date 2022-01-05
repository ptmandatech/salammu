import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-tambah-cabang-ranting',
  templateUrl: './tambah-cabang-ranting.page.html',
  styleUrls: ['./tambah-cabang-ranting.page.scss'],
})
export class TambahCabangRantingPage implements OnInit {

  crData:any = {};
  category:any;
  isCreated:boolean = true;
  loading:boolean;
  byPassedHTMLString:any;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public activatedRoute:ActivatedRoute,
    public modalController: ModalController,
    private loadingController: LoadingController,
  ) { }

  async ngOnInit() {
    this.crData = {};
    this.category = this.activatedRoute.snapshot.paramMap.get('id');
  }

  save() {
    this.api.post('cr', this.crData).then(res => {
      if(res) {
        alert('Berhasil menambahkan data.');
        this.loading = false;
        this.router.navigate(['/my-cr']);
      }
    })
  }

}
