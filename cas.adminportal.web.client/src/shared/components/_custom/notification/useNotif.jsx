import { useState } from "react";
import { NotificationContent } from "./NotificationContent";

const useNotif = () => {
    const [notification, setAsNotif] = useState([]);

    const Content = () => {
        return (
            <div className="scrollable-y-hover h-96">
                {notification.map((notif) => (
                    <NotificationContent
                        key={notif.id + notif.createdAt}
                        id={notif.id}
                        type={notif.type}
                        title={notif.title}
                        sender={notif.sender}
                        department={notif.department}
                        data={notif?.data}
                        description={notif.description}
                        createdAt={notif.createdAt}
                        isRead={notif.isRead}
                        isOnline={notif.isOnline}
                    />
                ))}
            </div>
        );
    };

    return { notification, setAsNotif, Content };
};

export { useNotif };
