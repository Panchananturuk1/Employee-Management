import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, from, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.config';
import { AppUser, UserRole } from '../models/app-user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // `undefined` means Firebase has not reported the initial auth state yet, which
  // is different from `null` (confirmed signed out) and matters for route guards.
  private userSubject = new BehaviorSubject<AppUser | null | undefined>(undefined);

  constructor() {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        this.userSubject.next(null);
        return;
      }

      this.loadProfile(firebaseUser).subscribe({
        next: (appUser) => this.userSubject.next(appUser),
        error: () => this.userSubject.next(this.toAppUser(firebaseUser, 'user'))
      });
    });
  }

  get user$(): Observable<AppUser | null> {
    return this.userSubject.pipe(
      filter((user): user is AppUser | null => user !== undefined)
    );
  }

  get currentUser(): AppUser | null {
    return this.userSubject.value ?? null;
  }

  get isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  signUp(name: string, email: string, password: string, role: UserRole): Observable<AppUser> {
    return from(createUserWithEmailAndPassword(auth, email, password)).pipe(
      switchMap(credential =>
        from(updateProfile(credential.user, { displayName: name })).pipe(
          map(() => credential.user)
        )
      ),
      switchMap(firebaseUser => {
        const profile = this.toAppUser(firebaseUser, role);
        profile.displayName = name;

        return from(setDoc(doc(db, 'users', firebaseUser.uid), {
          email: profile.email,
          displayName: profile.displayName,
          photoURL: profile.photoURL,
          role: profile.role,
          createdAt: serverTimestamp()
        })).pipe(map(() => profile));
      }),
      tap(profile => this.userSubject.next(profile))
    );
  }

  login(email: string, password: string): Observable<AppUser> {
    return from(signInWithEmailAndPassword(auth, email, password)).pipe(
      switchMap(credential => this.loadProfile(credential.user)),
      tap(profile => this.userSubject.next(profile))
    );
  }

  logout(): Observable<void> {
    return from(signOut(auth)).pipe(
      tap(() => this.userSubject.next(null))
    );
  }

  sendPasswordReset(email: string): Observable<void> {
    return from(sendPasswordResetEmail(auth, email));
  }

  updateAccount(displayName: string, photoURL: string): Observable<AppUser> {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      return throwError(() => new Error('You must be signed in to update your profile.'));
    }

    return from(updateProfile(firebaseUser, { displayName, photoURL: photoURL || null })).pipe(
      switchMap(() => from(updateDoc(doc(db, 'users', firebaseUser.uid), { displayName, photoURL }))),
      map(() => {
        const updated: AppUser = {
          ...(this.currentUser ?? this.toAppUser(firebaseUser, 'user')),
          displayName,
          photoURL
        };
        return updated;
      }),
      tap(updated => this.userSubject.next(updated))
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    const firebaseUser = auth.currentUser;

    if (!firebaseUser || !firebaseUser.email) {
      return throwError(() => new Error('You must be signed in to change your password.'));
    }

    const credential = EmailAuthProvider.credential(firebaseUser.email, currentPassword);

    return from(reauthenticateWithCredential(firebaseUser, credential)).pipe(
      switchMap(() => from(updatePassword(firebaseUser, newPassword)))
    );
  }

  /** Resolves once the initial auth check has settled, so guards never redirect too early. */
  waitForAuth(): Observable<AppUser | null> {
    return this.user$.pipe(take(1));
  }

  describeError(error: unknown): string {
    const code = (error as { code?: string })?.code ?? '';

    switch (code) {
      case 'auth/invalid-email':
        return 'That email address is not valid.';
      case 'auth/email-already-in-use':
        return 'An account already exists with that email address.';
      case 'auth/weak-password':
        return 'Please choose a password with at least 6 characters.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a moment and try again.';
      case 'auth/requires-recent-login':
        return 'Please sign in again before changing your password.';
      case 'auth/network-request-failed':
        return 'Network error. Check your connection and try again.';
      case 'auth/operation-not-allowed':
        return 'Email/password sign-in is disabled for this Firebase project. Enable it under Authentication \u2192 Sign-in method.';
      case 'auth/configuration-not-found':
        return 'Firebase Authentication is not set up for this project yet. Open Authentication in the Firebase Console and click "Get started", then enable the Email/Password provider.';
      case 'auth/invalid-api-key':
      case 'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
        return 'The Firebase API key in firebase.config.ts is not valid for this project.';
      default:
        return (error as { message?: string })?.message ?? 'Something went wrong. Please try again.';
    }
  }

  private loadProfile(firebaseUser: User): Observable<AppUser> {
    const profileDoc = doc(db, 'users', firebaseUser.uid);

    return from(getDoc(profileDoc)).pipe(
      switchMap(snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.data() as any;
          return of({
            uid: firebaseUser.uid,
            email: data.email || firebaseUser.email || '',
            displayName: data.displayName || firebaseUser.displayName || '',
            photoURL: data.photoURL || firebaseUser.photoURL || '',
            role: data.role === 'admin' ? 'admin' : 'user'
          } as AppUser);
        }

        // Accounts created before roles existed get a profile document on first sign-in.
        const profile = this.toAppUser(firebaseUser, 'user');
        return from(setDoc(profileDoc, {
          email: profile.email,
          displayName: profile.displayName,
          photoURL: profile.photoURL,
          role: profile.role,
          createdAt: serverTimestamp()
        })).pipe(map(() => profile));
      })
    );
  }

  private toAppUser(firebaseUser: User, role: UserRole): AppUser {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || firebaseUser.email || '',
      photoURL: firebaseUser.photoURL || '',
      role: role
    };
  }
}
