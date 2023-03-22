import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DetailJadwalSholatPage } from './detail-jadwal-sholat.page';

describe('DetailJadwalSholatPage', () => {
  let component: DetailJadwalSholatPage;
  let fixture: ComponentFixture<DetailJadwalSholatPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailJadwalSholatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailJadwalSholatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
