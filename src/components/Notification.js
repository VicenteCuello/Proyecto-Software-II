import React, { useState } from "react";
import { Bell, X } from "lucide-react";

const initialNotifications = [
  { id: 1, message: "Tienes una nueva tarea.", read: false },
  { id: 2, message: "Tu sesión expirará pronto.", read: false },
  { id: 3, message: "Actualización disponible.", read: true },
];

function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6" /> Notificaciones
        </h2>
        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-red-500 hover:underline"
          >
            Limpiar todas
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No hay notificaciones.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`flex justify-between items-center p-3 rounded-lg border ${
                n.read ? "bg-gray-100" : "bg-white shadow"
              }`}
            >
              <span
                className={`flex-1 ${
                  n.read ? "text-gray-500" : "font-semibold"
                }`}
              >
                {n.message}
              </span>
              <div className="flex gap-2 ml-4">
                {!n.read && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="text-blue-500 text-sm"
                  >
                    Marcar como leída
                  </button>
                )}
                <button
                  onClick={() => removeNotification(n.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationsPage;