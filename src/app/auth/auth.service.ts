import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "@angular/fire/auth";
import { Firestore } from '@angular/fire/firestore';
import { Router} from "@angular/router";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token: any;
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private router: Router, private auth: Auth, private firestore: Firestore) {
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
    if(localStorage.getItem('token')){
      this.token = localStorage.getItem('token');
    }
   }

  signup(email: string, passwd: string): Promise<string> {
    return createUserWithEmailAndPassword(this.auth, email, passwd)
      .then(async userCredential => {
        // User registration was successful; now store user data in Firestore
        const uid = userCredential.user.uid; // Get user ID
        await setDoc(doc(this.firestore, 'users', uid), {
          profile: {
            email: email,
            createdAt: new Date(), 
            username: "",
            age: null,
            gender: "",
            weight: null,
            height: null,
            activityLevel: "",
            goal: "",
            profileComplete: false
          },
          caloriePlan: {
            dailyCalories: null,
            protein: null,
            fat: null,
            carbs: null
          },
          weightHistory: [
            {
              date: "",
              weight: null
            }
          ] 
        });
        console.log('User data saved to Firestore.');
        return 'success';
      })
      .catch(error => {
        console.log(error);
        return error;
      }
    );
  }

  /*login(email: string, passwd: string){
    return signInWithEmailAndPassword(this.auth, email, passwd)
      .then(()=>{
        return this.auth.currentUser?.getIdToken()
          .then(
            (token: string) => {
              this.token = token;
              localStorage.setItem('username', email);
              localStorage.setItem('token', token);
              return true;
            }
          );
      })
      .catch(
        error => {
          console.log(error);
          return false;
        }
      )
  }*/

      login(email: string, passwd: string) {
        return signInWithEmailAndPassword(this.auth, email, passwd)
          .then(async () => {
            const user = this.auth.currentUser;
            if (user) {
              const token = await user.getIdToken();
              localStorage.setItem('username', email);
              localStorage.setItem('token', token);
              this.token = token;
      
              // Get user document from Firestore
              const userDocRef = doc(this.firestore, 'users', user.uid);
              console.log(userDocRef); // Log user document reference
      
              const userDoc = await getDoc(userDocRef);
              
              if (userDoc.exists()) {
                const data = userDoc.data();
                console.log('Firestore Data:', data); // Log the data fetched from Firestore
      
                // Check if profileComplete is inside the profile object
                const profileComplete = data?.['profile']?.profileComplete; // Check inside the profile field
      
                if (profileComplete === true) {
                  console.log("IN auth Go to home");
                  this.router.navigate(['/home']); // Redirect to home if profile is complete
                } else {
                  console.log("IN auth Go to profile");
                  this.router.navigate(['/profile-setup']); // Redirect to profile setup if incomplete
                }
              } else {
                console.log('User document does not exist');
                this.router.navigate(['/profile-setup']); // Redirect to profile setup if user data doesn't exist
              }
              
              console.log("IN auth TRUE RETURN");
              return true;
            }
      
            console.log("IN auth FALSE RETURN");
            return false;
          })
          .catch(error => {
            console.error(error);
            return false;
          });
      }


  isLoggedIn() {
    return this.userSubject.value !== null
  }

  /*isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }*/

  logout(): void {
    this.auth.signOut().then(() => {
      this.token = null; // Clear the token
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      this.router.navigate(['log-in']); // Redirect to login page
    });
  }

  getUid(){
    return this.auth.currentUser?.uid;
  }

}
