import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(value: any[], filterString: string, propName: string, categoryFilter: string = '', categoryProp: string = ''): any {
    if (!value || value.length === 0) {
      return [];
    }

    let filteredItems = value;

    // Apply name filter
    if (filterString) {
      filteredItems = filteredItems.filter(item => 
        item[propName]?.toLowerCase().includes(filterString.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter) {
      filteredItems = filteredItems.filter(item => 
        item[categoryProp] === categoryFilter
      );
    }

    return filteredItems;
  }
}
