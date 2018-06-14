import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class TweetService {

  options;
  domain = this.authService.domain;

  constructor(
    private authService: AuthService,
    private http: Http
  ) { }

  createAuthenticationHeaders() {
    this.authService.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authService.authToken // Attach token
      })
    });
  }

  newTweet(tweet) {
    console.log('new tweet di tweet service');
    this.createAuthenticationHeaders(); // Create headers
    return this.http.post(this.domain + '/tweets/newTweet', tweet, this.options).map(res => res.json());
  }

  getAllTweets(tweetsLimit) {
    this.createAuthenticationHeaders(); // Create headers
    const tweetData = { tweetsLimit : tweetsLimit};
    return this.http.post(this.domain + '/tweets/allTweets', tweetData, this.options).map(res => res.json());
  }

  likeTweet(tweetId, usernameLike) {
    this.createAuthenticationHeaders(); // Create headers
    // console.log('hehe'+id);
    const tweetData = { tweetId: tweetId, usernameLike: usernameLike };
    return this.http.put(this.domain + '/tweets/likeTweet', tweetData, this.options).map(res => res.json());
  }

  unlikeTweet(tweetId, usernameLike) {
    this.createAuthenticationHeaders(); // Create headers
    // console.log('hehe'+id);
    const tweetData = { tweetId: tweetId, usernameLike: usernameLike };
    return this.http.put(this.domain + '/tweets/unlikeTweet', tweetData, this.options).map(res => res.json());
  }

  postCommentTweet(tweetId, comment) {
    this.createAuthenticationHeaders(); // Create headers
    // console.log(username);
    const commentData = { tweetId: tweetId, comment: comment };
    return this.http.post(this.domain + '/tweets/comment', commentData, this.options).map(res => res.json());
  }
}
