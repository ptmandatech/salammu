import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-al-quran',
  templateUrl: './al-quran.page.html',
  styleUrls: ['./al-quran.page.scss'],
})
export class AlQuranPage implements OnInit {

  defaultSegment:any='surah';

  constructor() { }

  ngOnInit() {
  }

}
