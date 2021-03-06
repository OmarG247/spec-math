/*
Copyright 2020 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package org.specmath.library;

import static com.google.common.truth.Truth.assertThat;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import org.junit.jupiter.api.Test;

class TypeCheckerTest {

  @Test
  void isObjectMap_withLinkedHashMap_returnsTrue() {
    Object map = new LinkedHashMap<String, Object>();
    assertThat(TypeChecker.isObjectMap(map)).isTrue();
  }

  @Test
  void isObjectMap_withHashMap_returnsFalse() {
    Object map = new HashMap<>();
    Object notAMap = "notAMap";
    assertThat(TypeChecker.isObjectMap(map)).isFalse();
    assertThat(TypeChecker.isObjectMap(notAMap)).isFalse();
  }

  @Test
  void isObjectList_withArrayList_returnsTrue() {
    Object list = new ArrayList<Object>();
    assertThat(TypeChecker.isObjectList(list)).isTrue();
  }

  @Test
  void isObjectList_withString_returnsTrue() {
    Object notAList = "notAList";
    assertThat(TypeChecker.isObjectList(notAList)).isFalse();
  }

  @Test
  void isObjectPrimitive_withPrimitives_returnsTrue() {
    Object str = "str";
    Object integer = 5;
    Object doub = 5.0;
    Object bool = false;

    assertThat(TypeChecker.isObjectPrimitive(str)).isTrue();
    assertThat(TypeChecker.isObjectPrimitive(integer)).isTrue();
    assertThat(TypeChecker.isObjectPrimitive(doub)).isTrue();
    assertThat(TypeChecker.isObjectPrimitive(bool)).isTrue();
  }

  @Test
  void isObjectPrimitive_withoutPrimitives_returnsTrue() {
    Object list = new ArrayList<Object>();
    Object map = new LinkedHashMap<String, Object>();

    assertThat(TypeChecker.isObjectPrimitive(list)).isFalse();
    assertThat(TypeChecker.isObjectPrimitive(map)).isFalse();
  }
}
