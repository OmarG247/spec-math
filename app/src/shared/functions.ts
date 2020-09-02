import { By } from '@angular/platform-browser';
import { ComponentFixture } from '@angular/core/testing';
import { YamlLevel } from './interfaces';
import * as yaml from 'js-yaml';
import { parse } from 'path';

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

export const compareYaml = async (yamlFile: File, sources: File[]) => {
  const results = yaml.load(await readFileAsString(yamlFile));
  const sourceObjects = await Promise.all(sources.map(async (file) => {
    return {
      name: file.name,
      file: await yaml.load(await readFileAsString(file)),
    };
  }));

  iterateObject(results, sourceObjects);
};

type KeyMap = {[key: string]: File[]};

export const buildKeyMap = async (sources: File[], keyMap: KeyMap) => {
  for (const source of sources) {
    const parsed = yaml.load(await readFileAsString(source));
    buildKeyMapForSource('', source, parsed, keyMap);
  }

  console.log(keyMap);
};

const buildKeyMapForSource = (baseKey: string, source: File, parsed: object, keyMap: KeyMap) => {
  if (Array.isArray(parsed) || typeof parsed !== 'object') {
    return;
  }

  Object.keys(parsed).forEach((key) => {
    const fullKey = baseKey + key;
    if (!keyMap.hasOwnProperty(fullKey)) {
      keyMap[fullKey] = [];
    }

    keyMap[fullKey].push(source);

    buildKeyMapForSource(`${fullKey}.`, source, parsed[key], keyMap);
  });
};

const iterateObject = (objectNode: object, compareArray?: object[]) => {
  const isArray = Array.isArray(objectNode);
  const newComparisons = [];

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
