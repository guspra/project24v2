import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TweetService } from '../../services/tweet.service';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent implements OnInit {

  form;
  // formComment = [];
  formComment;
  temp = 0;
  username;
  newTweet = false;
  tweetPosted = false;
  tweets;
  commentShow = [];
  tweetsLimit = 10;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private tweetService: TweetService
  ) {
    this.createNewTweetForm();
    this.createNewCommentForm();
  }

  newTweetClicked(){
    this.newTweet = true;
  }

  goBack() {
    window.location.reload(); // Clear all variable states
  }

  createNewTweetForm() {
    this.form = this.formBuilder.group({
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5)
      ])]
    })
  }

  createNewCommentForm() {
    this.formComment = this.formBuilder.group({
      bodyComment: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(200),
        Validators.minLength(2)
      ])]
    })
  }

  submitTweetForm(){
    const tweet = {
      body: this.form.get('body').value, // Body field
      createdBy: this.username // CreatedBy field
    }
// console.log('submit tweet form di tweet component');
    this.tweetService.newTweet(tweet).subscribe(data => {
      // Check if tweet was saved to database or not
      if (!data.success) {
        console.log(data.message);
      } else {
        this.tweetPosted = true;
        this.form.reset();
        // this.form.reset();
        setTimeout(() => {
           // Reset all form fields
          this.newTweet = false;
          this.tweetPosted = false;
          this.getAllTweets();
        }, 1);

      }
    });
  }

  submitCommentForm(tweetId){
    const comment = {
      comment: this.formComment.get('bodyComment').value, // Body field
      commentator: this.username // CreatedBy field
    }
    this.tweetService.postCommentTweet(tweetId, comment).subscribe(data => {
      // Check if tweet was saved to database or not
      if (!data.success) {
        console.log(data.message);
      } else {
        // this.tweetPosted = true;
        this.formComment.reset();
        this.getAllTweets();
      }
    });
  }

    getAllTweets() {
      // Function to GET all tweets from database
      this.tweetService.getAllTweets(this.tweetsLimit).subscribe(data => {
        this.tweets = data.tweets; // Assign array to use in HTML
        // console.log(data);
      });

    }

    likeTweet(tweetId){
      // console.log(id);
      this.tweetService.likeTweet(tweetId, this.username).subscribe(data => {
        console.log(data);
        this.getAllTweets();
        // this.tweets = [];
      });
    }

    unlikeTweet(tweetId){
      // console.log(id);
      this.tweetService.unlikeTweet(tweetId, this.username).subscribe(data => {
        console.log(data);
        this.getAllTweets();
        // this.tweets = [];
      });
    }

    showComment(tweetId){
      this.commentShow = [];
      this.commentShow.push(tweetId);
      this.formComment.reset();
    }

    loadMoreTweet(){
      this.tweetsLimit += 5;
      this.getAllTweets();
    }

xxx(){
  console.log(this.tweets);
}
  ngOnInit() {
this.getAllTweets();
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Used when creating new tweet posts and comments
    });

  }

}
