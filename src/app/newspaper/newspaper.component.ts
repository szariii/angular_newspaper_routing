import { Component, EventEmitter, Output } from '@angular/core';
import { NewspaperDataService } from '../newspaper-data.service';

@Component({
  selector: 'app-newspaper',
  templateUrl: './newspaper.component.html',
  styleUrls: ['./newspaper.component.css'],
})
export class NewspaperComponent {
  public arrayWithNameOfPhotos: Array<NewspaperInfo> = [];

  constructor(private ser: NewspaperDataService) {
    this.takeData(ser);
    //console.log(ser.checkIfNameExist(''));
  }

  takeData = async (ser: NewspaperDataService) => {
    //this.arrayWithNameOfPhotos = await ser.takeAllNewspapers();
    ser.takeData().subscribe(
      (data) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, 'text/xml');
        console.log(xml);
        const path = `//zmienne/*`;
        let nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
        console.log(nodes);
        let result = nodes.iterateNext();
        const returnArray: Array<NewspaperInfo> = [];
        while (result) {
          let newspaperInfo = result.childNodes[0].parentElement as HTMLElement;
          let src = newspaperInfo.getElementsByTagName('src')[0].innerHTML;
          let klik = newspaperInfo.getElementsByTagName('klik')[0].innerHTML;
          let obj: NewspaperInfo = {
            name: klik,
            img: src,
          };
          console.log(obj);
          this.arrayWithNameOfPhotos.push(obj);
          result = nodes.iterateNext();
        }
      },
      (error) => {
        console.log('Error', error);
      }
    );
  };
}

interface NewspaperInfo {
  name: string;
  img: string;
}
