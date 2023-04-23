/*
 * Copyright (C) 2022-2023 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// @ts-nocheck
import { describe, beforeAll, beforeEach, afterEach, afterAll, it, expect } from 'deccjsunit/index';
import pasteboard from '@ohos.pasteboard';
import image from '@ohos.multimedia.image';

describe('PasteBoardJSTest', function () {
  beforeAll(async function () {
    console.info('beforeAll');
  });

  afterAll(async function () {
    console.info('afterAll');
  });

  /**
   * @tc.name      pasteboard_exception_test1
   * @tc.desc      自定义数据测试
   * @tc.type      Function
   * @tc.require   AR000HEECB
   */
  it('pasteboard_exception_test1', 0, async function (done) {
    let systemPasteBoard = pasteboard.getSystemPasteboard();
    await systemPasteBoard.clear().then(async () => {
      let pasteData = undefined;
      console.info('systemPasteBoard clear data success');
      let dataUri = new ArrayBuffer(256);
      pasteData = pasteboard.createData('xxx', dataUri);
      let addUri = new ArrayBuffer(128);
      pasteData.addRecord('xxx', addUri);
      let recordUri = new ArrayBuffer(96);
      let pasteDataRecord = pasteboard.createRecord('xxx', recordUri);
      pasteData.addRecord(pasteDataRecord);
      await systemPasteBoard.setPasteData(pasteData).then(async () => {
        console.info('Set pastedata success');
        await systemPasteBoard.hasPasteData().then(async (data) => {
          console.info('Check pastedata has data success, result: ' + data);
          expect(data).assertTrue();
          await systemPasteBoard.getPasteData().then(async (data) => {
            console.info('Get paste data success');
            expect(data.getRecordCount()).assertEqual(3);
            expect(data.getRecordAt(0).data['xxx'].byteLength).assertEqual(96);
            expect(data.getRecordAt(1).data['xxx'].byteLength).assertEqual(128);
            expect(data.getRecordAt(2).data['xxx'].byteLength).assertEqual(256);
            done();
          });
        });
      });
    });
  });

  /**
   * @tc.name      pasteboard_exception_test2
   * @tc.desc      自定义数据测试
   * @tc.type      Function
   * @tc.require   AR000HEECB
   */
  it('pasteboard_exception_test2', 0, async function (done) {
    let systemPasteBoard = pasteboard.getSystemPasteboard();
    await systemPasteBoard.clear().then(async () => {
      console.info('systemPasteBoard clear data success');
      let pasteData = undefined;
      let pasteRecord = undefined;

      let dataHtml = new ArrayBuffer(256);
      pasteData = pasteboard.createData('xy', dataHtml);
      expect(pasteData != undefined).assertTrue();

      pasteData.addRecord('x'.repeat(1024), dataHtml);
      expect(pasteData.getRecordCount()).assertEqual(2);

      pasteRecord = pasteboard.createRecord('xy2', dataHtml);
      expect(pasteRecord != undefined).assertTrue();
      pasteData.addRecord(pasteRecord);

      await systemPasteBoard.setPasteData(pasteData).then(async () => {
        console.info('set pastedata success');
        await systemPasteBoard.hasPasteData().then(async (data) => {
          console.info('Check pastedata has data success, result: ' + data);
          expect(data).assertTrue();
          await systemPasteBoard.getPasteData().then(async (data) => {
            console.info('get paste data success');
            expect(data.getRecordCount()).assertEqual(3);
            expect(data.getRecordAt(0).mimeType).assertEqual('xy2');
            expect(data.getRecordAt(1).mimeType).assertEqual('x'.repeat(1024));
            expect(data.getRecordAt(2).mimeType).assertEqual('xy');
            done();
          });
        });
      });
    });
  });

  /**
   * @tc.name      pasteboard_exception_test3
   * @tc.desc      自定义数据异常测试
   * @tc.type      Function
   * @tc.require   AR000HEECB
   */
  it('pasteboard_exception_test3', 0, async function (done) {
    console.info('pasteboard_exception_test1 start');
    let systemPasteBoard = pasteboard.getSystemPasteboard();
    await systemPasteBoard.clear().then(async () => {
      console.info('systemPasteBoard clear data success');
      let pasteData = undefined;
      let pasteRecord = undefined;

      // test createData
      let dataHtml = new ArrayBuffer(256);
      try {
        pasteData = pasteboard.createData('x'.repeat(1025), dataHtml);
        expect(true === false).assertTrue();
      } catch (error) {
        console.info(error.code);
        console.info(error.message);
      }

      expect(pasteData).assertEqual(undefined);
      pasteData = pasteboard.createData('x'.repeat(1024), dataHtml);
      expect(pasteData != undefined).assertTrue();

      // test addRecord
      try {
        pasteData.addRecord('x'.repeat(1025), dataHtml);
        expect(true === false).assertTrue();
      } catch (error) {
        console.info(error.code);
        console.info(error.message);
      }
      expect(pasteData.getRecordCount()).assertEqual(1);
      pasteData.addRecord('x'.repeat(1024), dataHtml);
      expect(pasteData.getRecordCount()).assertEqual(2);
      
      let addHtml = new ArrayBuffer(128);
      try {
        pasteData.addRecord('x'.repeat(1025), addHtml);
        expect(true === false).assertTrue();
      } catch (error) {
        console.info(error.code);
        console.info(error.message);
      }
      expect(pasteData.getRecordCount()).assertEqual(2);
      pasteData.addRecord('x'.repeat(1024), addHtml);
      expect(pasteData.getRecordCount()).assertEqual(3);

      let recordHtml = new ArrayBuffer(64);
      try {
        pasteRecord = pasteboard.createRecord('x'.repeat(1025), recordHtml);
        expect(true === false).assertTrue();
      } catch (error) {
        console.info(error.code);
        console.info(error.message);
      }
      expect(pasteRecord).assertEqual(undefined);
      pasteRecord = pasteboard.createRecord('x'.repeat(1024), recordHtml);
      expect(pasteRecord != undefined).assertTrue();
      pasteData.addRecord(pasteRecord);
      expect(pasteData.getRecordCount()).assertEqual(4);
      await systemPasteBoard.setPasteData(pasteData).then(async () => {
        console.info('set pastedata success');
        await systemPasteBoard.hasPasteData().then(async (data) => {
          console.info('Check pastedata has data success, result: ' + data);
          expect(data).assertTrue();
          await systemPasteBoard.getPasteData().then(async (data) => {
            console.info('get paste data success');
            expect(data.getRecordCount()).assertEqual(4);
            done();
          });
        });
      });
    });
  });

  /**
   * @tc.name      pasteboard_exception_test5
   * @tc.desc      一个record中多个数据类型：get primary html、pixelMap、want、text、uri
   * @tc.type      Function
   * @tc.require   AR000HEECB
   */
  it('pasteboard_exception_test5', 0, async function (done) {
    let systemPasteBoard = pasteboard.getSystemPasteboard();
    systemPasteBoard.clear().then(() => {
      let dataHtml = new ArrayBuffer(256);
      let htmlText = '<html><head></head><body>Hello!</body></html>';
      let uriText = 'https://www.baidu.com/';
      let wantText = {
        bundleName: 'com.example.myapplication3',
        abilityName: 'com.example.myapplication3.MainAbility',
      };
      let plainText = '';
      let pasteData = pasteboard.createData('x'.repeat(1024), dataHtml);
      let record = pasteData.getRecordAt(0);
      record.htmlText = htmlText;
      record.plainText = plainText;
      record.uri = uriText;
      record.want = wantText;
      let buffer = new ArrayBuffer(128);
      let opt = {
        size: { height: 5, width: 5 },
        pixelFormat: 3,
        editable: true,
        alphaType: 1,
        scaleMode: 1,
      };
      image.createPixelMap(buffer, opt).then((pixelMap) => {
        record.pixelMap = pixelMap;
        pasteData.replaceRecordAt(0, record);
        systemPasteBoard.setPasteData(pasteData).then(() => {
          systemPasteBoard.hasPasteData().then((hasData) => {
            expect(hasData).assertTrue();
            systemPasteBoard.getPasteData().then((data) => {
              expect(data.getRecordCount()).assertEqual(1);
              expect(data.getRecordAt(0).mimeType).assertEqual('x'.repeat(1024));
              expect(data.getPrimaryWant().bundleName).assertEqual(wantText.bundleName);
              expect(data.getPrimaryWant().abilityName).assertEqual(wantText.abilityName);
              let newPixelMap = data.getPrimaryPixelMap();
              newPixelMap.getImageInfo().then((imageInfo) => {
                expect(imageInfo.size.height).assertEqual(opt.size.height);
                expect(imageInfo.size.width).assertEqual(opt.size.width);
              });
              expect(data.getPrimaryUri()).assertEqual(uriText);
              expect(data.getPrimaryText()).assertEqual(plainText);
              expect(data.getPrimaryHtml()).assertEqual(htmlText);
              done();
            });
          });
        });
      });
    });
  });

  /**
   * @tc.name      pasteboard_exception_test6
   * @tc.desc      Test CreateRecord throw error
   * @tc.type      Function
   * @tc.require   I5TYVJ
   */
  it('pasteboard_exception_test6', 0, async function (done) {
    let systemPasteboard = pasteboard.getSystemPasteboard();
    systemPasteboard.clear().then(() => {
      let uriText = 'https://www.baidu.com/';
      let pasteData = pasteboard.createUriData(uriText);
      systemPasteboard.setPasteData(pasteData).then(() => {
        systemPasteboard.hasPasteData().then((data) => {
          expect(data).assertEqual(true);
          systemPasteboard.getPasteData().then((data) => {
            let pasteData1 = data;
            expect(pasteData1.getRecordCount()).assertEqual(1);
            let uriText1 = 'https://www.baidu.com/1';
            let pasteDataRecord = pasteboard.createRecord(pasteboard.MIMETYPE_TEXT_URI, uriText1);
            let replace = pasteData1.replaceRecordAt(0, pasteDataRecord);
            expect(replace).assertEqual(true);
            let primaryUri1 = pasteData1.getPrimaryUri();
            expect(primaryUri1).assertEqual(uriText1);
            expect(pasteData1.hasMimeType(pasteboard.MIMETYPE_TEXT_URI)).assertEqual(true);
            let primaryUri2 = pasteData1.getPrimaryUri();
            expect(primaryUri2).assertEqual(uriText1);
            done();
          });
        });
      });
    });
  });

  /**
   * @tc.name      pasteboard_exception_test7
   * @tc.desc      Test CreateRecord throw error
   * @tc.type      Function
   * @tc.require   I5TYVJ
   */
  it('pasteboard_exception_test7', 0, async function (done) {
    let systemPasteboard = pasteboard.getSystemPasteboard();
    systemPasteboard.clear().then(async () => {
      let uriText = 'https://www.baidu.com/';
      let textData = 'Hello World!';
      let htmlText = '<html><head></head><body>Hello World!</body></html>';
      let wantText = {
        bundleName: 'com.example.myapplication3',
        abilityName: 'com.example.myapplication3.MainAbility',
      };
      let dataHtml = new ArrayBuffer(256);
      let buffer = new ArrayBuffer(128);
      let opt = {
        size: { height: 5, width: 5 },
        pixelFormat: 3,
        editable: true,
        alphaType: 1,
        scaleMode: 1,
      };
      let pixelMap = await image.createPixelMap(buffer, opt);
      let pasteData = pasteboard.createUriData(uriText);

      try {
        let pasteDataRecord = pasteboard.createRecord(pasteboard.MIMETYPE_TEXT_URI, uriText);
        pasteData.addRecord(pasteDataRecord);
        pasteDataRecord = pasteboard.createRecord(pasteboard.MIMETYPE_TEXT_PLAIN, textData);
        pasteData.addRecord(pasteDataRecord);
        pasteDataRecord = pasteboard.createRecord(pasteboard.MIMETYPE_TEXT_HTML, htmlText);
        pasteData.addRecord(pasteDataRecord);
        pasteDataRecord = pasteboard.createRecord(pasteboard.MIMETYPE_TEXT_WANT, wantText);
        pasteData.addRecord(pasteDataRecord);
        pasteDataRecord = pasteboard.createRecord('x'.repeat(1022), dataHtml);
        pasteData.addRecord(pasteDataRecord);
        pasteDataRecord = pasteboard.createRecord(pasteboard.MIMETYPE_PIXELMAP, pixelMap);
        pasteData.addRecord(pasteDataRecord);
      } catch (error) {
        expect(error.code === undefined).assertTrue();
        expect(error.message === undefined).assertTrue();
        expect(True === false).assertTrue();
      }
      systemPasteboard.setPasteData(pasteData).then(() => {
        systemPasteboard.hasPasteData().then((data) => {
          expect(data).assertEqual(true);
          systemPasteboard.getPasteData().then((data) => {
            expect(data.getRecordCount()).assertEqual(7);
            let dataRecord = data.getRecordAt(3);
            expect(dataRecord.htmlText).assertEqual(htmlText);
            done();
          });
        });
      });
    });
  });

  /**
   * @tc.name      pasteboard_exception_test8
   * @tc.desc      Test CreateRecord throw error
   * @tc.type      Function
   * @tc.require   I5TYVJ
   */
  it('pasteboard_exception_test8', 0, async function (done) {
    let systemPasteboard = pasteboard.getSystemPasteboard();
    systemPasteboard.clear().then(async () => {
      let uriText = 'https://www.baidu.com/';
      let htmlText = '<html><head></head><body>Hello World!</body></html>';
      let pasteData = pasteboard.createUriData(uriText);

      try {
        let pasteDataRecord = pasteboard.createRecord('xxddxx', htmlText);
        pasteData.addRecord(pasteDataRecord);
        expect(true === false).assertTrue();
      } catch (error) {
        expect(error.code).assertEqual('401');
        expect(error.message).assertEqual('Parameter error. The value does not match mimeType correctly.');
      }
      done();
    });
  });

  /**
   * @tc.name      pasteboard_exception_test9
   * @tc.desc      Test Create Uri Data
   * @tc.type      Function
   * @tc.require   I5TYVJ
   */
  it('pasteboard_exception_test9', 0, async function (done) {
    let systemPasteboard = pasteboard.getSystemPasteboard();
    await systemPasteboard.clear();
    let uriText = 'https://www.baidu.com/';
    let pasteData = undefined;
    try {
      pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_URI, uriText);
    } catch (e) {
      expect(true === false).assertTrue();
    }
    systemPasteboard.setPasteData(pasteData).then(() => {
      systemPasteboard.hasPasteData().then((data) => {
        expect(data).assertEqual(true);
        systemPasteboard.getPasteData().then((data) => {
          expect(data.getRecordCount()).assertEqual(1);
          let dataRecord = data.getRecordAt(0);
          expect(dataRecord.uri).assertEqual(uriText);
          done();
        });
      });
    });
  });

  /**
   * @tc.name      pasteboard_exception_test10
   * @tc.desc      Test Create htmlText Data
   * @tc.type      Function
   * @tc.require   I5TYVJ
   */
  it('pasteboard_exception_test10', 0, async function (done) {
    let systemPasteboard = pasteboard.getSystemPasteboard();
    await systemPasteboard.clear();
    let htmlText = '<html><head></head><body>Hello World!</body></html>';
    let pasteData = undefined;
    try {
      pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_HTML, htmlText);
    } catch (e) {
      expect(true === false).assertTrue();
    }
    systemPasteboard.setPasteData(pasteData).then(() => {
      systemPasteboard.hasPasteData().then((data) => {
        expect(data).assertEqual(true);
        systemPasteboard.getPasteData().then((data) => {
          expect(data.getRecordCount()).assertEqual(1);
          let dataRecord = data.getRecordAt(0);
          expect(dataRecord.htmlText).assertEqual(htmlText);
          done();
        });
      });
    });
  });

  /**
   * @tc.name      pasteboard_exception_test11
   * @tc.desc      Test Create wantText Data
   * @tc.type      Function
   * @tc.require   I5TYVJ
   */
  it('pasteboard_exception_test11', 0, async function (done) {
    let systemPasteboard = pasteboard.getSystemPasteboard();
    await systemPasteboard.clear();
    let wantText = {
      bundleName: 'com.example.myapplication3',
      abilityName: 'com.example.myapplication3.MainAbility',
    };
    let pasteData = undefined;
    try {
      pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_WANT, wantText);
    } catch (e) {
      expect(true === false).assertTrue();
    }
    systemPasteboard.setPasteData(pasteData).then(() => {
      systemPasteboard.hasPasteData().then((data) => {
        expect(data).assertEqual(true);
        systemPasteboard.getPasteData().then((data) => {
          expect(data.getRecordCount()).assertEqual(1);
          let primaryWant = data.getPrimaryWant();
          expect(primaryWant.bundleName).assertEqual(wantText.bundleName);
          expect(primaryWant.abilityName).assertEqual(wantText.abilityName);
          done();
        });
      });
    });
  });

  /**
   * @tc.name      pasteboard_exception_test12
   * @tc.desc      Test Create pixelMap Data
   * @tc.type      Function
   * @tc.require   I5TYVJ
   */
  it('pasteboard_exception_test12', 0, async function (done) {
    let systemPasteboard = pasteboard.getSystemPasteboard();
    await systemPasteboard.clear();
    let buffer = new ArrayBuffer(128);
    let opt = {
      size: { height: 5, width: 5 },
      pixelFormat: 3,
      editable: true,
      alphaType: 1,
      scaleMode: 1,
    };
    let pasteData = undefined;
    let pixelMap = await image.createPixelMap(buffer, opt);
    try {
      pasteData = pasteboard.createData(pasteboard.MIMETYPE_PIXELMAP, pixelMap);
    } catch (e) {
      expect(true === false).assertTrue();
    }
    systemPasteboard.setPasteData(pasteData).then(() => {
      systemPasteboard.hasPasteData().then((data) => {
        expect(data).assertEqual(true);
        systemPasteboard.getPasteData().then((data) => {
          expect(data.getRecordCount()).assertEqual(1);
          let primaryPixelMap = data.getPrimaryPixelMap();
          let PixelMapBytesNumber = primaryPixelMap.getPixelBytesNumber();
          expect(PixelMapBytesNumber).assertEqual(100);
          primaryPixelMap.getImageInfo().then((imageInfo) => {
            expect(imageInfo.size.height === 5 && imageInfo.size.width === 5).assertEqual(true);
            done();
          });
        });
      });
    });
  });

  /**
   * @tc.name      pasteboard_exception_test13
   * @tc.desc      Test CreateData throw error
   * @tc.type      Function
   * @tc.require   I5TYVJ
   */
  it('pasteboard_exception_test13', 0, async function (done) {
    let systemPasteboard = pasteboard.getSystemPasteboard();
    await systemPasteboard.clear();
    let dataHtml = new ArrayBuffer(256);
    let pasteData = undefined;
    try {
      pasteData = pasteboard.createData(pasteboard.MIMETYPE_PIXELMAP, dataHtml);
      expect(true === false).assertTrue();
    } catch (e) {
      expect(e.code).assertEqual('401');
      expect(e.message).assertEqual('Parameter error. The value does not match mimeType correctly.');
    }
    done();
  });

  /**
   * @tc.name      pasteboard_exception_test14
   * @tc.desc      Test Create KV Data
   * @tc.type      Function
   * @tc.require   I5TYVJ
   */
  it('pasteboard_exception_test14', 0, async function (done) {
    let systemPasteboard = pasteboard.getSystemPasteboard();
    await systemPasteboard.clear();
    let dataHtml = new ArrayBuffer(256);
    let pasteData = undefined;
    try {
      pasteData = pasteboard.createData('x'.repeat(1034), dataHtml);
      expect(true === false).assertTrue();
    } catch (e) {
      expect(e.code === '401').assertTrue();
      expect(e.message === 'Parameter error. The length of mimeType cannot be greater than 1024 bytes.').assertTrue();
    }
    done();
  });

  /**
   * @tc.name      pasteboard_exception_test15
   * @tc.desc      Test addRecord throw error
   * @tc.type      Function
   * @tc.require   I5TYVJ
   */
  it('pasteboard_exception_test15', 0, async function (done) {
    let systemPasteboard = pasteboard.getSystemPasteboard();
    systemPasteboard.clear().then(async () => {
      let uriText = 'https://www.baidu.com/';
      let textData = 'Hello World!';
      let htmlText = '<html><head></head><body>Hello World!</body></html>';
      let wantText = {
        bundleName: 'com.example.myapplication3',
        abilityName: 'com.example.myapplication3.MainAbility',
      };
      let dataHtml = new ArrayBuffer(256);
      let buffer = new ArrayBuffer(128);
      let opt = {
        size: { height: 5, width: 5 },
        pixelFormat: 3,
        editable: true,
        alphaType: 1,
        scaleMode: 1,
      };
      let pixelMap = await image.createPixelMap(buffer, opt);
      let pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_URI, uriText);

      try {
        pasteData.addRecord(pasteboard.MIMETYPE_TEXT_HTML, htmlText);
        pasteData.addRecord(pasteboard.MIMETYPE_TEXT_URI, uriText);
        pasteData.addRecord(pasteboard.MIMETYPE_TEXT_PLAIN, textData);
        pasteData.addRecord(pasteboard.MIMETYPE_PIXELMAP, pixelMap);
        pasteData.addRecord(pasteboard.MIMETYPE_TEXT_WANT, wantText);
        pasteData.addRecord('x'.repeat(100), dataHtml);
      } catch (error) {
        expect(true === false).assertTrue();
      }
      systemPasteboard.setPasteData(pasteData).then(() => {
        systemPasteboard.hasPasteData().then((data) => {
          expect(data).assertEqual(true);
          systemPasteboard.getPasteData().then((data) => {
            expect(data.getRecordCount()).assertEqual(7);
            let dataRecord = data.getRecordAt(6);
            expect(dataRecord.uri).assertEqual(uriText);
            let primaryPixelMap = data.getPrimaryPixelMap();
            let PixelMapBytesNumber = primaryPixelMap.getPixelBytesNumber();
            expect(PixelMapBytesNumber).assertEqual(100);
            done();
          });
        });
      });
    });
  });

  /**
   * @tc.name      pasteboard_exception_test16
   * @tc.desc      Test addRecord throw error
   * @tc.type      Function
   * @tc.require   I5TYVJ
   */
  it('pasteboard_exception_test16', 0, async function (done) {
    let uriText = 'https://www.baidu.com/';
    let pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_URI, uriText);
    try {
      pasteData.addRecord('xxxx', uriText);
      expect(true === false).assertTrue();
    } catch (e) {
      expect(e.code === '401').assertTrue();
    }
    done();
  });

  /**
   * @tc.name      pasteboard_exception_test17
   * @tc.desc      Test addRecord throw error
   * @tc.type      Function
   * @tc.require   I5TYVJ
   */
  it('pasteboard_exception_test17', 0, async function (done) {
    let uriText = 'https://www.baidu.com/';
    let pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_URI, uriText);
    try {
      for (let i = 0; i < 600; i++) {
        pasteData.addRecord(pasteboard.MIMETYPE_TEXT_URI, uriText);
      }
      expect(true === false).assertTrue();
    } catch (e) {
      expect(e.code === '12900002').assertTrue();
    }
    done();
  });

  /**
   * @tc.name      pasteboard_exception_test18
   * @tc.desc      Test getRecord throw error
   * @tc.type      Function
   * @tc.require   I5TYVJ
   */
  it('pasteboard_exception_test18', 0, async function (done) {
    let uriText = 'https://www.baidu.com/';
    let pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_URI, uriText);
    try {
      let dataRecord = pasteData.getRecord(0);
      expect(dataRecord.uri).assertEqual(uriText);
    } catch (e) {
      expect(true === false).assertTrue();
    }
    done();
  });

  /**
   * @tc.name      pasteboard_exception_test19
   * @tc.desc      Test getRecord throw error
   * @tc.type      Function
   * @tc.require   I5TYVJ
   */
  it('pasteboard_exception_test19', 0, async function (done) {
    let uriText = 'https://www.baidu.com/';
    let pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_URI, uriText);
    try {
      let dataRecord = pasteData.getRecord(5);
      expect(true === false).assertTrue();
    } catch (e) {
      expect(e.code === '12900001').assertTrue();
    }
    done();
  });

  /**
   * @tc.name      pasteboard_exception_test20
   * @tc.desc      Test replaceRecord throw error
   * @tc.type      Function
   * @tc.require   I5TYVJ
   */
  it('pasteboard_exception_test20', 0, async function (done) {
    let uriText = 'https://www.baidu.com/';
    let uriText1 = 'https://www.baidu1.com/';
    let pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_URI, uriText);
    let dataRecord = pasteboard.createRecord(pasteboard.MIMETYPE_TEXT_URI, uriText1);
    try {
      pasteData.replaceRecord(0, dataRecord);
      let record = pasteData.getRecord(0);
      expect(record.uri).assertEqual(uriText1);
    } catch (e) {
      expect(true === false).assertTrue();
    }
    done();
  });

  /**
   * @tc.name      pasteboard_exception_test22
   * @tc.desc      Test replaceRecord throw error
   * @tc.type      Function
   * @tc.require   I5TYVJ
   */
  it('pasteboard_exception_test22', 0, async function (done) {
    let uriText = 'https://www.baidu.com/';
    let pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_URI, uriText);
    try {
      pasteData.replaceRecord(0, 'xxxxxx');
      expect(true === false).assertTrue();
    } catch (e) {
      expect(e.code === '401').assertTrue();
    }
    done();
  });

  /**
   * @tc.name      pasteboard_exception_test23
   * @tc.desc      Test setData
   * @tc.type      Function
   * @tc.require   I5TYVJ
   */
  it('pasteboard_exception_test23', 0, async function (done) {
    let systemPasteboard = pasteboard.getSystemPasteboard();
    systemPasteboard.clearData().then(() => {
      let uriText = 'Hello//';
      let pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_URI, uriText);
      systemPasteboard.setData(pasteData).then(() => {
        systemPasteboard.hasData().then((data) => {
          expect(data).assertEqual(true);
          systemPasteboard.getData().then((pasteData1) => {
            expect(pasteData1.getRecordCount()).assertEqual(1);
            expect(pasteData1.hasType(pasteboard.MIMETYPE_TEXT_URI)).assertEqual(true);
            expect(pasteData1.getPrimaryUri()).assertEqual(uriText);
            done();
          });
        });
      });
    });
  });

  /**
   * @tc.name      pasteboard_exception_test24
   * @tc.desc      Test setData throw error
   * @tc.type      Function
   * @tc.require   I5TYVJ
   */
  it('pasteboard_exception_test24', 0, async function (done) {
    let systemPasteboard = pasteboard.getSystemPasteboard();
    try {
      systemPasteboard.setData('xxxxx');
      expect(true === false).assertTrue();
    } catch (e) {
      expect(e.code === '401').assertTrue();
      expect(e.message === 'Parameter error. The Type of data must be pasteData.').assertTrue();
    }
    done();
  });

  /**
   * @tc.name      pasteboard_exception_test25
   * @tc.desc      Test setproperty throw error
   * @tc.type      Function
   * @tc.require   I5TYVJ
   */
  it('pasteboard_exception_test25', 0, async function (done) {
    let systemPasteboard = pasteboard.getSystemPasteboard();
    systemPasteboard.clear().then(async () => {
      let textData = 'Hello World!';
      let pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, textData);
      let pasteDataProperty = pasteData.getProperty();
      expect(pasteDataProperty.shareOption).assertEqual(pasteboard.ShareOption.CrossDevice);
      pasteDataProperty.shareOption = pasteboard.ShareOption.InApp;
      pasteData.setProperty(pasteDataProperty);
      expect(pasteData.getProperty().shareOption).assertEqual(pasteboard.ShareOption.InApp);
      done();
    });
  });

  /**
   * @tc.name      pasteboard_exception_test26
   * @tc.desc      Test setproperty throw error
   * @tc.type      Function
   * @tc.require   I5TYVJ
   */
  it('pasteboard_exception_test26', 0, async function (done) {
    let systemPasteboard = pasteboard.getSystemPasteboard();
    systemPasteboard.clear().then(async () => {
      let textData = 'Hello World!';
      let pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, textData);
      try {
        let obj = { shareOption: 1 };
        pasteData.setProperty(obj);
        expect(true === false).assertTrue();
      } catch (e) {
        expect(e.code === '401').assertTrue();
        expect(e.message === 'Parameter error. The type of property must be PasteDataProperty.').assertTrue();
      }
      done();
    });
  });

  /**
   * @tc.name      pasteboard_exception_test27
   * @tc.desc      Test createData throw error
   * @tc.type      Function
   * @tc.require   I5TYVJ
   */
  it('pasteboard_exception_test27', 0, async function (done) {
    let textData = 'Hello World!';
    let dataXml = new ArrayBuffer(512);
    try {
      let pasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, dataXml);
      expect(true === false).assertTrue();
    } catch (e) {
      expect(e.code === '401').assertTrue();
      expect(e.message === 'Parameter error. The value does not match mimeType correctly.').assertTrue();
    }
    done();
  });

  /**
   * @tc.name      pasteboard_exception_test28
   * @tc.desc      Test createData throw error
   * @tc.type      Function
   * @tc.require   I5TYVJ
   */
  it('pasteboard_exception_test28', 0, async function (done) {
    let textData = 'Hello World!';
    let dataXml = new ArrayBuffer(512);
    try {
      let pasteData = pasteboard.createData('xxxxx', textData);
      expect(true === false).assertTrue();
    } catch (e) {
      expect(e.code === '401').assertTrue();
      expect(e.message === 'Parameter error. The value does not match mimeType correctly.').assertTrue();
    }
    done();
  });

  /**
   * @tc.name      pasteboard_exception_test29
   * @tc.desc      Test createData throw error
   * @tc.type      Function
   * @tc.require   I5TYVJ
   */
  it('pasteboard_exception_test29', 0, async function (done) {
    try {
      let pasteData = pasteboard.createData(pasteboard.MIMETYPE_PIXELMAP, {});
      expect(true === false).assertTrue();
    } catch (e) {
      expect(e.code === '401').assertTrue();
      expect(e.message === 'Parameter error. The value does not match mimeType correctly.').assertTrue();
    }
    done();
  });
});
