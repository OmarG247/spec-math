// Copyright 2020 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { TestBed, async, ComponentFixture, flush, tick, fakeAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';

import { BrowserModule, By } from '@angular/platform-browser';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from './components/specmath-modal/modal.module';
import { queryElement } from 'src/shared/functions';
import { DisplayResultsModule } from './components/spec-math-display-results/display-results.module';
import { YamlRenderModule } from './components/yaml-render/yaml-render.module';
import { MatListModule } from '@angular/material/list';
import { DefaultsPageComponent } from './components/defaults-page/defaults-page.component';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, DefaultsPageComponent, AboutPageComponent],
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatSidenavModule,
        MatMenuModule,
        MatIconModule,
        MatDividerModule,
        MatButtonModule,
        ModalModule,
        DisplayResultsModule,
        YamlRenderModule,
        MatListModule,
        RouterTestingModule,
        RouterModule.forRoot([
          {
            path: '**',
            component: AppComponent,
          },
        ]),
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AppComponent);
        app = fixture.componentInstance;
      });
  }));

  it('creates the app component', () => {
    expect(app).toBeTruthy();
  });

  it('opens the operations menu when the New button is clicked', () => {
    const button = queryElement(fixture, '#operation-menu-button-desktop')
      .nativeElement;
    button.click();

    fixture.detectChanges();
    const menu = queryElement(fixture, '#operation-menu');
    expect(menu).toBeTruthy();
  });

  it('opens the About Default files page when its button is clicked', fakeAsync(() => {
    const aboutDefaultFilesButton = queryElement(
      fixture,
      '#about-default-files-button'
    ).nativeElement;

    const spy = spyOn(app, 'setRoute').and.callThrough();
    aboutDefaultFilesButton.click();

    fixture.detectChanges();
    flush();

    expect(spy).toHaveBeenCalledWith('defaults');
    expect(app.currentRoute).toEqual('defaults');

    // const defaultsPage = fixture.debugElement.query(By.directive(DefaultsPageComponent)).nativeElement;
    // expect(defaultsPage).toBeTruthy();
  }));

  it('opens the About Spec Math page when its button is clicked', fakeAsync (() => {
    const aboutSpecMathButton = queryElement(
      fixture,
      '#about-spec-math-button'
    ).nativeElement;

    const spy = spyOn(app, 'setRoute').and.callThrough();
    aboutSpecMathButton.click();

    fixture.detectChanges();
    flush();

    expect(spy).toHaveBeenCalledWith('about');
    expect(app.currentRoute).toEqual('about');
  }));
});
