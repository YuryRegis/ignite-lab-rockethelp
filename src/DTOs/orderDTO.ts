import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type IOrderFirestoreDTO = {
  patrimony: string;
  description: string;
  status: "open" | "close";
  solution?: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  closedAt?: FirebaseFirestoreTypes.Timestamp;
};
