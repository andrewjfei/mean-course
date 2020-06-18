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
                        content: post.content,
                        imagePath: post.imagePath
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

    updatePost(id: string, title: string, content: string, image: File | string) {  
        let postData: Post | FormData;
        if (typeof(image) === 'object') {
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
        } else {
            postData = { id: id, title: title, content: content, imagePath: image };
        };
        this.http.put('http://localhost:3000/api/posts/' + id, postData)
        .subscribe(
            (res: { message: string, imagePath: string }) => {
                const updatedPosts = this.posts.slice();
                const oldPostIndex = updatedPosts.findIndex((post: Post) => {
                    return post.id === id;
                });
                const post: Post = { id: id, title: title, content: content, imagePath: res.imagePath };
                updatedPosts[oldPostIndex] = post;
                this.posts = updatedPosts;
                this.postsUpdated.next(this.posts.slice());
                this.router.navigate(['/']);
            }
        );
    }

    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
        this.http.post('http://localhost:3000/api/posts', postData)
        .subscribe(
            (res: { message: string, post: Post }) => {
                const post: Post = { id: res.post.id, title: title, content: content, imagePath: res.post.imagePath };
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