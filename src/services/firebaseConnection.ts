import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyBTIZfvouY5WFYnAlix4n-b_ckAQ3xXbEM",
	authDomain: "taskify-108b5.firebaseapp.com",
	projectId: "taskify-108b5",
	storageBucket: "taskify-108b5.appspot.com",
	messagingSenderId: "518040932098",
	appId: "1:518040932098:web:31b5fd6a6ebe911cd4fc1b",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);

export { db };
