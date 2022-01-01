import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-cr',
  templateUrl: './my-cr.page.html',
  styleUrls: ['./my-cr.page.scss'],
})
export class MyCrPage implements OnInit {

  defaultSegment:any='cabang';

  constructor() { }

  ngOnInit() {
  }

}
