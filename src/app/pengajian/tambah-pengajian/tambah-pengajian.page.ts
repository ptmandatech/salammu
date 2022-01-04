import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonDatetime, LoadingController, ModalController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common.service';
 
@Component({
  selector: 'app-tambah-pengajian',
  templateUrl: './tambah-pengajian.page.html',
  styleUrls: ['./tambah-pengajian.page.scss'],
})
export class TambahPengajianPage implements OnInit {

  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;
  dateValue = '';
  pengajianData:any = {};
  id:any;
  isCreated:boolean = true;
  loading:boolean;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public router:Router,
    public routes:ActivatedRoute,
    public modalController: ModalController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.id = this.routes.snapshot.paramMap.get('id');
    if(this.id != 0) {
      this.isCreated = false;
      this.getDetailPengajian();
    }
  }

  getDetailPengajian() {
    this.api.get('pengajian/find/'+this.id).then(res => {
      this.pengajianData = res;
      console.log(res)
      this.dateValue = this.pengajianData.datetime;
    })
  }

  formatDate(value: string) {
    return format(parseISO(value), 'MMM dd yyyy HH:mm');
  }

  save() {
    if(this.isCreated == true) {
      this.api.post('pengajian', this.pengajianData).then(res => {
        console.log(res)
        if(res) {
          alert('Berhasil menambahkan data.');
          this.loading = false;
          this.router.navigate(['/my-pengajian']);
        }
      })
    } else {
      this.api.put('pengajian/'+this.id, this.pengajianData).then(res => {
        console.log(res)
        if(res) {
          alert('Berhasil memperbarui data.');
          this.loading = false;
          this.router.navigate(['/my-pengajian']);
        }
      })
    }
  }

  delete() {
    var conf = confirm('Anda yakin ingin menghapus data?');
    if (conf) {
      this.api.delete('pengajian/'+this.id).then(res => {
        if(res) {
          alert('Berhasil menghapus data.');
          this.loading = false;
          this.router.navigate(['/my-pengajian']);
        }
      })
    }
  }

}
