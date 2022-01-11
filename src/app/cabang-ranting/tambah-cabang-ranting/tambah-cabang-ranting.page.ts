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
  id:any;
  serverImg:any;
  imageNow:any;
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
    this.category = this.activatedRoute.snapshot.paramMap.get('category');
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.id)
    this.crData.category = this.category;
    if(this.id != 0) {
      this.isCreated = false;
      this.getDetailCr();
    }
  }

  getDetailCr() {
    this.api.get('cr/find/'+this.id).then(res => {
      this.crData = res;
    })
  }

  save() {
    if(this.isCreated == true) {
      this.api.post('cr', this.crData).then(res => {
        if(res) {
          alert('Berhasil menambahkan data.');
          this.loading = false;
          this.router.navigate(['/my-cr']);
        }
      })
    } else {
      this.api.put('cr/'+ this.crData.id, this.crData).then(res => {
        if(res) {
          alert('Berhasil memperbarui data.');
          this.loading = false;
          this.router.navigate(['/my-cr']);
        }
      })
    }
  }

  delete() {
    var conf = confirm('Anda yakin ingin menghapus data?');
    if (conf) {
      this.api.delete('cr/'+this.id).then(res => {
        if(res) {
          alert('Berhasil menghapus data.');
          this.loading = false;
          this.router.navigate(['/my-cr']);
        }
      })
    }
  }

}
