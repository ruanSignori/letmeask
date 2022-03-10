import { useEffect, useState } from "react";
import { database, onValue, ref, off } from "../services/firebase";
import { useAuth } from "./useAuth";

type QuestionType = {
  id: string, 
  author: {
    name: string;
    avatar: string
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likes: Record<string, {
    authorId: string
  }>;
}>

export function useRoom(roomId: string) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`);

    //child_added 
    // https://firebase.google.com/docs/database/web/lists-of-data#web-version-9_3

    onValue(roomRef, (room) => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions)
        .map(([key, value]) => {
            return {
              id: key,
              content: value.content,
              author: value.author,
              isHighlighted: value.isHighlighted || false,
              isAnswered: value.isAnswered || false,
              likeCount: Object.values(value.likes ?? {}).length,
              likeId: Object.entries(value.likes ?? {})
                .find(([key, like]) => like.authorId === user?.id)?.[0]
            };
        });
      
        setTitle(databaseRoom.title);
        setQuestions(parsedQuestions);
    });

    return () => {
      off(roomRef, 'value');
    }
  }, [roomId, user?.id]);

  return { questions, title }
}