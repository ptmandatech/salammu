import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalendarService } from '../services/calendar.service';
import { ModalKalenderComponent } from './modal-kalender/modal-kalender.component';
import { ModalPetaComponent } from './modal-peta/modal-peta.component';

@Component({
  selector: 'app-pengajian',
  templateUrl: './pengajian.page.html',
  styleUrls: ['./pengajian.page.scss'],
})
export class PengajianPage implements OnInit {

  defaultSegment:any='kalender';
  cal:any={};
  week:any=[];
  selected:any;

  constructor(
    private calendar:CalendarService,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
    this.getCal();
  }

  getCal()
  {
    this.cal={};
  	var cal=this.calendar.today().data;
    this.selected=this.calendar.today().selected;
  	this.parseCal(cal);
  }
  parseCal(cal)
  {
    var res={};
    for(var i=0; i<cal.length;i++)
    {
      var key=Math.floor(i/7);
      if(res[key]==undefined)
      {
        res[key]=[cal[i]];
      }else{
        res[key].push(cal[i]);
      }
    }
    this.cal=res;
    this.week=Object.keys(res);
  }
  next(from)
  {
      var cal=this.calendar.next(this.selected, from).data;
      this.selected=this.calendar.next(this.selected, from).selected;
      this.parseCal(cal);
  }
  prev(from)
  {
      var cal=this.calendar.previous(this.selected, from).data;
      this.selected=this.calendar.previous(this.selected, from).selected;
      this.parseCal(cal);
  }

  //pilih cell
  cellSelected:any={};
  selectCell(m,n)
  {
     this.cellSelected={};
     this.cellSelected[m+n]=true;
     var date=this.cal[m][n];
     this.selected=new Date(date.tahun,date.bulan-1,date.tanggal);
     this.modalKelander(this.selected);
  }

  //Modal Kalender
  async modalKelander(selected) {
    const modal = await this.modalController.create({
      component: ModalKalenderComponent,
      mode: "md",
      cssClass: 'modal-class',
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 1],
      componentProps: {data:selected}
    });
    return await modal.present();
  }

  async modalPeta() {
    const modal = await this.modalController.create({
      component: ModalPetaComponent,
      mode: "md",
      cssClass: 'modal-class',
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 1],
    });
    return await modal.present();
  }

}
