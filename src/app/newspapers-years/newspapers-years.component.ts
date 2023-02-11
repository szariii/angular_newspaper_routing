import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NewspaperDataService } from '../newspaper-data.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newspapers-years',
  templateUrl: './newspapers-years.component.html',
  styleUrls: ['./newspapers-years.component.css'],
  providers: [],
})
export class NewspapersYearsComponent {
  // @Output() public changeView = new EventEmitter();
  // @Input('newspaperName') public newspaperName: string = '';
  public newspaperName: string = '';
  arrayWithYears: Array<string> = [];
  arrayWithNewspapers: Array<NewspaperFullInfo> = [];
  selectedYearFlag = false;
  selectedYear: string = '';
  //service;

  constructor(
    private ser: NewspaperDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.checkData();
  }

  checkData = async () => {
    this.ser.takeData().subscribe(
      (data) => {
        const newsName = this.route.snapshot.params['name'];
        const newsYear = this.route.snapshot.params['year'];

        const parser = new DOMParser();
        const xml = parser.parseFromString(data, 'text/xml');
        const path = `//lata/${newsName}`;
        let nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
        let yearArray: Array<string> = [];
        let result = nodes.iterateNext();
        while (result) {
          let html = result.childNodes[0].parentElement as HTMLElement;
          yearArray = html.innerHTML.split(',');
          result = nodes.iterateNext();
        }

        if (yearArray.length === 0) {
          this.router.navigateByUrl('');
        } else {
          this.newspaperName = this.route.snapshot.params['name'];
          yearArray.push('Wszystkie');
          this.arrayWithYears = yearArray;

          if (this.route.snapshot.params['year'] != undefined) {
            const pathv2 = `//czasopisma/${newsName}/*`;
            let nodes = xml.evaluate(
              pathv2,
              xml,
              null,
              XPathResult.ANY_TYPE,
              null
            );
            const newspaperArray: Array<NewspaperFullInfo> = [];
            let result = nodes.iterateNext();

            while (result) {
              if (result.childNodes.length !== 0) {
                let html = result.childNodes[0].parentElement as HTMLElement;

                if (
                  newsYear === html.getAttribute('rok') ||
                  newsYear === 'Wszystkie'
                ) {
                  //if(){
                  let obj: NewspaperFullInfo = {
                    nazwa: html.getElementsByTagName('nazwa')[0].innerHTML,
                    numer: html.getElementsByTagName('numer')[0].innerHTML,
                    wydawca: html.getElementsByTagName('wydawca')[0].innerHTML,
                    format: html.getElementsByTagName('format')[0].innerHTML,
                    stron: html.getElementsByTagName('stron')[0].innerHTML,
                    miniaturka:
                      html.getElementsByTagName('miniaturka')[0].innerHTML,
                    plik: html.getElementsByTagName('plik')[0].innerHTML,
                    skan: html.getElementsByTagName('skan')[0].innerHTML,
                    przetworzenie:
                      html.getElementsByTagName('przetworzenie')[0].innerHTML,
                    podeslal:
                      html.getElementsByTagName('podeslal')[0].innerHTML,
                  };
                  console.log(obj);
                  newspaperArray.push(obj);
                }
              }
              result = nodes.iterateNext();
            }

            console.log(yearArray);
            if (yearArray.includes(newsYear)) {
              this.selectedYearFlag = true;
              this.selectedYear = newsYear;
              this.arrayWithNewspapers = newspaperArray;
            } else {
              console.log('nie ma gazet');
              this.router.navigateByUrl('');
            }
          }
        }
      },
      (error) => {
        console.log('Error', error);
      }
    );

    // console.log(route);
    // const newsName = route.snapshot.params['name'];
    // console.log(newsName);

    // console.log(route.snapshot.params['year']);
    // if (route.snapshot.params['id'] == undefined) {
    //   console.log('ni ma id');
    // } else {
    //   console.log('jest id');
    // }
  };

  // async ngOnInit() {
  //   this.arrayWithYears = await this.service.getYearsOfNewspapers(
  //     this.newspaperName
  //   );
  // }

  // clickYearHandler = async (year: string) => {
  //   this.selectedYear = year;
  //   this.selectedYearFlag = true;
  //   // this.arrayWithNewspapers = await this.service.getNewspapersInSelectedYear(
  //   //   this.newspaperName,
  //   //   year
  //   // );
  // };
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
