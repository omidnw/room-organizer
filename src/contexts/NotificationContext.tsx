import React, { createContext, useContext, useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import NotificationContainer, {
	NotificationItem,
} from "../components/ui/NotificationContainer";
import { NotificationPosition } from "../components/ui/Notification";

interface NotificationContextType {
	showNotification: (type: NotificationItem["type"], message: string) => void;
	position: NotificationPosition;
	setPosition: (position: NotificationPosition) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined
);

export function NotificationProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [notifications, setNotifications] = useState<NotificationItem[]>([]);
	const [position, setPosition] = useState<NotificationPosition>("top-right");

	const removeNotification = useCallback((id: string) => {
		setNotifications((prev) =>
			prev.filter((notification) => notification.id !== id)
		);
	}, []);

	const showNotification = useCallback(
		(type: NotificationItem["type"], message: string) => {
			const id = uuidv4();
			setNotifications((prev) => [...prev, { id, type, message }]);
		},
		[]
	);

	return (
		<NotificationContext.Provider
			value={{ showNotification, position, setPosition }}
		>
			{children}
			<NotificationContainer
				notifications={notifications}
				position={position}
				onClose={removeNotification}
			/>
		</NotificationContext.Provider>
	);
}

export function useNotification() {
	const context = useContext(NotificationContext);
	if (context === undefined) {
		throw new Error(
			"useNotification must be used within a NotificationProvider"
		);
	}
	return context;
}
