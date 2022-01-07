import { DatePipe } from '@angular/common';
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
  dateToday:any;

  constructor(
    private datePipe: DatePipe,
    private calendar:CalendarService,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
    let date = new Date();
    this.dateToday = Number(this.datePipe.transform(new Date(date), 'dd'));
    this.getCal();
  }

  getCal()
  {
    this.cal={};
  	var cal=this.calendar.today().data;
    this.selected=this.calendar.today().selected;
  	this.parseCal(cal);
  }

  m:any;
  n:any;
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

    for(var i=0; i<this.week.length;i++)
    {
      for(var j=0; j<this.cal[this.week[i]].length;j++)
      {
        if(this.cal[this.week[i]][j].tanggal == this.dateToday) {
          this.m = i.toString();
          this.n = j.toString();
          this.cellSelected={};
          this.cellSelected[this.m+this.n]=true;
        }
      }
    }
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
