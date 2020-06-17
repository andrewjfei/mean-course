import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PostsService {

    private posts: Post[] = []
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient) {}

    getPosts() {
        this.http.get('http://localhost:3000/api/posts')
        .subscribe(
            (postData: { message: string, posts: Post[] }) => {
                this.posts = postData.posts;
                this.postsUpdated.next(this.posts.slice());
            }
        );
        // return this.posts.slice();
    }

    getPostUpdateListener() {

        // Returns an observable where we can't emit, but we can listen to
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string) {
        const post: Post = { id: null, title: title, content: content };
        this.posts.push(post);
        this.postsUpdated.next(this.posts.slice());
    }

}