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

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { SpecNameInputOptions, DefaultsFileUploadOptions, SpecFilesUploadOptions, MergeConflict } from 'src/shared/interfaces';

enum Steps {
  specNameInput = 0,
  defaultsFileUpload = 1,
  specFilesUpload = 2,
  confirmOperation = 3,
}

interface StepMeta {
  toolTipText?: string;
  nextStep?: Steps;
  previousStep?: Steps;
  nextButtonText?: string;
  lastStep?: boolean;
}

type StepList = {
  [key: number]: StepMeta;
};

const stepOptions: StepList = {
  [Steps.specNameInput]: {
    toolTipText: 'You must name your new spec',
    nextStep: Steps.defaultsFileUpload,
    nextButtonText: 'Next'
  },
  [Steps.defaultsFileUpload]: {
    nextStep: Steps.specFilesUpload,
    previousStep: Steps.specNameInput,
    nextButtonText: 'Next'
  },
  [Steps.specFilesUpload]: {
    toolTipText: 'You must upload a set of spec files',
    nextStep: Steps.confirmOperation,
    previousStep: Steps.defaultsFileUpload,
    nextButtonText: 'Next'
  },
  [Steps.confirmOperation]: {
    previousStep: Steps.specFilesUpload,
    nextButtonText: 'Confirm',
    lastStep: true,
  }
};

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  FIRST_STEP = Steps.specNameInput;
  LAST_STEP = Steps.confirmOperation;
  currentStep: Steps = Steps.specNameInput;
  specNameInputOptions: SpecNameInputOptions = {
    newFileName: '',
    valid: false
  };
  defaultsFileUploadOptions: DefaultsFileUploadOptions = {
    defaultsFile: null
  };
  specFilesUploadOptions: SpecFilesUploadOptions = {
    specFiles: [],
    valid: false,
  };
  mergeConflicts: MergeConflict [];

  constructor(readonly dialogRef: MatDialogRef<ModalComponent>) {
    dialogRef.disableClose = true;
  }

  nextStep(stepper: MatStepper): void {
    const currentStep = this.currentStepList[this.currentStep];

    if (currentStep.lastStep) {
      this.mergeOperation();

      if (this.hasMergeConflicts) {
        console.log('conflicts detected');
        this.currentStep  = 0;
        stepper.selectedIndex = this.currentStep + 4;
      } else {
        this.finalizeSteps();
      }
    } else {
      this.currentStep = this.currentStepList[this.currentStep].nextStep;
      stepper.selectedIndex = this.currentStep + (this.hasMergeConflicts ? 4 : 0);
    }
  }

  get currentStepList(): StepList {
    return this.hasMergeConflicts ? this.generateMergeStepOptions : stepOptions;
  }

  get generateMergeStepOptions(): StepList {
    const mergeConflictsNum = this.mergeConflicts.length;

    const mergeOptions = this.mergeConflicts.reduce((steps, _, index) => {
      const newStep: StepMeta = {
        toolTipText: 'You must resolve this conflict',
        nextButtonText: 'Resolve'
      };

      if (index === 0) {
        newStep.nextStep = index + 1;
      } else if (index === mergeConflictsNum - 1) {
        newStep.previousStep = index - 1;
        newStep.lastStep = true;
      } else if (index < mergeConflictsNum) {
        newStep.previousStep = index - 1;
        newStep.nextStep = index + 1;
      }

      steps[index] = newStep;

      return steps;
    }, {});

    return mergeOptions;
  }

  get hasMergeConflicts() {
    return !!this.mergeConflicts;
  }

  finalizeSteps() {
    this.dialogRef.close();
  }

  previousStep(stepper: MatStepper): void {
    this.currentStep = this.currentStepList[this.currentStep].previousStep;
    stepper.selectedIndex = this.currentStep + (this.hasMergeConflicts ? 4 : 0);
  }

  get validFiles(): boolean {
    return this.specFilesUploadOptions.valid;
  }

  get newFileName(): string {
    return this.specNameInputOptions?.newFileName || '';
  }

  get nextButtonTooltipText(): string {
    return this.currentStepList[this.currentStep].toolTipText;
  }

  get nextButtonEnabled(): boolean {
    switch (this.currentStep) {
      case Steps.specNameInput:
        return this.specNameInputOptions?.valid;
      case Steps.specFilesUpload:
        return this.specFilesUploadOptions?.valid;
      default:
        return true;
    }
  }

  get conflictsResolved(): boolean {
    return false;
  }

  mergeOperation() {
    // ?Call the SpecMath service here
    this.mergeConflicts = [
      {
        keypath: '/dogs',
        option1: 'Option A',
        option2: 'Option B',
      },
      {
        keypath: '/cats',
        option1: 'Option A',
        option2: 'Option B',
      },
      {
        keypath: '/pets/categories',
        option1: 'Option A',
        option2: 'Option B',
      }
    ];
  }

  get nextButtonText(): string {
    return this.currentStepList[this.currentStep].nextButtonText;
  }

  handleSpecNameInputOptions(specNameInputOptions: SpecNameInputOptions) {
    this.specNameInputOptions = specNameInputOptions;
  }

  handleDefaultsFileUploadOptions(defaultsFileUploadOptions: DefaultsFileUploadOptions) {
    this.defaultsFileUploadOptions = defaultsFileUploadOptions;
  }

  handleSpecFilesUploadOptions(specFilesUploadOptions: SpecFilesUploadOptions) {
    this.specFilesUploadOptions = specFilesUploadOptions;
  }
}
