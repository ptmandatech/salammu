import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PencarianCabangrantingPage } from './pencarian-cabangranting.page';

describe('PencarianCabangrantingPage', () => {
  let component: PencarianCabangrantingPage;
  let fixture: ComponentFixture<PencarianCabangrantingPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PencarianCabangrantingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PencarianCabangrantingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
