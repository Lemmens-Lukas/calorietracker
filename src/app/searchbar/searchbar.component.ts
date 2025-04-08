import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
})
export class SearchbarComponent  implements OnInit {

  constructor() { }

  ngOnInit() {
   
  }

  enteredSearchValue: string = "";

  @Output() searchTextChanged: EventEmitter<string> = new EventEmitter<string>();

  onSearchTextChanged(){
    console.log(this.enteredSearchValue)
    this.searchTextChanged.emit(this.enteredSearchValue);
  }

}
