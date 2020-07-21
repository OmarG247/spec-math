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

import { Component, Input } from '@angular/core';
import { DefaultsFileUploadOptions, SpecFilesUploadOptions } from 'src/shared/interfaces';

@Component({
  selector: 'app-confirm-operation',
  templateUrl: './confirm-operation.component.html',
  styleUrls: ['./confirm-operation.component.scss']
})
export class ConfirmOperationComponent {
  defaultsFile = null;
  specFiles = [];

  @Input() defaultsFileUploadOptions?: DefaultsFileUploadOptions;
  @Input() specFilesUploadOptions?: SpecFilesUploadOptions;

  get inputFilesValid(): boolean {
    if (this.specFilesUploadOptions.valid) {
      this.defaultsFile = (this.defaultsFileUploadOptions ? this.defaultsFileUploadOptions.defaultsFile : null);
      this.specFiles = this.specFilesUploadOptions.specFiles;
      return true;
    }

    return false;
  }

  get operationFiles(): File[] {
    return (this.defaultsFile ?
      [this.defaultsFile, ...this.specFiles] : [...this.specFiles]);
  }
}
