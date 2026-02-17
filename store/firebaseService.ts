
import { db, auth } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query, 
  orderBy, 
  limit, 
  where,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { User, Test, TestResult, UserRole } from '../types';

export const firebaseService = {
  // Foydalanuvchi profilini olish
  getUserProfile: async (uid: string): Promise<User | null> => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as User) : null;
  },

  // Profilni saqlash/yangilash
  saveUserProfile: async (user: User) => {
    await setDoc(doc(db, "users", user.id), user, { merge: true });
  },

  // Reyting uchun barcha o'quvchilarni olish
  getAllUsers: async (): Promise<User[]> => {
    const q = query(collection(db, "users"), orderBy("points", "desc"), limit(50));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as User);
  },

  // Testlarni olish
  getTests: async (): Promise<Test[]> => {
    const querySnapshot = await getDocs(collection(db, "tests"));
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Test));
  },

  // Yangi test qo'shish yoki tahrirlash
  saveTest: async (test: Test) => {
    if (test.id && test.id.length > 15) { // Mavjud test
       const { id, ...data } = test;
       await updateDoc(doc(db, "tests", id), data);
    } else { // Yangi test
       await addDoc(collection(db, "tests"), test);
    }
  },

  // Testni o'chirish
  deleteTest: async (testId: string) => {
    await deleteDoc(doc(db, "tests", testId));
  },

  // Test natijasini saqlash
  saveTestResult: async (result: TestResult, currentPoints: number) => {
    await addDoc(collection(db, "results"), result);
    const pointsEarned = result.score * 5;
    const userRef = doc(db, "users", result.userId);
    await updateDoc(userRef, {
      points: (currentPoints || 0) + pointsEarned
    });
  },

  // Foydalanuvchining shaxsiy natijalari
  getUserResults: async (userId: string): Promise<TestResult[]> => {
    const q = query(
      collection(db, "results"), 
      where("userId", "==", userId),
      orderBy("completedAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as TestResult);
  },

  // Global so'nggi faollik
  getRecentResults: async (limitCount: number = 5): Promise<TestResult[]> => {
    const q = query(collection(db, "results"), orderBy("completedAt", "desc"), limit(limitCount));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as TestResult);
  }
};
