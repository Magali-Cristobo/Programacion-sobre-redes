import { Component } from '@angular/core';

@Component({
  selector: 'numero-magico',
  template: `
    <p>Tu numero magico es: {{random}}</p>
  `,
  styles: [
  ]
})
export class NumeroMagicoComponent {
  random=Math.round(Math.random()*100);
}
