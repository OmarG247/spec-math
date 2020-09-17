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

import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MergeModalComponent } from './merge-modal.component';
import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { SpecFilesUploadComponent } from './spec-files-upload/spec-files-upload.component';
import { ResolveConflictComponent } from './resolve-conflict/resolve-conflict.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpecMathService } from 'src/shared/services/specmath.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ConfirmOperationModule } from '../shared-steps/confirm-operation/confirm-operation.module';
import { SpecNameInputModule } from '../shared-steps/spec-name-input/spec-name-input.module';
import { FileUploadModule } from '../shared-steps/file-upload/file-upload.module';
import { StubSpecMathService } from 'src/tests/mocks/stub-specmath.service';

@NgModule({
  declarations: [
    MergeModalComponent,
    SpecFilesUploadComponent,
    ResolveConflictComponent
  ],
  imports: [
    MatStepperModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    BrowserModule,
    MatChipsModule,
    MatRadioModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    RouterModule,
    ConfirmOperationModule,
    SpecNameInputModule,
    FileUploadModule
  ],
  exports: [
    MergeModalComponent,
  ],
  providers: [SpecMathService],
  bootstrap: [MergeModalComponent]
})
export class MergeModalModule { }
