import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Book } from 'app/models/book';
import { OldBook } from 'app/models/old-book';
import { DataService } from 'app/core/data.service';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styles: []
})
export class EditBookComponent implements OnInit {

  selectedBook: Book;

  constructor(private route: ActivatedRoute,
              private dataService: DataService) { }

  ngOnInit() {
    let bookID: number = parseInt(this.route.snapshot.params['id']);
    this.dataService.getBookById(bookID).subscribe(
      (book: Book) => this.selectedBook = book,
      (err: any) => console.log(err),
      () => console.log('complete')
    );

    this.dataService.getOldBookById(bookID).subscribe(
      (data: OldBook) => console.log(`Old book title: ${data.bookTitle}`)
    );
  }

  setMostPopular(): void {
    this.dataService.setMostPopularBook(this.selectedBook);
  }

  saveChanges(): void {
    this.dataService.updateBook(this.selectedBook)
      .subscribe(
        (data: void) => console.log(`${this.selectedBook.title} updated successfully.`),
        (err: any) => console.log(err)
      );
    
  }
}
