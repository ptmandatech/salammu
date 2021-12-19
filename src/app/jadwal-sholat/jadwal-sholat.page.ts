import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController, PopoverController } from '@ionic/angular';
import { CalendarService } from '../services/calendar.service';
import { ModalJadwalComponent } from './modal-jadwal/modal-jadwal.component';

@Component({
  selector: 'app-jadwal-sholat',
  templateUrl: './jadwal-sholat.page.html',
  styleUrls: ['./jadwal-sholat.page.scss'],
})
export class JadwalSholatPage implements OnInit {

  constructor(
    private calendar:CalendarService,
    private routerOutlet: IonRouterOutlet,
    public modalController: ModalController,
    public popoverController: PopoverController
  ) { }

  cal:any={};
  week:any=[];
  selected:any;
  daily:boolean;
  weekly:boolean;
  monthly:boolean;

  ngOnInit() {
    this.getCal();
    this.dailyShow();
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
  next()
  {
      console.log(this.selected);
      var cal=this.calendar.next(this.selected).data;
      this.selected=this.calendar.next(this.selected).selected;
      this.parseCal(cal);
  }
  prev()
  {
      console.log(this.selected);
      var cal=this.calendar.previous(this.selected).data;
      this.selected=this.calendar.previous(this.selected).selected;
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
     this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalJadwalComponent,
      cssClass: 'modal-class',
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.5, 1],
    });
    return await modal.present();
  }

  dailyShow() {

    this.daily =true;
    this.weekly =false;
    this.monthly =false;

  }

  weeklyShow() {

    this.daily =false;
    this.weekly =true;
    this.monthly =false;

  }

  monthlyShow() {

    this.daily =false;
    this.weekly =false;
    this.monthly =true;

  }


}
