import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, skip, startWith, take } from 'rxjs/operators';
import { increment, decrement, reset } from '../counter.actions';

@Component({
  selector: 'app-my-counter',
  templateUrl: './my-counter.component.html',
  styleUrls: ['./my-counter.component.css']
})
export class MyCounterComponent {
  count$: Observable<number>;

  constructor(private store: Store<{ count: number }>) {
    this.count$ = store.select('count');
  }

  increment() {
    this.store.dispatch(increment());
    // this.calculateSeries();
    this.calculateMath('add');
    this.calculateMath('mul');
  }

  decrement() {
    this.store.dispatch(decrement());
    this.calculateSeries();
    this.calculateMath('add');
    this.calculateMath('mul');
  }

  reset() {
    this.store.dispatch(reset());
  }

  calculateSeries() {
    //Display squared value for each like 0,4,9
    this.count$
      .pipe(map(res => res * res))
      .subscribe(value =>
        console.log('using map operator print squared numbers', value)
      );

    //Display only the first 3 values emitted.
    this.count$
      .pipe(take(3))
      .subscribe(value => console.log('Only emit first 3 using take', value));

    //Display only values emitted that are even numbers:
    this.count$
      .pipe(filter(res => res % 2 === 0))
      .subscribe(value =>
        console.log('Only emit required values using filter', value)
      );

    // Display all values emitted but the 3 first
    this.count$
      .pipe(skip(3))
      .subscribe(value => console.log('skip of first three values', value));

    //Make the observable emit a first value equal to 100
    this.count$
      .pipe(startWith(100))
      .subscribe(value => console.log('start with 100', value));
  }

  calculateMath(val: string) {
    let operators$ = new BehaviorSubject('');
    operators$.next(val);
    combineLatest(this.count$, operators$).subscribe(res => {
      console.log(res);
      if (res[1] == 'add') {
        console.log(res[0] + res[0]);
      } else if (res[1] == 'mul') {
        console.log(res[0] * res[0]);
      }
    });
  }
}
