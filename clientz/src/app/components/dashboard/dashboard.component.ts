import { Component, ViewChild, ElementRef, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
// import io from 'socket.io-client';
// import * as io from 'socket.io-client';
import io from 'socket.io-client/dist/socket.io';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild('chatWindow') private viewer: ElementRef;
  url = `http://172.104.161.63:2424`;
  socket;
  form: FormGroup;
  conversation = [];
  typingStatus;
  username = '';


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // console.log(this.authService.getProfile());

    this.createForm();
    this.socket = io(this.url);
    this.socket.on('chat', (chatData) => {
      this.typingStatus = '';
      this.conversation.push(chatData);
      // console.log(chatData);
      this.scroll();
    });
    this.socket.on('typing', (chatData) => {
      this.typingStatus = chatData + ' is typing...';
      console.log(chatData);
      this.scroll();
    });
    this.authService.getProfile().subscribe(profile => {
      if(profile.user){
        this.setUsername(profile.user.username);
      } else{
        this.authService.logout();
        this.router.navigate(['/login']);
      }

    });
  }

  setUsername(username){
    this.form.controls['handle'].setValue('Hello ' + username + '! Say hi to everyone.');
    this.username = username;
  }

  createForm() {
    this.form = this.formBuilder.group({
      handle: [''],
      message: ['']
    });

  }

  sendMessage(){
    this.socket.emit('chat', {
      message: this.form.controls['message'].value,
      handle: this.username
    });
    this.form.controls['message'].setValue('');
    console.log(this.viewer);
    this.scroll();
  }

  listenKeypress(){
    this.socket.emit('typing', this.username);
  }

  debug(){
    // console.log('xxx');
  }

  private scroll(): void {
        setTimeout(() => {
            this.scrollToBottom();
        }, 100);
    }

    private getDiff(): number {
        const nativeElement = this.viewer.nativeElement;
        return nativeElement.scrollHeight - (nativeElement.scrollTop + nativeElement.clientHeight);
    }

    private scrollToBottom(t = 1, b = 0): void {
      // console.log('t'+t+'b'+b)
        if (b < 1) {
            b = this.getDiff();
        }
        if (b > 0 && t <= 120) {
            setTimeout(() => {
                const diff = this.easeInOutSin(t / 120) * this.getDiff();
                this.viewer.nativeElement.scrollTop += diff;
                this.scrollToBottom(++t, b);
            }, 1 / 60);
        }
    }

    private easeInOutSin(t): number {
        return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;
    }

  ngOnInit() {

  }

}





//
// export class DashboardComponent implements OnInit {
//
//   form: FormGroup;
//   socket;// = io.connect('http://localhost:2424');
//   conversation = '';
//   typingStatus;
//   output = document.getElementById('output');
//
//   constructor(
//     private formBuilder: FormBuilder
//   ) {
//     this.createForm();
//   }
//
//
//
//   createForm() {
//     this.form = this.formBuilder.group({
//       handle: ['usernameXXX'],
//       message: ['']
//     });
//     console.log(this.form);
//     // this.form.controls['message'].value = 'hahahahaha';
//     this.form.controls['message'].setValue('hohoho');// = 'hahahahaha';
//
//     // setTimeout(() => {
//     //   this.form.value.message = 'hohoho';
//     //   console.log(this.form);
//     // }, 2000);
//     // console.log(this.form.controls['handle']);
//   }
//
//   sendMessage(){
//     this.socket.emit('chat', {
//         message: this.form.controls['message'].value,
//         handle: this.form.controls['handle'].value
//     });
//     // console.log('sendMessage');
//     // console.log(this.form.controls['message']);
//     // // message.value = "";
//     // this.form.controls['message'] = 'hahaha';
//     // console.log('endsendmessage');
//   }
//
//   listenKeypress(){
//     this.socket.emit('typing', this.form.controls['handle'].value);
//     // this.conversation = this.form.get('message').value;
//   }
//
//   debug(){
//     console.log('xxx');
//   }
//
//   ngOnInit() {
//     this.conversation = 'jjj';
//     // this.output.innerHTML += 'xxx';
//     // console.log(this.output);
//     // console.log(this.conversation);
//     // console.log(io);
//     this.debug();
//     this.socket = io.connect('http://localhost:2424');
//     // console.log(this.socket);
//         // Listen for events
//         // console.log('init');
//     this.socket.on('chat', (data) => {
//     // console.log(this);
//     // console.log('hhhhh');
//     // console.log(this.conversation);
//     // console.log(conver);
//     // console.log(data);
//     // console.log('xxx'+form+'x');
//         this.typingStatus = '';
//         this.debug;
//         // output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
//         // let newMessage = this.form.get('message').value;
//         // let newMessage = data.message;
//         this.conversation += '<p><strong>' + 'test handle' + ': </strong>' + data.message + '</p>';
//         // console.log(this.conversation);
//         // this.conversation = 'asdfasdfasdf';
//     });
//     // this.form.value['message'] = 'hahaha';
//     //
//     // socket.on('typing', function(data){
//     //     feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
//     // });
//
//   }
//
// }
