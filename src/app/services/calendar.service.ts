import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router} from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class CalendarService {	
	constructor() { }
	today()
	{	
		var dt=new Date();
		return this.calendar(dt);
	}
	
	next(dd, from)
	{
		if(from == 'daily') {
			var d=new Date(dd.getFullYear(),dd.getMonth()+1,1);
			return this.calendar(d);
		} else if(from == 'weekly') {
			var d=new Date(dd.getFullYear(),dd.getDay()+7,1);
			return this.calendar(d);
		} else if(from == 'monthly') {
			var d=new Date(dd.getFullYear(),dd.getMonth()+1,1);
			return this.calendar(d);
		}
	}

	previous(dd, from)
	{
		if(from == 'daily') {
			var d=new Date(dd.getFullYear(),dd.getMonth()-1,1);
			return this.calendar(d);
		} else if(from == 'weekly') {
			var d=new Date(dd.getFullYear(),dd.getDay()-7,1);
			return this.calendar(d);
		} else if(from == 'monthly') {
			var d=new Date(dd.getFullYear(),dd.getMonth()-1,1);
			return this.calendar(d);
		}
	}

	calendar(dt)
	{
		var delta=86400000;		
		//var dt=new Date(s);
		var month=dt.getMonth();
		var year=dt.getFullYear();
		var date=dt.getDate();
		var maxDt=new Date(year,month+1,0).getDate();
		var firstDay=new Date(year,month,1).getDay();
		var firstTime=new Date(year,month,1).getTime();
		var lastDay=new Date(year,month,maxDt).getDay();
		var calendar=[];
		for(var i=0; i<firstDay; i++)
		{
			calendar.push(0);
		}
		for(var i=1; i<=maxDt;i++)
		{
			var d=new Date(year,month+1,i);
			var day=d.getDay();
			var th=d.getFullYear();
			var bl=d.getMonth();
			var tgl, bln;
			if(bl<10) bln='0'+bl; else bln=bl.toString(); 
			var tg=d.getDate();
			if(tg<10) tgl='0'+tg; else tgl=tg.toString();
			var dd={
				tahun:year,
				bulan:month+1,
				tanggal:i,
				hari:d.getDay()
			};
			calendar.push(dd);
		}
		for(var i=(lastDay+1); i<=6; i++)
		{
			calendar.push(0);
		}

		return {data:calendar,selected:dt};
	}
}