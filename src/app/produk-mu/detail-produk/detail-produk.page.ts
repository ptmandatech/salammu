import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-produk',
  templateUrl: './detail-produk.page.html',
  styleUrls: ['./detail-produk.page.scss'],
})
export class DetailProdukPage implements OnInit {

  slideOpts = {
    initialSlide: 1,
    speed: 400,
    loop: true
  };

  constructor() { }

  ngOnInit() {
  }

}
