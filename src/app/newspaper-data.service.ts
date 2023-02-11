import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NewspaperDataService {
  arrayWithInfoOfNewspaper: Array<NewspaperInfo> = [];
  arrayWithYears: Array<String> = [];
  http;

  xml: Document = new Document();

  constructor(private httpClient: HttpClient) {
    this.http = httpClient;

    //const params = new HttpParams().set('responseType', 'document');
    //this.parseData();
    //this.takeXml();
    // var xhttp = new XMLHttpRequest();
    // xhttp.onreadystatechange = function () {
    //   if (this.readyState == 4 && this.status == 200) {
    //     showResult();
    //   }
    // };
    // xhttp.open('GET', '../assets/czasopisma.xml', true);
    // xhttp.send();

    // const showResult = async () => {
    //   let xml = this.takeXml();
    //   //console.log(xm1);
    //   const path = `//zmienne/*`;
    //   if (xml.evaluate) {
    //     let nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
    //     let result = nodes.iterateNext();
    //     while (result) {
    //       let newspaperInfo = result.childNodes[0].parentElement as HTMLElement;
    //       let src = newspaperInfo.getElementsByTagName('src')[0].innerHTML;
    //       let klik = newspaperInfo.getElementsByTagName('klik')[0].innerHTML;
    //       let obj: NewspaperInfo = {
    //         name: klik,
    //         img: src,
    //       };
    //       console.log(obj);
    //       this.arrayWithInfoOfNewspaper.push(obj);
    //       result = nodes.iterateNext();
    //     }
    //   }
    // };

    // showResult();
  }

  // parseData = async () => {
  //   return this.takeData().subscribe(
  //     (data) => {
  //       const parser = new DOMParser();
  //       //this.xml = parser.parseFromString(data, 'text/xml');
  //       console.log(parser.parseFromString(data, 'text/xml'));
  //       return parser.parseFromString(data, 'text/xml');
  //     },
  //     (error) => {
  //       console.log('Error', error);
  //     }
  //   );
  // };

  takeData = () => {
    return this.http.get('../assets/czasopisma.xml', { responseType: 'text' });
  };

  takeAllNewspapers = async () => {
    const xml = this.xml;
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
      returnArray.push(obj);
      result = nodes.iterateNext();
    }
    console.log(returnArray);
    return returnArray;
  };

  // takeXml = async () => {
  //   const params = new HttpParams().set('responseType', 'document');
  //   this.http
  //     .get('../assets/czasopisma.xml', { responseType: 'text' })
  //     .subscribe(
  //       (data) => {
  //         const parser = new DOMParser();
  //         this.xml = parser.parseFromString(data, 'text/xml');
  //       },
  //       (error) => {
  //         console.log('Error', error);
  //       }
  //     );
  // };

  checkIfNameExist = async (name: string) => {
    this.http
      .get('../assets/czasopisma.xml', { responseType: 'text' })
      .subscribe(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.log('Error', error);
        }
      );
    console.log('test koniec');
  };

  async getYearsOfNewspapers(name: string) {
    const getPostagePrice = async () => {
      let doc: Document = new Document();
      await fetch('../assets/czasopisma.xml')
        .then((response) => response.text())
        .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
        .then((data) => (doc = data));

      return doc;
    };

    let xml = await getPostagePrice();
    const path = `//lata/${name}`;
    let nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
    let array: Array<string> = [];
    let result = nodes.iterateNext();
    while (result) {
      let html = result.childNodes[0].parentElement as HTMLElement;
      array = html.innerHTML.split(',');
      result = nodes.iterateNext();
    }
    array.push('Wszystkie');
    return array;
  }

  async getNewspapersInSelectedYear(name: string, year: string) {
    const getPostagePrice = async () => {
      let doc: Document = new Document();
      await fetch('../assets/czasopisma.xml')
        .then((response) => response.text())
        .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
        .then((data) => (doc = data));

      return doc;
    };

    let xml = await getPostagePrice();
    const path = `//czasopisma/${name}/*`;
    let nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
    let array: Array<NewspaperFullInfo> = [];
    let result = nodes.iterateNext();

    while (result) {
      if (result.childNodes.length !== 0) {
        let html = result.childNodes[0].parentElement as HTMLElement;

        if (year === html.getAttribute('rok') || year === 'Wszystkie') {
          //if(){
          let obj: NewspaperFullInfo = {
            nazwa: html.getElementsByTagName('nazwa')[0].innerHTML,
            numer: html.getElementsByTagName('numer')[0].innerHTML,
            wydawca: html.getElementsByTagName('wydawca')[0].innerHTML,
            format: html.getElementsByTagName('format')[0].innerHTML,
            stron: html.getElementsByTagName('stron')[0].innerHTML,
            miniaturka: html.getElementsByTagName('miniaturka')[0].innerHTML,
            plik: html.getElementsByTagName('plik')[0].innerHTML,
            skan: html.getElementsByTagName('skan')[0].innerHTML,
            przetworzenie:
              html.getElementsByTagName('przetworzenie')[0].innerHTML,
            podeslal: html.getElementsByTagName('podeslal')[0].innerHTML,
          };
          array.push(obj);
        }
      }

      result = nodes.iterateNext();
    }

    return array;
  }
}

interface NewspaperInfo {
  name: string;
  img: string;
}

interface NewspaperFullInfo {
  nazwa: string;
  numer: string;
  wydawca: string;
  format: string;
  stron: string;
  miniaturka: string;
  plik: string;
  skan: string;
  przetworzenie: string;
  podeslal: string;
}
