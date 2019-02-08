import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
//import AuthProvider = firebase.auth.AuthProvider;

/**
 * @author Ntepp J96n J09l
 */
@Injectable()
export class AuthService {
	private user: firebase.User;

	constructor(public afAuth: AngularFireAuth) {
		afAuth.authState.subscribe(user => {
			this.user = user;
		});
	}

	signInWithEmail(credentials) {
		//console.log('Sign in with email');
		return this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
	}

	doLogout(){
		return new Promise((resolve, reject) => {
		  if(firebase.auth().currentUser){
			this.afAuth.auth.signOut()
			resolve();
		  }
		  else{
			reject();
		  }
		});
	}

	doRegister(value){
		return new Promise<any>((resolve, reject) => {
		  firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
		  .then(res => {
			resolve(res);
		  }, err => reject(err))
		})
	}

	remove(account){
		firebase.auth().signInWithEmailAndPassword(account.email, account.password)
    .then(info => {
       var user = firebase.auth().currentUser;
       user.delete();
    });
	}

	resetPassword(email: string) {
    var auth = firebase.auth();
    return auth.sendPasswordResetEmail(email)
      .then(() => console.log("email sent"))
      .catch((error) => console.log(error))
  }

	get authenticated(): boolean {
		return this.user !== null;
	}

	getEmail() {
		return this.user && this.user.email;
	}
}