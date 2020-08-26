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

import { Component, Input, OnInit } from '@angular/core';
import { OperationSet } from 'src/shared/interfaces';
import { readFileAsString, iterateYaml } from 'src/shared/functions';
import { Observable } from 'rxjs';
import * as fileSaver from 'file-saver';
import * as JSZip from 'jszip';
import { OperationService } from 'src/shared/services/operation.service';
import { Router } from '@angular/router';
import { routes } from 'src/shared/routes';

@Component({
  selector: 'app-display-results',
  templateUrl: './display-results.component.html',
  styleUrls: ['./display-results.component.scss']
})
export class DisplayResultsComponent {
  operationSet: OperationSet;

  constructor(operations: OperationService, router: Router) {
    const results = operations.getResults();
    results.valid ? this.operationSet = results : router.navigateByUrl(routes.home);
  }

  async downloadFile(yamlFile: File) {
    fileSaver.saveAs(yamlFile);
  }

  downloadOperationSet() {
    this.generateOperationSetZip().subscribe(set => {
      set.generateAsync({ type: 'blob' }).then((zipContent) => {
        fileSaver.saveAs(zipContent, `${this.resultsSpecFileDisplayName}-merge-set`);
      });
    });
  }

  private generateOperationSetZip(): Observable<JSZip> {
    return new Observable((observer) => {
      const operationSetZip = new JSZip();
      const resultFileContent = readFileAsString(this.operationSet.resultSpec);
      operationSetZip.file(this.resultSpecFileName, resultFileContent);

      if (this.defaultsFileValid) {
        const defaultsFileContent = readFileAsString(this.operationSet.defaultsFile);
        operationSetZip.file(this.defaultsFileName, defaultsFileContent);
      }

      this.specFiles.forEach((spec) => {
        const specFileContent = readFileAsString(spec);
        operationSetZip.file(spec.name, specFileContent);
      });

      observer.next(operationSetZip);
      observer.complete();
    });
  }

  specLabel(index: number) {
    return `Spec ${index + 1}`;
  }

  get mergeDescription(): string {
    const defaults = this.defaultsFileValid ? `using ${this.defaultsFileName} and ` : '';
    const specs = this.specFiles.map(spec => spec.name).join(', ');

    return `This new OpenAPI specification has been generated by ${defaults} merging ${specs}.`;
  }

  get defaultsFileValid(): boolean {
    return !!this.operationSet.defaultsFile;
  }

  get resultSpecFileName(): string {
    return this.operationSet.resultSpec.name;
  }

  get resultsSpecFileDisplayName(): string {
    return this.operationSet.resultSpec.name.slice(0, this.resultSpecFileName.indexOf('.yaml'));
  }

  get defaultsFileName(): string {
    return this.operationSet.defaultsFile.name;
  }

  get specFiles(): File[] {
    return this.operationSet.specFiles;
  }

  ngOnInit() {
    iterateYaml(this.operationSet.resultSpec);
  }
}
