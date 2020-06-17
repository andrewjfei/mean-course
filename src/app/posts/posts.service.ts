import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class PostsService {

    private posts: Post[] = []
    private postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient, private router: Router) {}

    getPosts() {
        this.http.get('http://localhost:3000/api/posts')
        .pipe(
            map((postData: { message: string, posts: any}) => {
                return postData.posts.map((post) => {
                    return {
                        id: post._id,
                        title: post.title,
                        content: post.content
                    };
                });
            })
        )
        .subscribe(
            (posts: Post[] ) => {
                this.posts = posts;
                this.postsUpdated.next(this.posts.slice());
            }
        );
    }

    getPostUpdateListener() {
        // Returns an observable where we can't emit, but we can listen to
        return this.postsUpdated.asObservable();
    }

    getPost(id: string) {
        return this.http.get('http://localhost:3000/api/posts/' + id);
    }

    updatePost(id: string, title: string, content: string) {
        const post: Post = { id: id, title: title, content: content };
        this.http.put('http://localhost:3000/api/posts/' + id, post)
        .subscribe(
            (res: { message: string }) => {
                const updatedPosts = this.posts.slice();
                const oldPostIndex = updatedPosts.findIndex((post: Post) => {
                    return post.id === id;
                });
                updatedPosts[oldPostIndex] = post;
                this.posts = updatedPosts;
                this.postsUpdated.next(this.posts.slice());
                this.router.navigate(['/']);
            }
        );
    }

    addPost(title: string, content: string) {
        const post: Post = { id: null, title: title, content: content };
        this.http.post('http://localhost:3000/api/posts', post)
        .subscribe(
            (res: { message: string, postId: string }) => {
                const postId = res.postId;
                post.id = postId;
                this.posts.push(post);
                this.postsUpdated.next(this.posts.slice());
                this.router.navigate(['/']);
            }
        );
    }

    deletePost(postId: string) {
        this.http.delete('http://localhost:3000/api/posts/' + postId)
        .subscribe(
            (res: { message: string }) => {
                const updatedPosts = this.posts.filter(
                    (post: Post) => {
                        if (post.id !== postId) {
                            return post;
                        }
                    }
                );

                this.posts = updatedPosts;
                this.postsUpdated.next(this.posts.slice());
            }
        );
    }

}