import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class PostsService {

    private posts: Post[] = []
    private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();

    constructor(private http: HttpClient, private router: Router) {}

    getPosts(postsPerPage: number, currentPage: number) {
        const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
        this.http.get('http://localhost:3000/api/posts' + queryParams)
        .pipe(
            map((postData: { message: string, posts: any, maxPosts: number}) => {
                return { 
                    posts: postData.posts.map((post) => {
                        return {
                            id: post._id,
                            title: post.title,
                            content: post.content,
                            imagePath: post.imagePath
                        };
                    }),
                    maxPosts: postData.maxPosts
                };
            })
        )
        .subscribe(
            (transformedPostData: { posts: Post[], maxPosts: number }) => {
                this.posts = transformedPostData.posts;
                this.postsUpdated.next({ posts: this.posts.slice(), postCount: transformedPostData.maxPosts });
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
                this.router.navigate(['/']);
            }
        );
    }

    deletePost(postId: string) {
        return this.http.delete('http://localhost:3000/api/posts/' + postId);
    }

}