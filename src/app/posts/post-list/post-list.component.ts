import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: 'First Post', content: 'Dummy content' },
  //   { title: 'Second Post', content: 'Dummy content' },
  //   { title: 'Third Post', content: 'Dummy content' }
  // ];
  
  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading: boolean = false;

  constructor(private postsService: PostsService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener().subscribe(
      (posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      }
    );
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

}
