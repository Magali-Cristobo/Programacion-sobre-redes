import { Component, Input } from '@angular/core';

@Component({
  selector: 'casilla',
  template: `
    <button>
      {{valor}}
    </button>
  `,
  styles: [ "button{border: 1px grey solid;height: 200px;width: 200px;}"]
})
export class CasillaComponent {
  
  @Input() valor:string = " ";

}
