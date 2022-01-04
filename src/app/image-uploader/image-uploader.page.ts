import { Component, OnInit, Input } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.page.html',
  styleUrls: ['./image-uploader.page.scss'],
})
export class ImageUploaderPage implements OnInit {
  @Input() imageData: string;
  constructor(
    private loadingController: LoadingController,
    public modalCtrl: ModalController
  ) {
  }

  ngOnInit() {
    this.loadingController.dismiss();
  }


  imageChangedEvent: any = '';
  croppedImage: any = '';

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  dismiss()
  {
    this.modalCtrl.dismiss({
      'url': false
    });
  }

  loading:boolean;
  uploadImage() {
    this.loading=true;
    this.modalCtrl.dismiss(this.croppedImage);
  }

}
