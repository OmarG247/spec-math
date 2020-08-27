import { By } from '@angular/platform-browser';
import { ComponentFixture } from '@angular/core/testing';
import { YamlLevel } from './interfaces';
import * as yaml from 'js-yaml';

export const queryElement = (targetFixture: ComponentFixture<any>, targetClass: string) => {
  return targetFixture.debugElement.query(By.css(targetClass));
};

export const readFileAsString = (file: File): Promise<string> => {
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.readAsText(file);
    reader.addEventListener('load', () => {
      resolve(reader.result.toString());
    });
  });
};

const flattenYamlToArray = (levelArray: YamlLevel[], level: number, objectNode: object) => {
  const isArray = Array.isArray(objectNode);

  Object.keys(objectNode).forEach((key) => {
    if (typeof (objectNode[key]) !== 'object') {
      levelArray.push({
        attribute: isArray ? `- ${objectNode[key]}` : `${key}: ${objectNode[key]}`,
        level,
      });
      return;
    }

    if (!isArray) {
      levelArray.push({
        attribute: `${key}:`,
        level,
      });
    }

    flattenYamlToArray(levelArray, isArray ? level : level + 1, objectNode[key]);
  });
};

export const flattenYamlFile = async (yamlFile: File): Promise<YamlLevel[]> => {
  const levelArray = [];
  await readFileAsString(yamlFile).then((res) => {
    flattenYamlToArray(levelArray, 0, yaml.load(res));
  });
  return levelArray;
};

export const compareYaml = async (yamlFile: File, comparisons: File[]) => {
  const results = yaml.load(await readFileAsString(yamlFile));

  readFileAsString(yamlFile).then((res) => {
    iterateObject(yaml.load(res));
  });
};

const iterateObject = (objectNode: object, compareNode?: object) => {
  const isArray = Array.isArray(objectNode);

  Object.keys(objectNode).forEach((key) => {
    if (typeof (objectNode[key]) !== 'object') {
      console.log(isArray ? `- ${objectNode[key]}` : `${key}: ${objectNode[key]}`);
      return;
    }

    if (!isArray) {
      console.log(`${key}:`);
    }

    iterateObject(objectNode[key]);
  });
};
