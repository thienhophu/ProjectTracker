import { IonItem, IonLabel, IonNote } from "@ionic/react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Message } from "../data/messages";
import { increment } from "../features/counter/counterSlice";
import { add, remove } from "../features/projects/projectsSlice";
import "./MessageListItem.css";

interface MessageListItemProps {
  message: Message;
}

const MessageListItem: React.FC<MessageListItemProps> = ({ message }) => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <IonItem
      // routerLink={`/message/${message.id}`}
      detail={false}
      onClick={() => {
        dispatch(increment());
        dispatch(add({ id: "12312", name: "fasfa", progress: 20, steps: [] }));
        dispatch(remove("123abc"));
      }}
    >
      <div slot="start" className="dot dot-unread"></div>
      <IonLabel className="ion-text-wrap">
        <h2>
          {message.fromName} {count}
          <span className="date">
            <IonNote>{message.date}</IonNote>
          </span>
        </h2>
        <h3>{message.subject}</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </IonLabel>
    </IonItem>
  );
};

export default MessageListItem;
