import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing'

import { DataService } from "./data.service";
import { Book } from "app/models/book";
import { BookTrackerError } from "app/models/bookTrackerError";

describe('DataService Tests', () => {
  let dataService: DataService;
  let httpTestingController: HttpTestingController;

  let testBooks: Book[] = [
    { bookID: 1, title: 'Book 1', author: 'Author 1', publicationYear: 2001 },
    { bookID: 2, title: 'Book 2', author: 'Author 2', publicationYear: 2002 },
    { bookID: 3, title: 'Book 3', author: 'Author 3', publicationYear: 2003 }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ DataService ]
    });

    dataService = TestBed.inject(DataService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should GET all books', () => {
    dataService.getAllBooks()
      .subscribe(
        (data: Book[] | BookTrackerError) => {
        expect((<Book[]>data).length).toBe(3);
      });

    let booksRequest: TestRequest = httpTestingController.expectOne('/api/books');
    expect(booksRequest.request.method).toEqual('GET');

    booksRequest.flush(testBooks);

    // moving to afterEach:
    //httpTestingController.verify();
  });

  it('should return a BookTrackerError', () => {
    dataService.getAllBooks()
      .subscribe(
        (data: Book[] | BookTrackerError) => fail('this should have been an error'),
        (err: BookTrackerError) => {
          expect(err.errorNumber).toEqual(100);
          expect(err.friendlyMessage).toEqual('An error occurred retrieving data.')
        }
      );

      let booksRequest: TestRequest = httpTestingController.expectOne('/api/books');

      booksRequest.flush('error', {
        status: 500,
        statusText: 'Server Error'
      });

      // moving to afterEach:
      //httpTestingController.verify();
  });
});